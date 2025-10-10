import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { product } from "@/common/constants/auth.constant";
import { SOURCE_PLATFORM, TIMELINE_STATUS } from "@/common/constants/campaign.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  MessageCircle,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreatorTimelineSteps from "../creator-timeline/creator-timeline";
import useCreatorTimeline from "../creator-timeline/use-creator-timeline.hook";

const CampaignDetail = ({ selectedCampaign, isLoading }) => {
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  const campaign = selectedCampaign;
  const router = useRouter();

  // Only load timeline for CleerCut campaigns
  const isCleerCutCampaign =
    campaign?.sourcePlatform === SOURCE_PLATFORM.CLEERCUT || !campaign?.sourcePlatform; // Default to true if not set

  // Get timeline data to sync with progress (only for CleerCut campaigns)
  const { timelineSteps } = useCreatorTimeline(
    isCleerCutCampaign ? campaign?.id : null,
    campaign?.campaign_deadline || campaign?.application_deadline
  );

  const { getPlatformIcon } = useGetplatform();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // Open progress modal
  const handleUpdateProgress = () => {
    setShowProgressModal(true);
  };

  // Sample data for the information sections
  const campaignInfo = {
    dosdonts: {
      dos: [
        "Use natural lighting when filming",
        "Show product application process",
        "Include before/after shots if possible",
        "Mention the discount code: SUMMER20",
        "Tag @GlowCoBeauty in all posts",
      ],
      donts: [
        "Don't use heavy filters that alter skin tone",
        "Avoid filming in poor lighting conditions",
        "Don't make medical claims about the product",
        "Avoid negative comparisons with competitors",
        "Don't forget to disclose partnership (#ad)",
      ],
    },
    styleGuide: {
      colors: ["#FF6B9D", "#4ECDC4", "#FFE66D"],
      fonts: ["Montserrat", "Open Sans"],
      tone: "Fresh, authentic, and approachable",
      aesthetics: [
        "Clean, minimalist backgrounds",
        "Bright, natural lighting",
        "Focus on product textures and results",
        "Include lifestyle elements (morning routine, skincare shelf)",
      ],
    },
    captions: [
      {
        platform: "Instagram",
        caption:
          "Summer glow-up starts with the right skincare! ✨ This lightweight serum from @GlowCoBeauty has been a game-changer for my routine. The SPF 30 protection is perfect for these sunny days! 🌞 Use code SUMMER20 for 20% off! #GlowCoPartner #SummerSkincare #SPFProtection #ad",
        hashtags: "#GlowCoPartner #SummerSkincare #SPFProtection #SkincareRoutine #GlowUp #ad",
      },
      {
        platform: "TikTok",
        caption:
          "POV: You found the perfect summer skincare combo ☀️ This @GlowCoBeauty duo is giving me that healthy glow! Code SUMMER20 for 20% off 💕 #GlowCoPartner #SummerSkincare #SkincareHacks #ad",
        hashtags: "#GlowCoPartner #SummerSkincare #SkincareHacks #GlowUp #SPF #ad",
      },
    ],
  };

  // Campaign type color mapping
  const getCampaignTypeStyle = (type) => {
    const styles = {
      "Sponsored Post": {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      },
      UGC: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
      },
      Gifted: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      },
      Affiliate: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
      },
    };
    return styles[type] || styles["Sponsored Post"];
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="w-full h-screen bg-white border-x flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">Loading campaign details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show no campaign selected state
  if (!campaign) {
    return (
      <div className="w-full h-screen bg-white border-x flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sm text-gray-500 mb-2">No campaign selected</div>
            <div className="text-xs text-gray-400">
              Select a campaign from the list to view details.
            </div>
          </div>
        </div>
      </div>
    );
  }

  const typeStyle = getCampaignTypeStyle(campaign.type);

  return (
    <div className="w-full h-screen bg-white border-x flex-1 flex flex-col overflow-y-auto">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4 pb-20">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
                <img src={campaign.logo} alt="Brand Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{campaign.brand}</h2>
                <p className="text-sm text-gray-600">{campaign.title}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(campaign.deadline)}</span>
                </div>
              </div>
            </div>

            {/* UGC Post Badge and Product */}
            <div className="flex flex-col items-end gap-2 flex-shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {campaign.type}
              </div>
              <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
                <div>{campaign.compensation} -</div>
                <div>{campaign.compensationAmount}</div>
              </div>
            </div>
          </div>

          <div className="w-full flex gap-6">
            {/* Information Sections */}
            <div className="w-full space-y-2">
              {/* Do's and Don'ts */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("dosdonts")}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">Do's and Don'ts</span>
                  </div>
                  {expandedSections.dosdonts ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.dosdonts && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Do's
                        </h4>
                        <ul className="space-y-1">
                          {campaignInfo.dosdonts.dos.map((item, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                          <X className="w-3 h-3" />
                          Don'ts
                        </h4>
                        <ul className="space-y-1">
                          {campaignInfo.dosdonts.donts.map((item, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Style Guide */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("styleGuide")}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">Style Guide</span>
                  </div>
                  {expandedSections.styleGuide ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.styleGuide && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                    <div>
                      <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Colors</h4>
                      <div className="flex gap-1">
                        {campaignInfo.styleGuide.colors.map((color, index) => (
                          <div key={index} className="flex flex-col items-center gap-1">
                            <div
                              className="w-6 h-6 rounded border border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-xs text-gray-500">{color}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Tone</h4>
                      <p className="text-xs text-gray-600">{campaignInfo.styleGuide.tone}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Captions and Hashtags */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection("captions")}
                  className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-900">Captions & Hashtags</span>
                  </div>
                  {expandedSections.captions ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedSections.captions && (
                  <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                    {campaignInfo.captions.map((item, index) => (
                      <div key={index} className="border border-gray-100 rounded p-2">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-medium text-gray-900 flex items-center gap-1">
                            <div className="w-3 h-3">{getPlatformIcon(item.platform)}</div>
                            {item.platform}
                          </h4>
                          <button
                            onClick={() => copyToClipboard(item.caption)}
                            className="text-blue-600 hover:text-blue-700"
                            title="Copy caption"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                        <p className="text-xs text-gray-600 mb-1 line-clamp-2">{item.caption}</p>
                        <p className="text-xs text-blue-600">{item.hashtags}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex-shrink-0">
              <img
                src={product}
                alt="Campaign Product"
                className="w-36 h-36 rounded-lg object-cover border border-gray-200"
              />
            </div>
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h3>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex flex-wrap gap-1">
                {campaign.deliverables.map((item, index) => (
                  <span
                    key={index}
                    className="bg-white text-xs text-gray-700 px-2 py-1 rounded border flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-blue-500 rounded-full" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-l-2 border-primary my-5">
            <p className="text-xs text-gray-600 line-clamp-2 ml-2">
              <span className="font-bold">Description:</span> {campaign.description}
            </p>
          </div>

          {/* Campaign Progress - Only for CleerCut campaigns */}
          {isCleerCutCampaign && (
            <>
              {/* Helpful Note */}
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                <p className="font-medium">📌 Quick Tip:</p>
                <p className="mt-1">
                  Use the timeline steps below to track progress. "Upload Content" opens your brief
                  for reference.
                </p>
              </div>

              <CreatorTimelineSteps
                campaignId={campaign?.id}
                deadline={campaign?.campaign_deadline || campaign?.application_deadline}
              />
            </>
          )}

          {/* Action Buttons Row - As per requirements */}
          <div className={`grid ${isCleerCutCampaign ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
            {isCleerCutCampaign && (
              <CustomButton
                text="Update Progress"
                className="btn-outline text-xs"
                onClick={handleUpdateProgress}
                startIcon={<BarChart3 className="w-3 h-3" />}
              />
            )}
            <CustomButton
              text="Message"
              className="btn-outline text-xs"
              onClick={() => setShowMessageModal(true)}
              startIcon={<MessageCircle className="w-3 h-3" />}
            />
            <CustomButton
              text="View Brief"
              className="btn-outline text-xs"
              onClick={() => setShowContentBrief(true)}
              startIcon={<ExternalLink className="w-3 h-3" />}
            />
          </div>
        </div>
      </div>

      {/* Content Brief Modal */}
      {showContentBrief && (
        <Modal
          show={showContentBrief}
          title="Content Brief"
          onClose={() => setShowContentBrief(false)}
          size="lg"
        >
          <div className="prose text-sm text-gray-600">
            <p className="mb-4">
              Create engaging content showcasing our Summer Skincare Collection. Focus on the
              benefits of our new hydrating serum and SPF moisturizer.
            </p>
            <h3 className="font-medium text-gray-900 mb-2">Key Points to Cover:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Lightweight, non-greasy formula</li>
              <li>Suitable for all skin types</li>
              <li>SPF 30 protection</li>
              <li>Hydrating benefits</li>
            </ul>
            <h3 className="font-medium text-gray-900 mb-2">Brand Guidelines:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Use natural lighting when possible</li>
              <li>Include product close-ups</li>
              <li>Mention discount code: SUMMER20</li>
            </ul>
          </div>
        </Modal>
      )}

      {/* Progress Update Modal */}
      <Modal
        show={showProgressModal}
        title="Campaign Progress"
        onClose={() => setShowProgressModal(false)}
        size="md"
      >
        <div className="space-y-4">
          {/* Overall Progress */}
          <div className="bg-gray-50 rounded p-3 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm font-medium text-gray-900">
                {timelineSteps
                  ? Math.round(
                      (timelineSteps.filter(
                        (s) =>
                          s.status === TIMELINE_STATUS.COMPLETED ||
                          s.status === TIMELINE_STATUS.APPROVED
                      ).length /
                        timelineSteps.length) *
                        100
                    )
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    timelineSteps
                      ? (timelineSteps.filter(
                          (s) =>
                            s.status === TIMELINE_STATUS.COMPLETED ||
                            s.status === TIMELINE_STATUS.APPROVED
                        ).length /
                          timelineSteps.length) *
                        100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Timeline Steps */}
          <div className="space-y-3">
            {timelineSteps && timelineSteps.length > 0 ? (
              timelineSteps.map((step, index) => {
                const isCompleted =
                  step.status === TIMELINE_STATUS.COMPLETED ||
                  step.status === TIMELINE_STATUS.APPROVED;
                const isSubmitted = step.status === TIMELINE_STATUS.SUBMITTED;
                const isInProgress = step.status === TIMELINE_STATUS.IN_PROGRESS;
                const isRevisionRequested = step.status === TIMELINE_STATUS.REVISION_REQUESTED;

                return (
                  <div
                    key={step.id || index}
                    className="p-3 rounded border border-gray-200 bg-white hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox */}
                      <div className="mt-0.5">
                        <input
                          type="checkbox"
                          checked={isCompleted}
                          readOnly
                          className="w-4 h-4 text-primary rounded border-gray-300"
                        />
                      </div>

                      {/* Step Info */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-gray-900">{step.title}</h4>
                          <span className="text-xs text-gray-500">
                            {isCompleted
                              ? "Completed"
                              : isSubmitted
                                ? "Pending Review"
                                : isRevisionRequested
                                  ? "Revision Needed"
                                  : isInProgress
                                    ? "In Progress"
                                    : "Not Started"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600">{step.description}</p>
                        {step.submitted_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted {new Date(step.submitted_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Revision Feedback */}
                    {isRevisionRequested && step.revisions && step.revisions.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-700">
                          <span className="font-medium">Feedback:</span>{" "}
                          {step.revisions[0].revision_notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading progress...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end pt-2 border-t border-gray-200">
            <CustomButton
              text="Close"
              className="btn-primary"
              onClick={() => setShowProgressModal(false)}
            />
          </div>
        </div>
      </Modal>

      {/* Message Modal */}
      <Modal
        show={showMessageModal}
        title="Message Brand"
        onClose={() => setShowMessageModal(false)}
        size="md"
      >
        <div className="space-y-3">
          <p className="text-sm text-gray-600">Contact the brand directly about this campaign.</p>
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <p className="text-xs text-gray-500">
              <strong>Note:</strong> For full messaging functionality, please use the Chat/Inbox
              feature.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Close"
              className="btn-cancel"
              onClick={() => setShowMessageModal(false)}
            />
            <CustomButton
              text="Go to Inbox"
              className="btn-primary"
              onClick={() => {
                setShowMessageModal(false);
                router.push("/chat-inbox");
              }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetail;
