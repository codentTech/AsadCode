import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  rejectCreator,
  reinstateCreator,
  getRejectedCreators,
} from "@/provider/features/campaigns/campaigns.slice";
import CampaignOverview from "./components/campaign-overview/campaign-overview.component";
import CreatorSpendAnalysis from "./components/creator-spend-analysis/creator-spend-analysis.component";
import DeliverablesProgress from "./components/deliverables-progress/deliverables-progress.component.jsx";

function Rejected() {
  const dispatch = useDispatch();
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [filters, setFilters] = useState({});

  // Get rejected creators state from Redux
  const {
    data: rejectedCreatorsData,
    isLoading: rejectedCreatorsLoading,
    isSuccess: rejectedCreatorsSuccess,
    isError: rejectedCreatorsError,
  } = useSelector((state) => state.campaigns.getRejectedCreators || {});

  // Get reject creator state from Redux
  const {
    isLoading: rejectLoading,
    isSuccess: rejectSuccess,
    isError: rejectError,
  } = useSelector((state) => state.campaigns.rejectCreator || {});

  // Get reinstate creator state from Redux
  const {
    isLoading: reinstateLoading,
    isSuccess: reinstateSuccess,
    isError: reinstateError,
  } = useSelector((state) => state.campaigns.reinstateCreator || {});

  // Handle campaign selection
  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    setSelectedCreator(null); // Reset selected creator when campaign changes

    // Fetch rejected creators for this campaign
    dispatch(
      getRejectedCreators({
        campaignId: campaign.id,
        filters: { ...filters, status: "REJECTED" },
      })
    );
  };

  // Handle creator selection
  const handleCreatorSelect = (creator) => {
    setSelectedCreator(creator);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Refetch creators with new filters if campaign is selected
    if (selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...newFilters, status: "REJECTED" },
        })
      );
    }
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({});
    if (selectedCampaign) {
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { status: "REJECTED" },
        })
      );
    }
  };

  // Handle reject creator
  const handleRejectCreator = (campaignId, creatorId) => {
    dispatch(rejectCreator({ campaignId, creatorId }));
  };

  // Handle reinstate creator
  const handleReinstateCreator = (campaignId, creatorId) => {
    dispatch(reinstateCreator({ campaignId, creatorId }));
  };

  // Listen for reject success from application tab and refresh rejected creators
  useEffect(() => {
    if (rejectSuccess && selectedCampaign) {
      // Refresh the rejected creators list to show the newly rejected creator
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "REJECTED" },
        })
      );
    }
  }, [rejectSuccess, selectedCampaign, dispatch, filters]);

  // Listen for reinstate success and refresh rejected creators
  useEffect(() => {
    if (reinstateSuccess && selectedCampaign) {
      // Refresh the rejected creators list to remove the reinstated creator
      dispatch(
        getRejectedCreators({
          campaignId: selectedCampaign.id,
          filters: { ...filters, status: "REJECTED" },
        })
      );
      // Reset selected creator since it's no longer in the rejected list
      setSelectedCreator(null);
    }
  }, [reinstateSuccess, selectedCampaign, dispatch, filters]);

  return (
    <div className="relative flex">
      <CampaignOverview
        onCampaignSelect={handleCampaignSelect}
        selectedCampaign={selectedCampaign}
        selectedCreator={selectedCreator}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        onReinstateCreator={handleReinstateCreator}
      />

      <CreatorSpendAnalysis
        selectedCampaign={selectedCampaign}
        appliedCreatorsData={rejectedCreatorsData}
        appliedCreatorsLoading={rejectedCreatorsLoading}
        onCreatorSelect={handleCreatorSelect}
        onReinstateCreator={handleReinstateCreator}
        reinstateLoading={reinstateLoading}
      />

      <DeliverablesProgress selectedCampaign={selectedCampaign} selectedCreator={selectedCreator} />
    </div>
  );
}

export default Rejected;
