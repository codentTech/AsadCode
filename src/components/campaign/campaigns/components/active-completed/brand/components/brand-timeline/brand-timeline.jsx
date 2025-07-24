import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { AlertCircle, CheckCircle, Circle, Clock, MessageSquare } from "lucide-react";
import React, { useState } from "react";

const BrandTimelineSteps = () => {
  const [timelineSteps, setTimelineSteps] = useState([
    {
      id: 1,
      title: "Content Recorded",
      description: "Filmed & editing",
      status: "completed", // completed, in_progress, pending, action_required
      completedAt: "2025-01-15T10:30:00Z",
      brandAction: false,
      tooltip: "Content recorded by creator",
    },
    {
      id: 2,
      title: "Draft Review",
      description: "Review & feedback",
      status: "action_required",
      submittedAt: "2025-01-16T14:20:00Z",
      brandAction: true,
      tooltip: "Your action required",
      draftUrl: "#draft-preview",
    },
    {
      id: 3,
      title: "Final Published",
      description: "Confirm completion",
      status: "pending",
      publishedAt: null,
      brandAction: true,
      tooltip: "Waiting for Step 2",
      deadline: "2025-01-20T23:59:59Z",
    },
  ]);

  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getTimeRemaining = (deadline) => {
    if (!deadline) return "";
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d`;
    return `${hours}h`;
  };

  const handleApproveDraft = () => {
    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === 2) {
          return { ...step, status: "completed", completedAt: new Date().toISOString() };
        }
        if (step.id === 3) {
          return { ...step, status: "in_progress", tooltip: "Waiting for creator" };
        }
        return step;
      })
    );
  };

  const handleRequestRevision = () => {
    if (!revisionNotes.trim()) return;

    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === 2) {
          return {
            ...step,
            status: "in_progress",
            tooltip: "Revision requested",
            revisionRequested: true,
            revisionNotes: revisionNotes,
          };
        }
        return step;
      })
    );

    setShowRevisionModal(false);
    setRevisionNotes("");
  };

  const handleMarkAsComplete = () => {
    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === 3) {
          return { ...step, status: "completed", completedAt: new Date().toISOString() };
        }
        return step;
      })
    );
  };

  const getStepIcon = (step) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-600" />;
      case "action_required":
        return <AlertCircle className="w-3 h-3 text-orange-500" />;
      case "in_progress":
        return <Clock className="w-3 h-3 text-blue-500" />;
      default:
        return <Circle className="w-3 h-3 text-gray-400" />;
    }
  };

  const getStepBorderColor = (step) => {
    switch (step.status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "action_required":
        return "border-orange-200 bg-orange-50";
      case "in_progress":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const completedSteps = timelineSteps.filter((step) => step.status === "completed").length;
  const completionPercentage = (completedSteps / timelineSteps.length) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-gray-800">Progress</h3>
        <span className="text-xs text-gray-500">
          {completedSteps}/{timelineSteps.length}
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
        {timelineSteps.map((step, index) => (
          <div
            key={step.id}
            className={`relative p-2 rounded border transition-all duration-200 ${getStepBorderColor(step)}`}
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                {getStepIcon(step)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-900 truncate">{step.title}</h4>
                  <p className="text-xs text-gray-600 truncate">{step.description}</p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                {step.status === "action_required" && (
                  <span className="inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                    Action
                  </span>
                )}
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-gray-500 mb-2">
              {step.completedAt && <span>Done: {formatDate(step.completedAt)}</span>}
              {step.submittedAt && !step.completedAt && (
                <span>Submitted: {formatDate(step.submittedAt)}</span>
              )}
              {step.deadline && step.status !== "completed" && (
                <span
                  className={`block ${getTimeRemaining(step.deadline) === "Overdue" ? "text-red-600 font-medium" : ""}`}
                >
                  {getTimeRemaining(step.deadline)} left
                </span>
              )}
            </div>

            {/* Action Buttons */}
            {step.brandAction && step.status === "action_required" && (
              <div className="space-y-1">
                {step.id === 2 && (
                  <React.Fragment>
                    <CustomButton
                      text="View Draft"
                      onClick={() => window.open(step.draftUrl, "_blank")}
                      className="btn-primary w-full !h-7 text-xs"
                    />

                    <div className="flex gap-1">
                      <CustomButton
                        text="Approve"
                        onClick={handleApproveDraft}
                        className="btn-success w-full !h-7 text-xs"
                      />

                      <CustomButton
                        text="Revise"
                        onClick={() => setShowRevisionModal(true)}
                        className="btn-outline w-full !h-7 text-xs"
                      />
                    </div>
                  </React.Fragment>
                )}
                {step.id === 3 && step.status === "action_required" && (
                  <button
                    onClick={handleMarkAsComplete}
                    className="w-full flex items-center justify-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" />
                    Mark Complete
                  </button>
                )}
              </div>
            )}

            {/* Status Messages */}
            {step.revisionRequested && (
              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                <div className="flex items-center gap-1 text-yellow-800">
                  <MessageSquare className="w-3 h-3" />
                  <span className="text-xs font-medium">Revision Requested</span>
                </div>
                <p className="text-xs text-yellow-700 mt-1 break-words">{step.revisionNotes}</p>
              </div>
            )}

            {/* Tooltip */}
            {step.tooltip && (
              <div className="mt-1 text-xs text-gray-500 italic">{step.tooltip}</div>
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
            placeholder="Provide specific feedback"
          />
          <div className="flex justify-end gap-2 mt-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={() => setShowRevisionModal(false)}
            />
            <CustomButton
              text="Send Request"
              className="btn-primary"
              onClick={handleRequestRevision}
              //   disabled={!revisionNotes.trim()}
            />
          </div>
        </div>
      </Modal>

      {/* Auto-complete Notice */}
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-3 h-3 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium">Auto-completion</p>
            <p className="mt-1">Steps auto-complete 48hrs after deadline unless disputed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandTimelineSteps;
