import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { COMPENSATION_TYPE, SOURCE_PLATFORM } from "@/common/constants/campaign.constant";
import { Avatar } from "@mui/material";
import { Edit2, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import MessageThreadModal from "@/components/campaign-refactored/shared/message-thread-modal/message-thread-modal.component";
import { pickMessageThreadModalProps } from "@/components/campaign-refactored/shared/message-thread-modal/use-message-thread.hook";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";
import useDeliverablesProgress from "../../../active/components/deliverables-progress/use-deliverables-progress.hook";
import { formatDate } from "@/common/utils/formate-date";
import ContractPreviewModal from "../../../applications/components/contract-preview-modal/contract-preview-modal.component";
import { getUser } from "@/common/utils/users.util";

const DeliverablesProgressCompleted = ({
  selectedCampaign,
  selectedCreator,
  isIndividualCreator = false,
  onClearCreator = null,
  filters = { status: "COMPLETED", sort: "newest" },
}) => {
  const [showContractPreview, setShowContractPreview] = useState(false);
  const user = getUser();

  const {
    messageThreadHook,
    handleMessageClick,
    creator,
    creatorUserId,
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
    selectedContract,
    contracts,
    campaignReviews,
    reviewStatus,
    isReviewsLoading,
    handleViewCreatorPortfolio,
  } = useDeliverablesProgress(
    selectedCampaign,
    selectedCreator,
    isIndividualCreator,
    onClearCreator,
    filters
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
    <div className="shrink-0 z-10 flex flex-col items-center gap-1 border-b border-gray-100 bg-white/95 px-3 pb-3 pt-3 backdrop-blur-sm sm:pb-4">
      <div className="relative">
        <Avatar
          src={creator?.image || avatar}
          alt={creator?.name}
          className="h-16 w-16 border-4 border-white shadow-md ring-2 ring-primary sm:h-20 sm:w-20"
        >
          {creator?.name?.charAt(0) || "C"}
        </Avatar>
      </div>
      <h3 className="text-center">
        <button
          type="button"
          onClick={handleViewCreatorPortfolio}
          className="text-base transition-colors hover:text-primary sm:text-lg"
        >
          {creator?.name}
        </button>
        <span className="ml-1 text-base text-gray-500 sm:text-lg">{creator?.rating}</span>
        <span className="ml-1 text-base text-gray-500 sm:text-lg">
          ({creator?.reviewCount || 0})
        </span>
      </h3>
      <p className="-mt-1 flex flex-wrap items-center justify-center gap-x-1 text-xs text-gray-500 sm:text-sm">
        <span>{creator?.age}</span>
        <span aria-hidden>•</span>
        <span className="max-w-[min(100%,20rem)] break-words text-center">{creator?.location}</span>
      </p>
      <p className="-mt-1 max-w-full px-1 text-center text-xs leading-relaxed text-gray-500 sm:text-sm">
        {creator?.bio}
      </p>
      <div className="mt-2 rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white">
        Campaign Completed
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Quick Actions</h4>
      <CustomButton
        text="Message"
        className="btn-primary min-h-8 w-full !text-[11px] sm:min-h-9 sm:!text-xs md:!text-sm"
        onClick={handleMessageClick}
      />
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
        return `Gifted Product ($${selectedContract.productPrice || selectedContract.productValue || 0})`;
      } else if (selectedContract.compensationType === COMPENSATION_TYPE.COMMISSION) {
        return "Commission based";
      }
      return "Not specified";
    };

    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3">
        <div className="mb-2 flex flex-nowrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
          <h4 className="min-w-0 flex-1 truncate pr-1 text-xs font-semibold text-gray-900 sm:text-sm">
            Contract Agreement
          </h4>
          <button
            type="button"
            className="max-w-[48%] shrink-0 text-right text-[11px] font-semibold leading-tight text-primary underline-offset-2 hover:underline sm:max-w-none sm:text-sm"
            onClick={() => setShowContractPreview(true)}
          >
            View Full Contract
          </button>
        </div>
        <ul className="space-y-2 text-xs text-gray-600">
          {selectedContract.contentFormat?.split(",").map((deliverable, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{deliverable.trim()}</span>
            </li>
          ))}
          <li className="flex items-center justify-between">
            <span>
              Completed:
              <span className="font-medium ml-1">
                {formatDate(selectedContract.completionDeadline)}
              </span>
            </span>
          </li>
          <li className="flex items-center justify-between">
            <span>
              Payment: <span className="font-medium">{formatCompensation()}</span>
              <span className="text-green-600 text-xs ml-1">(Paid)</span>
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

    const creatorUserId = isIndividualCreator
      ? selectedCreator?.creatorUserId || selectedCreator?.creator?.id || selectedCreator?.id
      : selectedCreator?.creator?.id || selectedCreator?.creator_id;

    if (!creatorUserId) {
      return null;
    }

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
        <BrandTimelineSteps campaignId={campaignId} creatorId={creatorUserId} />
      </div>
    );
  };

  const renderReviews = () => {
    if (isReviewsLoading) {
      return (
        <div className="bg-white rounded border p-3">
          <Skeleton className="h-4 w-20 mb-2" />
          <div className="space-y-2 py-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      );
    }

    if (!reviewStatus) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
          <p className="text-xs text-gray-500">No reviews available.</p>
        </div>
      );
    }

    if (!reviewStatus.isUnlocked && reviewStatus.hasBrandReview && !reviewStatus.hasCreatorReview) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-semibold text-amber-800">Review Locked</span>
            </div>
            <p className="text-[11px] text-amber-700 mt-1">
              Your review has been locked. Wait for creator to give review so that your review gets
              unlocked.
            </p>
          </div>
        </div>
      );
    }

    const filteredReviews =
      campaignReviews?.filter((review) => {
        if (!reviewStatus.isUnlocked) {
          return review.created_by?.id === user?.id;
        } else {
          return review.reviewer_role === "CREATOR";
        }
      }) || [];

    if (reviewStatus.isUnlocked && filteredReviews.length > 0) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
          <div className="space-y-2">
            {filteredReviews.map((review, index) => (
              <div key={review.id || index} className="border-l-2 border-indigo-500 pl-3 py-1">
                <span className="text-[10px] font-semibold text-gray-500 mb-1 block">
                  Creator's Review
                </span>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-700">{review.review || review.text}</p>
                <span className="text-[11px] text-gray-400 mt-0.5 block">
                  {review.created_at ? formatDate(review.created_at) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
        <p className="text-xs text-gray-500">No reviews available.</p>
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
                    <span>{note.note || note.text}</span>
                    <span className="text-xs text-gray-400 mt-0.5">
                      {note.created_at ? formatDate(note.created_at) : formatDate(note.timestamp)}
                    </span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditNote(note)}
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
                        <Loader loading={true} />
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
          key={`note-textarea-${editingNote?.id || "new"}-${textareaKey}`}
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
                <Loader loading={true} />
              ) : editingNote ? (
                "Update"
              ) : (
                "Save"
              )
            }
            className="btn-primary text-xs py-1 px-2"
            onClick={editingNote ? () => handleSaveEditNote(editingNote.id) : handleSaveNewNote}
            disabled={!newNoteText?.trim() || isCreateNoteLoading || isUpdateNoteLoading}
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
            {renderTimeline()}
            {renderReviews()}
            {renderNotes()}
          </div>
          <MessageThreadModal
            isOpen={messageThreadHook?.isModalOpen}
            onClose={messageThreadHook?.closeMessageModal}
            creator={creator}
            messages={messageThreadHook?.messages || []}
            newMessage={messageThreadHook?.newMessage || ""}
            setNewMessage={messageThreadHook?.setNewMessage}
            sendMessage={messageThreadHook?.sendMessage}
            isSending={messageThreadHook?.isSending}
            isLoading={messageThreadHook?.isLoading}
            isCreatorOnline={messageThreadHook?.isCreatorOnline}
            isCreatorTyping={messageThreadHook?.isCreatorTyping}
            messagesEndRef={messageThreadHook?.messagesEndRef}
            messagesContainerRef={messageThreadHook?.messagesContainerRef}
            {...pickMessageThreadModalProps(messageThreadHook ?? {})}
          />
          {showContractPreview && selectedContract && (
            <ContractPreviewModal
              show={showContractPreview}
              onClose={() => setShowContractPreview(false)}
              contractData={{
                brandName: `${selectedContract?.brand?.brand_profile?.brand_name}` || "Brand",
                creatorName: creator?.name || "Creator",
                campaignTitle:
                  selectedCampaign?.campaign_title || selectedCampaign?.title || "Campaign",
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
                hashtags: selectedContract.hashtags,
                mentions: selectedContract.mentions,
              }}
              creatorData={user}
              campaignData={selectedCampaign}
              contractId={selectedContract.id}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DeliverablesProgressCompleted;
