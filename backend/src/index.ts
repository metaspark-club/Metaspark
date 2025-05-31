import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import { PrismaClient } from '@prisma/client';
import router from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import userMessages from './routes/userMessages';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(cors());
app.use(express.json());
app.use('/api/users', router);
app.use('/api/auth', authRoutes);
app.use('/api/messages', userMessages);

// ========== User Connection & Messaging ==========
const onlineUsers = new Map<number, string>(); // userId -> socketId

// ========== Random Chat Logic ==========
const lookingQueue: number[] = [];
const activeRooms = new Map<number, string>(); // userId -> roomId

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // Handle user connection
  socket.on('user_connected', async (userId: number) => {
    console.log('MFucking User connected with ID:', userId);

    if (!userId || typeof userId !== 'number') {
      console.error('Mfucking Invalid userId received:', userId);
      return;
    }

    onlineUsers.set(userId, socket.id);

    await prisma.user.update({
      where: { id: userId },
      data: { online: true }
    });

    const users = await prisma.user.findMany({
      select: { id: true, username: true, profilePicture: true, online: true }
    });

    io.emit('online_users', users);
    socket.emit('all_users', users);
  });

  // ========== Private Message ==========
  socket.on('private_message', async ({ from, to, content }) => {
    const newMessage = await prisma.message.create({
      data: {
        senderId: from,
        receiverId: to,
        content,
      },
    });

    const message = {
      id: newMessage.id,
      content: newMessage.content,
      senderId: from,
      receiverId: to,
      createdAt: newMessage.createdAt,
    };

    const toSocket = onlineUsers.get(to);
    if (toSocket) io.to(toSocket).emit('private_message', message);

    const fromSocket = onlineUsers.get(from);
    if (fromSocket) io.to(fromSocket).emit('private_message', message);
  });

  // ========== Random Match ==========
  socket.on('start_looking', async (userId: number) => {
    if (!userId || typeof userId !== 'number') {
      console.error('Invalid userId received:', userId);
      return;
    }
  
    await prisma.user.update({
      where: { id: userId },
      data: { looking: true }
    });
  
    if (!lookingQueue.includes(userId)) lookingQueue.push(userId);
  
    if (lookingQueue.length >= 2) {
      const [user1, user2] = lookingQueue.splice(0, 2); // get 2 users
      const roomId = `room-${user1}-${user2}-${Date.now()}`;
  
      activeRooms.set(user1, roomId);
      activeRooms.set(user2, roomId);
  
      const socket1 = onlineUsers.get(user1);
      const socket2 = onlineUsers.get(user2);
  
      if (socket1) {
        io.to(socket1).emit('matched', { partnerId: user2, roomId });
      }
  
      if (socket2) {
        io.to(socket2).emit('matched', { partnerId: user1, roomId });
      }
    }
  });

  socket.on('skip', async (userId: number) => {
    const roomId = activeRooms.get(userId);
  
    if (roomId) {
      io.to(roomId).emit('chat_ended');
  
      for (const [uid, rid] of activeRooms.entries()) {
        if (rid === roomId) activeRooms.delete(uid);
      }
    }
  
    if (!lookingQueue.includes(userId)) lookingQueue.push(userId);
    io.emit('looking_updated', lookingQueue);
  });

  // Join room
  socket.on('join_room', (roomId: string) => {
    socket.join(roomId);
  });

  // Send message in room
  socket.on('send_message', ({ roomId, message }) => {
    socket.to(roomId).emit('receive_message', message); // only sends to *other* clients in the room
  });
  

  // Skip current chat
  socket.on('skip', async (userId: number) => {
    const roomId = activeRooms.get(userId);

    if (roomId) {
      io.to(roomId).emit('chat_ended');
      for (const [uid, rid] of activeRooms.entries()) {
        if (rid === roomId) activeRooms.delete(uid);
      }
    }

    if (!lookingQueue.includes(userId)) lookingQueue.push(userId);
    io.emit('looking_updated', lookingQueue);
  });

  // ========== Handle Disconnect ==========
  socket.on('disconnect', async () => {
    let disconnectedUserId: number | null = null;
  
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        disconnectedUserId = userId;
        break;
      }
    }
  
    if (disconnectedUserId !== null) {
      await prisma.user.update({
        where: { id: disconnectedUserId },
        data: { online: false, looking: false }
      });
  
      const roomId = activeRooms.get(disconnectedUserId);
      if (roomId) {
        io.to(roomId).emit('chat_ended');
        for (const [uid, rid] of activeRooms.entries()) {
          if (rid === roomId) activeRooms.delete(uid);
        }
      }
  
      const index = lookingQueue.indexOf(disconnectedUserId);
      if (index !== -1) lookingQueue.splice(index, 1);
    }
  
    const users = await prisma.user.findMany({
      select: { id: true, username: true, profilePicture: true, online: true }
    });
  
    io.emit('online_users', users);
  });
}); 

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
