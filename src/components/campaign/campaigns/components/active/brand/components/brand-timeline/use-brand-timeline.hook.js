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

  const { data: timelineData, isLoading: timelineLoading } = useSelector(
    (state) => state.campaignTimeline.getTimeline || {}
  );

  const { isLoading: approveLoading } = useSelector(
    (state) => state.campaignTimeline.approveDraft || {}
  );

  const { isLoading: revisionLoading } = useSelector(
    (state) => state.campaignTimeline.requestRevision || {}
  );

  const { isLoading: completeLoading } = useSelector(
    (state) => state.campaignTimeline.markFinalComplete || {}
  );

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const timelineSteps = timelineData?.data || [];

  useEffect(() => {
    if (!campaignId) return;

    dispatch(getTimeline(campaignId));
  }, [campaignId, dispatch]);

  useEffect(() => {
    if (!campaignId) return;

    const interval = setInterval(() => {
      dispatch(getTimeline(campaignId));
    }, 10000);

    return () => clearInterval(interval);
  }, [campaignId, dispatch]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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

  const handleApproveDraft = useCallback(async () => {
    try {
      await dispatch(
        approveDraft({
          campaignId,
          step: TIMELINE_STEPS.DRAFT_REVIEW,
        })
      ).unwrap();

      await dispatch(getTimeline(campaignId));
    } catch (error) {
      alert(`Approval failed: ${error.message || "Unknown error"}`);
    }
  }, [campaignId, dispatch]);

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

      await dispatch(getTimeline(campaignId));

      setShowRevisionModal(false);
      setRevisionNotes("");
    } catch (error) {}
  }, [revisionNotes, campaignId, dispatch]);

  const handleMarkAsComplete = useCallback(async () => {
    try {
      await dispatch(
        markFinalComplete({
          campaignId,
          step: TIMELINE_STEPS.FINAL_PUBLISHED,
        })
      ).unwrap();

      await dispatch(getTimeline(campaignId));
    } catch (error) {}
  }, [campaignId, dispatch]);

  const completedSteps = timelineSteps.filter(
    (step) => step.status === TIMELINE_STATUS.COMPLETED || step.status === TIMELINE_STATUS.APPROVED
  ).length;
  const completionPercentage =
    timelineSteps.length > 0 ? (completedSteps / timelineSteps.length) * 100 : 0;

  return {
    timelineSteps,
    timelineLoading,
    approveLoading,
    revisionLoading,
    completeLoading,
    showRevisionModal,
    revisionNotes,
    completionPercentage,
    setShowRevisionModal,
    setRevisionNotes,
    handleApproveDraft,
    handleRequestRevision,
    handleMarkAsComplete,
    formatDate,
    getTimeRemaining,
  };
}
