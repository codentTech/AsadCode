"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import EmailNotifications from "@/components/settings/communications/email-notifications.component";

export default function Page() {
  return <Auth component={<EmailNotifications />} type={AUTH.PRIVATE} />;
}
