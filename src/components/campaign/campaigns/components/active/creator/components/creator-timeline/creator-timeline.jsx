import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import { TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import {
  AlertCircle,
  CheckCircle,
  Circle,
  ExternalLink,
  Lock,
  MessageSquare,
  Upload,
} from "lucide-react";
import useCreatorTimeline from "./use-creator-timeline.hook";

const CreatorTimelineSteps = ({
  campaignId,
  deadline = "2025-01-20T23:59:59Z",
  revisionsLimit = 2,
}) => {
  const {
    // State
    timelineSteps,
    timelineLoading,
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
  } = useCreatorTimeline(campaignId, deadline, revisionsLimit);

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
      [TIMELINE_STATUS.SUBMITTED]: { text: "Submitted", className: "bg-blue-100 text-blue-800" },
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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Campaign Progress</h3>
        <div className="flex items-center gap-2">
          <div className="w-24 bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="text-xs font-medium text-gray-600">
            {Math.round(completionPercentage)}%
          </span>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="space-y-3">
        {timelineSteps.map((step) => (
          <div
            key={step.id}
            className="relative p-3 rounded-lg border border-gray-200 bg-white transition-all duration-200"
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                {getStepIcon(step)}
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-gray-900">
                    Step {step.step_number}: {step.title}
                  </h4>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
              <div className="flex-shrink-0">{getStatusTag(step)}</div>
            </div>

            {/* Timestamps and Info */}
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
              {step.completed_at && <span>Completed: {formatDate(step.completed_at)}</span>}
              {step.submitted_at && !step.completed_at && (
                <span>Submitted: {formatDate(step.submitted_at)}</span>
              )}
              {step.step_number === 3 && step.status !== TIMELINE_STATUS.COMPLETED && (
                <span
                  className={`${getTimeRemaining(deadline) === "Overdue" ? "text-red-600 font-medium" : ""}`}
                >
                  Deadline: {getTimeRemaining(deadline)}
                </span>
              )}
            </div>

            {/* Revision Info */}
            {step.revision_count > 0 && (
              <div className="mb-3 text-xs text-orange-600">
                Revisions: {step.revision_count}/{revisionsLimit}
              </div>
            )}

            {/* Revision Notes */}
            {step.status === TIMELINE_STATUS.REVISION_REQUESTED &&
              step.revisions &&
              step.revisions.length > 0 && (
                <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-orange-800">Revision Requested</p>
                      <p className="text-xs text-orange-700 mt-1">
                        {step.revisions[0].revision_notes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Published URL Display */}
            {step.published_url && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                  <a
                    href={step.published_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline truncate"
                  >
                    {step.published_url}
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {/* Step 1: Mark as Complete (NO UPLOAD) */}
              {step.step === "CONTENT_RECORDED" && step.status === TIMELINE_STATUS.PENDING && (
                <CustomButton
                  text="Mark as Recorded"
                  onClick={() => handleMarkComplete(step.id)}
                  className="btn-success !h-7 text-xs"
                  disabled={updateLoading}
                />
              )}

              {/* Step 2: Upload Draft (FILE UPLOAD) */}
              {step.step === "DRAFT_REVIEW" &&
                (step.status === TIMELINE_STATUS.IN_PROGRESS ||
                  step.status === TIMELINE_STATUS.REVISION_REQUESTED) &&
                step.revision_count < revisionsLimit && (
                  <CustomButton
                    text={
                      step.status === TIMELINE_STATUS.REVISION_REQUESTED
                        ? "Re-upload Draft"
                        : "Upload Draft"
                    }
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary !h-7 text-xs"
                    disabled={updateLoading}
                  />
                )}

              {/* Step 3: Submit URL (URL INPUT ONLY) */}
              {step.step === "FINAL_PUBLISHED" && step.status === TIMELINE_STATUS.IN_PROGRESS && (
                <CustomButton
                  text="Submit Published URL"
                  onClick={() => setShowUrlModal(true)}
                  className="btn-primary !h-7 text-xs"
                  disabled={updateLoading}
                />
              )}
            </div>

            {/* Revision Limit Warning */}
            {step.step === "DRAFT_REVIEW" &&
              step.revision_count >= revisionsLimit &&
              step.status === TIMELINE_STATUS.REVISION_REQUESTED && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <p className="text-xs text-red-700 font-medium">
                    Revision limit reached. Please contact support for assistance.
                  </p>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      <Modal
        show={showUploadModal}
        title="Upload Draft Content"
        onClose={() => setShowUploadModal(false)}
      >
        <div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-2">Choose file to upload</p>
            <input
              type="file"
              accept="video/*,image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm bg-white hover:bg-gray-50 cursor-pointer"
            >
              Select File
            </label>
            {selectedFile && (
              <p className="text-xs text-green-600 mt-2">Selected: {selectedFile.name}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Cancel"
              type="button"
              className="btn-cancel"
              onClick={() => setShowUploadModal(false)}
            />
            <CustomButton
              text={updateLoading ? "Uploading..." : "Submit for Review"}
              className="btn-primary"
              onClick={handleFileUpload}
              disabled={!selectedFile || updateLoading}
            />
          </div>
        </div>
      </Modal>

      {/* URL Modal */}
      <Modal
        show={showUrlModal}
        title="Submit Published Post URL"
        onClose={() => setShowUrlModal(false)}
      >
        <div>
          <div className="space-y-1 mb-4">
            <div>
              <CustomInput
                label="Post URL"
                type="url"
                value={publishedUrl}
                onChange={(e) => setPublishedUrl(e.target.value)}
                placeholder="https://instagram.com/p/..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be a valid URL from Instagram, TikTok or YouTube
              </p>
            </div>
            {publishedUrl && !validateUrl(publishedUrl) && (
              <p className="text-xs text-red-600">Please enter a valid social media URL</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Cancel"
              type="button"
              className="btn-cancel"
              onClick={() => setShowUrlModal(false)}
            />
            <CustomButton
              text={updateLoading ? "Submitting..." : "Mark as Published"}
              className="btn-primary"
              onClick={handlePublishUrl}
              disabled={!validateUrl(publishedUrl) || updateLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatorTimelineSteps;
