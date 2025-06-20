"use client";
import UserAPI from "@/lib/userApi";
import React, { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
};

function WaitList() {
  const [waitList, setWaitList] = useState<User[]>([]);

  useEffect(() => {
    const fetchWaitList = async () => {
      try {
        const response = await UserAPI.get("/");
        const users = response.data as User[];
        setWaitList(users);
      } catch (error) {
        console.error("Failed to fetch waitlist users:", error);
      }
    };

    fetchWaitList();
  }, []);

  return (
    <div className="h-screen bg-gray-900 flex flex-col items-center justify-center p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Welcome to Metaspark!</h1>
      <p className="text-lg">
        <strong>You are on the wait list.</strong>
      </p>
      <p className="mt-2 text-green-400">
        Total registered users: <strong>{waitList.length}</strong>
      </p>
    </div>
  );
}

export default WaitList;
