"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BlockedBrandsPage from "@/components/settings/privacy-safety/blocked-brands/blocked-brands.component";

export default function Page() {
  return <Auth component={<BlockedBrandsPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
