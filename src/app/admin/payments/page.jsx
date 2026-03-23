"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import Payments from "@/components/admin/payments/payments.component";

export default function Page() {
  return (
    <Auth component={<Payments />} type={AUTH.PRIVATE} />
  );
}
