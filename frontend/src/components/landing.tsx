"use client";
import { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Landing() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Memoize the data streams to prevent unnecessary re-renders
  const dataStreams = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 3 + Math.random() * 2,
      })),
    []
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          opacity: 0,
          y: -20,
          duration: 1.2,
          ease: "power2.out",
        });
      }

      if (buttonsRef.current) {
        gsap.from(buttonsRef.current.children, {
          opacity: 0,
          y: 20,
          duration: 1,
          stagger: 0.2,
          ease: "power2.out",
        });
      }
    });

    return () => ctx.revert();
  }, []);

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1.05,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const handleLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    gsap.to(e.currentTarget, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  return (
    <div className="h-screen w-full bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden font-orbitron">
      {/* Side textures */}
      <div className="absolute inset-y-0 left-0 w-16 bg-[url('/textures/metal-texture.png')] opacity-20 mix-blend-overlay" />
      <div className="absolute inset-y-0 right-0 w-16 bg-[url('/textures/metal-texture.png')] opacity-20 mix-blend-overlay" />

      {/* Main container */}
      <div className="absolute inset-0 m-6 rounded-xl p-1 bg-gradient-to-br from-[#5a5a5a] to-[#2d2d2d] shadow-[0_0_30px_#ff6600aa] border-[6px] border-[#888]">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.05),_transparent)]" />

        {/* Glowing edge lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-pulse delay-100" />

        {/* Screen */}
        <div className="relative w-full h-full rounded-lg p-6 bg-gradient-to-b from-orange-950/90 to-orange-900/90 backdrop-blur-md overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(255,165,0,0.1)_50%,transparent_100%)] bg-[length:100%_10px] animate-[scan_4s_linear_infinite]" />

            {/* Floating orbs */}
            <div className="absolute w-32 h-32 border-2 border-orange-500/30 rounded-full top-1/4 left-1/4 animate-pulse will-change-transform">
              <div className="absolute inset-0 bg-orange-400/10 blur-2xl" />
            </div>
            <div className="absolute w-24 h-24 border-2 border-orange-400/30 rounded-full bottom-1/4 right-1/4 animate-pulse delay-300 will-change-transform">
              <div className="absolute inset-0 bg-orange-400/10 blur-2xl" />
            </div>

            {/* Data streams */}
            <div className="absolute inset-0 overflow-hidden">
              {dataStreams.map(({ id, left, top, duration }) => (
                <div
                  key={id}
                  className="absolute h-32 w-0.5 bg-orange-500/20 will-change-transform"
                  style={{
                    left,
                    top,
                    animation: `dataStream ${duration}s linear infinite`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Main content */}
          <div className="z-10 text-center flex flex-col items-center justify-center h-full">
            <div className="space-y-6">
              <h1
                ref={titleRef}
                className="text-6xl font-extrabold text-orange-400 drop-shadow-[0_0_10px_#ffa50088] mb-4 tracking-wide relative"
              >
                Welcome to MetaSpark
              </h1>
              <p className="text-xl text-orange-200/80 max-w-2xl mx-auto leading-relaxed">
                Your next-generation social platform where connections come
                alive. Experience real-time chat, AI-powered interactions, and
                seamless networking.
              </p>
              <div className="flex items-center justify-center gap-4 text-orange-300/70 pb-[24px]">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  Real-time Chat
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  AI Integration
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
                  Secure Platform
                </div>
              </div>
            </div>

            <div ref={buttonsRef} className="flex gap-6 justify-center">
              <Link href="login">
                <button
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                  className="px-8 py-3 bg-orange-500 text-black rounded-lg shadow-md hover:bg-orange-600 transition duration-300 text-lg font-semibold relative overflow-hidden will-change-transform"
                >
                  <span className="relative z-10">Login</span>
                  <div className="absolute inset-0 bg-orange-300/10 blur-md animate-shimmer" />
                </button>
              </Link>

              <Link href="signup">
                <button
                  onMouseEnter={handleHover}
                  onMouseLeave={handleLeave}
                  className="px-8 py-3 bg-gray-800 text-orange-400 border-2 border-orange-500 rounded-lg hover:bg-gray-700 transition duration-300 text-lg font-semibold relative overflow-hidden will-change-transform"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-orange-400/10 blur-md animate-shimmer" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
