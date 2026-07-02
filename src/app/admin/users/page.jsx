"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Users from "@/components/admin/users/all-users/users.component";

export default function Page() {
  return <Auth component={<Users />} type={AUTH.SUPER_ADMIN} />;
}
