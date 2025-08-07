"use client";

import { usePathname, useRouter } from "next/navigation";
import {
	OrganizationSwitcher,
	SignedIn,
	useOrganization,
	useUser,
	useOrganizationList,
} from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";

const OrgSwitcher = () => {
	const { isLoaded: isOrgLoaded, organization } = useOrganization();
	const { isLoaded: isUserLoaded, user } = useUser();
	const { setActive, isLoaded: isOrgListLoaded } = useOrganizationList();

	const pathname = usePathname();
	const router = useRouter();

	const [initialLoadComplete, setInitialLoadComplete] = useState(false);
	const [previousOrgId, setPreviousOrgId] = useState<string | null>(null);
	const firstRender = useRef(true);

	const isOnOnboarding = pathname.includes("/onboarding");

	// 🔹 Reset active org on onboarding
	useEffect(() => {
		if (isOnOnboarding && isOrgListLoaded && setActive) {
			console.log("Clearing active organization for fresh onboarding...");
			setActive({ organization: null });
		}
	}, [isOnOnboarding, isOrgListLoaded, setActive]);

	// 🔹 Complete load check
	useEffect(() => {
		if (isOrgLoaded && isUserLoaded) {
			setInitialLoadComplete(true);
		}
	}, [isOrgLoaded, isUserLoaded]);

	// 🔹 Handle auto navigation
	useEffect(() => {
		if (!initialLoadComplete || !organization) return;

		console.log("org:", organization.id, "prev:", previousOrgId);

		if (isOnOnboarding && firstRender.current) {
			console.log("Onboarding mode → Skip auto-navigation (first render)");
			firstRender.current = false;
			return;
		}

		firstRender.current = false;

		if (!isOnOnboarding && organization.id !== previousOrgId) {
			console.log("Org changed → navigating...");
			setPreviousOrgId(organization.id);
			router.push(`/organization/${organization.slug}`);
		} else {
			console.log("Same org selected. No redirect.");
		}
	}, [
		organization,
		pathname,
		previousOrgId,
		router,
		initialLoadComplete,
		isOnOnboarding,
	]);

	if (pathname === "/") return null;
	if (!initialLoadComplete || !user) return null;

	return (
		<div className="flex justify-end mt-2">
			<SignedIn>
				<OrganizationSwitcher
					hidePersonal
					createOrganizationMode="navigation"
					createOrganizationUrl="/onboarding"
					appearance={{
						elements: {
							organizationSwitcherTrigger: `
      group relative inline-flex items-center gap-3 
      rounded-full px-6 py-3 text-base md:text-lg font-semibold 
      border border-gray-300 dark:border-gray-700
      bg-white dark:bg-gray-950
      text-gray-800 dark:text-gray-200
      shadow-md 
      transition-all duration-300 ease-in-out

      hover:-translate-y-[3px] hover:scale-[1.05]
      hover:border-transparent
      hover:bg-gradient-to-r hover:from-[#e96614] hover:to-[#bf1363]
      hover:text-white
      hover:shadow-[0_0_35px_5px_rgba(233,102,20,0.4)]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#e96614]
    `,

							organizationSwitcherTriggerIcon: `
      text-gray-500 dark:text-gray-400
      group-hover:text-white transition-colors duration-300
    `,
						},
					}}
				/>
			</SignedIn>
		</div>
	);
};

export default OrgSwitcher;
