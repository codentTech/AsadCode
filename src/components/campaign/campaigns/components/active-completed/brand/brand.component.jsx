import React, { useState } from "react";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import { isCreatorMode } from "@/common/utils/users.util";

function Brand({ isCompleted }) {
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    // Reset creator selection when campaign changes
    setSelectedCreator(null);
  };

  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  return (
    <div className="relative flex">
      <CampaignOverview isCompleted={isCompleted} onCampaignSelect={handleCampaignSelect} />

      <CreatorSpendAnalysis
        isCompleted={isCompleted}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        isCompleted={isCompleted}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
      />
    </div>
  );
}

export default Brand;
