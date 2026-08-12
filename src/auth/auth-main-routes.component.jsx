"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import { isOnboardingCompleted, getUser } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";
import { usePathname, useRouter } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * Auth pages (login/onboarding). Logged-in users with completed onboarding go to app.
 * Incomplete onboarding may stay on /onboarding to finish phase two.
 */
export default function AuthMainRoutes({ component }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const user = getUser();

  useEffect(() => {
    if (!isLoginVerified()) return;

    if (user?.role === ROLES.ADMIN) {
      router.push("/admin/dashboard");
      return;
    }

    const onOnboarding = pathname.startsWith("/onboarding") || pathname.startsWith("/invite-signup");
    if (!isOnboardingCompleted(user) && onOnboarding) {
      return;
    }

    if (!isOnboardingCompleted(user)) {
      router.push("/onboarding");
      return;
    }

    router.push("/campaign");
  }, [router, pathname, user]);

  return component;
}

AuthMainRoutes.propTypes = {
  component: PropTypes.element.isRequired,
};
