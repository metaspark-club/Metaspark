"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { connectSocket, getSocket } from "./socket";
import axios from "axios";
import { RootState } from "@/store/store";

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
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (user) {
      const socket = connectSocket(user.token);

      socket.emit("user_connected", user.id);

      socket.on("private_message", (message: Message) => {
        if (
          selectedUser &&
          (message.senderId === selectedUser.id ||
            message.receiverId === selectedUser.id) &&
          message.senderId !== user.id // Only add message if it's not from the current user
        ) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, [user, selectedUser]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users");
        setUsers(res.data.filter((u: User) => u.email !== user?.email));
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    if (user) fetchUsers();
  }, [user]);

  const selectChatUser = async (otherUser: User) => {
    setSelectedUser(otherUser);
    try {
      const params = new URLSearchParams({
        userId: user?.id?.toString() || "",
        otherUserId: otherUser.id.toString(),
      });
      const res = await axios.get(
        `http://localhost:8080/api/messages?${params.toString()}`
      );
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser && user) {
      const socket = getSocket();
      if (socket) {
        socket.emit("private_message", {
          from: user.id,
          to: selectedUser.id,
          content: newMessage,
        });
      } else {
        console.error("Socket is not connected.");
      }
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          content: newMessage,
          senderId: user.id,
          receiverId: selectedUser.id,
          createdAt: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    }
  };

  // ... existing useEffect and functions remain the same ...

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Users Sidebar */}
      <div className="w-1/3 border-r border-orange-500/20 p-4 overflow-y-auto bg-gray-800/50 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-4 text-orange-400 font-orbitron">
          Active Users
        </h2>
        <div className="space-y-2">
          {users.map((u) => (
            <div
              key={u.id}
              onClick={() => selectChatUser(u)}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                selectedUser?.id === u.id
                  ? "bg-orange-500/20 border border-orange-500/30"
                  : "hover:bg-gray-700/50 border border-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-gray-200">{u.username}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col bg-gray-900/50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedUser ? (
            <>
              <div className="flex items-center space-x-2 mb-4 p-2 border-b border-orange-500/20">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <h2 className="text-lg font-semibold text-orange-400 font-orbitron">
                  Chat with {selectedUser.username}
                </h2>
              </div>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.senderId === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs p-3 rounded-lg ${
                        msg.senderId === user?.id
                          ? "bg-orange-500/20 border border-orange-500/30 text-orange-200"
                          : "bg-gray-800/50 border border-gray-700 text-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 font-orbitron">
                Select a user to start chatting
              </p>
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="p-4 border-t border-orange-500/20 flex space-x-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-gray-200 placeholder-gray-500 focus:border-orange-500/50 focus:outline-none transition-colors"
              placeholder="Type a message..."
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-6 py-3 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 rounded-lg transition-colors duration-200 font-orbitron"
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
