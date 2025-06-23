"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import { AxiosError } from "axios";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async () => {
    try {
      await API.post("/signup", { username, email, password });
      alert("Signup successful!");
      router.push("/login");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const message = error.response?.data?.message || "Login failed";
      alert(message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-orange-500">
        <h1 className="text-2xl font-bold mb-6 text-orange-500 text-center">
          🤖 Robot Sign Up
        </h1>

        <div className="space-y-4">
          <div className="relative">
            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            onClick={handleSignup}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
          >
            <span className="mr-2">🤖</span> Initialize Account
          </button>
        </div>
      </div>
    </div>
  );
}
