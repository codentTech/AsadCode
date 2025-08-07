"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PayoutMethodsPage from "@/components/settings/payments/payout-methods/payout-method.component";

export default function Page() {
  return <Auth component={<PayoutMethodsPage />} type={AUTH.PRIVATE} />;
}
