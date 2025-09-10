import { isCreatorMode } from "@/common/utils/users.util";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { rejectCreator, getAppliedCreators } from "@/provider/features/campaigns/campaigns.slice";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function BrandApplications() {
  const dispatch = useDispatch();

  // Get Redux state for applied creators
  const {
    data: appliedCreatorsData,
    isLoading: appliedCreatorsLoading,
    isSuccess: appliedCreatorsSuccess,
    isError: appliedCreatorsError,
  } = useSelector((state) => state.campaigns.getAppliedCreators || {});

  // Get Redux state for reject creator
  const {
    isLoading: rejectLoading,
    isSuccess: rejectSuccess,
    isError: rejectError,
  } = useSelector((state) => state.campaigns.rejectCreator || {});

  // State to manage data flow between components
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({
    min_followers: "",
    max_followers: "",
    min_rating: "",
    max_rating: "",
    country: "",
    city: "",
    niches: [],
    platforms: [],
    status: "",
    sort: "newest",
  });

  // Handle campaign selection from CampaignOverview
  const handleCampaignSelect = (campaign) => {
    console.log("Refreshing campaign data for:", campaign.id);
    setSelectedCampaign(campaign);
    setSelectedCreator(null); // Reset selected creator when campaign changes

    // Fetch applied creators for this campaign
    dispatch(
      getAppliedCreators({
        campaignId: campaign.id,
        filters: { ...filters, status: "PENDING" },
      })
    );
  };

  // Handle creator selection from CreatorSpendAnalysis
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  // Handle filter changes from CampaignOverview
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);

    // Refetch creators with new filters if campaign is selected
    if (selectedCampaign) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...newFilters, status: "PENDING" },
        })
      );
    }
  };

  const clearFilters = () => {
    const clearedFilters = {
      min_followers: "",
      max_followers: "",
      min_rating: "",
      max_rating: "",
      country: "",
      city: "",
      niches: [],
      platforms: [],
      status: "",
      sort: "newest",
    };
    setFilters(clearedFilters);

    // Refetch creators with cleared filters if campaign is selected
    if (selectedCampaign) {
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...clearedFilters, status: "PENDING" },
        })
      );
    }
  };

  // Handle reject creator
  const handleRejectCreator = (campaignId, creatorId) => {
    dispatch(rejectCreator({ campaignId, creatorId }));
  };

  // Handle reject success - refresh the applied creators list
  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      // Refresh the applied creators list to remove the rejected creator
      dispatch(
        getAppliedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "PENDING" },
        })
      );
      // Reset selected creator since they're no longer in the list
      setSelectedCreator(null);
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters]);

  return (
    <div className="relative flex">
      <CampaignOverview
        onCampaignSelect={handleCampaignSelect}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={clearFilters}
        onRejectCreator={handleRejectCreator}
      />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        appliedCreatorsData={appliedCreatorsData}
        appliedCreatorsLoading={appliedCreatorsLoading}
        onCreatorSelect={handleCreatorSelect}
        selectedCreator={selectedCreator}
        filters={filters}
      />

      <DeliverablesProgress
        isCreatorMode={isCreatorMode()}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
      />
    </div>
  );
}

export default BrandApplications;
