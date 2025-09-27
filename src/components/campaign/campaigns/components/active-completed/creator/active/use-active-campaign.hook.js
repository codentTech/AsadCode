import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";

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

  // Filter active campaigns from applications
  const activeCampaigns =
    applications?.filter((app) => app.status === "HIRED" && app.campaign?.status === "ACTIVE") ||
    [];

  // Format campaign data for display
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    return {
      id: campaign.campaign?.id,
      title: campaign.campaign?.campaign_title,
      brand: campaign.campaign?.brand_name || "Unknown Brand",
      logo: "🌟", // Default logo, can be enhanced later
      deadline: campaign.campaign?.application_date,
      platforms: campaign.campaign?.platforms || [],
      deliverables: campaign.campaign?.deliverables || [],
      payment:
        campaign.campaign?.compensation_type === "FIXED"
          ? `$${campaign.campaign?.budget || 0}`
          : campaign.campaign?.compensation_type === "GIFTED"
            ? "Gifted"
            : "Commission",
      productImage: "🧴", // Default product image
      completionRate: 0, // Will be calculated based on progress
      type: campaign.campaign?.campaign_type || "UGC",
      compensation: campaign.campaign?.compensation_type || "FIXED",
      compensationAmount:
        campaign.campaign?.compensation_type === "FIXED"
          ? `$${campaign.campaign?.budget || 0}`
          : campaign.campaign?.compensation_type === "GIFTED"
            ? "Free Product"
            : "Commission-based",
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

  // Auto-select first campaign when campaigns are loaded
  useEffect(() => {
    if (activeCampaigns.length > 0 && !selectedCampaign) {
      setSelectedCampaign(formatCampaignData(activeCampaigns[0]));
    }
  }, [activeCampaigns, selectedCampaign, formatCampaignData]);

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
