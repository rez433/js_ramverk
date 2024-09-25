'use client'

import { useState } from "react"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import localFont from "next/font/local"
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "./globals.css"
import { AuthProvider } from "./AuthContext"

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
})
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
})

const lobster = localFont({
	src: "./fonts/Lobster.ttf",
	variable: "--font-lobster",
	weight: "100 900"
})


export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${lobster.variable} antialiased min-h-screen`}
			>
				<AuthProvider>
					<main className="flex flex-col items-center justify-between ui_txt">
						<ToastContainer />
						<Navbar />
						{children}
					</main>
					<Footer />
				</AuthProvider>
			</body>
		</html>
	)
}
