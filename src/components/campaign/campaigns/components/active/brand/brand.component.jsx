import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import Loading from "@/common/components/loadar/loading.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useActiveBrand from "./use-active-brand.hook";

function ActiveBrandCampaign() {
  const {
    selectedCampaign,
    selectedCreator,
    isMultiCreator,
    filters,
    rightPaneState,
    handleCampaignSelect,
    handleCreatorSelect,
    handleClearCreator,
    handleSortChange,
    handleToggleChange,
  } = useActiveBrand();

  const renderRightPane = () => {
    if (rightPaneState.type === "loading") {
      return (
        <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
          <Loading />
        </div>
      );
    }

    if (rightPaneState.type === "notFound") {
      return (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound title={rightPaneState.title} description={rightPaneState.description} />
        </div>
      );
    }

    return (
      <DeliverablesProgress
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        isIndividualCreator={rightPaneState.isIndividualCreator}
        onClearCreator={handleClearCreator}
        filters={filters}
      />
    );
  };

  return (
    <div className="relative flex">
      <CampaignOverview onCampaignSelect={handleCampaignSelect} onToggleChange={handleToggleChange} />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onClearCreator={handleClearCreator}
        onSortChange={handleSortChange}
        currentSort={filters.sort}
        isMultiCreator={isMultiCreator}
        isCompleted={false}
      />

      {renderRightPane()}
    </div>
  );
}

export default ActiveBrandCampaign;
