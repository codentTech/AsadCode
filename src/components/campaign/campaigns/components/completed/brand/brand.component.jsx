import React, { useMemo, useState } from "react";
import CampaignOverviewCompleted from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysisCompleted from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgressCompleted from "./components/deliverables-progress/deliverables-progress.component";
import { isCreatorMode } from "@/common/utils/users.util";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";

function CompletedBrandCampaign() {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCreator(null);
  };

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  const handleSortChange = () => {};

  return (
    <div className="relative flex">
      <CampaignOverviewCompleted onCampaignSelect={handleCampaignSelect} />

      <CreatorSpendAnalysisCompleted
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onSortChange={handleSortChange}
        currentSort={"newest"}
        isMultiCreator={!selectedCampaign || selectedCampaign?.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
        isCompleted={true}
      />

      {/* Right Pane - consistent states */}
      {selectedCampaign ? (
        <DeliverablesProgressCompleted
          selectedCampaign={selectedCampaign}
          selectedCreator={selectedCreator}
          isIndividualCreator={selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
        />
      ) : (
        <div className="w-[27%] bg-transparent flex flex-col border-l h-screen items-center justify-center">
          <NotFound title="No Campaign Selected" description="Select a campaign to view details." />
        </div>
      )}
    </div>
  );
}

export default CompletedBrandCampaign;
