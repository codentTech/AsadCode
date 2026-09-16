"use client";

import { Suspense } from "react";
import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import HeaderLayout from "@/common/layouts/header.layout";
import CreateCampaign from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";

function CreateCampaignPage() {
  return (
    <HeaderLayout>
      <Suspense fallback={<div className="flex min-h-0 flex-1 bg-[#f3f7fa]" />}>
        <CreateCampaign />
      </Suspense>
    </HeaderLayout>
  );
}

export default function Page() {
  return <Auth component={<CreateCampaignPage />} type={AUTH.PRIVATE} />;
}
