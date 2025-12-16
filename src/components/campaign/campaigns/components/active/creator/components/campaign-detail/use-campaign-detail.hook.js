import { useState, useCallback, useMemo } from "react";
import { SOURCE_PLATFORM, CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import useCreatorTimeline from "../creator-timeline/use-creator-timeline.hook";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

export default function useCampaignDetail(selectedCampaign) {
  // State
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  // Campaign data
  const campaign = selectedCampaign;
  const campaignData = campaign?.campaign || {};

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

  // Message thread hook
  const brandId = campaign?.campaign?.created_by?.id;
  const campaignId = campaign?.id;
  const messageThreadHook = useMessageThread(brandId, campaignId);

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

  return {
    // State
    showContentBrief,
    expandedSections,
    campaign,
    campaignData,
    campaignInfo,

    // Computed
    isCleerCutCampaign,
    typeStyle: getCampaignTypeStyle(
      campaign?.type ||
        campaign?.contract?.campaignType ||
        campaign?.contract?.campaign_type ||
        campaignData?.campaign_type
    ),
    formattedType: formatCampaignType(campaign?.type || campaignData?.campaign_type),
    timelineSteps,
    creator,
    brandId,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleCloseContentBrief,
    handleOpenContentBrief,
  };
}
