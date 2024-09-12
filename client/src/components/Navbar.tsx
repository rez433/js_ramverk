'use client'

import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar() {
    // const { data: session } = useSession()

    return (
        <nav className="bg-gray-800 p-4 w-full mb-4">
            <div className="container flex justify-between items-center">
                <Link href="/" className="text-white">
                    Collaborative Editor
                </Link>
                <div>
                    {/* {session ? ( */}
                        <>
                            <Link href="/dashboard" className="text-white mr-4">
                                Dashboard
                            </Link>
                            <button
                                onClick={() => signOut()}
                                className="py-2 px-2 rounded pen-btn"
                            >
                                Log out
                            </button>
                        </>
                    {/* ) : ( */}
                        <>
                            <button
                                onClick={() => signIn('google')}
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
                    {/* )} */}
                </div>
            </div>
        </nav>
    )
}