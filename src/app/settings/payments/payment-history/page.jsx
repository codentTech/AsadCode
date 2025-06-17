"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PaymentHistoryPage from "@/components/settings/payments/components/payment-history/payment-history.component";

export default function Page() {
  return <Auth component={<PaymentHistoryPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
