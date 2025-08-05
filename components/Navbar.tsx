"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import UserLoading from "./user-loading";
import gsap from "gsap";

export default function Navbar() {
	const [bubbles, setBubbles] = useState<{ top: string; left: string }[]>([]);

	useEffect(() => {
		// Generate random bubbles client-side only
		setBubbles(
			Array.from({ length: 10 }).map(() => ({
				top: `${Math.random() * 100}%`,
				left: `${Math.random() * 100}%`,
			}))
		);
	}, []);

	useEffect(() => {
		// GSAP floating animation
		const bubblesEls = document.querySelectorAll(".bubble");
		bubblesEls.forEach((bubble) => {
			gsap.to(bubble, {
				y: -20,
				repeat: -1,
				yoyo: true,
				duration: 2 + Math.random() * 2,
				ease: "sine.inOut",
				delay: Math.random(),
			});
		});
	}, [bubbles]);

	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex h-16 items-center justify-between">
					{/* Animated Brand Title */}
					<Link
						href="/"
						id="syncboard-title"
						className="text-2xl md:text-3xl font-extrabold tracking-wide 
            text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-pink-500 to-red-500 
            cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-1"
					>
						Syncboard
					</Link>

					<div className="flex items-center gap-4 relative">
						{/* Create Project Button with animated bubbles */}
						<Link href="/project/create" passHref>
							<Button
								id="create-project-btn"
								className="relative overflow-hidden flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white 
                shadow-lg hover:shadow-[0_0_35px_rgba(255,180,50,0.9)]
                hover:scale-110 transition-all duration-300 group"
							>
								<PenBox size={16} />
								<span className="hidden md:inline">Create Project</span>

								{bubbles.map((bubble, i) => (
									<span
										key={i}
										className="bubble absolute w-2 h-2 rounded-full bg-white opacity-30 blur-sm 
                      group-hover:opacity-70 transition-opacity duration-300"
										style={{ top: bubble.top, left: bubble.left }}
									/>
								))}
							</Button>
						</Link>

						<SignedOut>
							<SignInButton forceRedirectUrl="/onboarding">
								<Button variant="default">Login</Button>
							</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserMenu />
						</SignedIn>
					</div>
				</nav>

				<UserLoading />
			</div>
		</header>
	);
}
