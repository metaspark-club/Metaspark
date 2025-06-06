"use client";

import { useSelector } from "react-redux";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { RootState } from "@/store/store";

interface MenuItem {
  id: number;
  title: string;
  icon: string;
  path: string;
  description: string;
}

export default function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      title: "Chat",
      icon: "💬",
      path: "/chat",
      description: "Connect with others",
    },
    {
      id: 2,
      title: "Social Labyrinth",
      icon: "🌐",
      path: "/rand",
      description: "random chatting",
    },
    {
      id: 3,
      title: "Digiskets Market",
      icon: "🛍️",
      path: "/market",
      description: "Trade digital assets",
    },
    {
      id: 4,
      title: "Games",
      icon: "🎮",
      path: "/game",
      description: "Enter the arena",
    },
    {
      id: 5,
      title: "Profile",
      icon: "👤",
      path: "/profile",
      description: "Your digital identity",
    },
    {
      id: 6,
      title: "AI Chat",
      icon: "🤖",
      path: "/ai-chat",
      description: "Talk to the future",
    },
  ];

  const rotateCarousel = (index: number) => {
    if (carouselRef.current) {
      const angle = (360 / menuItems.length) * index;
      gsap.to(carouselRef.current, {
        rotateY: -angle,
        duration: 0.8,
        ease: "power2.inOut",
      });
    }
  };

  useEffect(() => {
    rotateCarousel(activeIndex);
  }, [activeIndex]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        setActiveIndex(
          (prev) => (prev - 1 + menuItems.length) % menuItems.length
        );
      } else {
        setActiveIndex((prev) => (prev + 1) % menuItems.length);
      }
      setIsDragging(false);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Grid Background */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(rgba(255,165,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,165,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black_70%)]" /> */}

      {/* Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full blur-[100px] opacity-20 animate-pulse" />

      {/* Header */}
      <div className="relative z-10 text-center mt-[34px]">
        <div className="relative inline-block">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-gray-400 font-orbitron tracking-wider mb-12">
            Welcome, {user?.email}
          </h1>
          {/* <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-gray-400 rounded-lg blur opacity-30" /> */}
        </div>
        <p className="text-gray-400 text-lg font-light tracking-wider">
          ENTER THE DIGITAL REALM
        </p>
      </div>

      {/* Carousel */}
      <div
        className="relative w-[800px] h-[600px] perspective-[1500px] cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          ref={carouselRef}
          className="w-full h-full absolute right-[15%] top-[0%] transition-transform duration-500 z-0"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {menuItems.map((item, i) => {
            const angle = (360 / menuItems.length) * i;
            const isActive = i === activeIndex;
            return (
              <Link
                key={item.id}
                href={item.path}
                className="absolute w-64 h-64 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
                style={{
                  transform: `rotateY(${angle}deg) translateZ(400px)`,
                  opacity: isActive ? 1 : 0.5,
                  scale: isActive ? 1.1 : 0.8,
                }}
              >
                <div className="relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 hover:border-gray-400/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)]">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-gray-400/10 rounded-2xl" />
                  <div className="relative z-10">
                    <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-gray-400 font-semibold text-center text-2xl mb-2 font-orbitron">
                      {item.title}
                    </h3>
                    <p className="text-orange-500 text-center text-sm font-light">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-6 mt-8">
        <button
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-gray-400 rounded-xl text-black font-bold hover:from-gray-400 hover:to-orange-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-500/25 pointer"
          onClick={() =>
            setActiveIndex(
              (prev) => (prev - 1 + menuItems.length) % menuItems.length
            )
          }
        >
          ←
        </button>
        <button
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-gray-400 rounded-xl text-black font-bold hover:from-gray-400 hover:to-orange-500 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-orange-500/25 pointer"
          onClick={() =>
            setActiveIndex((prev) => (prev + 1) % menuItems.length)
          }
        >
          →
        </button>
      </div>

      {/* Border Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent animate-pulse" />
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-orange-500 to-transparent animate-pulse" />
      </div>
    </div>
  );
}
