import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-gradient-to-br from-[#2e1065] via-[#581c87] to-[#b81365] text-gray-200 py-12 mt-12">
			<div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm sm:text-left text-center">
				{/* Left */}
				<div>
					<h2 className="text-2xl font-bold tracking-tight text-white">
						Syncboard
					</h2>
					<p className="text-sm text-gray-300 mt-2">
						Project management. Beautifully reimagined.
					</p>
				</div>

				{/* Middle Links */}
				<div className="space-y-2">
					<h3 className="text-md font-semibold text-white">Quick Links</h3>
					<ul className="space-y-1 text-gray-300">
						<li>
							<Link
								href="/project/create"
								className="hover:text-white transition"
							>
								Create Project
							</Link>
						</li>
						<li>
							<Link href="/dashboard" className="hover:text-white transition">
								Dashboard
							</Link>
						</li>
						<li>
							<Link href="/pricing" className="hover:text-white transition">
								Pricing
							</Link>
						</li>
						<li>
							<Link href="/docs" className="hover:text-white transition">
								Docs
							</Link>
						</li>
					</ul>
				</div>

				{/* Right Social */}
				<div className="space-y-2">
					<h3 className="text-md font-semibold text-white">Connect</h3>
					<div className="flex justify-center sm:justify-start gap-4 mt-2">
						<Link href="https://github.com" target="_blank">
							<Github className="w-5 h-5 hover:text-white transition" />
						</Link>
						<Link href="https://linkedin.com" target="_blank">
							<Linkedin className="w-5 h-5 hover:text-white transition" />
						</Link>
						<Link href="https://twitter.com" target="_blank">
							<Twitter className="w-5 h-5 hover:text-white transition" />
						</Link>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="mt-10 border-t border-white/20 pt-6 text-center text-xs text-gray-400">
				<p>&copy; {new Date().getFullYear()} Syncboard — Made with ❤️ by AD</p>
			</div>
		</footer>
	);
}
