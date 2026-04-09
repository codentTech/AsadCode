import { useState, useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  updateTimelineStep,
} from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { TIMELINE_STEPS, TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import { getUser } from "@/common/utils/users.util";

export default function useCreatorTimeline(campaignId, deadline, revisionsLimit = 2) {
  const dispatch = useDispatch();
  const user = getUser();
  const creatorId = user?.id;

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

  const maxTimelineStepNumber = useMemo(
    () =>
      timelineSteps.length
        ? Math.max(...timelineSteps.map((s) => Number(s.step_number) || 0))
        : 0,
    [timelineSteps]
  );

  const hasPublishedPostStep = useMemo(
    () => timelineSteps.some((s) => s.step === TIMELINE_STEPS.FINAL_PUBLISHED),
    [timelineSteps]
  );

  useEffect(() => {
    if (campaignId && creatorId) {
      dispatch(getTimeline({ campaignId, creatorId }));
    }
  }, [campaignId, creatorId, dispatch]);

  useEffect(() => {
    if (!campaignId || !creatorId) return;

    const interval = setInterval(() => {
      dispatch(getTimeline({ campaignId, creatorId }));
    }, 10000);

    return () => clearInterval(interval);
  }, [campaignId, creatorId, dispatch]);

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

  // Validate URL (avoid complex regex to prevent catastrophic backtracking on paste)
  const validateUrl = useCallback((url) => {
    if (!url || typeof url !== "string") return false;
    const trimmed = url.trim();
    if (!trimmed) return false;
    try {
      const parsed = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
      const host = parsed.hostname.toLowerCase();
      const allowed = [
        "instagram.com",
        "www.instagram.com",
        "tiktok.com",
        "www.tiktok.com",
        "youtube.com",
        "www.youtube.com",
        "youtu.be",
        "twitter.com",
        "www.twitter.com",
        "x.com",
        "www.x.com",
      ];
      return allowed.some((domain) => host === domain || host.endsWith(`.${domain}`));
    } catch {
      return false;
    }
  }, []);

  // Step 1: Mark content as recorded (NO UPLOAD)
  const handleMarkComplete = useCallback(
    async (stepId) => {
      await dispatch(
        updateTimelineStep({
          campaignId,
          step: TIMELINE_STEPS.CONTENT_RECORDED,
          data: { status: TIMELINE_STATUS.COMPLETED },
        })
      ).unwrap();

      await dispatch(getTimeline({ campaignId, creatorId }));
    },
    [campaignId, creatorId, dispatch]
  );

  // Step 2: Upload draft file (FILE UPLOAD)
  const handleFileUpload = useCallback(async () => {
    if (!selectedFile) return;

    // Upload file to storage
    const uploadResult = await dispatch(
      uploadSingleFile({
        file: selectedFile,
        folder: "campaign",
      })
    ).unwrap();

    const fileUrl = uploadResult.url || uploadResult.file_url;
    if (!fileUrl) return;

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
    await dispatch(getTimeline({ campaignId, creatorId }));

    setShowUploadModal(false);
    setSelectedFile(null);
  }, [selectedFile, campaignId, creatorId, dispatch]);

  // Step 3: Submit published URL (URL INPUT ONLY)
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
    ).unwrap();

    // Refresh timeline
    await dispatch(getTimeline({ campaignId, creatorId }));

    setShowUrlModal(false);
    setPublishedUrl("");
  }, [publishedUrl, campaignId, creatorId, dispatch]);

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
    revisionsLimit,
    deadline,
    maxTimelineStepNumber,
    hasPublishedPostStep,
  };
}
