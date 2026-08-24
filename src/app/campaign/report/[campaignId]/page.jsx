"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import CompletedCampaignReport from "@/components/campaign-refactored/brand-campaign/completed/components/completed-campaign-report/completed-campaign-report.component";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function CompletedCampaignReportGate() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params?.campaignId;
  const user = useSelector((state) => state.auth?.user);
  const role = user?.role || user?.data?.role;

  useEffect(() => {
    if (role === "CREATOR") {
      router.replace("/campaign");
    }
  }, [role, router]);

  if (role === "CREATOR") {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Redirecting…
      </div>
    );
  }

  if (!campaignId) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500">
        Missing campaign
      </div>
    );
  }

  return <CompletedCampaignReport campaignId={campaignId} />;
}

export default function Page() {
  return <Auth component={<CompletedCampaignReportGate />} type={AUTH.PRIVATE} />;
}
