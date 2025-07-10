import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  AlertCircle,
  Upload,
  ExternalLink,
  MessageSquare,
  Eye,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";

const CreatorTimelineSteps = ({
  campaignId,
  deadline = "2025-01-20T23:59:59Z",
  revisionsLimit = 3,
}) => {
  const [timelineSteps, setTimelineSteps] = useState([
    {
      id: 1,
      title: "Content Recorded",
      description: "Mark when content is filmed/captured",
      status: "completed", // completed, in_progress, pending, revision_requested
      completedAt: "2025-01-15T10:30:00Z",
      requiresUpload: false,
      manualAction: true,
    },
    {
      id: 2,
      title: "Draft Submitted for Review",
      description: "Upload draft and submit for review",
      status: "revision_requested",
      submittedAt: "2025-01-16T14:20:00Z",
      requiresUpload: true,
      manualAction: true,
      revisionCount: 1,
      revisionNotes:
        "Please adjust the lighting in the second half of the video and mention the SPF 30 benefit more prominently.",
      draftFile: null,
    },
    {
      id: 3,
      title: "Final Post Published",
      description: "Submit published post URL",
      status: "pending",
      publishedAt: null,
      requiresUpload: false,
      requiresUrl: true,
      manualAction: true,
      publishedUrl: "",
    },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

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

  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate - now;

    if (diff <= 0) return "Overdue";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const validateUrl = (url) => {
    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const socialPlatforms = ["instagram.com", "tiktok.com", "youtube.com", "twitter.com", "x.com"];

    if (!urlPattern.test(url)) return false;
    return socialPlatforms.some((platform) => url.includes(platform));
  };

  const handleMarkComplete = (stepId) => {
    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === stepId) {
          return { ...step, status: "completed", completedAt: new Date().toISOString() };
        }
        if (step.id === stepId + 1) {
          return { ...step, status: "in_progress" };
        }
        return step;
      })
    );
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === 2) {
          return {
            ...step,
            status: "pending_approval",
            submittedAt: new Date().toISOString(),
            draftFile: selectedFile,
            revisionCount: step.revisionCount || 0,
          };
        }
        return step;
      })
    );

    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handlePublishUrl = () => {
    if (!validateUrl(publishedUrl)) return;

    setTimelineSteps((prev) =>
      prev.map((step) => {
        if (step.id === 3) {
          return {
            ...step,
            status: "awaiting_brand_approval",
            publishedAt: new Date().toISOString(),
            publishedUrl: publishedUrl,
          };
        }
        return step;
      })
    );

    setShowUrlModal(false);
    setPublishedUrl("");
  };

  const getStepIcon = (step) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "revision_requested":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "pending_approval":
      case "awaiting_brand_approval":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStepBorderColor = (step) => {
    switch (step.status) {
      case "completed":
        return "border-green-200 bg-green-50";
      case "revision_requested":
        return "border-orange-200 bg-orange-50";
      case "pending_approval":
      case "awaiting_brand_approval":
        return "border-blue-200 bg-blue-50";
      case "in_progress":
        return "border-blue-200 bg-blue-50";
      default:
        return "border-gray-200 bg-gray-50";
    }
  };

  const getStatusTag = (step) => {
    const statusMap = {
      completed: { text: "Completed", className: "bg-green-100 text-green-800" },
      pending_approval: { text: "Pending Approval", className: "bg-blue-100 text-blue-800" },
      awaiting_brand_approval: {
        text: "Awaiting Brand Approval",
        className: "bg-blue-100 text-blue-800",
      },
      revision_requested: {
        text: "Revision Requested",
        className: "bg-orange-100 text-orange-800",
      },
      in_progress: { text: "In Progress", className: "bg-yellow-100 text-yellow-800" },
      pending: { text: "Pending", className: "bg-gray-100 text-gray-800" },
    };

    const status = statusMap[step.status] || statusMap.pending;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${status.className}`}
      >
        {status.text}
      </span>
    );
  };

  const completedSteps = timelineSteps.filter((step) => step.status === "completed").length;
  const completionPercentage = (completedSteps / timelineSteps.length) * 100;

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
        {timelineSteps.map((step, index) => (
          <div
            key={step.id}
            className={`relative p-3 rounded-lg border transition-all duration-200 ${getStepBorderColor(step)}`}
          >
            {/* Step Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-3">
                {getStepIcon(step)}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">Step {step.id}</span>
                {getStatusTag(step)}
              </div>
            </div>

            {/* Timestamps and Info */}
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
              {step.completedAt && <span>Completed: {formatDate(step.completedAt)}</span>}
              {step.submittedAt && !step.completedAt && (
                <span>Submitted: {formatDate(step.submittedAt)}</span>
              )}
              {step.publishedAt && <span>Published: {formatDate(step.publishedAt)}</span>}
              {step.id === 3 && step.status !== "completed" && (
                <span
                  className={`${getTimeRemaining(deadline) === "Overdue" ? "text-red-600 font-medium" : ""}`}
                >
                  Deadline: {getTimeRemaining(deadline)}
                </span>
              )}
            </div>

            {/* Revision Info */}
            {step.revisionCount > 0 && (
              <div className="mb-3 text-xs text-orange-600">
                Revisions: {step.revisionCount}/{revisionsLimit}
              </div>
            )}

            {/* Revision Notes */}
            {step.status === "revision_requested" && step.revisionNotes && (
              <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3 h-3 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-orange-800">Revision Requested</p>
                    <p className="text-xs text-orange-700 mt-1">{step.revisionNotes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Published URL Display */}
            {step.publishedUrl && (
              <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded">
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3 text-blue-600" />
                  <a
                    href={step.publishedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-700 underline truncate"
                  >
                    {step.publishedUrl}
                  </a>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {step.id === 1 && step.status === "completed" && (
                <CustomButton
                  text="Mark as Recorded"
                  onClick={() => handleMarkComplete(1)}
                  className="btn-success !h-7 text-xs"
                />
              )}

              {step.id === 2 &&
                (step.status === "in_progress" || step.status === "revision_requested") &&
                step.revisionCount < revisionsLimit && (
                  <CustomButton
                    text={step.status === "revision_requested" ? "Re-upload Draft" : "Upload Draft"}
                    onClick={() => setShowUploadModal(true)}
                    className="btn-primary !h-7 text-xs"
                  />
                )}

              {step.id === 3 && step.status !== "in_progress" && (
                <CustomButton
                  text="Submit Published URL"
                  onClick={() => setShowUrlModal(true)}
                  className="btn-primary !h-7 text-xs"
                />
              )}
            </div>

            {/* Revision Limit Warning */}
            {step.id === 2 &&
              step.revisionCount >= revisionsLimit &&
              step.status === "revision_requested" && (
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
              className="btn-cancel"
              onClick={() => setShowUploadModal(false)}
            />
            <CustomButton
              text="Submit for Review"
              className="btn-primary"
              onClick={handleFileUpload}
              disabled={!selectedFile}
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
                Must be a valid URL from Instagram, TikTok, YouTube, or Twitter/X
              </p>
            </div>
            {publishedUrl && !validateUrl(publishedUrl) && (
              <p className="text-xs text-red-600">Please enter a valid social media URL</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={() => setShowUrlModal(false)}
            />
            <CustomButton
              text="Mark as Published"
              className="btn-primary"
              onClick={handlePublishUrl}
              //   disabled={!validateUrl(publishedUrl)}
            />
          </div>
        </div>
      </Modal>

      {/* Auto-approval Notice */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium">Auto-approval Policy</p>
            <p className="mt-1">
              Final posts auto-approve 48 hours after deadline unless disputed by brand. Revisions
              allowed: {revisionsLimit} per step.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorTimelineSteps;
