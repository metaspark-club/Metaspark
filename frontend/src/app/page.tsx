"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Landing from "@/components/landing";
import WaitList from "@/components/wait-list";

export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log(user);
  return <main>{user ? <WaitList /> : <Landing />}</main>;
}
