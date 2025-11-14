"use client";

import { useEffect, useState } from "react";
import HeaderLayout from "@/common/layouts/header.layout";
import { isCreatorMode } from "@/common/utils/users.util";
import { useRouter } from "next/navigation";
import useBrandPortfolioData from "./use-brand-portfolio-data.hook";
import ProfileOverview from "./components/profile-overview/profile-overview";
import AboutUs from "./components/about-us/about-us";
import ActiveCampaigns from "./components/active-campaigns/active-campaigns";
import AudienceSnapshot from "./components/audience-snapshot/audience-snapshot";

export default function BrandPortfolio() {
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isCreatorMode()) {
      router.replace("/creator-portfolio");
    }
  }, [router]);

  const {
    brandBasics,
    brandOverview,
    brandPreferences,
    verifiedConnections,
    audienceSummary,
    refreshBrandData,
  } = useBrandPortfolioData(refreshKey);

  const handleRefresh = () => {
    setIsRefreshing(true);
    refreshBrandData();
    setRefreshKey((prev) => prev + 1);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <HeaderLayout className="min-h-screen bg-gray-50">
      <main className="flex flex-col gap-4 mx-auto px-4 py-8 w-full md:w-[80%] bg-gray-50">
        <ProfileOverview
          basics={brandBasics}
          overview={brandOverview}
          connections={verifiedConnections}
          preferences={brandPreferences}
          audienceSummary={audienceSummary}
          onEditProfile={() => router.push("/settings/brand-profile/profile-information")}
          canEdit
        />

        <AboutUs overview={brandOverview} website={brandBasics.website} />

        <ActiveCampaigns refreshKey={refreshKey} />

        <AudienceSnapshot
          connections={verifiedConnections}
          summary={audienceSummary}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
      </main>
    </HeaderLayout>
  );
}
