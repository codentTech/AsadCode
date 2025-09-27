import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";
import { isCreatorMode } from "@/common/utils/users.util";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";

function Brand({ isCompleted }) {
  const dispatch = useDispatch();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({
    status: "HIRED", // Default to HIRED applications for active-completed tab
    sort: "newest", // Default sort
  });

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    // Reset creator selection when campaign changes
    setSelectedCreator(null);

    // Fetch applied creators for this campaign (HIRED status for active-completed tab)
    if (campaign?.id) {
      dispatch(
        getHiredCreators({
          campaignId: campaign.id,
          filters: filters,
        })
      );
    }
  };

  const handleCreatorSelect = (creator) => {
    console.log("handleCreatorSelect", creator);
    setSelectedCreator(creator);
  };

  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Refetch creators with new filters if campaign is selected
    if (selectedCampaign?.id) {
      dispatch(
        getHiredCreators({
          campaignId: selectedCampaign.id,
          filters: newFilters,
        })
      );
    }
  };

  const handleSortChange = (sortValue) => {
    console.log("Sort changed to:", sortValue);
    handleFilterChange("sort", sortValue);
  };

  return (
    <div className="relative flex">
      <CampaignOverview isCompleted={isCompleted} onCampaignSelect={handleCampaignSelect} />

      <CreatorSpendAnalysis
        isCompleted={isCompleted}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onSortChange={handleSortChange}
        currentSort={filters.sort}
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
