import { useState, useCallback, useMemo } from "react";
import {
  SOURCE_PLATFORM,
  CAMPAIGN_TYPE,
  COMPENSATION_TYPE,
  COLLABORATION_TYPE,
} from "@/common/constants/campaign.constant";
import { getUser } from "@/common/utils/users.util";
import { getBrandDisplayNameForContract } from "@/common/utils/brand-display.util";
import useCreatorTimeline from "../creator-timeline/use-creator-timeline.hook";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";

export default function useCampaignDetail(selectedCampaign) {
  // State
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  // Campaign data
  const campaign = selectedCampaign;
  const campaignData = campaign?.campaign || {};
  const user = getUser();

  // Check if CleerCut campaign
  const isCleerCutCampaign = useMemo(
    () => campaign?.sourcePlatform === SOURCE_PLATFORM.CLEERCUT || !campaign?.sourcePlatform,
    [campaign?.sourcePlatform]
  );

  // Timeline hook
  const { timelineSteps } = useCreatorTimeline(
    isCleerCutCampaign ? campaign?.id : null,
    campaign?.campaign_deadline || campaign?.application_deadline
  );

  const brandId = campaign?.campaign?.created_by?.id;
  const campaignId = campaign?.id;

  const applicationPitch = useMemo(() => {
    const app = campaign?.application;
    const isActuallyInvitation =
      app?.isInvitation &&
      (app?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
        app?.campaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR);
    if (isActuallyInvitation) return null;
    const raw =
      app?.pitch ||
      app?.custom_message ||
      app?.contract?.application?.pitch ||
      app?.contract?.application?.custom_message ||
      "";
    const trimmed = typeof raw === "string" ? raw.trim() : "";
    return trimmed || null;
  }, [
    campaign?.application?.isInvitation,
    campaign?.application?.collaboration_type,
    campaign?.application?.campaign?.collaboration_type,
    campaign?.application?.pitch,
    campaign?.application?.custom_message,
    campaign?.application?.contract?.application?.pitch,
    campaign?.application?.contract?.application?.custom_message,
  ]);

  const messageThreadHook = useMessageThread(brandId, campaignId, null, applicationPitch);

  // Creator data for message thread
  const creator = useMemo(
    () => ({
      id: brandId,
      name:
        campaign?.campaign?.created_by?.first_name && campaign?.campaign?.created_by?.last_name
          ? `${campaign.campaign.created_by.first_name} ${campaign.campaign.created_by.last_name}`
          : campaign?.brand || "Brand",
      avatar: campaign?.campaign?.created_by?.profile_photo_url,
      isOnline: true,
    }),
    [brandId, campaign]
  );

  // Parse campaign information
  const campaignInfo = useMemo(() => {
    const dos = Array.isArray(campaignData.non_negotiables_do)
      ? campaignData.non_negotiables_do
      : [];
    const donts = Array.isArray(campaignData.non_negotiables_dont)
      ? campaignData.non_negotiables_dont
      : [];
    const styleGuideText = campaignData.style_guide || "";
    const styleGuideFile = campaignData.style_guide_file || "";
    const hashtagsString = campaignData.hashtags || "";

    return {
      dosdonts: {
        dos,
        donts,
      },
      styleGuide: {
        text: styleGuideText,
        style_guide_file: styleGuideFile,
      },
      hashtags: hashtagsString,
    };
  }, [campaignData]);

  const resolvedCampaignType = useMemo(
    () =>
      campaign?.type ||
      campaign?.contract?.campaignType ||
      campaign?.contract?.campaign_type ||
      campaignData?.campaign_type,
    [campaign, campaignData?.campaign_type]
  );

  const resolvedCompensationType = useMemo(
    () =>
      campaign?.compensation ||
      campaign?.contract?.compensationType ||
      campaign?.contract?.compensation_type ||
      campaignData?.compensation_type,
    [campaign, campaignData?.compensation_type]
  );

  // Format campaign type from enum to display text
  const formatCampaignType = useCallback((type) => {
    if (!type) return "Sponsored Post";

    if (type === CAMPAIGN_TYPE.SPONSORED_POST) {
      return "Sponsored Post";
    }
    if (type === CAMPAIGN_TYPE.UGC) {
      return "UGC";
    }
    if (type === CAMPAIGN_TYPE.GIFTED) {
      return "Gifted";
    }
    if (type === CAMPAIGN_TYPE.AFFILIATE) {
      return "Affiliate";
    }

    return type;
  }, []);

  // Campaign type style mapping
  const getCampaignTypeStyle = useCallback(
    (type) => {
      const formattedType = formatCampaignType(type);
      const styles = {
        "Sponsored Post": {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-200",
        },
        UGC: {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
        },
        Gifted: {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-200",
        },
        Affiliate: {
          bg: "bg-purple-100",
          text: "text-purple-800",
          border: "border-purple-200",
        },
      };
      return styles[formattedType] || styles["Sponsored Post"];
    },
    [formatCampaignType]
  );

  // Handlers
  const handleMessageClick = useCallback(() => {
    if (!brandId || !campaignId) return;
    messageThreadHook.openMessageModal(campaignId);
  }, [brandId, campaignId, messageThreadHook]);

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  const handleCloseContentBrief = useCallback(() => {
    setShowContentBrief(false);
  }, []);

  const handleOpenContentBrief = useCallback(() => {
    setShowContentBrief(true);
  }, []);

  const handleOpenContractModal = useCallback(() => {
    setShowContractModal(true);
  }, []);

  const handleCloseContractModal = useCallback(() => {
    setShowContractModal(false);
  }, []);

  const selectedContract = useMemo(() => {
    if (!campaign?.campaign?.contracts || !Array.isArray(campaign.campaign.contracts)) {
      return campaign?.contract || null;
    }

    const signedContract = campaign.campaign.contracts.find(
      (contract) =>
        contract.status === "signed" &&
        (contract.creator_id === user?.id || contract.creatorId === user?.id)
    );

    return signedContract || campaign.campaign.contracts[0] || campaign?.contract || null;
  }, [campaign, user?.id]);

  const contractPreviewBrandName = useMemo(() => {
    const fromContract =
      selectedContract?.brand?.brand_profile?.brand_name ||
      selectedContract?.brand?.brand_profile?.brandName;
    if (fromContract && String(fromContract).trim()) return String(fromContract).trim();
    const fromCampaign = getBrandDisplayNameForContract(campaign?.campaign || null);
    return fromCampaign === "[Brand Name]" ? "Brand" : fromCampaign;
  }, [selectedContract, campaign]);

  const compensationAmount = useCallback(({ campaign, contract, compensationType }) => {
    const activeCompensationType =
      compensationType ||
      contract?.compensationType ||
      contract?.compensation_type ||
      campaign?.compensation_type;

    if (activeCompensationType === COMPENSATION_TYPE.COMMISSION) {
      return `${campaign?.commission_percentage || 0}%`;
    }
    if (activeCompensationType === COMPENSATION_TYPE.GIFTED_PRODUCT) {
      const giftedValue = contract?.productPrice || contract?.product_price || campaign?.product_value || 0;
      return `${giftedValue} value`;
    }
    if (activeCompensationType === COMPENSATION_TYPE.PAID) {
      return (
        contract?.totalCompensation ||
        contract?.total_compensation ||
        campaign?.creator_fee ||
        0
      );
    }
  }, []);

  return {
    // State
    showContentBrief,
    showContractModal,
    expandedSections,
    campaign,
    campaignData,
    campaignInfo,

    // Computed
    isCleerCutCampaign,
    typeStyle: getCampaignTypeStyle(resolvedCampaignType),
    formattedType: formatCampaignType(resolvedCampaignType),
    resolvedCompensationType,
    timelineSteps,
    creator,
    brandId,
    user,
    selectedContract,
    contractPreviewBrandName,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleCloseContentBrief,
    handleOpenContentBrief,
    handleOpenContractModal,
    handleCloseContractModal,
    compensationAmount,
  };
}
