"use client";

import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";
import { checkUser } from "@/lib/checkUser";
import UserLoading from "./user-loading";
import gsap from "gsap";

const Navbar = async () => {
	await checkUser();

	useEffect(() => {
		// Animate title on hover
		const title = document.getElementById("syncboard-title");
		if (title) {
			title.addEventListener("mouseenter", () => {
				gsap.to(title, {
					scale: 1.08,
					rotate: 2,
					duration: 0.3,
					ease: "power2.out",
				});
			});
			title.addEventListener("mouseleave", () => {
				gsap.to(title, {
					scale: 1,
					rotate: 0,
					duration: 0.3,
					ease: "power2.out",
				});
			});
		}

		// Create Project button sparkle effect
		const btn = document.getElementById("create-project-btn");
		if (!btn) return;

		const handleEnter = () => {
			for (let i = 0; i < 5; i++) {
				const sparkle = document.createElement("div");
				sparkle.className =
					"absolute w-1.5 h-1.5 rounded-full bg-white opacity-80 pointer-events-none";
				sparkle.style.left = `${Math.random() * 100}%`;
				sparkle.style.top = `${Math.random() * 100}%`;
				btn.appendChild(sparkle);

				gsap.fromTo(
					sparkle,
					{ scale: 0, y: 0, opacity: 0.8 },
					{
						scale: 1.5,
						y: -10,
						opacity: 0,
						duration: 0.8 + Math.random() * 0.5,
						ease: "power1.out",
						onComplete: () => sparkle.remove(),
					}
				);
			}
		};

		btn.addEventListener("mouseenter", handleEnter);
		return () => btn.removeEventListener("mouseenter", handleEnter);
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
               cursor-pointer transition-transform duration-300"
					>
						Syncboard
					</Link>

					{/* Right-hand side actions */}
					<div className="flex items-center gap-4 relative">
						{/* Create Project Button with GSAP sparkle effect */}
						<Link href="/project/create" passHref>
							<Button
								id="create-project-btn"
								className="relative overflow-hidden flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold
                           bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white 
                           shadow-lg hover:shadow-[0_0_25px_rgba(255,180,50,0.7)]
                           hover:scale-105 transition-all duration-300"
							>
								<PenBox size={16} />
								<span className="hidden md:inline">Create Project</span>

								{/* Glow layer */}
								<span
									className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-red-500 
                                 opacity-20 blur-xl transition-all duration-300 group-hover:opacity-40"
								/>
							</Button>
						</Link>

						{/* Auth Buttons */}
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
