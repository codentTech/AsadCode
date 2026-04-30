import { useEffect } from "react";
import { ChevronLeft, Users } from "lucide-react";
import { useCampaignTabBarMobileSlot } from "@/components/campaign-refactored/campaign-tab-bar-mobile-slot.context";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import RightPaneSkeleton from "@/components/campaign-refactored/shared/right-pane-skeleton/right-pane-skeleton.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { Skeleton, SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import useCompleted from "./use-completed.hook";

function LeftPaneSkeleton() {
  return (
    <div className="hidden min-h-0 w-full shrink-0 space-y-4 border-r border-gray-200 bg-white p-4 md:block md:w-[min(100%,288px)] md:max-w-[26%] lg:max-w-[300px]">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-3">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MiddlePaneSkeleton() {
  return (
    <div className="min-h-0 flex-1 border-r border-gray-200 bg-white p-3 sm:p-4">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-[10rem]" />
      </div>
      <SkeletonCardGrid
        count={6}
        gridClass="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
      />
    </div>
  );
}

const slotBtnClass =
  "inline-flex min-h-[30px] w-10 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 sm:min-h-8 md:min-h-9";

export default function BrandCompleted() {
  const {
    selectedCampaign,
    selectedCreator,
    isMultiCreator,
    currentSort,
    isLoading,
    isIndividualCreator,
    campaignsLoading,
    mobilePane,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleSortChange,
    handleToggleChange,
    goToCreatorsPane,
    backFromCreatorsToOverview,
    backFromDetailToCreators,
  } = useCompleted();

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
          aria-label="Open creators and results"
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

  if (campaignsLoading && !selectedCampaign) {
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
      {isLoading ? (
        <RightPaneSkeleton layout="fluid" />
      ) : !selectedCreator ? (
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
          isIndividualCreator={isIndividualCreator}
          onClearCreator={handleClearCreator}
          filters={{ status: "COMPLETED", sort: currentSort || "newest" }}
        />
      )}
    </>
  );

  return (
    <div className="relative flex min-h-0 flex-1 flex-col bg-gradient-to-b from-slate-50/80 to-white md:flex-row md:bg-transparent">
      <div
        className={`min-h-0 min-w-0 flex-col border-b border-indigo-100/30 bg-white shadow-[0_4px_24px_-12px_rgba(79,70,229,0.15)] transition-[opacity,transform] duration-200 ease-out md:flex md:max-w-[min(100%,300px)] md:flex-[0_1_23%] md:border-b-0 md:border-r md:border-gray-200 md:shadow-none lg:max-w-[320px] ${overviewVisible} md:flex`}
      >
        <CampaignOverview
          onCampaignSelect={handleCampaignSelect}
          onToggleChange={handleToggleChange}
          parentSelectedCampaign={selectedCampaign}
        />
      </div>

      <div
        className={`min-h-0 min-w-0 flex-1 flex-col md:flex md:max-w-[58%] md:flex-[1_1_50%] lg:max-w-[60%] ${creatorsVisible} md:flex`}
      >
        <CreatorSpendAnalysis
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          onCreatorSelect={handleCreatorSelect}
          onClearCreator={handleClearCreator}
          onSortChange={handleSortChange}
          currentSort={currentSort || "newest"}
          isMultiCreator={isMultiCreator}
          isCompleted={true}
        />
      </div>

      <div
        className={`min-h-0 min-w-0 flex-1 flex-col border-l border-gray-200/90 bg-white shadow-[0_0_28px_-10px_rgba(79,70,229,0.18)] md:shadow-none ${detailVisible} md:flex md:max-w-md md:flex-[0_1_27%] lg:max-w-lg lg:flex-[0_1_27%]`}
      >
        {rightColumn}
      </div>
    </div>
  );
}
