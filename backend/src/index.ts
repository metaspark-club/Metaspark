import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { PrismaClient } from "@prisma/client";
import router from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import userMessages from "./routes/userMessages";

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/users", router);
app.use("/api/auth", authRoutes);
app.use("/api/messages", userMessages);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("user_connected", async (userId) => {
    onlineUsers.set(userId, socket.id);

    const users = await prisma.user.findMany({
      select: { id: true, username: true, profilePicture: true },
    });

    io.emit("online_users", Array.from(onlineUsers.keys()));
    socket.emit("all_users", users);
  });

  socket.on("private_message", async ({ from, to, content }) => {
    const newMessage = await prisma.message.create({
      data: { senderId: from, receiverId: to, content },
    });

    const message = {
      id: newMessage.id,
      content: newMessage.content,
      createdAt: newMessage.createdAt,
      from,
    };

    const toSocket = onlineUsers.get(to);
    if (toSocket) {
      io.to(toSocket).emit("private_message", message);
    }

    const fromSocket = onlineUsers.get(from);
    if (fromSocket) {
      io.to(fromSocket).emit("private_message", message);
    }
  });

  socket.on("disconnect", () => {
    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
