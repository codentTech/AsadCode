"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import WaitingList from "@/components/admin/users/waiting-list/waiting-list.component";

export default function Page() {
  return <Auth component={<WaitingList />} type={AUTH.PRIVATE} />;
}
