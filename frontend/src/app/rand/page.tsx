"use client";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

const ChatApp = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [roomId, setRoomId] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [partnerId, setPartnerId] = useState<number | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    socket.emit("user_connected", user.id);
    socket.emit("start_looking", user.id);

    socket.on("matched", ({ partnerId, roomId }) => {
      setPartnerId(partnerId);
      setRoomId(roomId);
      socket.emit("join_room", roomId);
      setMessages([]);
    });

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat_ended", () => {
      setMessages((prev) => [...prev, "Chat ended. Looking for new match..."]);
      setRoomId("");
      setPartnerId(null);
      socket.emit("start_looking", user.id);
    });

    return () => {
      socket.off("matched");
      socket.off("receive_message");
      socket.off("chat_ended");
      socket.disconnect();
    };
  }, [user?.id]);

  const send = () => {
    if (input.trim() && roomId) {
      socket.emit("send_message", { roomId, message: input });
      setMessages((prev) => [...prev, `You: ${input}`]);
      setInput("");
    }
  };

  const skip = () => {
    socket.emit("skip", user?.id);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 rounded-lg p-4 mb-4">
        <h2 className="text-orange-500 text-xl font-bold text-center">
          {partnerId
            ? `🤖 Chatting with Stranger #${partnerId}`
            : "🔍 Searching for a match..."}
        </h2>
      </div>

      <div className="flex-1 bg-gray-800 rounded-lg p-4 mb-4 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 p-2 rounded-lg ${
              msg.startsWith("You:")
                ? "bg-orange-500 text-white ml-auto"
                : "bg-gray-700 text-gray-200"
            } max-w-[80%]`}
          >
            {msg}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && send()}
        />
        <button
          onClick={send}
          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          Send
        </button>
        <button
          onClick={skip}
          className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
