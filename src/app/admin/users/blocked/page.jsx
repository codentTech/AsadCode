"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import BlockedUsers from "@/components/admin/users/blocked-users/blocked-users.component";

export default function Page() {
  return <Auth component={<BlockedUsers />} type={AUTH.PRIVATE} />;
}
