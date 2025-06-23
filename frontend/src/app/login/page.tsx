"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import Cookies from "js-cookie";
import Link from "next/link";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const res = await API.post("/signin", { email, password });
      Cookies.set("token", res.data.token);
      dispatch(setCredentials({ user: res.data.user, token: res.data.token }));
      router.push("/");
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
          🤖 Robot Login
        </h1>

        <div className="space-y-4">
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
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Login
          </button>

          <div className="text-center mt-4">
            <Link
              href="/forget-password"
              className="text-orange-400 hover:text-orange-300 transition-colors duration-200"
            >
              Forgot Password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
