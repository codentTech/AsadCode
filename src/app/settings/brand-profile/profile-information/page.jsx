"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ProfileInformation from "@/components/settings/brand-profile/profile-information/profile-information";

export default function Page() {
  return <Auth component={<ProfileInformation />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
