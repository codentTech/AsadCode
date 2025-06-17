"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import EmailPreferencesPage from "@/components/settings/communications/email-preferrence.component";

export default function Page() {
  return <Auth component={<EmailPreferencesPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
