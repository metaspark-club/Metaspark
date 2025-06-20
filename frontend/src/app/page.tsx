"use client";
import Image from "next/image";
import { Provider, useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import Link from "next/link";
import Landing from "@/components/landing";
import Dashboard from "@/components/Dashbord";
import { useEffect } from "react";
import { logout } from "@/store/slices/authSlice";
import { useDispatch } from "react-redux";
import WaitList from "@/components/wait-list";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  return <main>{user ? <WaitList /> : <Landing />}</main>;
}
