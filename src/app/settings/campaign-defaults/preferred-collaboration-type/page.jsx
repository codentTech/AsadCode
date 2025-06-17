"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PreferredCollaborationType from "@/components/settings/campaign-defaults/components/preferred-collaboration-type/preferred-collaboration-type.component";

export default function Page() {
  return <Auth component={<PreferredCollaborationType />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
