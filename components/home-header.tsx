'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Header() {
	return (
		<header className="fixed top-0 z-50 w-full border-b border-gray-300 bg-white text-black shadow-md">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
				{/* Left Section — Logo */}
				<div className="flex items-center space-x-3">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="h-6 w-6 text-black"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M3 3h18M3 9h18M3 15h18M3 21h18" />
					</svg>
					<Link href="/" className="text-xl font-semibold tracking-tight">
						SIAPA
					</Link>
				</div>

				<nav className="hidden md:flex space-x-6 text-sm font-medium text-gray-400">
					<Link href="/" className="hover:text-gray-500">
						Home
					</Link>
					<Link href="/statistik" className="hover:text-gray-700">
						Statistik
					</Link>
				</nav>

				{/* Right Section — Actions */}
				<div className="flex items-center space-x-2">
					<Link href="/login">
						<Button
							variant={"secondary"}
							className="cursor-pointer"
						>
							Masuk
						</Button>
					</Link>

				</div>
			</div>
		</header>
	)
}