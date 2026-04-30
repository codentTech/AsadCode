import React, { useEffect, useState } from "react";
import CampaignList from "./components/campaign-list/campaign-list.component";
import CampaignDetail from "./components/campaign-detail/campaign-detail.component";
import ContentPlanning from "./components/content-planning/content-planning.component";
import TaskManagerCreator from "@/components/campaign-refactored/creator-campaign/active/components/task-manager-creator/task-manager-creator.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import useActive from "./use-active.hook";

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
    <div className="w-[27%] bg-white p-4">
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-3 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CreatorActive() {
  const {
    selectedCampaign,
    activeCampaigns,
    getApplicationsState,
    handleCampaignSelect,
    getCampaignById,
    formatCampaignData,
  } = useActive();
  const [mobilePane, setMobilePane] = useState("list");
  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  const formattedCampaigns = activeCampaigns.map((campaign) => formatCampaignData(campaign));
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
            onClick={() => setMobilePane("planner")}
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            aria-label="Go to planner"
          >
            <ChevronRight className="h-3.5 w-3.5 text-primary" strokeWidth={2.25} aria-hidden />
          </button>
        </div>
      );
    } else if (mobilePane === "planner") {
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

  if (getApplicationsState.isLoading && formattedCampaigns.length === 0) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <LeftPaneSkeleton />
        <MiddlePaneSkeleton />
        <RightPaneSkeleton />
      </div>
    );
  }

  if (!getApplicationsState.isLoading && formattedCampaigns.length === 0) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <div className="w-[23%] bg-white border-r border-gray-200">
          <NotFound
            title="No Active Campaigns"
            description="No campaigns available."
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
        <div className="w-[27%] bg-white flex flex-col">
          <div className="flex-1">
            <NotFound
              title="No Content Planner"
              description="Content tools not available."
              className="h-full"
            />
          </div>
          <div className="border-t border-gray-200 p-4 flex-shrink-0" style={{ maxHeight: "40%" }}>
            <TaskManagerCreator
              setSelectedCampaign={handleCampaignSelect}
              getCampaignById={getCampaignById}
              formatCampaignData={formatCampaignData}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
      <div className={`${mobilePane === "list" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[0_1_23%]`}>
        <CampaignList
          campaigns={formattedCampaigns}
          selectedCampaign={selectedCampaign}
          onCampaignSelect={handleCampaignSelectWithPane}
          isLoading={getApplicationsState.isLoading}
        />
      </div>
      <div className={`${mobilePane === "detail" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[1_1_50%]`}>
        <CampaignDetail selectedCampaign={selectedCampaign} isLoading={getApplicationsState.isLoading} />
      </div>
      <div className={`${mobilePane === "planner" ? "flex" : "hidden"} min-h-0 flex-1 md:flex md:flex-[0_1_27%]`}>
        <ContentPlanning
          selectedCampaign={selectedCampaign}
          setSelectedCampaign={handleCampaignSelectWithPane}
          getCampaignById={getCampaignById}
          formatCampaignData={formatCampaignData}
        />
      </div>
    </div>
  );
}
