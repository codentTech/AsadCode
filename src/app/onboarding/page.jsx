"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Onboarding from "@/components/onboarding/onboarding.component";

export default function Page() {
  return <Auth component={<Onboarding />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
