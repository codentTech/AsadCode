import { useEffect, useState } from "react";
import CampaignList from "./components/campaign-list/campaign-list.component";
import CampaignDetail from "./components/campaign-detail/campaign-detail.component";
import ContentPlanning from "./components/content-planning/content-planning.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CreatorLeftPaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/left-pane-skeleton.component";
import CreatorMiddlePaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/middle-pane-skeleton.component";
import CreatorRightPaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/right-pane-skeleton.component";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import useActive from "./use-active.hook";

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
        <CreatorLeftPaneSkeleton />
        <CreatorMiddlePaneSkeleton />
        <CreatorRightPaneSkeleton variant="active" />
      </div>
    );
  }

  if (!getApplicationsState.isLoading && formattedCampaigns.length === 0) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div
          className={`${mobilePane === "list" ? "flex" : "hidden"} min-h-0 flex-1 items-center justify-center border-r border-gray-200 bg-white md:flex md:w-[23%] md:flex-none`}
        >
          <NotFound
            title="No Active Campaigns"
            description="No campaigns available."
            className="w-full h-full"
          />
        </div>
        <div
          className={`${mobilePane === "detail" ? "flex" : "hidden"} min-h-0 flex-1 items-center justify-center border-r border-gray-200 bg-white md:flex`}
        >
          <NotFound
            title="No Campaign Selected"
            description="Select a campaign to view details."
            className="w-full h-full"
          />
        </div>
        <div
          className={`${mobilePane === "planner" ? "flex" : "hidden"} min-h-0 flex-1 items-center justify-center bg-white md:flex md:w-[27%] md:flex-none`}
        >
          <NotFound
            title="No Content Planner"
            description="Content tools not available."
            className="w-full h-full"
          />
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
