'use client'

import Link from 'next/link'
import { useAuth } from '@/app/AuthContext'
import { useEffect } from 'react'

export default function Navbar() {
	const { isAuthenticated, user, logout } = useAuth()

	useEffect(() => {
		console.log("User:", user)
	}, [isAuthenticated, user])

	const handleLogout = () => {
		logout()
		console.log("Logged out")
	}

	return (
		<nav className="bg-gray-800 p-4 w-full mb-4">
			<div className="container flex justify-between items-center">
				<Link href="/" className="text-white">
					Collaborative Editor
				</Link>
				<div>
					{isAuthenticated && user ? (
						<>
							<Link href={`/dashboard`}>
								<button className="py-2 px-2 rounded mr-2 pen-btn">
									Dashboard
								</button>
							</Link>
							<button
								onClick={handleLogout}
								className="py-2 px-2 rounded pen-btn"
							>
								Log out
							</button>
						</>
					) : (
						<>
							<Link href="/signin">
								<button className="py-2 px-2 rounded mr-2 pen-btn">
									Log in
								</button>
							</Link>
							<Link href="/signup">
								<button className="py-2 px-2 rounded mr-2 pen-btn">
									Sign Up
								</button>
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	)
}
