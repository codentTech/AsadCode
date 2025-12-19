import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loadar/loading.component";
import { product } from "@/common/constants/auth.constant";
import { formatDate } from "@/common/utils/formate-date";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, ExternalLink, File, X } from "lucide-react";
import CampaignBriefModal from "../../../../applications/creator/components/campaign-brief-modal/campaign-brief-modal.component";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import CreatorTimelineSteps from "../creator-timeline/creator-timeline";
import useCampaignDetail from "./use-campaign-detail.hook";
import ContractPreviewModal from "../../../../applications/brand/components/contract-preview-modal/contract-preview-modal.component";
import { getUser } from "@/common/utils/users.util";

const CampaignDetail = ({ selectedCampaign, isLoading }) => {
  const {
    // State
    showContentBrief,
    showContractModal,
    expandedSections,
    campaign,
    campaignInfo,

    // Computed
    isCleerCutCampaign,
    typeStyle,
    formattedType,
    creator,

    // Message thread
    messageThreadHook,

    // Handlers
    handleMessageClick,
    toggleSection,
    handleCloseContentBrief,
    handleOpenContentBrief,
    handleOpenContractModal,
    handleCloseContractModal,
  } = useCampaignDetail(selectedCampaign);

  const user = getUser();

  // Find the signed contract for the current creator
  const selectedContract = React.useMemo(() => {
    if (!campaign?.campaign?.contracts || !Array.isArray(campaign.campaign.contracts)) {
      return campaign?.contract || null;
    }

    // For multi-creator campaigns, find the signed contract for this creator
    const signedContract = campaign.campaign.contracts.find(
      (contract) =>
        contract.status === "signed" &&
        (contract.creator_id === user?.id || contract.creatorId === user?.id)
    );

    return signedContract || campaign.campaign.contracts[0] || campaign?.contract || null;
  }, [campaign, user?.id]);

  // Loading state
  if (!isLoading) <Loading />;

  // No campaign selected state
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
                  <span>{formatDate(campaign.application_deadline)}</span>
                </div>
              </div>
            </div>

            {/* Campaign Type Badge and Compensation */}
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
              <div
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {formattedType}
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
                      <div className="space-y-2">
                        <p className="text-xs text-gray-600 whitespace-pre-wrap">
                          {campaignInfo.styleGuide.text}
                        </p>
                        {campaignInfo.styleGuide.style_guide_file && (
                          <a
                            href={campaignInfo.styleGuide.style_guide_file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium transition-colors cursor-pointer group"
                          >
                            <File className="w-4 h-4" />
                            <span>
                              {campaignInfo.styleGuide.style_guide_file
                                .split("/")
                                .pop()
                                .split("?")[0] || "View Style Guide File"}
                            </span>
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                      </div>
                    ) : campaignInfo.styleGuide.style_guide_file ? (
                      <div>
                        <a
                          href={campaignInfo.styleGuide.style_guide_file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs text-blue-700 font-medium transition-colors cursor-pointer group"
                        >
                          <File className="w-4 h-4" />
                          <span>
                            {campaignInfo.styleGuide.style_guide_file
                              .split("/")
                              .pop()
                              .split("?")[0] || "View Style Guide File"}
                          </span>
                          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
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
              <div className="flex-shrink-0">
                <img
                  src={campaign?.campaign?.campaign_image}
                  alt="Campaign Product"
                  className="w-36 h-36 rounded-lg object-cover border border-gray-200"
                />
              </div>
            )}
          </div>

          {/* Deliverables */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h3>
            <div className="bg-gray-100 rounded-lg p-3">
              <div className="flex flex-wrap gap-1">
                {campaign.deliverables?.map((item, index) => (
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

          {/* Action Buttons */}
          <div
            className={`grid ${
              isCleerCutCampaign && selectedContract
                ? "grid-cols-3"
                : isCleerCutCampaign
                  ? "grid-cols-2"
                  : "grid-cols-1"
            } gap-2 pt-2`}
          >
            {isCleerCutCampaign && (
              <>
                {selectedContract && (
                  <CustomButton
                    text="View Full Contract"
                    className="btn-outline text-xs w-full"
                    onClick={handleOpenContractModal}
                  />
                )}
                <CustomButton
                  text="Message"
                  className="btn-primary text-xs"
                  onClick={handleMessageClick}
                />
              </>
            )}
            <CustomButton
              text="View Brief"
              className="btn-outline text-xs"
              onClick={handleOpenContentBrief}
            />
          </div>

          {/* Campaign Progress - Only for CleerCut campaigns */}
          {isCleerCutCampaign && (
            <CreatorTimelineSteps
              campaignId={campaign?.id}
              deadline={campaign?.campaign_deadline || campaign?.application_deadline}
            />
          )}
        </div>
      </div>

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
      />

      {/* Contract Preview Modal */}
      {showContractModal && selectedContract && (
        <ContractPreviewModal
          show={showContractModal}
          onClose={handleCloseContractModal}
          contractData={{
            brandName:
              campaign?.campaign?.created_by?.first_name &&
              campaign?.campaign?.created_by?.last_name
                ? `${campaign.campaign.created_by.first_name} ${campaign.campaign.created_by.last_name}`
                : campaign?.campaign?.created_by?.first_name || "Brand",
            creatorName:
              user?.first_name && user?.last_name
                ? `${user.first_name} ${user.last_name}`
                : user?.first_name || "Creator",
            campaignTitle: campaign?.campaign?.campaign_title || campaign?.title || "Campaign",
            startDate: selectedContract.startDate || selectedContract.start_date,
            completionDeadline:
              selectedContract.completionDeadline || selectedContract.completion_deadline,
            contentFormat: selectedContract.contentFormat || selectedContract.content_format,
            revisionsLimit:
              selectedContract.revisionsLimit || selectedContract.revisions_limit || "2",
            compensationType:
              selectedContract.compensationType || selectedContract.compensation_type,
            totalCompensation:
              selectedContract.totalCompensation?.toString() ||
              selectedContract.total_compensation?.toString(),
            productPrice:
              selectedContract.productPrice?.toString() ||
              selectedContract.product_price?.toString(),
            productValue:
              campaign?.campaign?.product_value?.toString() ||
              selectedContract.productValue?.toString() ||
              selectedContract.product_value?.toString(),
            usageRights: selectedContract.usageRights || selectedContract.usage_rights,
            exclusivityClause:
              selectedContract.exclusivityClause || selectedContract.exclusivity_clause,
            hashtags: selectedContract.hashtags,
            mentions: selectedContract.mentions,
          }}
          creatorData={user}
          campaignData={campaign?.campaign || campaign}
          contractId={selectedContract.id}
        />
      )}
    </div>
  );
};

export default CampaignDetail;
