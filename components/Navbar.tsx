"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import UserLoading from "./user-loading";
import gsap from "gsap";

const Navbar = () => {
	useEffect(() => {
		// GSAP floating bubble animation
		const bubbles = document.querySelectorAll(".bubble");
		bubbles.forEach((bubble) => {
			gsap.to(bubble, {
				y: -20,
				repeat: -1,
				yoyo: true,
				duration: 2 + Math.random() * 20,
				ease: "sine.inOut",
				delay: Math.random(),
			});
		});
	}, []);

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
               cursor-pointer transition-transform duration-300 hover:scale-105 hover:rotate-1"
					>
						Syncboard
					</Link>

					<div className="flex items-center gap-4 relative">
						{/* Create Project Button with multiple bubbles */}
						<Link href="/project/create" passHref>
							<Button
								id="create-project-btn"
								className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
                           bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white 
                           shadow-lg hover:shadow-[0_0_25px_rgba(255,180,50,0.7)]
                           hover:scale-115 transition-all duration-900 group"
							>
								<PenBox size={16} />
								<span className="hidden md:inline">Create Project</span>

								{/* Floating bubbles */}
								{Array.from({ length: 6 }).map((_, i) => (
									<span
										key={i}
										className={`bubble absolute w-2 h-2 rounded-full bg-white opacity-30 blur-sm 
                                group-hover:opacity-70 transition-opacity duration-300`}
										style={{
											top: `${Math.random() * 100}%`,
											left: `${Math.random() * 100}%`,
										}}
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
};

export default Navbar;
