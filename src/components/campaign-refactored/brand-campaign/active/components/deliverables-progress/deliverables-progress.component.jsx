import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loading from "@/common/components/loader/loading.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { COMPENSATION_TYPE, SOURCE_PLATFORM } from "@/common/constants/campaign.constant";
import { formatDate } from "@/common/utils/formate-date";
import { Avatar } from "@mui/material";
import { Check, Copy, Edit2, MapPin, Star, Trash2, X } from "lucide-react";
import React, { useState } from "react";
import ContractPreviewModal from "../../../applications/components/contract-preview-modal/contract-preview-modal.component";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";
import DiscountCodeTracking from "./components/discount-code-tracking/discount-code-tracking.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({
  selectedCampaign,
  selectedCreator,
  isIndividualCreator = false,
  onClearCreator = null,
  showProfileClose = false,
  filters = { status: "HIRED", sort: "newest" },
  onPipelineUpdated = null,
}) => {
  const [showContractPreview, setShowContractPreview] = useState(false);

  const {
    messageThreadHook,
    handleMessageClick,
    creator,
    creatorUserId,
    formatShippingAddress,
    onCopyShippingAddress,
    isAddressCopied,
    privateNotes,
    editingNote,
    newNoteText,
    setNewNoteText,
    textareaKey,
    handleEditNote,
    handleSaveEditNote,
    handleCancelEditNote,
    handleDeleteNote,
    handleSaveNewNote,
    handleCancelNewNote,
    isNotesLoading,
    isCreateNoteLoading,
    isUpdateNoteLoading,
    isDeleteNoteLoading,
    isContractsLoading,
    isUpdateCampaignLoading,
    selectedContract,
    contracts,
    showMarkCompleteModal,
    isMarkingComplete,
    isMarkCompleteDisabled,
    markCompleteDisabledTitle,
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
    handleViewCreatorPortfolio,
    requiresCollaborationPayment,
  } = useDeliverablesProgress(
    selectedCampaign,
    selectedCreator,
    isIndividualCreator,
    onClearCreator,
    filters,
    onPipelineUpdated
  );

  const renderCampaignSelectionMessage = () => (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center px-4 text-center">
      <NotFound
        title="No Data Available"
        description="Please select a campaign and creator."
        className="flex-1 w-full !p-0"
      />
    </div>
  );

  const renderNoCreatorFound = () => (
    <div className="flex h-full min-h-0 w-full flex-1 items-center justify-center px-4 text-center">
      <NotFound
        title="No Data Available"
        description="Please select a campaign and creator."
        className="flex-1 w-full !p-0"
      />
    </div>
  );

  const renderCreatorProfile = () => (
    <div className="relative shrink-0 z-10 flex flex-col items-start gap-1 border-b border-gray-100 bg-white/95 px-2.5 pb-3 pt-3 text-left backdrop-blur-sm sm:items-center sm:px-3 sm:pb-4 sm:text-center">
      {showProfileClose && onClearCreator ? (
        <button
          type="button"
          onClick={onClearCreator}
          className="absolute right-2 top-2 z-20 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-50 sm:right-3 sm:top-3"
          aria-label="Close creator details"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
      <div className="relative self-center sm:self-auto">
        <Avatar
          src={creator?.image}
          alt={creator?.image}
          className="h-16 w-16 border-4 border-white shadow-md ring-2 ring-primary sm:h-20 sm:w-20"
        >
          {creator.name?.charAt(0) || "C"}
        </Avatar>
      </div>
      <h3 className="w-full text-center">
        <button
          type="button"
          onClick={handleViewCreatorPortfolio}
          className="text-sm font-semibold transition-colors hover:text-primary sm:text-lg"
        >
          {creator.name} -
        </button>
        <span className="ml-1 text-sm text-gray-500 sm:text-lg">{creator?.rating}</span>
        <span className="ml-1 text-sm text-gray-500 sm:text-lg">({creator?.reviewCount || 0})</span>
      </h3>
      <p className="-mt-1 flex w-full items-center justify-center gap-x-1 text-[10px] text-gray-500 sm:justify-center sm:text-sm">
        <span>{creator.age}</span>
        <span aria-hidden>•</span>
        <span>{creator.location}</span>
      </p>
      {/* Shipping Address Section - Replaces Bio on Active Campaign Screen */}
      {creator?.shippingAddress ? (
        <div className="mt-3 w-full">
          <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <h4 className="text-sm font-semibold text-gray-800">Shipping Address</h4>
            </div>
            <div className="mb-4 space-y-1.5">
              {formatShippingAddress(creator.shippingAddress)?.map((line, index) => (
                <div key={index} className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <p className="text-sm leading-relaxed text-gray-700">{line}</p>
                </div>
              ))}
            </div>
            <CustomButton
              text={isAddressCopied ? "Copied!" : "Copy Shipping Address"}
              className={`w-full text-xs ${
                isAddressCopied
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                  : "btn-secondary"
              }`}
              onClick={() => onCopyShippingAddress(creator.shippingAddress)}
              icon={isAddressCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              disabled={isAddressCopied}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3 w-full">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-sm italic text-gray-500">Shipping address not provided</p>
          </div>
        </div>
      )}
    </div>
  );

  const renderQuickActions = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Quick Actions</h4>
      <div className="flex flex-col gap-2 sm:flex-row">
        <CustomButton text="Message" className="btn-primary w-full" onClick={handleMessageClick} />
        <CustomButton
          text="Mark Complete"
          onClick={handleMarkCompleteClick}
          className={isMarkCompleteDisabled ? "btn-disabled w-full" : "btn-primary w-full"}
          disabled={isMarkCompleteDisabled}
          title={markCompleteDisabledTitle}
        />
      </div>
    </div>
  );

  const renderContractDetails = () => {
    if (isContractsLoading) {
      return (
        <div className="bg-white rounded border p-3">
          <Skeleton className="h-4 w-36 mb-2" />
          <div className="space-y-2 py-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-full" />
          </div>
        </div>
      );
    }

    if (!selectedContract) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
            Contract Agreement
          </h4>
          <p className="text-xs text-gray-500">No contract found for this creator</p>
        </div>
      );
    }

    const formatCompensation = () => {
      if (selectedContract.compensationType === COMPENSATION_TYPE.PAID) {
        return `$${selectedContract.totalCompensation || 0}`;
      } else if (selectedContract.compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT) {
        return `Gifted Product ($${selectedContract.productPrice || 0})`;
      } else if (selectedContract.compensationType === COMPENSATION_TYPE.COMMISSION) {
        return "Commission based";
      }
      return "Not specified";
    };

    return (
      <div className="bg-white rounded border p-3">
        <div className="mb-2 flex flex-nowrap items-baseline justify-between gap-2 border-b pb-2 sm:items-center">
          <h4 className="min-w-0 shrink text-sm font-semibold text-gray-800">Contract Agreement</h4>
          <button
            type="button"
            className="shrink-0 whitespace-nowrap text-left text-[10px] font-semibold text-primary hover:underline sm:text-sm sm:text-right"
            onClick={() => setShowContractPreview(true)}
          >
            View Full Contract
          </button>
        </div>
        <ul className="space-y-2 text-xs text-gray-600">
          {selectedContract.contentFormat?.split(",").map((deliverable, index) => {
            return (
              <li key={index} className="flex items-center justify-between">
                <span>{deliverable.trim()}</span>
              </li>
            );
          })}
          <li className="flex items-center justify-between">
            <span>
              Deadline:
              <span className="font-medium ml-1">
                {formatDate(selectedContract.completionDeadline)}
              </span>
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>
              Payment: <span className="font-medium">{formatCompensation()}</span>
            </span>
          </li>
          {selectedContract.usageRights && (
            <li className="flex items-center justify-between">
              <span>
                Usage Rights:{" "}
                <span className="font-medium">
                  {selectedContract.usageRights
                    ? selectedContract.usageRights?.split("_").join(" ")
                    : "None"}
                </span>
              </span>
            </li>
          )}
          {selectedContract.exclusivityClause && (
            <li className="flex items-center justify-between">
              <span>
                Exclusivity:{" "}
                <span className="font-medium">
                  {selectedContract.exclusivityClause
                    ? selectedContract.exclusivityClause?.split("_").join(" ")
                    : "None"}
                </span>
              </span>
            </li>
          )}
          {selectedContract.revisionsLimit && (
            <li className="flex items-center justify-between">
              <span>
                Revisions: <span className="font-medium">{selectedContract.revisionsLimit}</span>
              </span>
            </li>
          )}
        </ul>
      </div>
    );
  };

  const renderTimeline = () => {
    if (selectedCampaign?.source_platform === SOURCE_PLATFORM.OTHER) {
      return null;
    }

    const campaignId = isIndividualCreator
      ? selectedCreator?.campaign_id ||
        selectedCreator?.campaign?.id ||
        selectedCreator?.contract?.campaignId
      : selectedCampaign?.id;

    if (!campaignId) {
      return null;
    }

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
        <BrandTimelineSteps
          campaignId={campaignId}
          creatorId={creatorUserId}
          onPipelineUpdated={onPipelineUpdated}
          onWorkflowComplete={handleMarkCompleteClick}
        />
      </div>
    );
  };

  const renderNotes = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Campaign Notes</h4>
      {isNotesLoading ? (
        <div className="space-y-2 py-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ) : (
        <div className="space-y-2 text-xs text-gray-700 mb-3">
          {privateNotes && privateNotes.length > 0 ? (
            privateNotes.map((note, index) => (
              <div key={note.id || index} className="border-l-2 border-indigo-500 pl-3 py-1 group">
                <div className="flex justify-between items-start border-b pb-1">
                  <div className="flex flex-col flex-1">
                    <span>{note.text || note.note}</span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {note.created_at ? formatDate(note.created_at) : formatDate(note.timestamp)}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit note"
                    >
                      <Edit2 className="w-3 h-3 text-indigo-500" />
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={isDeleteNoteLoading}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete note"
                    >
                      {isDeleteNoteLoading ? (
                        <Loading />
                      ) : (
                        <Trash2 className="w-3 h-3 text-red-500" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-gray-500">No notes yet.</p>
          )}
        </div>
      )}
      <React.Fragment>
        <TextArea
          key={`note-textarea-${editingNote || "new"}-${textareaKey}`}
          label={editingNote ? "Edit note..." : "Add a new note"}
          value={newNoteText || ""}
          onChange={(e) => setNewNoteText(e.target.value)}
          className="text-xs"
          rows={2}
          placeholder="Type your note here"
        />
        <div className="flex justify-end gap-2 mt-2">
          <CustomButton
            text="Cancel"
            className="btn-cancel text-xs py-1 px-2"
            onClick={editingNote ? handleCancelEditNote : handleCancelNewNote}
          />
          <CustomButton
            text={
              isCreateNoteLoading || isUpdateNoteLoading ? (
                <Loading />
              ) : editingNote ? (
                "Update"
              ) : (
                "Save"
              )
            }
            className="btn-primary text-xs py-1 px-2"
            onClick={editingNote ? () => handleSaveEditNote(editingNote) : handleSaveNewNote}
            disabled={!newNoteText.trim() || isCreateNoteLoading || isUpdateNoteLoading}
          />
        </div>
      </React.Fragment>
    </div>
  );

  if (!selectedCampaign) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col border-l border-gray-200 bg-white">
        {renderCampaignSelectionMessage()}
      </div>
    );
  }

  if (selectedCreator === null || selectedCreator === undefined) {
    return (
      <div className="flex min-h-0 w-full flex-1 flex-col border-l border-gray-200 bg-white">
        {renderNoCreatorFound()}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden border-l border-gray-200 bg-white">
      {selectedCampaign && selectedCreator && creator && creator.id !== "unknown" && (
        <>
          {renderCreatorProfile()}
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain p-3 sm:gap-4 sm:p-4">
            {renderQuickActions()}
            {renderContractDetails()}
            {selectedContract ? (
              <DiscountCodeTracking
                selectedCampaign={selectedCampaign}
                selectedContract={selectedContract}
                isManageEnabled
                title="Discount code"
              />
            ) : null}
            {renderTimeline()}
            {renderNotes()}
          </div>
          <MessageThreadModal
            isOpen={messageThreadHook.isModalOpen}
            onClose={messageThreadHook.closeMessageModal}
            creator={creator}
            messages={messageThreadHook.messages}
            newMessage={messageThreadHook.newMessage}
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
          <Modal
            show={showMarkCompleteModal}
            onClose={handleCancelMarkComplete}
            title={`Leave a review for ${creator.name}`}
            size="md"
          >
            <div className="p-4">
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Your review helps other brands on CleerCut choose creators with confidence.
                </p>
                <div className="flex justify-between items-center bg-gray-200 p-2 rounded-lg">
                  <label className="block text-base font-medium text-gray-700">Rating</label>

                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 cursor-pointer transition-colors ${
                          i < markCompleteRating ? "text-yellow-400 fill-current" : "text-gray-500"
                        }`}
                        onClick={() => setMarkCompleteRating(i + 1)}
                      />
                    ))}
                  </div>
                </div>
                {markCompleteRating > 0 && (
                  <span className="flex justify-end text-xs text-gray-600 ml-2 mt-1.5">
                    You rated {creator.name} with {markCompleteRating}/5
                  </span>
                )}
                <div className="mb-4">
                  <TextArea
                    label="Feedback"
                    placeholder="Share your experience working with this creator..."
                    value={markCompleteFeedback}
                    onChange={(e) => setMarkCompleteFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Notice:</span>{" "}
                    {requiresCollaborationPayment
                      ? "This completes the collaboration on your side. Payout to the creator runs after they submit their review and funds have finished settling."
                      : "This completes the collaboration on your side."}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <CustomButton
                  text="Cancel"
                  className="btn-cancel flex-1"
                  onClick={handleCancelMarkComplete}
                  disabled={isMarkingComplete || isUpdateCampaignLoading}
                />
                <CustomButton
                  text="Mark Complete"
                  className="btn-primary flex-1"
                  onClick={handleConfirmMarkComplete}
                  disabled={
                    !markCompleteFeedback ||
                    isMarkingComplete ||
                    isUpdateCampaignLoading ||
                    markCompleteRating === 0
                  }
                  loading={isMarkingComplete || isUpdateCampaignLoading}
                />
              </div>
            </div>
          </Modal>
          {selectedContract && (
            <ContractPreviewModal
              show={showContractPreview}
              onClose={() => setShowContractPreview(false)}
              contractData={{
                brandName: `${selectedContract?.brand?.brand_profile?.brand_name}` || "Brand",
                creatorName: creator?.name || "Creator",
                campaignTitle: selectedCampaign?.campaign_title || "Campaign",
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
                  selectedCampaign?.product_value?.toString() ||
                  selectedContract.productValue?.toString() ||
                  selectedContract.product_value?.toString(),
                usageRights: selectedContract.usageRights || selectedContract.usage_rights,
                exclusivityClause:
                  selectedContract.exclusivityClause || selectedContract.exclusivity_clause,
                additionalClauseTitle: selectedContract.additionalClauseTitle,
                additionalClauseBody: selectedContract.additionalClauseBody,
                customerDiscountPercent:
                  selectedContract.customerDiscountPercent ||
                  selectedContract.customer_discount_percent ||
                  selectedCampaign?.customer_discount_percent,
              }}
              creatorData={creator}
              campaignData={selectedCampaign}
              contractId={selectedContract.id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeliverablesProgress;
