import CompanyCarousel from "@/components/company-carousel";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BarChart, Calendar, Layout } from "lucide-react";
import Link from "next/link";
import faqs from "@/data/faqs.json";
import Section from "@/components/section";

export default function Home() {
	const features = [
		{
			title: "Intuitive Kanban Boards",
			description:
				"Visualize your workflow and optimize team productivity with our easy-to-use Kanban boards.",
			icon: Layout,
		},
		{
			title: "Powerful Sprint Planning",
			description:
				"Plan and manage sprints effectively, ensuring your team stays focused on delivering value.",
			icon: Calendar,
		},
		{
			title: "Comprehensive Reporting",
			description:
				"Gain insights into your team's performance with detailed, customizable reports and analytics.",
			icon: BarChart,
		},
	];

	return (
		<div>
			{/* Hero Section */}
			{/* <section className="flex items-center min-h-screen py-24 text-center"> */}

			<Section className="flex-col justify-center items-center  min-h-screen mx-auto text-center flex ">
				<div className="container mx-auto px-5">
					<h1 className="text-6xl sm:text-7xl lg:text-8xl font-extrabold gradient-title pb-6">
						Streamline Your Workflow
						<br />
						<span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 text-transparent bg-clip-text">
							with SyncBoard
						</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
						Empower your team with our intuitive project management solution.
					</p>
					<div className="flex justify-center gap-4">
						<Link href="/onboarding">
							<Button
								size="lg"
								className="relative px-8 py-4 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-300 text-white shadow-lg hover:shadow-[0_0_30px_rgba(255,115,179,0.8)] hover:scale-115 transition-all"
							>
								Get Started <ArrowRight size={18} className="ml-2" />
							</Button>
						</Link>
						<Link href="#features">
							<Button
								size="lg"
								className="bg-transaparent text-white border border-gray-300 hover:bg-white hover:text-black hover:scale-115"
							>
								Learn More
							</Button>
						</Link>
					</div>
				</div>
			</Section>

			{/* Features Section */}
			<Section id="features" className="bg-gray-950">
				<div className="container mx-auto">
					<h3 className="text-4xl font-bold mb-16 text-center text-white">
						Key Features
					</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
						{features.map((feature, index) => (
							<Card
								key={index}
								className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-6 border border-white/10 hover:border-white/20 transition-all rounded-xl shadow-md hover:shadow-lg"
							>
								<CardContent className="flex flex-col items-start gap-4">
									<feature.icon className="h-12 w-12 text-pink-400" />
									<h4 className="text-2xl font-semibold">{feature.title}</h4>
									<p className="text-sm text-gray-300">{feature.description}</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</Section>

			{/* Companies Carousel */}
			<Section className="bg-black text-white">
				<div className="container mx-auto">
					<h3 className="text-4xl font-bold mb-16 text-center">
						Trusted by Industry Leaders
					</h3>
					<CompanyCarousel />
				</div>
			</Section>

			{/* FAQ Section */}
			<Section className="bg-gray-950 text-white">
				<div className="container mx-auto">
					<h3 className="text-4xl font-bold mb-16 text-center">
						Frequently Asked Questions
					</h3>
					{/* <Accordion
						type="single"
						collapsible
						className="w-full max-w-3xl mx-auto"
					>
						{faqs.map((faq, index) => (
							<AccordionItem key={index} value={`item-${index}`}>
								<AccordionTrigger>{faq.question}</AccordionTrigger>
								<AccordionContent>{faq.answer}</AccordionContent>
							</AccordionItem>
						))}
					</Accordion> */}
					<div className="w-full max-w-3xl mx-auto">
						<Accordion type="single" collapsible>
							{faqs.map((faq, index) => (
								<AccordionItem
									key={index}
									value={`item-${index}`}
									className="mb-4 rounded-lg border border-white/10 bg-gray-900/50 shadow-sm px-8"
								>
									<AccordionTrigger className="text-lg font-medium transition-colors">
										{faq.question}
									</AccordionTrigger>
									<AccordionContent>{faq.answer}</AccordionContent>
								</AccordionItem>
							))}
						</Accordion>
					</div>
				</div>
			</Section>

			{/* CTA Section */}
			<Section className="text-center bg-gradient-to-br from-black via-gray-950 to-black text-white pb-16 pt-16">
				<div className="container mx-auto px-5">
					<h3 className="text-4xl font-bold mb-6">
						Ready to Transform Your Workflow?
					</h3>
					<p className="text-xl mb-12">
						Join thousands of teams already using SyncBoard to streamline their
						projects and boost productivity.
					</p>
					<Link href="/onboarding">
						<Button
							size="lg"
							className="px-8 py-4 text-lg font-bold rounded-xl bg-gradient-to-r from-[#b81365] via-[#f55536] to-orange-400 text-white shadow-lg hover:shadow-[0_0_30px_rgba(248,85,113,0.8)] animate-pulse hover:animate-none transition-all"
						>
							Start For Free <ArrowRight className="ml-2 h-5 w-5" />
						</Button>
					</Link>
				</div>
			</Section>
		</div>
	);
}
