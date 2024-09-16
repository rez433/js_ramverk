'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useState } from 'react'


interface NavbarProps {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  }
export default function Navbar( {isAuthenticated, setIsAuthenticated}: NavbarProps ) {
    // const { data: session } = useSession()

    return (
        <nav className="bg-gray-800 p-4 w-full mb-4">
            <div className="container flex justify-between items-center">
                <Link href="/" className="text-white">
                    Collaborative Editor
                </Link>
                <div>
                    {/* {session ? ( */}
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard">
                                <button
                                    className="py-2 px-2 rounded mr-2 pen-btn"
                                >
                                    Dashboard
                                </button>
                            </Link>
                            <button
                                onClick={() => {
                                    setIsAuthenticated(false)
                                    console.log("Logout")
                                }}
                                className="py-2 px-2 rounded pen-btn"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    setIsAuthenticated(true)
                                    console.log("Login")
                                }}
                                className="py-2 px-2 rounded mr-2 pen-btn"
                            >
                                Log in
                            </button>
                            {/* <button
                                onClick={() => signIn('google')}
                                className="bg-green-500 hover:bg-green-600 text-white py-2 px-2 rounded"
                            >
                                Sign up
                            </button> */}
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
