"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AdminDashboard from "@/components/dashboard/dashboard.component";
import Login from "@/components/login/login.component";

export default function Page() {
  return <Auth component={<AdminDashboard />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
