"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import NicheTags from "@/components/settings/brand-profile/niche-tags/niche-tags.component";

export default function Page() {
  return <Auth component={<NicheTags />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
