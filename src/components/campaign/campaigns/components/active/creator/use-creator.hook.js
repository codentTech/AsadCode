import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";
import { COMPENSATION_TYPE, SOURCE_PLATFORM } from "@/common/constants/campaign.constant";

export default function useActiveCampaign() {
  const dispatch = useDispatch();
  const { getCreatorApplications: getApplicationsState } = useSelector((state) => state.campaigns);

  const applications = getApplicationsState.data?.data || [];

  const [selectedCampaign, setSelectedCampaign] = useState(null);

  useEffect(() => {
    dispatch(getCreatorApplications("HIRED"));
  }, [dispatch]);
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    const isIndividualCollaboration =
      campaign.invitation || campaign.campaign?.collaboration_type === "INDIVIDUAL_CREATOR";

    const campaignData = campaign.campaign || {};
    const brandData = campaign.brand || campaignData.created_by || {};

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
      completionRate: 0,
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
      campaign: campaignData,
      application: campaign,
      invitation: campaign.invitation,
      isIndividualCollaboration,
      sourcePlatform: campaignData.source_platform || SOURCE_PLATFORM.CLEERCUT,
    };
  }, []);

  const activeCampaigns = applications || [];

  useEffect(() => {
    if (activeCampaigns.length > 0 && !selectedCampaign) {
      const firstCampaign = formatCampaignData(activeCampaigns[0]);
      setSelectedCampaign(firstCampaign);
    } else if (activeCampaigns.length === 0 && selectedCampaign) {
      setSelectedCampaign(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applications]);

  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);
  const getCampaignById = useCallback(
    (campaignId) => {
      return activeCampaigns.find((campaign) => campaign.campaign?.id === campaignId);
    },
    [activeCampaigns]
  );

  return {
    selectedCampaign,
    activeCampaigns,
    getApplicationsState,
    handleCampaignSelect,
    getCampaignById,
    formatCampaignData,
  };
}
