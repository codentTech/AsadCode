import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  approveDraft,
  requestRevision,
  markFinalComplete,
} from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { TIMELINE_STEPS, TIMELINE_STATUS } from "@/common/constants/campaign.constant";

export default function useBrandTimeline(campaignId) {
  const dispatch = useDispatch();

  // Redux state
  const {
    data: timelineData,
    isLoading: timelineLoading,
    isSuccess: timelineSuccess,
    isError: timelineError,
  } = useSelector((state) => state.campaignTimeline.getTimeline || {});

  const { isLoading: approveLoading } = useSelector(
    (state) => state.campaignTimeline.approveDraft || {}
  );

  const { isLoading: revisionLoading } = useSelector(
    (state) => state.campaignTimeline.requestRevision || {}
  );

  const { isLoading: completeLoading } = useSelector(
    (state) => state.campaignTimeline.markFinalComplete || {}
  );

  // Local state
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  // Get timeline steps from Redux
  const timelineSteps = timelineData?.data || [];

  // Load timeline on mount and when campaignId changes
  useEffect(() => {
    if (campaignId) {
      dispatch(getTimeline(campaignId));
    }
  }, [campaignId, dispatch]);

  // Auto-refresh timeline every 10 seconds to show creator updates
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
    });
  };

  // Get time remaining
  const getTimeRemaining = useCallback((deadlineDate) => {
    if (!deadlineDate) return "";
    const now = new Date();
    const deadline = new Date(deadlineDate);
    const diff = deadline - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d`;
    return `${hours}h`;
  }, []);

  // Approve draft (Step 2 only)
  const handleApproveDraft = useCallback(async () => {
    try {
      await dispatch(
        approveDraft({
          campaignId,
          step: TIMELINE_STEPS.DRAFT_REVIEW,
        })
      ).unwrap();

      // Refresh timeline
      await dispatch(getTimeline(campaignId));
    } catch (error) {
      console.error("Failed to approve draft:", error);
      alert(`Approval failed: ${error.message || "Unknown error"}`);
    }
  }, [campaignId, dispatch]);

  // Request revision (Step 2 only)
  const handleRequestRevision = useCallback(async () => {
    if (!revisionNotes.trim()) return;

    try {
      await dispatch(
        requestRevision({
          campaignId,
          step: TIMELINE_STEPS.DRAFT_REVIEW,
          revisionNotes,
        })
      ).unwrap();

      // Refresh timeline
      await dispatch(getTimeline(campaignId));

      setShowRevisionModal(false);
      setRevisionNotes("");
    } catch (error) {
      console.error("Failed to request revision:", error);
    }
  }, [revisionNotes, campaignId, dispatch]);

  // Mark as complete (Step 3 only)
  const handleMarkAsComplete = useCallback(async () => {
    try {
      await dispatch(
        markFinalComplete({
          campaignId,
          step: TIMELINE_STEPS.FINAL_PUBLISHED,
        })
      ).unwrap();

      // Refresh timeline
      await dispatch(getTimeline(campaignId));
    } catch (error) {
      console.error("Failed to mark complete:", error);
    }
  }, [campaignId, dispatch]);

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
    approveLoading,
    revisionLoading,
    completeLoading,
    showRevisionModal,
    revisionNotes,
    completionPercentage,

    // Actions
    setShowRevisionModal,
    setRevisionNotes,
    handleApproveDraft,
    handleRequestRevision,
    handleMarkAsComplete,
    formatDate,
    getTimeRemaining,
  };
}
