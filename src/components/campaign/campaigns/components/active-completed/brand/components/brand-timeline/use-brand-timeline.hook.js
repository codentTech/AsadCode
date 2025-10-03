import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  approveDraft,
  requestRevision,
  markFinalComplete,
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

  // Approve draft
  const handleApproveDraft = useCallback(async () => {
    await dispatch(
      approveDraft({
        campaignId,
        step: TIMELINE_STEPS.DRAFT_REVIEW,
      })
    );
  }, [campaignId, dispatch]);

  // Request revision
  const handleRequestRevision = useCallback(async () => {
    if (!revisionNotes.trim()) return;

    await dispatch(
      requestRevision({
        campaignId,
        step: TIMELINE_STEPS.DRAFT_REVIEW,
        revisionNotes,
      })
    );

    setShowRevisionModal(false);
    setRevisionNotes("");
  }, [revisionNotes, campaignId, dispatch]);

  // Mark as complete
  const handleMarkAsComplete = useCallback(async () => {
    await dispatch(
      markFinalComplete({
        campaignId,
        step: TIMELINE_STEPS.FINAL_PUBLISHED,
      })
    );
  }, [campaignId, dispatch]);

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

    // Constants
    TIMELINE_STEPS,
    TIMELINE_STATUS,
  };
}
