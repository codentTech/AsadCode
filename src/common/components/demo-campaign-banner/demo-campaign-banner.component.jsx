"use client";

import { DEMO_CAMPAIGN_BANNER_COPY } from "@/common/utils/demo-campaign.util";

export default function DemoCampaignBanner({ className = "" }) {
  return (
    <div
      role="status"
      className={`w-full border-b border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs font-medium text-amber-950 sm:px-4 sm:text-sm ${className}`}
    >
      {DEMO_CAMPAIGN_BANNER_COPY}
    </div>
  );
}
