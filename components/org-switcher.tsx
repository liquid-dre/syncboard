"use client";

import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

const OrgSwitcher = () => {
  const { isLoaded: isOrgLoaded, organization } = useOrganization();
  const { isLoaded: isUserLoaded, user } = useUser();
  const pathname = usePathname();

  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    if (isOrgLoaded && isUserLoaded) {
      setInitialLoadComplete(true);
    }
  }, [isOrgLoaded, isUserLoaded]);

  if (pathname === "/") {
    return null;
  }

  if (!initialLoadComplete) {
    return null;
  }

  if (!user || !organization) {
    return null;
  }

  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          // FIX: Change createOrganizationMode to only allow "navigation" or undefined
          // If you want a modal, you'll need to implement it separately,
          // e.g., with a button that opens Clerk's <CreateOrganization /> component.
          createOrganizationMode="navigation" // This is the fix
          // If you want it conditional, it still must only resolve to "navigation" or undefined:
          // createOrganizationMode={pathname === "/onboarding" ? "navigation" : undefined}


          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
          createOrganizationUrl="/onboarding"
          appearance={{
            elements: {
              organizationSwitcherTrigger: `
                flex items-center gap-2
                border border-gray-300 dark:border-gray-700
                rounded-lg px-4 py-2 text-sm md:text-base
                text-gray-800 dark:text-gray-200
                shadow-sm hover:shadow-md
                transition-all duration-200
                bg-white dark:bg-gray-800
              `,
              organizationSwitcherTriggerIcon: "text-gray-500 dark:text-gray-400",
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;