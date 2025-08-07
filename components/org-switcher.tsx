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
                flex items-center gap-2
                rounded-full px-5 py-2.5 text-sm md:text-base font-medium
                border border-gray-300 dark:border-gray-700
                bg-white dark:bg-gray-900
                text-gray-800 dark:text-gray-200
                shadow-md hover:shadow-xl
                transition-all duration-300
                hover:-translate-y-0.5 hover:scale-105
                hover:border-transparent
                hover:bg-gradient-to-r hover:from-[#6366F1] hover:to-[#4ECDC4] 
                hover:text-white
              `,
              organizationSwitcherTriggerIcon: `
                text-gray-500 dark:text-gray-400
                group-hover:text-white transition-colors
              `,
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;