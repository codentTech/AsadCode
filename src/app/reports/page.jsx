"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Reports from "@/components/reports/reports.component";

export default function Page() {
  return <Auth component={<Reports />} type={AUTH.PRIVATE} />;
}
