"use client"

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { connectSocket, getSocket } from './socket';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
}

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  createdAt: string;
}

const Chat = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  
  useEffect(() => {
    if (user) {
      const socket = connectSocket(user.token);

      socket.on('receive_message', (message: Message) => {
        if (
          selectedUser &&
          (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)
        ) {
          setMessages(prev => [...prev, message]);
        }
      });
    }
  }, [user, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users');
        setUsers(res.data.filter((u: User) => u.email !== user?.email));
        console.log(res.data)
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const selectChatUser = async (otherUser: User) => {
    setSelectedUser(otherUser);
    try {
      const res = await axios.get(`http://localhost:5000/api/messages/${otherUser.id}`);
      setMessages(res.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser && user) {
      const socket = getSocket();
      socket.emit('send_message', {
        content: newMessage,
        receiverId: selectedUser.id,
      });
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          content: newMessage,
          senderId: user.id,
          receiverId: selectedUser.id,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {users.map(u => (
          <div
            key={u.id}
            onClick={() => selectChatUser(u)}
            className={`cursor-pointer p-2 rounded hover:bg-gray-200 ${
              selectedUser?.id === u.id ? 'bg-gray-300' : ''
            }`}
          >
            {u.username}
          </div>
        ))}
      </div>

      <div className="w-2/3 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedUser ? (
            <>
              <h2 className="text-lg font-semibold mb-2">Chat with {selectedUser.username}</h2>
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded max-w-xs ${
                    msg.senderId === user?.id
                      ? 'bg-blue-100 self-end ml-auto'
                      : 'bg-gray-100 self-start'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </>
          ) : (
            <p>Select a user to start chatting</p>
          )}
        </div>

        {selectedUser && (
          <div className="p-4 border-t flex">
            <input
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1 border rounded p-2"
              placeholder="Type a message"
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
