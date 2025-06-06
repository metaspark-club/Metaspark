'use client'
import Image from "next/image";
import { Provider, useSelector } from 'react-redux'
import { RootState, store } from '@/store'
import Link from "next/link";
import Landing from "@/components/landing";
import Dashboard from "@/components/Dashbord";


export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user)
  console.log(user);
  return (
    

    <main>
      
      {user ? (
        <Dashboard />
      ) : (
        <Landing />
      )}
    </main>
    
  )
}




