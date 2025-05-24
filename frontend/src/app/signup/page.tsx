'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import API from '@/lib/api'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSignup = async () => {
    try {
      await API.post('/signup', { username, email, password })
      alert('Signup successful!')
      router.push('/login')
    } catch (err: any) {
      alert(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Sign Up</h1>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="border p-2 mb-2 w-full" />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 mb-2 w-full" />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2 mb-2 w-full" />
      <button onClick={handleSignup} className="bg-green-500 text-white p-2 w-full">Sign Up</button>
    </div>
  )
}
