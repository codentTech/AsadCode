import { useState, useCallback, useMemo } from "react";
import { SOURCE_PLATFORM, TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import useCreatorTimeline from "../creator-timeline/use-creator-timeline.hook";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

export default function useCampaignDetail(selectedCampaign) {
  // State
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
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
    () =>
      campaign?.sourcePlatform === SOURCE_PLATFORM.CLEERCUT || !campaign?.sourcePlatform,
    [campaign?.sourcePlatform]
  );

  // Timeline hook
  const { timelineSteps } = useCreatorTimeline(
    isCleerCutCampaign ? campaign?.id : null,
    campaign?.campaign_deadline || campaign?.application_deadline
  );

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

  const handleUpdateProgress = useCallback(() => {
    setShowProgressModal(true);
  }, []);

  const handleCloseContentBrief = useCallback(() => {
    setShowContentBrief(false);
  }, []);

  const handleOpenContentBrief = useCallback(() => {
    setShowContentBrief(true);
  }, []);

  const handleCloseProgressModal = useCallback(() => {
    setShowProgressModal(false);
  }, []);

  // Format date
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }, []);

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (!timelineSteps || timelineSteps.length === 0) return 0;
    const completedSteps = timelineSteps.filter(
      (s) => s.status === TIMELINE_STATUS.COMPLETED || s.status === TIMELINE_STATUS.APPROVED
    ).length;
    return Math.round((completedSteps / timelineSteps.length) * 100);
  }, [timelineSteps]);

  // Get timeline step status
  const getStepStatus = useCallback((step) => {
    const isCompleted =
      step.status === TIMELINE_STATUS.COMPLETED || step.status === TIMELINE_STATUS.APPROVED;
    const isSubmitted = step.status === TIMELINE_STATUS.SUBMITTED;
    const isInProgress = step.status === TIMELINE_STATUS.IN_PROGRESS;
    const isRevisionRequested = step.status === TIMELINE_STATUS.REVISION_REQUESTED;

    return {
      isCompleted,
      isSubmitted,
      isInProgress,
      isRevisionRequested,
      statusText: isCompleted
        ? "Completed"
        : isSubmitted
          ? "Pending Review"
          : isRevisionRequested
            ? "Revision Needed"
            : isInProgress
              ? "In Progress"
              : "Not Started",
    };
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
    isCleerCutCampaign,
    typeStyle: getCampaignTypeStyle(campaign?.type),
    timelineSteps,
    progressPercentage,
    creator,
    brandId,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleUpdateProgress,
    handleCloseContentBrief,
    handleOpenContentBrief,
    handleCloseProgressModal,
    formatDate,
    getStepStatus,
  };
}

