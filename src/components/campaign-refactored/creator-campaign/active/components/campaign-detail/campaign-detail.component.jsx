import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loader/loading.component";
import { formatDate } from "@/common/utils/formate-date";
import { getUser } from "@/common/utils/users.util";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, ExternalLink, File, X } from "lucide-react";
import React from "react";
import ContractPreviewModal from "@/components/campaign-refactored/brand-campaign/applications/components/contract-preview-modal/contract-preview-modal.component";
import CampaignBriefModal from "../../../applications/components/campaign-brief-modal/campaign-brief-modal.component";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import { getBrandDisplayNameForContract } from "@/common/utils/brand-display.util";

import CreatorTimelineSteps from "../creator-timeline/creator-timeline.component";
import useCampaignDetail from "./use-campaign-detail.hook";

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
    compensationAmount,
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

  const contractPreviewBrandName = React.useMemo(() => {
    const fromContract =
      selectedContract?.brand?.brand_profile?.brand_name ||
      selectedContract?.brand?.brand_profile?.brandName;
    if (fromContract && String(fromContract).trim()) return String(fromContract).trim();
    const fromCampaign = getBrandDisplayNameForContract(campaign?.campaign || null);
    return fromCampaign === "[Brand Name]" ? "Brand" : fromCampaign;
  }, [selectedContract, campaign]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center bg-white border-x md:h-screen">
        <Loading />
      </div>
    );
  }

  // No campaign selected state
  if (!campaign) {
    return (
      <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white border-x md:h-screen">
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
    <div className="flex h-full w-full flex-1 flex-col overflow-y-auto bg-white border-x md:h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-3 pb-20 sm:p-4">
          {/* Header Section */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="h-14 w-14 flex-shrink-0 rounded-lg border border-gray-200 bg-gray-100 sm:h-16 sm:w-16">
                <img src={campaign.logo} alt="Brand Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">{campaign.brand}</h2>
                <p className="text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">{campaign.title}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-gray-500 sm:text-xs">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(campaign.application_deadline)}</span>
                </div>
              </div>
            </div>

            {/* Campaign Type Badge and Compensation */}
            <div className="flex flex-shrink-0 flex-row items-center justify-between gap-2 sm:flex-col sm:items-end">
              <div
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] font-medium sm:px-3 sm:py-1.5 sm:text-xs ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
              >
                {formattedType}
              </div>
              <div className="flex items-center gap-2 text-left text-[10px] font-semibold text-gray-900 sm:text-xs">
                <div>{campaign.compensation} -</div>
                <div>{campaign?.compensationAmount || compensationAmount(campaign)}</div>
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
                ? "grid-cols-1 sm:grid-cols-3"
                : isCleerCutCampaign
                  ? "grid-cols-1 sm:grid-cols-2"
                  : "grid-cols-1"
            } gap-2 pt-2`}
          >
            {isCleerCutCampaign && (
              <>
                {selectedContract && (
                  <CustomButton
                    text="View Full Contract"
                    className="btn-outline w-full"
                    onClick={handleOpenContractModal}
                  />
                )}
                <CustomButton
                  text="Message"
                  className="btn-primary"
                  onClick={handleMessageClick}
                />
              </>
            )}
            <CustomButton
              text="View Brief"
              className="btn-outline"
              onClick={handleOpenContentBrief}
            />
          </div>

          {/* Campaign Progress - Only for CleerCut campaigns */}
          {isCleerCutCampaign && (
            <CreatorTimelineSteps
              campaignId={campaign?.id}
              deadline={campaign?.campaign_deadline || campaign?.application_deadline}
              revisionsLimit={
                campaign?.contract?.revisionsLimit || campaign?.contract?.revisions_limit || 2
              }
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
        {...pickMessageThreadModalProps(messageThreadHook)}
      />

      {/* Contract Preview Modal */}
      {showContractModal && selectedContract && (
        <ContractPreviewModal
          show={showContractModal}
          onClose={handleCloseContractModal}
          contractData={{
            brandName: contractPreviewBrandName,
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
