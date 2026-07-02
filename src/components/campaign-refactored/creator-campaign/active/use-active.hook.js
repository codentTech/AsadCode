import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorApplications } from "@/provider/features/campaigns/campaigns.slice";
import { avatar } from "@/common/constants/auth.constant";
import {
  COLLABORATION_TYPE,
  COMPENSATION_TYPE,
  SOURCE_PLATFORM,
} from "@/common/constants/campaign.constant";

export default function useActive() {
  const dispatch = useDispatch();

  // ============================================
  // 2. REDUX SELECTORS
  // ============================================
  const { getCreatorApplications: getApplicationsState } = useSelector((state) => state.campaigns);
  const applications = getApplicationsState.data?.data || [];

  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  // ============================================
  // 4. CALLBACKS
  // ============================================
  const formatCampaignData = useCallback((campaign) => {
    if (!campaign) return null;

    const isIndividualCollaboration =
      campaign.invitation ||
      campaign.campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    const campaignData = campaign.campaign || {};
    const contractData = campaign.contract || {};
    const brandData = campaign.brand || campaignData.created_by || contractData.brand || {};

    const hasContractData =
      contractData &&
      (contractData.id ||
        contractData.campaignId ||
        contractData.completionDeadline ||
        contractData.completion_deadline ||
        contractData.contentFormat ||
        contractData.compensationType ||
        contractData.compensation_type);

    if (isIndividualCollaboration && hasContractData) {
      return {
        id: contractData.campaignId || campaignData.id || campaign.campaign_id,
        title:
          campaignData.campaign_title || contractData.contentFormat || "Individual Collaboration",
        brand:
          brandData.brand_profile?.brand_name ||
          (brandData.first_name && brandData.last_name
            ? `${brandData.first_name} ${brandData.last_name}`
            : brandData.first_name || "Brand"),
        logo: brandData.brand_profile?.brand_logo_url || avatar,
        application_deadline:
          contractData.completionDeadline ||
          contractData.completion_deadline ||
          campaignData.application_deadline,
        startDate:
          contractData.startDate ||
          contractData.start_date ||
          campaign.hired_at ||
          campaign.hiredAt ||
          campaignData.active_date ||
          null,
        platforms: contractData.platforms || campaignData.platforms || [],
        deliverables: contractData.contentFormat
          ? [contractData.contentFormat]
          : campaignData.deliverables || [],
        payment:
          contractData.compensationType === COMPENSATION_TYPE.PAID ||
          contractData.compensation_type === COMPENSATION_TYPE.PAID
            ? `$${contractData.totalCompensation || contractData.total_compensation || 0}`
            : contractData.compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
                contractData.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT
              ? "Gifted"
              : "Commission",
        productImage: campaignData.campaign_image,
        completionRate: 0,
        type: contractData.campaignType || contractData.campaign_type || campaignData.campaign_type,
        compensation:
          contractData.compensationType ||
          contractData.compensation_type ||
          campaignData.compensation_type ||
          COMPENSATION_TYPE.PAID,
        compensationAmount:
          contractData.totalCompensation || contractData.total_compensation || campaignData.budget,
        description:
          contractData.contentGuidelines ||
          contractData.content_guidelines ||
          campaignData.short_description ||
          campaign.invitation?.custom_message ||
          "No description available",
        progress: [
          { task: "Content recorded", completed: false },
          { task: "1st draft sent", completed: false },
          { task: "Final post published", completed: false },
        ],
        campaign: campaignData,
        contract: contractData,
        application: campaign,
        invitation: campaign.invitation,
        isIndividualCollaboration: true,
        sourcePlatform: campaignData.source_platform || SOURCE_PLATFORM.CLEERCUT,
      };
    }

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
      startDate: campaignData.active_date || campaign.hired_at || campaign.hiredAt || null,
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
      isIndividualCollaboration: false,
      sourcePlatform: campaignData.source_platform || SOURCE_PLATFORM.CLEERCUT,
    };
  }, []);

  const handleCampaignSelect = useCallback((campaign) => {
    setSelectedCampaign(campaign);
  }, []);

  // ============================================
  // 5. COMPUTED VALUES
  // ============================================
  const activeCampaigns = (applications || []).filter((app) => {
    const isIndividualCollaboration =
      app.invitation ||
      app.campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isIndividualCollaboration && app.campaign) {
      return app.campaign.status !== "COMPLETE";
    }

    return true;
  });

  const getCampaignById = useCallback(
    (campaignId) => {
      return activeCampaigns.find((campaign) => campaign.campaign?.id === campaignId);
    },
    [activeCampaigns]
  );

  // ============================================
  // 6. USEEFFECTS
  // ============================================
  useEffect(() => {
    dispatch(getCreatorApplications("HIRED"));
  }, [dispatch]);

  useEffect(() => {
    if (activeCampaigns.length > 0 && !selectedCampaign) {
      const firstCampaign = formatCampaignData(activeCampaigns[0]);
      setSelectedCampaign(firstCampaign);
    } else if (activeCampaigns.length === 0 && selectedCampaign) {
      setSelectedCampaign(null);
    }
  }, [applications, selectedCampaign, activeCampaigns, formatCampaignData]);

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    selectedCampaign,
    activeCampaigns,
    getApplicationsState,
    handleCampaignSelect,
    getCampaignById,
    formatCampaignData,
  };
}
