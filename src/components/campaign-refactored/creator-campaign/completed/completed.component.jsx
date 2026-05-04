import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { useEffect, useState } from "react";
import CampaignDetails from "./components/campaign-detail/campaign-detail.component";
import CompletedCampaignList from "./components/campaign-list/campaign-list.component";
import FinanceDashboard from "./components/finance-dashboard/finance-dashboard.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import useCompleted from "./use-completed.hook";

function LeftPaneSkeleton() {
  return (
    <div className="w-full bg-white border-r border-gray-200 p-4 space-y-3 md:w-[23%]">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center gap-3 mb-3">
            <Skeleton circle className="h-12 w-12" />
            <div className="flex-1">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="h-3 w-full mb-1" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}

function MiddlePaneSkeleton() {
  return (
    <div className="flex-1 bg-white border-r border-gray-200 p-6">
      <Skeleton circle className="h-20 w-20 mx-auto mb-4" />
      <Skeleton className="h-6 w-48 mx-auto mb-2" />
      <Skeleton className="h-4 w-32 mx-auto mb-6" />
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="border rounded-lg p-4">
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RightPaneSkeleton() {
  return (
    <div className="w-full bg-white p-4 md:w-[27%]">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-full mb-2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreatorCompleted() {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  const {
    selectedCampaign,
    completedCampaigns,
    expandedMonths,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    paymentHistory,
    upcomingPayments,
    handleCampaignSelect,
    setExpandedMonths,
  } = useCompleted();

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [mobilePane, setMobilePane] = useState("list");
  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  const handleCampaignSelectWithPane = (campaign) => {
    handleCampaignSelect(campaign);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setMobilePane("detail");
    }
  };

  useEffect(() => {
    if (!selectedCampaign) setMobilePane("list");
  }, [selectedCampaign]);

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return undefined;
    if (mobilePane === "detail") {
      registerMobileSlot(
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => setMobilePane("list")}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Back to campaigns"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => setMobilePane("finance")}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Go to finance"
          >
            <ChevronRight className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      );
    } else if (mobilePane === "finance") {
      registerMobileSlot(
        <button
          type="button"
          onClick={() => setMobilePane("detail")}
          className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          aria-label="Back to campaign detail"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
        </button>
      );
    } else {
      clearMobileSlot();
    }
    return () => clearMobileSlot();
  }, [mobilePane, registerMobileSlot, clearMobileSlot]);

  if (applicationsLoading) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <LeftPaneSkeleton />
        <MiddlePaneSkeleton />
        <RightPaneSkeleton />
      </div>
    );
  }

  if (applicationsError) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <div className="w-full bg-white border-r border-gray-200 flex items-center justify-center md:w-[23%]">
          <div className="text-center">
            <div className="text-sm text-red-500">Failed to load campaigns</div>
          </div>
        </div>
        <div className="flex-1 bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-red-500">Error loading campaign details</div>
          </div>
        </div>
        <div className="w-full bg-white flex items-center justify-center md:w-[27%]">
          <div className="text-center">
            <div className="text-sm text-red-500">Error loading finance data</div>
          </div>
        </div>
      </div>
    );
  }

  if (!applicationsLoading && applicationsSuccess && completedCampaigns.length === 0) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <div className="w-full bg-white border-r border-gray-200 md:w-[23%]">
          <NotFound
            title="No Completed Campaigns"
            description="No completed campaigns available."
            className="h-full"
          />
        </div>
        <div className="flex-1 bg-white border-r border-gray-200">
          <NotFound
            title="No Campaign Selected"
            description="Select a campaign to view details."
            className="h-full"
          />
        </div>
        <div className="w-full bg-white md:w-[27%]">
          <NotFound
            title="No Finance Data"
            description="No payment data available."
            className="h-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <div className={`${mobilePane === "list" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[0_1_23%]`}>
        <CompletedCampaignList
          campaigns={completedCampaigns}
          selectedCampaign={selectedCampaign}
          onSelect={handleCampaignSelectWithPane}
        />
      </div>
      <div className={`${mobilePane === "detail" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[1_1_50%]`}>
        <CampaignDetails
          campaign={selectedCampaign}
          reviewRating={reviewRating}
          reviewText={reviewText}
          setReviewRating={setReviewRating}
          setReviewText={setReviewText}
          getPlatformIcon={getPlatformIcon}
          getPlatformColor={getPlatformColor}
        />
      </div>
      <div className={`${mobilePane === "finance" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[0_1_27%]`}>
        <FinanceDashboard
          expandedMonths={expandedMonths}
          setExpandedMonths={setExpandedMonths}
          selectedCampaign={selectedCampaign}
        />
      </div>
    </div>
  );
}
