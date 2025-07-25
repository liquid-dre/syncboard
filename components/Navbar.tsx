import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import React from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import { PenBox } from "lucide-react";
import UserMenu from "./user-menu";

const COMPANY_PRIMARY_COLOR = "#4ECDC4";

const Navbar = () => {
	return (
		<header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<nav className="flex h-16 items-center justify-between">
					{/* Logo/Home Link */}
					<Link href="/" className="flex items-center gap-2">
						<Image
							src="/logo-2.png" // Assuming this is a dark-theme-friendly logo
							alt="Zscrum Logo"
							width={150} // Smaller, more refined logo size
							height={42}
							className="h-8 w-auto object-contain"
						/>
						<span className="sr-only">Home</span>
					</Link>

					{/* Right-hand side actions */}
					<div className="flex items-center gap-4">
						<Link href="/project/create" passHref>
							<Button
								className={` border bg-background shadow-xs flex items-center gap-2 border-primary text-primary hover:bg-[#4ECDC4] hover:text-black hover:border-black`} 
							>
								<PenBox size={16} />
								<span className="hidden md:inline">Create Project</span>
							</Button>
						</Link>

						<SignedOut>
							<SignInButton forceRedirectUrl="/onboarding">
								<Button variant="default">Login</Button>
							</SignInButton>
						</SignedOut>

						<SignedIn>
							<UserMenu/>
						</SignedIn>

					</div>
				</nav>
			</div>
		</header>
	);
};

export default Navbar;
