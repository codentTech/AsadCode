"use client";

import { isLoginVerified } from "@/common/utils/access-token.util";
import {
  clearAuthSessionForOnboardingLogin,
  isOnboardingCompleted,
  getUser,
} from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import PropTypes from "prop-types";
import { useEffect } from "react";

/**
 * Auth pages (login/onboarding). Logged-in users with completed onboarding go to app.
 * Incomplete onboarding may stay on /onboarding to finish phase two.
 * Creator phase-one handoff (`resumeOnboarding=1`) must stay on login so they can sign in.
 */
export default function AuthMainRoutes({ component }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const searchParams = useSearchParams();
  const user = getUser();

  useEffect(() => {
    const resumeOnboarding = searchParams?.get("resumeOnboarding") === "1";
    if (pathname.startsWith("/login") && resumeOnboarding) {
      if (isLoginVerified()) {
        clearAuthSessionForOnboardingLogin();
      }
      return;
    }

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
  }, [router, pathname, user, searchParams]);

  return component;
}

AuthMainRoutes.propTypes = {
  component: PropTypes.element.isRequired,
};
