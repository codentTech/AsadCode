import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";
import { COMPENSATION_TYPE, SOURCE_PLATFORM } from "@/common/constants/campaign.constant";

export default function useActiveCampaign() {
  const dispatch = useDispatch();

  // Redux state
  const { getCreatorApplications: getApplicationsState } = useSelector((state) => state.campaigns);

  // Get applications from Redux state (backend already filters for HIRED status)
  const applications = getApplicationsState.data?.data || [];

  // Debug: Log applications to see what we're getting
  useEffect(() => {
    console.log("[useActiveCampaign] Applications received:", applications);
    console.log("[useActiveCampaign] Applications count:", applications.length);
    const individual = applications.filter(
      (app) => app.campaign?.collaboration_type === "INDIVIDUAL_CREATOR"
    );
    console.log("[useActiveCampaign] Individual collaborations found:", individual.length);
    if (individual.length > 0) {
      console.log("[useActiveCampaign] Individual collaboration details:", individual);
    }
  }, [applications]);

  // Local state
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // Load creator applications on component mount
  useEffect(() => {
    dispatch(getCreatorApplications("HIRED"));
  }, [dispatch]);

  // Format campaign data for display
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    console.log("[formatCampaignData] Formatting campaign:", campaign);

    // Handle individual collaborations (from invitations or contracts)
    const isIndividualCollaboration =
      campaign.invitation || campaign.campaign?.collaboration_type === "INDIVIDUAL_CREATOR";

    const campaignData = campaign.campaign || {};
    const brandData = campaign.brand || campaignData.created_by || {};

    console.log("[formatCampaignData] isIndividualCollaboration:", isIndividualCollaboration);
    console.log("[formatCampaignData] campaignData:", campaignData);
    console.log("[formatCampaignData] brandData:", brandData);

    return {
      id: campaignData.id || campaign.campaign_id,
      title: campaignData.campaign_title || "Individual Collaboration",
      brand:
        brandData.brand_profile?.brand_name ||
        (brandData.first_name && brandData.last_name
          ? `${brandData.first_name} ${brandData.last_name}`
          : brandData.first_name || "Brand"),
      logo: brandData.brand_profile?.brand_logo_url || avatar,
      application_deadline: campaignData.application_deadline,
      platforms: campaignData.platforms || [],
      deliverables: campaignData.deliverables || [],
      payment:
        campaignData.compensation_type === COMPENSATION_TYPE.PAID
          ? `$${campaignData.budget || 0}`
          : campaignData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT
            ? "Gifted"
            : "Commission",
      productImage: campaignData.campaign_image,
      completionRate: 0, // Will be calculated based on progress
      type: campaignData.campaign_type,
      compensation: campaignData.compensation_type || COMPENSATION_TYPE.PAID,
      compensationAmount: campaignData.budget,
      description:
        campaignData.short_description ||
        campaign.invitation?.custom_message ||
        "No description available",
      progress: [
        { task: "Content recorded", completed: false },
        { task: "1st draft sent", completed: false },
        { task: "Final post published", completed: false },
      ],
      // Additional campaign data
      campaign: campaignData,
      application: campaign,
      invitation: campaign.invitation,
      isIndividualCollaboration,
      sourcePlatform: campaignData.source_platform || SOURCE_PLATFORM.CLEERCUT,
    };
  }, []);

  // Backend already filters for HIRED status and returns active campaigns
  // Just use the applications directly
  const activeCampaigns = applications || [];

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
