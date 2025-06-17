"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Notifications from "@/components/notifications/notifications.component";

export default function Page() {
  return <Auth component={<Notifications />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
