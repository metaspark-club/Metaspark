"use client";

import { useState } from "react";
import Link from "next/link";

interface ChatBot {
  id: number;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export default function AIChatPage() {
  const [hoveredBot, setHoveredBot] = useState<number | null>(null);

  const chatBots: ChatBot[] = [
    {
      id: 1,
      name: "Zayd",
      description: "Your friendly AI cooking companion",
      icon: "🤖",
      path: "/ai-chat/zayd",
    },
    {
      id: 2,
      name: "Aero",
      description: "Your best language assistant",
      icon: "🚀",
      path: "/ai-chat/aero",
    },
    {
      id: 3,
      name: "Nova",
      description: "Creative writing expert",
      icon: "✨",
      path: "/ai-chat/nova",
    },
    {
      id: 4,
      name: "Quantum",
      description: "Problem-solving specialist",
      icon: "⚛️",
      path: "/ai-chat/quantum",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-gray-400 font-orbitron">
          Choose Your AI Companion
        </h1>
        <p className="text-gray-400 mt-4">
          Select a chatbot to start your conversation
        </p>
      </div>

      {/* Chatbot Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {chatBots.map((bot) => (
          <Link
            key={bot.id}
            href={bot.path}
            className="relative group"
            onMouseEnter={() => setHoveredBot(bot.id)}
            onMouseLeave={() => setHoveredBot(null)}
          >
            <div
              className={`relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 hover:border-gray-400/60 transition-all duration-300 ${
                hoveredBot === bot.id
                  ? "border-orange-500 scale-105 shadow-[0_0_30px_rgba(255,165,0,0.4)]"
                  : "border-orange-500/30 hover:border-gray-400/60 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,165,0,0.2)]"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-gray-400/10 rounded-2xl" />
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {bot.icon}
                </div>
                <h3 className="text-gray-400 font-semibold text-2xl mb-2 font-orbitron">
                  {bot.name}
                </h3>
                <p className="text-orange-500 text-sm font-light">
                  {bot.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
