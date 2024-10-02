'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../AuthContext'

export default function SignIn() {
  const [userEmail, setUserEmail] = useState('')
  const [password, setPassword] = useState('')
	const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { login } = useAuth()
	const api = "http://localhost:5051/auth/login"

  const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!userEmail || !password) {
			alert('Please enter your email and password')
			return
		}

		setIsLoading(true)
		try {
			const response = await fetch(api, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userEmail, password }),
			})
			if (!response.ok) {
				const errorMessage = await response.text()
				throw new Error(`Sign in failed: ${errorMessage || response.statusText}`)
			}
			const data = await response.json()
			if (!data.token || !data.user) {
				throw new Error("Invalid response format. Missing token or user data.")
			}

			login(data.token, data.user)
			setIsLoading(false)
			router.push(`/dashboard`)

		} catch (error) {
			console.error('An error occurred:', error)
			alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
		}
	}

	if (isLoading) {
		return <div className="flex justify-center items-center h-screen">Connecting to server...</div>
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
