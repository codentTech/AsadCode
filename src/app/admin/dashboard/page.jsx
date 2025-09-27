"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AdminDashboard from "@/components/admin/dashboard/dashboard.component";

export default function Page() {
  return <Auth component={<AdminDashboard />} type={AUTH.PRIVATE} />;
}
