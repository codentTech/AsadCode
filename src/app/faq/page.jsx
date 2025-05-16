"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import FAQPage from "@/components/faq/faq.component";

export default function Page() {
  return <Auth component={<FAQPage />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
