"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AccountSettings from "@/components/settings/account-settings/account-settings.component";

export default function Page() {
  return <Auth component={<AccountSettings />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
