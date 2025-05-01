"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";

export default function Page() {
  return (
    <Auth component={<CampaignCreationWizard />} type={AUTH.AUTH_MAIN_ROUTES} />
  );
}
