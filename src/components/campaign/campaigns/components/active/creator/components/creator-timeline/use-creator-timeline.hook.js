import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  updateTimelineStep,
} from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";

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

  const { isLoading: uploadLoading } = useSelector(
    (state) => state.uploadFile.uploadSingleFile || {}
  );

  // Local state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  // Get timeline steps from Redux
  const timelineSteps = timelineData?.data || [];

  // Load timeline on mount and when campaignId changes
  useEffect(() => {
    if (campaignId) {
      dispatch(getTimeline(campaignId));
    }
  }, [campaignId, dispatch]);

  // Auto-refresh timeline every 10 seconds to show brand updates
  useEffect(() => {
    if (!campaignId) return;

    const interval = setInterval(() => {
      dispatch(getTimeline(campaignId));
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
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

  // Step 1: Mark content as recorded (NO UPLOAD)
  const handleMarkComplete = useCallback(
    async (stepId) => {
      try {
        await dispatch(
          updateTimelineStep({
            campaignId,
            step: TIMELINE_STEPS.CONTENT_RECORDED,
            data: { status: TIMELINE_STATUS.COMPLETED },
          })
        ).unwrap();

        // Refresh timeline
        await dispatch(getTimeline(campaignId));
      } catch (error) {
        console.error("Failed to mark complete:", error);
      }
    },
    [campaignId, dispatch]
  );

  // Step 2: Upload draft file (FILE UPLOAD)
  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    try {
      // Upload file to storage
      const uploadResult = await dispatch(
        uploadSingleFile({
          file: selectedFile,
          folder: "campaign",
        })
      ).unwrap();

      const fileUrl = uploadResult.url || uploadResult.file_url;

      if (!fileUrl) {
        alert("Upload failed: No file URL received");
        return;
      }

      // Update timeline with file URL
      await dispatch(
        updateTimelineStep({
          campaignId,
          step: TIMELINE_STEPS.DRAFT_REVIEW,
          data: {
            status: TIMELINE_STATUS.SUBMITTED,
            file_url: fileUrl,
          },
        })
      ).unwrap();

      // Refresh timeline
      await dispatch(getTimeline(campaignId));

      setShowUploadModal(false);
      setSelectedFile(null);
    } catch (error) {
      console.error("Failed to upload draft:", error);
      alert(`Upload failed: ${error.message || "Unknown error"}`);
      setShowUploadModal(false);
      setSelectedFile(null);
    }
  }, [selectedFile, campaignId, dispatch]);

  // Step 3: Submit published URL (URL INPUT ONLY)
  const handlePublishUrl = useCallback(async () => {
    if (!validateUrl(publishedUrl)) return;

    try {
      await dispatch(
        updateTimelineStep({
          campaignId,
          step: TIMELINE_STEPS.FINAL_PUBLISHED,
          data: {
            status: TIMELINE_STATUS.SUBMITTED,
            published_url: publishedUrl,
          },
        })
      ).unwrap();

      // Refresh timeline
      await dispatch(getTimeline(campaignId));

      setShowUrlModal(false);
      setPublishedUrl("");
    } catch (error) {
      console.error("Failed to submit URL:", error);
    }
  }, [publishedUrl, campaignId, dispatch]);

  // Calculate completion percentage
  const completedSteps = timelineSteps.filter(
    (step) => step.status === TIMELINE_STATUS.COMPLETED || step.status === TIMELINE_STATUS.APPROVED
  ).length;

  const completionPercentage =
    timelineSteps.length > 0 ? (completedSteps / timelineSteps.length) * 100 : 0;

  return {
    // State
    timelineSteps,
    timelineLoading,
    timelineSuccess,
    timelineError,
    updateLoading: updateLoading || uploadLoading,
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
