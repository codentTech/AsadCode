import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";

export default function useActiveCampaign() {
  const dispatch = useDispatch();

  // Redux state
  const { getCreatorApplications: getApplicationsState } = useSelector((state) => state.campaigns);

  // Get applications from Redux state
  const applications = getApplicationsState.data?.data || [];

  // Local state
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Load creator applications on component mount
  useEffect(() => {
    dispatch(getCreatorApplications("HIRED"));
  }, [dispatch]);

  // Format campaign data for display
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    return {
      id: campaign.campaign?.id,
      title: campaign.campaign?.campaign_title,
      brand: campaign.campaign?.created_by?.brand_profile?.brand_name || "Unknown Brand",
      logo: campaign.campaign?.created_by?.brand_profile?.brand_logo_url || avatar, // Default logo, can be enhanced later
      deadline: campaign.campaign?.application_date,
      platforms: campaign.campaign?.platforms || [],
      deliverables: campaign.campaign?.deliverables || [],
      payment:
        campaign.campaign?.compensation_type === "PAID"
          ? `$${campaign.campaign?.budget || 0}`
          : campaign.campaign?.compensation_type === "GIFTED_PRODUCT"
            ? "Gifted"
            : "Commission",
      productImage: "🧴", // Default product image
      completionRate: 0, // Will be calculated based on progress
      type: campaign.campaign?.campaign_type || "UGC",
      compensation: campaign.campaign?.compensation_type || "PAID",
      compensationAmount: campaign.campaign?.budget,
      description: campaign.campaign?.description || "No description available",
      progress: [
        { task: "Content recorded", completed: false },
        { task: "1st draft sent", completed: false },
        { task: "Final post published", completed: false },
      ],
      // Additional campaign data
      campaign: campaign.campaign,
      application: campaign,
    };
  }, []);

  // Filter active campaigns from applications
  const activeCampaigns =
    applications?.filter(
      (app) =>
        app.status === "HIRED" && (app.campaign?.status === "INCOMPLETE" || !app.campaign?.status)
    ) || [];

  // Auto-select first campaign when campaigns are loaded
  useEffect(() => {
    if (activeCampaigns.length > 0 && !selectedCampaign) {
      // Only select first campaign if no campaign is selected
      const firstCampaign = formatCampaignData(activeCampaigns[0]);
      setSelectedCampaign(firstCampaign);
    } else if (activeCampaigns.length === 0 && selectedCampaign) {
      // Clear selection when no campaigns are available
      setSelectedCampaign(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  // Handle campaign selection
  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);

  // Get campaign by ID
  const getCampaignById = useCallback(
    (campaignId) => {
      return activeCampaigns.find((campaign) => campaign.campaign?.id === campaignId);
    },
    [activeCampaigns]
  );

  return {
    // State
    selectedCampaign,
    activeCampaigns,

    // Redux states
    getApplicationsState,

    // Actions
    handleCampaignSelect,
    getCampaignById,
    formatCampaignData,
  };
}
