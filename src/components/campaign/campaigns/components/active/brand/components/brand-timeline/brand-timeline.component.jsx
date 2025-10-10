import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { AlertCircle, CheckCircle, Circle, Lock, MessageSquare } from "lucide-react";
import React from "react";
import useBrandTimeline from "./use-brand-timeline.hook";

const BrandTimelineSteps = ({ campaignId }) => {
  const {
    // State
    timelineSteps,
    timelineLoading,
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
    TIMELINE_STATUS,
  } = useBrandTimeline(campaignId);

  const getStepIcon = (step) => {
    switch (step.status) {
      case TIMELINE_STATUS.COMPLETED:
      case TIMELINE_STATUS.APPROVED:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case TIMELINE_STATUS.SUBMITTED:
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case TIMELINE_STATUS.REVISION_REQUESTED:
        return <AlertCircle className="w-5 h-5 text-orange-600" />;
      case TIMELINE_STATUS.IN_PROGRESS:
        return <Circle className="w-5 h-5 text-orange-600" />;
      default:
        return <Lock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusTag = (step) => {
    const statusMap = {
      [TIMELINE_STATUS.COMPLETED]: { text: "Completed", className: "bg-green-100 text-green-800" },
      [TIMELINE_STATUS.APPROVED]: { text: "Approved", className: "bg-green-100 text-green-800" },
      [TIMELINE_STATUS.SUBMITTED]: {
        text: "Action Required",
        className: "bg-orange-100 text-orange-800",
      },
      [TIMELINE_STATUS.REVISION_REQUESTED]: {
        text: "Revision Requested",
        className: "bg-orange-100 text-orange-800",
      },
      [TIMELINE_STATUS.IN_PROGRESS]: {
        text: "In Progress",
        className: "bg-blue-100 text-blue-800",
      },
      [TIMELINE_STATUS.PENDING]: { text: "Pending", className: "bg-gray-100 text-gray-800" },
    };

    const status = statusMap[step.status] || statusMap[TIMELINE_STATUS.PENDING];
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.className}`}
      >
        {status.text}
      </span>
    );
  };

  // Loading state - only show on initial load, not on refresh
  if (timelineLoading && (!timelineSteps || timelineSteps.length === 0)) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <div className="text-sm text-gray-500">Loading timeline...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-800">Progress</h3>
        <span className="text-xs text-gray-500">
          {timelineSteps.filter((s) => s.status === TIMELINE_STATUS.COMPLETED).length}/
          {timelineSteps.length}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-primary h-1 rounded-full transition-all duration-300"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-2">
        {timelineSteps.map((step) => (
          <div
            key={step.id}
            className="relative p-2 rounded border border-gray-200 bg-white transition-all duration-200"
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {getStepIcon(step)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-gray-900">
                    Step {step.step_number}: {step.title}
                  </h4>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0">{getStatusTag(step)}</div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 mb-2">
              {step.completed_at && <span>Done: {formatDate(step.completed_at)}</span>}
              {step.submitted_at && !step.completed_at && (
                <span>Submitted: {formatDate(step.submitted_at)}</span>
              )}
              {step.deadline && step.status !== TIMELINE_STATUS.COMPLETED && (
                <span
                  className={`block ${getTimeRemaining(step.deadline) === "Overdue" ? "text-red-600 font-medium" : ""}`}
                >
                  {getTimeRemaining(step.deadline)} left
                </span>
              )}
            </div>

            {/* Step 1: Content Recorded - NO ACTION NEEDED (View Only) */}
            {/* Brand just sees status, no buttons */}

            {/* Step 2: Draft Review - View/Approve/Revise */}
            {step.step === "DRAFT_REVIEW" && step.status === TIMELINE_STATUS.SUBMITTED && (
              <div className="space-y-1">
                <CustomButton
                  text="View Draft"
                  onClick={() => window.open(step.file_url, "_blank")}
                  className="btn-primary w-full !h-7 text-xs"
                  disabled={!step.file_url}
                />

                <div className="flex gap-1">
                  <CustomButton
                    text={approveLoading ? "Approving..." : "Approve"}
                    onClick={handleApproveDraft}
                    className="btn-success w-full !h-7 text-xs"
                    disabled={approveLoading}
                  />

                  <CustomButton
                    text="Revise"
                    onClick={() => setShowRevisionModal(true)}
                    className="btn-outline w-full !h-7 text-xs"
                    disabled={revisionLoading}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Final Published - Mark Complete Only */}
            {step.step === "FINAL_PUBLISHED" && step.status === TIMELINE_STATUS.SUBMITTED && (
              <div className="space-y-1">
                {step.published_url && (
                  <a
                    href={step.published_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:underline block mb-1"
                  >
                    View Published Post →
                  </a>
                )}
                <CustomButton
                  text={completeLoading ? "Completing..." : "Mark Complete"}
                  onClick={handleMarkAsComplete}
                  className="btn-success w-full !h-7 text-xs"
                  disabled={completeLoading}
                />
              </div>
            )}

            {/* Revision Notes Display */}
            {step.revisions && step.revisions.length > 0 && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-1 text-yellow-800">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs font-medium">Revision Requested</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1 break-words">
                  {step.revisions[0].revision_notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Revision Modal */}
      <Modal
        show={showRevisionModal}
        title="Request Revision"
        onClose={() => setShowRevisionModal(false)}
      >
        <div>
          <TextArea
            label="Feedback"
            value={revisionNotes}
            onChange={(e) => setRevisionNotes(e.target.value)}
            placeholder="Provide specific feedback on what needs to be changed"
          />
          <div className="flex justify-end gap-2 mt-3">
            <CustomButton
              text="Cancel"
              type="button"
              className="btn-cancel"
              onClick={() => setShowRevisionModal(false)}
            />
            <CustomButton
              text={revisionLoading ? "Sending..." : "Send Request"}
              className="btn-primary"
              onClick={handleRequestRevision}
              disabled={!revisionNotes.trim() || revisionLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BrandTimelineSteps;
