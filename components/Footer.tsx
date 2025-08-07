import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
	return (
		<footer className="bg-[#2C2C2C] text-gray-300 py-14 mt-16 rounded-t-3xl shadow-lg">
			<div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-12 text-sm sm:text-left text-center">
				{/* Left */}
				<div>
					<h2 className="text-3xl font-bold tracking-tight text-white">
						Syncboard
					</h2>
					<p className="text-gray-400 mt-3 text-base leading-relaxed">
						Project management, beautifully reimagined for modern teams.
					</p>
				</div>

				{/* Middle Links */}
				<div>
					<h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/project/create"
								className="hover:text-[#4ECDC4] transition-colors"
							>
								Create Project
							</Link>
						</li>
						<li>
							<Link
								href="/dashboard"
								className="hover:text-[#4ECDC4] transition-colors"
							>
								Dashboard
							</Link>
						</li>
						<li>
							<Link
								href="/pricing"
								className="hover:text-[#4ECDC4] transition-colors"
							>
								Pricing
							</Link>
						</li>
						<li>
							<Link
								href="/docs"
								className="hover:text-[#4ECDC4] transition-colors"
							>
								Docs
							</Link>
						</li>
					</ul>
				</div>

				{/* Right Social */}
				<div>
					<h3 className="text-lg font-semibold text-white mb-3">Connect</h3>
					<div className="flex justify-center sm:justify-start gap-5 mt-2">
						<Link href="https://github.com" target="_blank">
							<Github className="w-6 h-6 hover:text-[#4ECDC4] transition-colors" />
						</Link>
						<Link href="https://linkedin.com" target="_blank">
							<Linkedin className="w-6 h-6 hover:text-[#4ECDC4] transition-colors" />
						</Link>
						<Link href="https://twitter.com" target="_blank">
							<Twitter className="w-6 h-6 hover:text-[#4ECDC4] transition-colors" />
						</Link>
					</div>
				</div>
			</div>

			{/* Divider */}
			<div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-gray-500">
				<p>&copy; {new Date().getFullYear()} Syncboard — Made with ❤️ by AD</p>
			</div>
		</footer>
	);
}
