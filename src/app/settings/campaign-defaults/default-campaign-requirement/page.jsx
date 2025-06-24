"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import DefaultCampaignRequirements from "@/components/settings/campaign-defaults/default-campaign-requirement/default-campaign-requirement.component";

export default function Page() {
  return <Auth component={<DefaultCampaignRequirements />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
