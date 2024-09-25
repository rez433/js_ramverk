'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUp() {
	const [userEmail, setUserEmail] = useState('')
	const [password, setPassword] = useState('')
	const [name, setName] = useState('')
	const [lastName, setLastName] = useState('')
	const router = useRouter()
	const baseApiUrl: string = process.env.NEXT_PUBLIC_API_URL || ''
	const api = `${baseApiUrl}/auth/signup`


	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		const response = await fetch(api, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ userEmail, password, name, lastName }),
		})
		if (response.ok) {
			router.push('/signin')
		} else {
			// Handle errors
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
			<div>
				<label htmlFor="name">Name</label>
				<input
					id="name"
					type="name"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</div>
			<div>
				<label htmlFor="lastName">Last Name</label>
				<input
					id="lastName"
					type="lastName"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="w-full">Sign Up</button>
		</form>
	)
}
