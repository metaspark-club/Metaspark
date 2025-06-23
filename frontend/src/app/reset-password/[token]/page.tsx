"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = params.token as string;

  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:8080/api/auth/reset-password/${token}`,
        {
          password,
        }
      );
      setMsg(res.data.message);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setMsg("Token expired or invalid");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-orange-500">
        <h1 className="text-2xl font-bold mb-6 text-orange-500 text-center">
          🤖 Password Reset
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Reset Password
          </button>

          {msg && (
            <div className="mt-4 p-3 rounded-lg bg-gray-700 text-orange-400 text-center">
              {msg}
            </div>
          )}

          <div className="text-center mt-4">
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
