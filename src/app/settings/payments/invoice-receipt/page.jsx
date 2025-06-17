"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import InvoicesReceiptsPage from "@/components/settings/payments/components/invoice-receipt/invoice-receipt.component.jsx";

export default function Page() {
  return <Auth component={<InvoicesReceiptsPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
