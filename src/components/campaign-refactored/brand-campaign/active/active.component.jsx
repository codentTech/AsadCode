import { useEffect } from "react";
import { ChevronLeft, Users } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import LeftPaneSkeleton from "@/common/components/brand-campaign-panes-skeleton/left-pane-skeleton.component";
import MiddlePaneSkeleton from "@/common/components/brand-campaign-panes-skeleton/middle-pane-skeleton.component";
import NotFound from "@/common/components/not-found/not-found.component";
import RightPaneSkeleton from "@/components/campaign-refactored/shared/right-pane-skeleton/right-pane-skeleton.component";
import useActive from "./use-active.hook";

const slotBtnClass =
  "inline-flex min-h-[30px] w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 sm:min-h-8 md:min-h-9";

export default function BrandActive() {
  const {
    selectedCampaign,
    selectedCreator,
    filters,
    rightPaneState,
    isLoading,
    mobilePane,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleSortChange,
    handleToggleChange,
    goToCreatorsPane,
    backFromCreatorsToOverview,
    backFromDetailToCreators,
  } = useActive();

  const tabBarMobileSlot = useCampaignTabBarMobileSlot();
  const registerMobileSlot = tabBarMobileSlot?.registerMobileSlot;
  const clearMobileSlot = tabBarMobileSlot?.clearMobileSlot;

  useEffect(() => {
    if (!registerMobileSlot || !clearMobileSlot) return undefined;

    if (mobilePane === "overview") {
      registerMobileSlot(
        <button
          type="button"
          onClick={goToCreatorsPane}
          className={slotBtnClass}
          aria-label="Open creators and progress"
        >
          <Users className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
        </button>
      );
    } else if (mobilePane === "creators") {
      registerMobileSlot(
        <button
          type="button"
          onClick={backFromCreatorsToOverview}
          className={slotBtnClass}
          aria-label="Back to campaign overview"
        >
          <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
        </button>
      );
    } else if (mobilePane === "detail") {
      registerMobileSlot(
        <button
          type="button"
          onClick={backFromDetailToCreators}
          className={slotBtnClass}
          aria-label="Back to creator list"
        >
          <ChevronLeft className="h-4 w-4 text-primary" strokeWidth={2.25} aria-hidden />
        </button>
      );
    } else {
      clearMobileSlot();
    }

    return () => clearMobileSlot();
  }, [
    mobilePane,
    registerMobileSlot,
    clearMobileSlot,
    goToCreatorsPane,
    backFromCreatorsToOverview,
    backFromDetailToCreators,
  ]);

  if (isLoading && !selectedCampaign) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <LeftPaneSkeleton />
        <MiddlePaneSkeleton />
        <RightPaneSkeleton layout="fluid" />
      </div>
    );
  }

  const overviewVisible = mobilePane === "overview" ? "flex" : "hidden";
  const creatorsVisible = mobilePane === "creators" ? "flex" : "hidden";
  const detailVisible = mobilePane === "detail" ? "flex" : "hidden";

  const rightColumn = (
    <>
      {rightPaneState.type === "loading" ? (
        <RightPaneSkeleton layout="fluid" />
      ) : rightPaneState.type === "notFound" ? (
        <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center border-l border-gray-100 bg-gradient-to-b from-violet-50/40 to-white px-4 text-center md:max-w-md md:flex-[0_1_27%] lg:flex-[0_1_27%]">
          <NotFound
            title="No Data Available"
            description="Please select a campaign and creator."
            className="flex-1 w-full !p-0"
          />
        </div>
      ) : (
        <DeliverablesProgress
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          isIndividualCreator={rightPaneState.isIndividualCreator}
          onClearCreator={handleClearCreator}
          filters={filters}
        />
      )}
    </>
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-gradient-to-b from-slate-50/80 to-white md:flex-row md:items-stretch md:bg-transparent">
      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-b border-indigo-100/30 bg-white shadow-[0_4px_24px_-12px_rgba(79,70,229,0.15)] transition-[opacity,transform] duration-200 ease-out md:h-full md:w-[300px] md:max-w-[320px] md:shrink-0 md:grow-0 md:basis-[340px] md:border-b-0 md:border-r md:border-gray-200 md:shadow-none lg:w-[380px] lg:max-w-[380px] lg:basis-[380px] ${overviewVisible} md:flex`}
      >
        <CampaignOverview
          onCampaignSelect={handleCampaignSelect}
          onToggleChange={handleToggleChange}
        />
      </div>

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden md:h-full md:max-w-[58%] md:flex-[1_1_50%] lg:max-w-[60%] ${creatorsVisible} md:flex`}
      >
        <CreatorSpendAnalysis
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          onCreatorSelect={handleCreatorSelect}
          onClearCreator={handleClearCreator}
          onSortChange={handleSortChange}
          currentSort={filters.sort}
          isCompleted={false}
        />
      </div>

      <div
        className={`flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border-l border-gray-200/90 bg-white shadow-[0_0_28px_-10px_rgba(79,70,229,0.18)] md:h-full md:shadow-none ${detailVisible} md:flex md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]`}
      >
        {rightColumn}
      </div>
    </div>
  );
}
