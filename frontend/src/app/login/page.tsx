"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { useRouter } from "next/navigation";
import API from "@/lib/api";
import Cookies from "js-cookie";

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
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 w-full"
      >
        Login
      </button>
    </div>
  );
}
