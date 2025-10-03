import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  updateTimelineStep,
} from "@/provider/features/campaign-timeline/campaign-timeline.slice";

const TIMELINE_STEPS = {
  CONTENT_RECORDED: "CONTENT_RECORDED",
  DRAFT_REVIEW: "DRAFT_REVIEW",
  FINAL_PUBLISHED: "FINAL_PUBLISHED",
};

const TIMELINE_STATUS = {
  PENDING: "PENDING",
  IN_PROGRESS: "IN_PROGRESS",
  SUBMITTED: "SUBMITTED",
  APPROVED: "APPROVED",
  REVISION_REQUESTED: "REVISION_REQUESTED",
  COMPLETED: "COMPLETED",
};

export default function useCreatorTimeline(campaignId, deadline, revisionsLimit = 3) {
  const dispatch = useDispatch();

  // Redux state
  const {
    data: timelineData,
    isLoading: timelineLoading,
    isSuccess: timelineSuccess,
    isError: timelineError,
  } = useSelector((state) => state.campaignTimeline.getTimeline || {});

  const { isLoading: updateLoading } = useSelector(
    (state) => state.campaignTimeline.updateTimelineStep || {}
  );

  // Local state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Get timeline steps from Redux
  const timelineSteps = timelineData?.data || [];

  // Load timeline on mount
  useEffect(() => {
    if (campaignId) {
      dispatch(getTimeline(campaignId));
    }
  }, [campaignId, dispatch]);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get time remaining
  const getTimeRemaining = useCallback((deadlineDate) => {
    const now = new Date();
    const deadlineDateObj = new Date(deadlineDate);
    const diff = deadlineDateObj - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  }, []);

  // Validate URL
  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const socialPlatforms = ["instagram.com", "tiktok.com", "youtube.com", "twitter.com", "x.com"];

    if (!urlPattern.test(url)) return false;
    return socialPlatforms.some((platform) => url.includes(platform));
  };

  // Mark content as recorded (Step 1)
  const handleMarkComplete = useCallback(
    async (stepId) => {
      await dispatch(
        updateTimelineStep({
          campaignId,
          step: TIMELINE_STEPS.CONTENT_RECORDED,
          data: { status: TIMELINE_STATUS.COMPLETED },
        })
      );
    },
    [campaignId, dispatch]
  );

  // Upload draft file (Step 2)
  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    // TODO: Upload file to storage first, then get URL
    const fileUrl = "https://example.com/draft.mp4"; // Placeholder

    await dispatch(
      updateTimelineStep({
        campaignId,
        step: TIMELINE_STEPS.DRAFT_REVIEW,
        data: {
          status: TIMELINE_STATUS.SUBMITTED,
          file_url: fileUrl,
        },
      })
    );

    setShowUploadModal(false);
    setSelectedFile(null);
  }, [selectedFile, campaignId, dispatch]);

  // Submit published URL (Step 3)
  const handlePublishUrl = useCallback(async () => {
    if (!validateUrl(publishedUrl)) return;

    await dispatch(
      updateTimelineStep({
        campaignId,
        step: TIMELINE_STEPS.FINAL_PUBLISHED,
        data: {
          status: TIMELINE_STATUS.SUBMITTED,
          published_url: publishedUrl,
        },
      })
    );

    setShowUrlModal(false);
    setPublishedUrl("");
  }, [publishedUrl, campaignId, dispatch]);

  // Calculate completion percentage
  const completedSteps = timelineSteps.filter(
    (step) => step.status === TIMELINE_STATUS.COMPLETED
  ).length;
  const completionPercentage =
    timelineSteps.length > 0 ? (completedSteps / timelineSteps.length) * 100 : 0;

  return {
    // State
    timelineSteps,
    timelineLoading,
    timelineSuccess,
    timelineError,
    updateLoading,
    showUploadModal,
    showUrlModal,
    publishedUrl,
    selectedFile,
    completionPercentage,

    // Actions
    setShowUploadModal,
    setShowUrlModal,
    setPublishedUrl,
    setSelectedFile,
    handleMarkComplete,
    handleFileUpload,
    handlePublishUrl,
    formatDate,
    getTimeRemaining,
    validateUrl,

    // Constants
    TIMELINE_STEPS,
    TIMELINE_STATUS,
    revisionsLimit,
    deadline,
  };
}
