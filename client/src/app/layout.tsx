import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import "./globals.css";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const lobster = localFont({
	src: "./fonts/Lobster.ttf",
	variable: "--font-lobster",
	weight: "100 900"
})

export const metadata: Metadata = {
	title: 'Collaborative Text Editor',
	description: 'A collaborative text editor',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${lobster.variable} antialiased min-h-screen`}
			>
				<main className="flex flex-col items-center justify-between ui_txt">
					<Navbar />
					{children}
				</main>
				<Footer />
			</body>
		</html>
	);
}
