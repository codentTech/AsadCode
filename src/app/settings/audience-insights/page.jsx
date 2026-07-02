"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AudienceInsightsPage from "@/components/settings/audience-insights/audience-insights.component";

export default function Page() {
  return <Auth component={<AudienceInsightsPage />} type={AUTH.PRIVATE} />;
}
