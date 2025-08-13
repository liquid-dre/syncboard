import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Section({
	className,
	...props
}: HTMLAttributes<HTMLElement>) {
	return <section className={cn("py-24 px-5", className)} {...props} />;
}