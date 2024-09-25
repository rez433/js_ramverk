'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../AuthContext'

export default function SignIn() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const { login } = useAuth()

	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || ''
	const api = `${baseApiUrl}/auth/login`

	console.log('login api is: ', api)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch(api, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userEmail, password }),
    })
    if (response.ok) {
      const { token, user } = await response.json()
      login(token, user)
      router.push(`/dashboard`)
    } else {
      // Handle errors
      console.error('Sign in failed')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto mt-10">
      <div>
        <label htmlFor="userEmail">UserEmail</label>
        <input
          id="userEmail"
          type="text"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="w-full">Sign In</button>
    </form>
  )
}
