"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import SocialLinks from "@/components/settings/brand-profile/social-links/social-links.component";

export default function Page() {
  return <Auth component={<SocialLinks />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
