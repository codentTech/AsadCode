import useGetplatform from "@/common/hooks/use-social-platform.hook";
import CampaignDetails from "./components/campaign-detail/campaign-detail.component";
import CompletedCampaignList from "./components/campaign-list/campaign-list.component";
import FinanceDashboard from "./components/finance-dashboard/finance-dashboard.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CreatorLeftPaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/left-pane-skeleton.component";
import CreatorMiddlePaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/middle-pane-skeleton.component";
import CreatorRightPaneSkeleton from "@/common/components/creator-campaign-panes-skeleton/right-pane-skeleton.component";
import useCompleted from "./use-completed.hook";

export default function CreatorCompleted() {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  const {
    selectedCampaign,
    completedCampaigns,
    expandedMonths,
    applicationsLoading,
    applicationsSuccess,
    applicationsError,
    handleCampaignSelectWithPane,
    setExpandedMonths,
    mobilePane,
    reviewRating,
    setReviewRating,
    reviewText,
    setReviewText,
  } = useCompleted();

  if (applicationsLoading) {
    return (
      <div className="relative flex h-screen flex-col md:flex-row">
        <CreatorLeftPaneSkeleton />
        <CreatorMiddlePaneSkeleton />
        <CreatorRightPaneSkeleton variant="completed" />
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
      <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
        <div
          className={`${mobilePane === "list" ? "flex" : "hidden"} min-h-0 flex-1 items-center justify-center border-r border-gray-200 bg-white md:flex md:w-[23%] md:flex-none`}
        >
          <NotFound
            title="No Completed Campaigns"
            description="No completed campaigns available."
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
          className={`${mobilePane === "finance" ? "flex" : "hidden"} min-h-0 flex-1 items-center justify-center bg-white md:flex md:w-[27%] md:flex-none`}
        >
          <NotFound
            title="No Finance Data"
            description="No payment data available."
            className="w-full h-full"
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
