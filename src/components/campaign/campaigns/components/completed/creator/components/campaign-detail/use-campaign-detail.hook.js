import { useState, useCallback, useMemo } from "react";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

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

  // Message thread hook
  const brandId = campaign?.campaign?.created_by?.id;
  const messageThreadHook = useMessageThread(brandId);

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
    if (!brandId) return;
    messageThreadHook.openMessageModal();
  }, [brandId, messageThreadHook]);

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

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
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
    typeStyle: getCampaignTypeStyle(campaign?.type),
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
    formatDate,
  };
}

