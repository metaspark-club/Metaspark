"use client";

import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

interface Player {
  id: number;
  name: string;
  score: number;
  isActive: boolean;
}

export default function GamePage() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize players
  useEffect(() => {
    if (user) {
      setPlayers([
        { id: 1, name: user.username, score: 0, isActive: true },
        { id: 2, name: "Player 2", score: 0, isActive: false },
        { id: 3, name: "Player 3", score: 0, isActive: false },
        { id: 4, name: "Player 4", score: 0, isActive: false },
      ]);
    }
  }, [user]);

  const startGame = () => {
    setGameStarted(true);
  };

  const rollDice = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[currentPlayer].score += roll;
      newPlayers[currentPlayer].isActive = false;
      const nextPlayer = (currentPlayer + 1) % 4;
      newPlayers[nextPlayer].isActive = true;
      return newPlayers;
    });
    setCurrentPlayer((prev) => (prev + 1) % 4);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-gray-400 font-orbitron">
          Dice Game
        </h1>
        <p className="text-gray-400 mt-4">Roll the dice and score points!</p>
      </div>

      {/* Game Board */}
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 gap-8">
          {players.map((player) => (
            <div
              key={player.id}
              className={`relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl border ${
                player.isActive ? "border-orange-500" : "border-orange-500/30"
              } transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-gray-400/10 rounded-2xl" />
              <div className="relative z-10">
                <h3 className="text-gray-400 font-semibold text-2xl mb-4 font-orbitron">
                  {player.name}
                </h3>
                <p className="text-orange-500 text-4xl font-bold">
                  Score: {player.score}
                </p>
                {player.isActive && (
                  <div className="mt-4 text-green-500 animate-pulse">
                    Your turn!
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Game Controls */}
        <div className="mt-12 text-center">
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-orange-500 to-gray-400 rounded-xl text-black font-bold hover:from-gray-400 hover:to-orange-500 transition-all duration-300 hover:scale-110"
            >
              Start Game
            </button>
          ) : (
            <button
              onClick={rollDice}
              disabled={!players[currentPlayer].isActive}
              className={`px-8 py-4 rounded-xl text-black font-bold transition-all duration-300 ${
                players[currentPlayer].isActive
                  ? "bg-gradient-to-r from-orange-500 to-gray-400 hover:from-gray-400 hover:to-orange-500 hover:scale-110"
                  : "bg-gray-600 cursor-not-allowed"
              }`}
            >
              Roll Dice
            </button>
          )}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gray-500 rounded-full blur-[100px] opacity-20 animate-pulse" />
      </div>
    </div>
  );
}
