"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
// Legacy: import Campaign from "@/components/campaign/campaigns/campaign.component";
import Campaign from "@/components/campaign-refactored/campaign.component";

export default function Page() {
  return <Auth component={<Campaign />} type={AUTH.PRIVATE} />;
}
