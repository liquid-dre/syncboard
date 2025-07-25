import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import {
	ClerkProvider,
	SignInButton,
	SignUpButton,
	SignedIn,
	SignedOut,
	UserButton,
} from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

const COMPANY_PRIMARY_COLOR = "#4ECDC4";
const COMPANY_PRIMARY_COLOR_HOVER ="2081C3"

const VIVID_DARK_BACKGROUND = "#18181B";
const VIVID_CARD_BACKGROUND = "#202024";

export const metadata: Metadata = {
	title: "SyncBoard",
	description: "Project Management App By LayerSync",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: shadesOfPurple,
				variables: {
					colorPrimary: COMPANY_PRIMARY_COLOR,
					colorBackground: VIVID_DARK_BACKGROUND,
					colorInputBackground: "#333338",
					colorInputText: "#EAEAEA",
					colorText: "#F5F5F5",
					colorTextOnPrimaryBackground: "#121212",

					colorDanger: "#EF4444",
					colorSuccess: "#22C55E",
					colorWarning: "#F59E0B",
				},
				elements: {
					formButtonPrimary: `bg-[${COMPANY_PRIMARY_COLOR}] hover:bg-[${COMPANY_PRIMARY_COLOR_HOVER}]/20 text-[${COMPANY_PRIMARY_COLOR}]-foreground`, // Use direct color value for dynamic Tailwind

					card: `bg-[${VIVID_CARD_BACKGROUND}]`,

					headerTitle: `text-[${COMPANY_PRIMARY_COLOR}]`,
					headerSubtitle: `text-gray-300`,
				},
			}}
		>
			<html lang="en" suppressHydrationWarning>
				<head />
				{/* Applies Dotteb background throughtout the whole site */}
				<body className={`${inter.className} dotted-background`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						<main className="min-h-screen">{children}</main>
						<footer className="bg-purple-900 py-12">
							<div className="container mx-auto px-4 text-center text-gray-200">
								<p>Made by AD</p>
							</div>
						</footer>
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
