"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PaymentMethodsPage from "@/components/settings/payments/payment-methods/payment-methods.component";

export default function PaymentMethods() {
  return <Auth component={<PaymentMethodsPage />} type={AUTH.PRIVATE} />;
}
