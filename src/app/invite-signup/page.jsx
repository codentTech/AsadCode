"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import InviteSignup from "@/components/invite-signup/invite-signup.component";

export default function Page() {
  return <Auth component={<InviteSignup />} type={AUTH.AUTH_MAIN_ROUTES} />;
}

