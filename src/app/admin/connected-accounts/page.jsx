"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ConnectedAccounts from "@/components/admin/connected-accounts/connected-accounts.component";

export default function Page() {
  return <Auth component={<ConnectedAccounts />} type={AUTH.PRIVATE} />;
}
