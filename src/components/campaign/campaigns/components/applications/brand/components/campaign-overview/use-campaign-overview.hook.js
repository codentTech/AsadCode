import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getBrandCampaignsExcludingCompleted } from "@/provider/features/campaigns/campaigns.slice";

function useCampaignOverview() {
  const dispatch = useDispatch();
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Get campaigns state
  const {
    data: campaignsData,
    isLoading: campaignsLoading,
    isSuccess: campaignsSuccess,
    isError: campaignsError,
  } = useSelector((state) => state.campaigns.getBrandCampaignsExcludingCompleted);

  // Load campaigns when component mounts
  useEffect(() => {
    dispatch(getBrandCampaignsExcludingCompleted());
  }, [dispatch]);

  // Auto-select the first campaign by default when data loads
  useEffect(() => {
    if (
      campaignsSuccess &&
      campaignsData?.data &&
      Array.isArray(campaignsData.data) &&
      campaignsData.data.length > 0 &&
      !selectedCampaign
    ) {
      setSelectedCampaign(campaignsData.data[0]);
    }
  }, [campaignsSuccess, campaignsData, selectedCampaign]);

  // Transform campaigns for dropdown options
  const campaignOptions =
    campaignsData?.data?.map((campaign) => ({
      value: campaign.id,
      label: campaign.campaign_title,
    })) || [];

  const handleCampaignChange = (campaignId) => {
    const campaign = campaignsData?.data?.find((c) => c.id === campaignId);
    setSelectedCampaign(campaign || null);
  };

  return {
    openFilterModal,
    setOpenFilterModal,
    messageDialogOpen,
    setMessageDialogOpen,
    campaignsData,
    campaignsLoading,
    campaignsSuccess,
    campaignsError,
    campaignOptions,
    selectedCampaign,
    handleCampaignChange,
  };
}

export default useCampaignOverview;
