"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DataPrivacyPage from "@/components/settings/privacy-safety/data-privacy/data-privacy.component";

export default function Page() {
  return <Auth component={<DataPrivacyPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
