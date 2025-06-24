"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BriefTemplate from "@/components/settings/campaign-defaults/breif-template/breif-template.component";

export default function Page() {
  return <Auth component={<BriefTemplate />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
