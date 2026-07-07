import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTimeline,
  approveDraft,
  requestRevision,
  markFinalComplete,
} from "@/provider/features/campaign-timeline/campaign-timeline.slice";
import { TIMELINE_STEPS, TIMELINE_STATUS } from "@/common/constants/campaign.constant";

function getTimelineFingerprint(steps) {
  if (!Array.isArray(steps) || steps.length === 0) return "";
  return steps
    .map(
      (step) =>
        `${step.step}:${step.status}:${step.submitted_at || ""}:${step.updated_at || ""}:${step.file_url || ""}`,
    )
    .join("|");
}

export default function useBrandTimeline(campaignId, creatorId, onPipelineUpdated, onWorkflowComplete) {
  const dispatch = useDispatch();
  const timelineFingerprintRef = useRef("");

  // Try to get timeline from keyed storage first, fallback to general state
  const timelineKey = campaignId && creatorId ? `${campaignId}-${creatorId}` : null;
  const keyedTimelineData = useSelector((state) =>
    timelineKey ? state.campaignTimeline.timelinesByKey?.[timelineKey] : null
  );
  const generalTimelineData = useSelector((state) => state.campaignTimeline.getTimeline || {});

  // Use keyed timeline if available, otherwise use general (for backwards compatibility)
  const timelineData = keyedTimelineData || generalTimelineData;

  const { isLoading: timelineLoading } = useSelector(
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
  const [selectedStepForRevision, setSelectedStepForRevision] = useState(null);

  const timelineSteps = Array.isArray(timelineData?.data) ? timelineData.data : [];

  const isDeliverablesOnlyWorkflow = useMemo(
    () =>
      timelineSteps.length > 0 &&
      !timelineSteps.some((s) => s.step === TIMELINE_STEPS.FINAL_PUBLISHED),
    [timelineSteps]
  );

  useEffect(() => {
    if (!campaignId || !creatorId) {
      return;
    }

    dispatch(getTimeline({ campaignId, creatorId }));
  }, [campaignId, creatorId, dispatch]);

  useEffect(() => {
    if (!campaignId || !creatorId) return;

    const interval = setInterval(() => {
      dispatch(getTimeline({ campaignId, creatorId }));
    }, 10000);

    return () => clearInterval(interval);
  }, [campaignId, creatorId, dispatch]);

  useEffect(() => {
    if (!campaignId || !creatorId || timelineSteps.length === 0) return;

    const fingerprint = getTimelineFingerprint(timelineSteps);
    if (
      timelineFingerprintRef.current &&
      timelineFingerprintRef.current !== fingerprint
    ) {
      onPipelineUpdated?.();
    }
    timelineFingerprintRef.current = fingerprint;
  }, [timelineSteps, campaignId, creatorId, onPipelineUpdated]);

  useEffect(() => {
    timelineFingerprintRef.current = "";
  }, [campaignId, creatorId]);

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
    // Find the DRAFT_REVIEW step from timelineSteps
    const draftStep = timelineSteps.find((s) => s.step === TIMELINE_STEPS.DRAFT_REVIEW);

    if (!draftStep) {
      return;
    }

    // Get creatorId from the actual step
    const stepCreatorId =
      draftStep?.creator?.id || draftStep?.creator_id || draftStep?.creatorId || creatorId;

    if (!stepCreatorId) {
      return;
    }

    await dispatch(
      approveDraft({
        campaignId,
        step: TIMELINE_STEPS.DRAFT_REVIEW,
        creatorId: stepCreatorId,
      })
    ).unwrap();

    await dispatch(getTimeline({ campaignId, creatorId: stepCreatorId }));
    onPipelineUpdated?.();

    if (isDeliverablesOnlyWorkflow) {
      onWorkflowComplete?.();
    }
  }, [
    campaignId,
    creatorId,
    timelineSteps,
    dispatch,
    onPipelineUpdated,
    onWorkflowComplete,
    isDeliverablesOnlyWorkflow,
  ]);

  const handleRequestRevision = useCallback(async () => {
    if (!revisionNotes.trim() || !selectedStepForRevision) return;

    // Get creatorId from the actual step, not from props
    const stepCreatorId =
      selectedStepForRevision.creator?.id ||
      selectedStepForRevision.creator_id ||
      selectedStepForRevision.creatorId ||
      creatorId;

    if (!stepCreatorId) {
      return;
    }

    const step = selectedStepForRevision.step
      ? typeof selectedStepForRevision.step === "string"
        ? selectedStepForRevision.step.toUpperCase()
        : selectedStepForRevision.step
      : TIMELINE_STEPS.DRAFT_REVIEW;

    await dispatch(
      requestRevision({
        campaignId,
        step,
        revisionNotes,
        creatorId: stepCreatorId,
      })
    ).unwrap();

    // Refresh timeline with the correct creatorId
    await dispatch(getTimeline({ campaignId, creatorId: stepCreatorId }));

    setShowRevisionModal(false);
    setRevisionNotes("");
    setSelectedStepForRevision(null);
    onPipelineUpdated?.();
  }, [revisionNotes, campaignId, creatorId, selectedStepForRevision, dispatch, onPipelineUpdated]);

  const handleMarkAsComplete = useCallback(async () => {
    // Find the FINAL_PUBLISHED step from timelineSteps
    const finalStep = timelineSteps.find((s) => s.step === TIMELINE_STEPS.FINAL_PUBLISHED);
    const stepCreatorId = finalStep?.creator?.id || finalStep?.creator_id || creatorId;

    if (!stepCreatorId) {
      return;
    }

    await dispatch(
      markFinalComplete({
        campaignId,
        step: TIMELINE_STEPS.FINAL_PUBLISHED,
        creatorId: stepCreatorId,
      })
    ).unwrap();

    await dispatch(getTimeline({ campaignId, creatorId: stepCreatorId }));
    onPipelineUpdated?.();
    onWorkflowComplete?.();
  }, [campaignId, creatorId, timelineSteps, dispatch, onPipelineUpdated, onWorkflowComplete]);

  const timelineProgressNumerator = timelineSteps.filter(
    (step) =>
      step.status === TIMELINE_STATUS.COMPLETED || step.status === TIMELINE_STATUS.APPROVED
  ).length;
  const completionPercentage =
    timelineSteps.length > 0 ? (timelineProgressNumerator / timelineSteps.length) * 100 : 0;

  return {
    timelineSteps,
    timelineLoading,
    approveLoading,
    revisionLoading,
    completeLoading,
    showRevisionModal,
    revisionNotes,
    completionPercentage,
    timelineProgressNumerator,
    setShowRevisionModal,
    setRevisionNotes,
    setSelectedStepForRevision,
    handleApproveDraft,
    handleRequestRevision,
    handleMarkAsComplete,
    formatDate,
    getTimeRemaining,
    isDeliverablesOnlyWorkflow,
  };
}
