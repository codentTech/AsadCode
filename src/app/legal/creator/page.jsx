"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import LegalIndexPage from "@/components/legal/legal-index/legal-index.component";

export default function Page() {
  return <Auth component={<LegalIndexPage audience="creator" />} type={AUTH.PUBLIC} />;
}
