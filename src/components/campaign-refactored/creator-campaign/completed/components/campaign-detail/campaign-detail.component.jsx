import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { formatDate } from "@/common/utils/date.utils";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Circle, X } from "lucide-react";
import CampaignBriefModal from "../../../applications/components/campaign-brief-modal/campaign-brief-modal.component";
import useCampaignDetail from "./use-campaign-detail.hook";

const CampaignDetail = ({ campaign }) => {
  const {
    // State
    showContentBrief,
    showProgressModal,
    expandedSections,
    campaignInfo,

    // Computed
    typeStyle,
    campaignProgressSteps,
    progressCompletionRate,
    creator,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleOpenContentBrief,
    handleCloseContentBrief,
    handleCloseProgressModal,
  } = useCampaignDetail(campaign);

  if (!campaign) {
    return (
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white md:h-screen">
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

  return (
    <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white md:h-screen">
      <div className="space-y-4 p-3 sm:p-4">
        {/* Header Section */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 sm:h-16 sm:w-16">
              <img
                src={campaign?.brand?.logo || campaign?.logo}
                alt={campaign?.brand?.name || campaign?.brand}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
                {campaign?.brand?.name || campaign?.brand}
              </h2>
              <p className="text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">{campaign?.title}</p>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(campaign?.campaign?.application_deadline)}</span>
              </div>
            </div>
          </div>

          {/* Campaign Type Badge and Compensation */}
          <div className="flex flex-shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
            <div
              className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
            >
              {campaign?.type}
            </div>
            <div className="flex items-center gap-2 text-left text-[10px] font-semibold text-gray-900 sm:text-xs">
              <div>{campaign?.compensation} -</div>
              <div>{campaign?.compensationAmount}</div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 sm:gap-6 lg:flex-row">
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
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Do's
                      </h4>
                      <ul className="space-y-1">
                        {campaignInfo.dosdonts.dos.length > 0 ? (
                          campaignInfo.dosdonts.dos.map((item, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-gray-400 italic">No do's specified</li>
                        )}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                        <X className="w-3 h-3" />
                        Don'ts
                      </h4>
                      <ul className="space-y-1">
                        {campaignInfo.dosdonts.donts.length > 0 ? (
                          campaignInfo.dosdonts.donts.map((item, index) => (
                            <li
                              key={index}
                              className="text-xs text-gray-600 flex items-start gap-1"
                            >
                              <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))
                        ) : (
                          <li className="text-xs text-gray-400 italic">No don'ts specified</li>
                        )}
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
                  {campaignInfo.styleGuide.text ? (
                    <div>
                      <p className="text-xs text-gray-600 whitespace-pre-wrap">
                        {campaignInfo.styleGuide.text}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">No style guide provided</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Hashtags */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection("captions")}
                className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-900">Hashtags</span>
                </div>
                {expandedSections.captions ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {expandedSections.captions && (
                <div className="p-3 bg-white border-t border-gray-200">
                  {campaignInfo.hashtags ? (
                    <p className="text-xs text-blue-600 break-words">{campaignInfo.hashtags}</p>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-xs text-gray-500">No hashtags provided</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Product Image */}
          {campaign?.campaign?.campaign_image && (
            <div className="flex flex-shrink-0 justify-center lg:justify-start">
              <img
                src={campaign?.campaign?.campaign_image}
                alt="Campaign Product"
                className="h-40 w-28 rounded-lg border border-gray-200 object-cover sm:h-36 sm:w-36"
              />
            </div>
          )}
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
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <CustomButton
            text="Message"
            className="btn-primary"
            onClick={handleMessageClick}
          />
          <CustomButton
            text="View Brief"
            className="btn-outline"
            onClick={handleOpenContentBrief}
          />
        </div>

        {/* Campaign Progress (UGC: 2 steps; other types: 3 steps) */}
        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-gray-900">Campaign Progress</h3>
            <div className="flex items-center gap-2">
              <div className="w-24 bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressCompletionRate}%` }}
                />
              </div>
              <span className="text-[10px] font-medium text-gray-600 sm:text-xs">{progressCompletionRate}%</span>
            </div>
          </div>

          <div className="space-y-2">
            {campaignProgressSteps.map((item, index) => (
              <div
                key={`${item.task}-${index}`}
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

      {/* Content Brief Modal */}
      {showContentBrief && (
        <Modal
          show={showContentBrief}
          title="Content Brief"
          onClose={handleCloseContentBrief}
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
      <Modal show={showProgressModal} title="Update Progress" onClose={handleCloseProgressModal}>
        <div>
          <div className="space-y-3 mb-4">
            {campaignProgressSteps.map((item, index) => (
              <div key={`${item.task}-${index}`} className="flex items-center">
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
            <CustomButton text="Cancel" className="btn-cancel" onClick={handleCloseProgressModal} />
            <CustomButton
              text="Save Changes"
              className="btn-primary"
              onClick={handleCloseProgressModal}
            />
          </div>
        </div>
      </Modal>

      {/* Campaign Brief Modal */}
      <CampaignBriefModal
        show={showContentBrief}
        onClose={handleCloseContentBrief}
        campaign={campaign}
      />

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
        {...pickMessageThreadModalProps(messageThreadHook)}
      />
    </div>
  );
};

export default CampaignDetail;
