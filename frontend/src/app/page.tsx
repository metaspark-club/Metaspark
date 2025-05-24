'use client'
import Image from "next/image";
import { Provider, useSelector } from 'react-redux'
import { RootState, store } from '@/store'



export default function Home() {
  const user = useSelector((state: RootState) => state.auth.user)
  return (
    

    <main>
      <h1>Welcome</h1>
      {user ? (
        <div>
          <p>Logged in as {user.email}</p>
        </div>
      ) : (
        <p>Not logged in</p>
      )}
    </main>
    
  )
}


