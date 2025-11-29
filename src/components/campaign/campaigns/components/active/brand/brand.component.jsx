import { isCreatorMode } from "@/common/utils/users.util";
import { getHiredCreators } from "@/provider/features/campaigns/campaigns.slice";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { useState } from "react";
import { useDispatch } from "react-redux";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component";

function ActiveBrandCampiagn() {
  const dispatch = useDispatch();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [isMultiCreator, setIsMultiCreator] = useState(true); // Track toggle state from CampaignOverview
  const [filters, setFilters] = useState({
    status: "HIRED", // Default to HIRED applications for active-completed tab
    sort: "newest", // Default sort
  });

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCreator(null); // Reset creator selection when campaign changes
    
    // For individual collaborations, we don't need to fetch hired creators
    if (campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR) {
      return;
    }
    
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

  const handleToggleChange = (newIsMultiCreator) => {
    setIsMultiCreator(newIsMultiCreator);
    // Reset selected campaign when toggle changes
    setSelectedCampaign(null);
    setSelectedCreator(null);
  };

  return (
    <div className="relative flex">
      <CampaignOverview 
        onCampaignSelect={handleCampaignSelect}
        onToggleChange={handleToggleChange}
      />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        onCreatorSelect={handleCreatorSelect}
        onSortChange={handleSortChange}
        currentSort={filters.sort}
        isMultiCreator={isMultiCreator}
        isCompleted={false}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        isIndividualCreator={!isMultiCreator || selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
      />
    </div>
  );
}

export default ActiveBrandCampiagn;
