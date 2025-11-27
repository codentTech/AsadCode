import { isCreatorMode } from "@/common/utils/users.util";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { useState } from "react";
import { useDispatch } from "react-redux";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";

function ActiveBrandCampiagn() {
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
    
    // Determine default sort based on campaign type
    const isPaidCampaign = 
      campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST || 
      campaign?.campaign_type === CAMPAIGN_TYPE.UGC;
    const isGiftedOrAffiliate = 
      campaign?.campaign_type === CAMPAIGN_TYPE.GIFTED || 
      campaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE;
    
    let defaultSort = "newest"; // Default fallback
    if (isPaidCampaign) {
      defaultSort = "most-expensive"; // Most expensive first for paid campaigns
    } else if (isGiftedOrAffiliate) {
      defaultSort = "newest"; // Newest first for gifted/affiliate
    }
    
    // Update filters with default sort if not already set
    const updatedFilters = {
      ...filters,
      sort: filters.sort || defaultSort,
    };
    setFilters(updatedFilters);

    // Fetch applied creators for this campaign (HIRED status for active-completed tab)
    if (campaign?.id) {
      dispatch(
        getHiredCreators({
          campaignId: campaign.id,
          filters: updatedFilters,
        })
      );
    }
  };

  const handleCreatorSelect = (creator) => {
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
    handleFilterChange("sort", sortValue);
  };

  return (
    <div className="relative flex">
      <CampaignOverview onCampaignSelect={handleCampaignSelect} />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onSortChange={handleSortChange}
        currentSort={filters.sort}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
      />
    </div>
  );
}

export default ActiveBrandCampiagn;
