"use client";
import { useState } from "react";

interface Digisket {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function MarketPage() {
  const [selectedDigisket, setSelectedDigisket] = useState<Digisket | null>(
    null
  );

  const digiskets: Digisket[] = [
    {
      id: 1,
      name: "Quantum Core",
      price: 999,
      description: "A powerful energy source for your digital assets",
      image: "⚛️",
    },
    {
      id: 2,
      name: "Neural Link",
      price: 750,
      description: "Enhance your digital connectivity",
      image: "🧠",
    },
    {
      id: 3,
      name: "Crypto Shield",
      price: 500,
      description: "Protect your digital assets",
      image: "🛡️",
    },
    {
      id: 4,
      name: "Data Crystal",
      price: 250,
      description: "Store vast amounts of digital information",
      image: "💎",
    },
  ];

  const handlePurchase = (digisket: Digisket) => {
    // Implement purchase logic here
    console.log(`Purchasing ${digisket.name} for ${digisket.price} credits`);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-gray-400 font-orbitron">
          Digisket Market
        </h1>
        <p className="text-gray-400 mt-4">
          Trade digital assets and enhance your collection
        </p>
      </div>

      {/* Market Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {digiskets.map((digisket) => (
          <div
            key={digisket.id}
            className="relative group"
            onClick={() => setSelectedDigisket(digisket)}
          >
            <div className="relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border border-orange-500/30 hover:border-gray-400/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)]">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-gray-400/10 rounded-2xl" />
              <div className="relative z-10">
                <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {digisket.image}
                </div>
                <h3 className="text-gray-400 font-semibold text-2xl mb-2 font-orbitron">
                  {digisket.name}
                </h3>
                <p className="text-orange-500 text-sm font-light mb-4">
                  {digisket.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">
                    {digisket.price} credits
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePurchase(digisket);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-orange-500 to-gray-400 rounded-lg text-black font-bold hover:from-gray-400 hover:to-orange-500 transition-all duration-300"
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Digisket Detail Popup */}
      {selectedDigisket && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white border border-orange-500 p-6 rounded-xl shadow-lg max-w-md w-full z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">{selectedDigisket.name}</h2>
            <button
              onClick={() => setSelectedDigisket(null)}
              className="text-orange-400 hover:text-orange-200 text-sm"
            >
              ✖ Close
            </button>
          </div>
          <p className="text-sm text-gray-300 mb-2">
            {selectedDigisket.description}
          </p>
          <p className="text-orange-400 font-bold">
            {selectedDigisket.price} credits
          </p>
        </div>
      )}

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
