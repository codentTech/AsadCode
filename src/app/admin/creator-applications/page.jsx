"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CreatorApplications from "@/components/admin/creator-applications/creator-applications.component";

export default function Page() {
  return <Auth component={<CreatorApplications />} type={AUTH.PRIVATE} />;
}

