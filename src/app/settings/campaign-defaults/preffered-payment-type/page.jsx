"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PreferredPaymentType from "@/components/settings/campaign-defaults/preffered-payment-type/preffered-payment-type";

export default function Page() {
  return <Auth component={<PreferredPaymentType />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
