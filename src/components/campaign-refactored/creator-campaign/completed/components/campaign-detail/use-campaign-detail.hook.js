import { useState, useCallback, useMemo } from "react";
import {
  CAMPAIGN_TYPE,
  COLLABORATION_TYPE,
} from "@/common/constants/campaign.constant";
import useMessageThread from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";

export default function useCampaignDetail(campaign) {
  // State
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  // Campaign data
  const campaignData = campaign?.campaign || {};

  const createdBy = campaign?.campaign?.created_by;
  const brandId =
    createdBy?.id ||
    campaign?.application?.brand?.id ||
    campaign?.application?.campaign?.created_by?.id;

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

  const creator = useMemo(() => {
    const logoCandidate = campaign?.brand?.logo;
    const logoFromFormatted =
      typeof logoCandidate === "string" && logoCandidate.startsWith("http")
        ? logoCandidate
        : undefined;
    const nameFromCreatedBy =
      createdBy?.first_name && createdBy?.last_name
        ? `${createdBy.first_name} ${createdBy.last_name}`
        : null;
    return {
      id: brandId,
      name:
        nameFromCreatedBy ||
        createdBy?.brand_profile?.brand_name ||
        (typeof campaign?.brand === "string" ? campaign.brand : campaign?.brand?.name) ||
        "Brand",
      avatar:
        createdBy?.brand_profile?.brand_logo_url ||
        createdBy?.profile_photo_url ||
        campaign?.application?.brand?.brand_profile?.brand_logo_url ||
        campaign?.application?.brand?.profile_photo_url ||
        logoFromFormatted,
      isOnline: true,
    };
  }, [brandId, campaign, createdBy]);

  // Parse campaign information from API data
  const campaignInfo = useMemo(() => {
    const dos = Array.isArray(campaignData.non_negotiables_do)
      ? campaignData.non_negotiables_do
      : [];
    const donts = Array.isArray(campaignData.non_negotiables_dont)
      ? campaignData.non_negotiables_dont
      : [];
    const styleGuideText = campaignData.style_guide || "";
    const hashtagsString = campaignData.hashtags || "";

    return {
      dosdonts: {
        dos,
        donts,
      },
      styleGuide: {
        text: styleGuideText,
      },
      hashtags: hashtagsString,
    };
  }, [campaignData]);

  const campaignType = campaign?.type || campaign?.campaign?.campaign_type;

  const isUgcCampaign = useMemo(
    () => campaignType === CAMPAIGN_TYPE.UGC,
    [campaignType],
  );

  const campaignProgressSteps = useMemo(() => {
    const raw = Array.isArray(campaign?.progress) ? campaign.progress : [];
    if (isUgcCampaign) {
      return raw.slice(0, 2);
    }
    return raw;
  }, [campaign?.progress, isUgcCampaign]);

  const progressCompletionRate = useMemo(() => {
    const steps = campaignProgressSteps;
    if (!steps.length) {
      return campaign?.completionRate ?? 0;
    }
    const completed = steps.filter((s) => s.completed).length;
    return Math.round((completed / steps.length) * 100);
  }, [campaignProgressSteps, campaign?.completionRate]);

  // Campaign type style mapping
  const getCampaignTypeStyle = useCallback((type) => {
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
    return styles[type] || styles["Sponsored Post"];
  }, []);

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

  const handleOpenContentBrief = useCallback(() => {
    setShowContentBrief(true);
  }, []);

  const handleCloseContentBrief = useCallback(() => {
    setShowContentBrief(false);
  }, []);

  const handleOpenProgressModal = useCallback(() => {
    setShowProgressModal(true);
  }, []);

  const handleCloseProgressModal = useCallback(() => {
    setShowProgressModal(false);
  }, []);

  return {
    // State
    showContentBrief,
    showProgressModal,
    expandedSections,
    campaign,
    campaignData,
    campaignInfo,

    // Computed
    typeStyle: getCampaignTypeStyle(campaignType),
    isUgcCampaign,
    campaignProgressSteps,
    progressCompletionRate,
    creator,
    brandId,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleOpenContentBrief,
    handleCloseContentBrief,
    handleOpenProgressModal,
    handleCloseProgressModal,
  };
}
