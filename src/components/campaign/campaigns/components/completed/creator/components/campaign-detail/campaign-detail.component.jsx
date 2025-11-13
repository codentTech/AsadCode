import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { product } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import {
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Copy,
  ExternalLink,
  MessageCircle,
  X,
} from "lucide-react";
import { useState } from "react";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

const CampaignDetail = ({ campaign, selectedCampaign }) => {
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  console.log(campaign);

  // Message thread hook - use brand ID (campaign creator)
  const brandId = campaign?.campaign?.created_by?.id;
  const messageThreadHook = useMessageThread(brandId);

  const creator = {
    id: brandId,
    name:
      campaign?.campaign?.created_by?.first_name && campaign?.campaign?.created_by?.last_name
        ? `${campaign.campaign.created_by.first_name} ${campaign.campaign.created_by.last_name}`
        : campaign?.brand || "Brand",
    avatar: campaign?.campaign?.created_by?.profile_photo_url,
    isOnline: true,
  };

  // Handle message click with validation
  const handleMessageClick = () => {
    if (!brandId) {
      return;
    }
    messageThreadHook.openMessageModal();
  };

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

  const typeStyle = getCampaignTypeStyle(campaign?.type);

  return (
    <div className="w-full h-screen bg-white flex-1 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-5xl border border-gray-200 flex-shrink-0">
              <img
                src={campaign?.brand?.logo}
                alt={campaign?.brand?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{campaign?.brand?.name}</h2>
              <p className="text-sm text-gray-600">{campaign?.title}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>{campaign?.deadline || "N/A"}</span>
              </div>
            </div>
          </div>

          {/* UGC Post Badge and Product */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
            >
              {campaign?.type}
            </div>
            <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
              <div>{campaign?.compensation} -</div>
              <div>{campaign?.compensationAmount}</div>
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
                {expandedSections?.dosdonts ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections?.dosdonts && (
                <div className="p-3 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Do's
                      </h4>
                      <ul className="space-y-1">
                        {campaignInfo?.dosdonts?.dos?.map((item, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
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
                        {campaignInfo?.dosdonts?.donts?.map((item, index) => (
                          <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
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
                {campaign?.campiagn?.style_guide ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {campaign?.campiagn?.style_guide && (
                <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Colors</h4>
                    <span className="text-xs text-gray-500">{color}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Tone</h4>
                    <p className="text-xs text-gray-600">
                      {campaign?.campiagn?.style_guide.style_guide_file}
                    </p>
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
                {campaign?.campiagn?.hashtags ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {campaign?.campiagn?.hashtags && (
                <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                  <p className="text-xs text-blue-600">{campaign?.campiagn?.hashtags}</p>
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
              {campaign?.deliverables?.map((item, index) => (
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
            <span className="font-bold">Description:</span> {campaign?.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            text="Message"
            className="btn-primary text-xs"
            onClick={handleMessageClick}
            startIcon={<MessageCircle className="w-4 h-4" />}
          />
          <CustomButton
            text="View Brief"
            className="btn-outline text-xs"
            onClick={() => setShowContentBrief(true)}
            startIcon={<ExternalLink className="w-4 h-4" />}
          />
        </div>

        {/* Campaign Progress */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-900">Campaign Progress</h3>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${campaign?.completionRate}%` }}
                />
              </div>
              <span className="text-xs font-medium text-gray-600">{campaign?.completionRate}%</span>
            </div>
          </div>

          <div className="space-y-2">
            {campaign?.progress?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  {item.completed ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <Circle className="w-4 h-4 text-gray-400" />
                  )}
                  <span className="text-xs text-gray-700">{item.task}</span>
                  {item.completed && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                      Complete
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-500">Step {index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* <div className={`grid ${isCleerCutCampaign ? "grid-cols-3" : "grid-cols-2"} gap-2`}>
            {isCleerCutCampaign && (
              <React.Fragment>
                <CustomButton
                  text="Update Progress"
                  className="btn-outline text-xs"
                  onClick={handleUpdateProgress}
                  startIcon={<BarChart3 className="w-3 h-3" />}
                />
                <CustomButton
                  text="Message"
                  className="btn-outline text-xs"
                  onClick={handleMessageClick}
                  startIcon={<MessageCircle className="w-3 h-3" />}
                />
              </React.Fragment>
            )}
            <CustomButton
              text="View Brief"
              className="btn-outline text-xs"
              onClick={() => setShowContentBrief(true)}
              startIcon={<ExternalLink className="w-3 h-3" />}
            />
          </div> */}

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
        title="Update Progress"
        onClose={() => setShowProgressModal(false)}
      >
        <div>
          <div className="space-y-3 mb-4">
            {campaign?.progress?.map((item, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="w-4 h-4 text-indigo-600 rounded mr-3"
                  readOnly
                />
                <span className="text-sm text-gray-700">{item.task}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="mt-4 flex justify-end space-x-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={() => setShowProgressModal(false)}
            />
            <CustomButton
              text="Save Changes"
              className="btn-primary"
              onClick={() => setShowProgressModal(false)}
            />
          </div>
        </div>
      </Modal>

      {/* Message Thread Modal */}
      <MessageThreadModal
        isOpen={messageThreadHook.isModalOpen}
        onClose={messageThreadHook.closeMessageModal}
        creator={creator}
        messages={messageThreadHook.messages || []}
        newMessage={messageThreadHook.newMessage || ""}
        setNewMessage={messageThreadHook.setNewMessage}
        sendMessage={messageThreadHook.sendMessage}
        isSending={messageThreadHook.isSending}
        isLoading={messageThreadHook.isLoading}
        isCreatorOnline={messageThreadHook.isCreatorOnline}
        isCreatorTyping={messageThreadHook.isCreatorTyping}
        messagesEndRef={messageThreadHook.messagesEndRef}
        messagesContainerRef={messageThreadHook.messagesContainerRef}
      />
    </div>
  );
};

export default CampaignDetail;
