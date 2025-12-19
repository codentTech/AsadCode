import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { COMPENSATION_TYPE, SOURCE_PLATFORM } from "@/common/constants/campaign.constant";
import { Avatar } from "@mui/material";
import { Edit2, Star, Trash2 } from "lucide-react";
import React, { useState } from "react";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";
import useDeliverablesProgress from "../../../../active/brand/components/deliverables-progress/use-deliverables-progress.hook";
import { formatDate } from "@/common/utils/formate-date";
import ContractPreviewModal from "../../../../applications/brand/components/contract-preview-modal/contract-preview-modal.component";
import { getUser } from "@/common/utils/users.util";

const DeliverablesProgressCompleted = ({
  selectedCampaign,
  selectedCreator,
  isIndividualCreator = false,
  isLoading: parentLoading = false,
}) => {
  const [showContractPreview, setShowContractPreview] = useState(false);
  const user = getUser();

  const {
    messageThreadHook,
    handleMessageClick,
    creator,
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
  } = useDeliverablesProgress(selectedCampaign, selectedCreator, isIndividualCreator);

  const renderCampaignSelectionMessage = () => (
    <div className="py-16">
      <NotFound
        title="No Campaign Selected"
        description="Select a campaign from the list to view creator details."
      />
    </div>
  );

  const renderNoCreatorFound = () => (
    <div className="py-16">
      <NotFound
        title="No Creator Found"
        description="No creators have completed this campaign yet."
      />
    </div>
  );

  const renderLoading = () => (
    <div className="py-16 flex flex-col items-center justify-center">
      <Loader loading={true} />
      <p className="text-sm text-gray-500 mt-2">Loading creator details...</p>
    </div>
  );

  const renderCreatorProfile = () => (
    <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-1 top-0 bg-white z-10">
      <div className="relative">
        <Avatar
          src={creator?.image || avatar}
          alt={creator?.name}
          className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
        >
          {creator?.name?.charAt(0) || "C"}
        </Avatar>
      </div>
      <h3>
        {creator?.name}
        <span className="text-lg text-gray-500 ml-1">{creator?.rating}</span>
        <span className="text-lg text-gray-500 ml-1">({creator?.reviewCount || 0})</span>
      </h3>
      <p className="flex items-center text-sm text-gray-500 -mt-1">
        {creator?.age} • <span className="ml-1">{creator?.location}</span>
      </p>
      <p className="text-sm text-gray-500 -mt-1">{creator?.bio}</p>
      <div className="mt-2 px-3 py-1 bg-primary text-white rounded-lg text-xs font-medium">
        Campaign Completed
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h4>
      <div className="flex gap-2">
        <CustomButton text="Message" className="btn-primary w-full" onClick={handleMessageClick} />
      </div>
    </div>
  );

  const renderContractDetails = () => {
    if (isContractsLoading) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
            Contract Agreement
          </h4>
          <div className="flex justify-center py-3">
            <Loader loading={true} />
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
        return `Product ($${selectedContract.productPrice || selectedContract.productValue || 0})`;
      } else if (selectedContract.compensationType === COMPENSATION_TYPE.COMMISSION) {
        return "Commission based";
      }
      return "Not specified";
    };

    return (
      <div className="bg-white rounded border p-3">
        <div className="flex justify-between items-center pb-2 mb-2 border-b">
          <h4 className="text-sm font-semibold text-gray-800">Contract Agreement</h4>
          <h4
            className="text-sm font-semibold text-primary cursor-pointer hover:underline"
            onClick={() => setShowContractPreview(true)}
          >
            View Full Contract
          </h4>
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
                  {selectedContract.usageRights?.split("_").join(" ")}
                </span>
              </span>
            </li>
          )}
          {selectedContract.exclusivityClause && (
            <li className="flex items-center justify-between">
              <span>
                Exclusivity:{" "}
                <span className="font-medium">
                  {selectedContract.exclusivityClause?.split("_").join(" ")}
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
        <BrandTimelineSteps campaignId={campaignId} contracts={contracts} />
      </div>
    );
  };

  const renderReviews = () => {
    if (isReviewsLoading) {
      return (
        <div className="bg-white rounded border p-3">
          <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
          <div className="flex justify-center py-3">
            <Loader loading={true} />
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
        <div className="flex justify-center py-3">
          <Loader loading={true} />
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

  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {!selectedCampaign && renderCampaignSelectionMessage()}
      {selectedCampaign && parentLoading && renderLoading()}
      {selectedCampaign && !parentLoading && !selectedCreator && renderNoCreatorFound()}
      {selectedCampaign &&
        !parentLoading &&
        selectedCreator &&
        creator &&
        creator.id !== "unknown" && (
          <>
            {renderCreatorProfile()}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
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
            />
            {showContractPreview && selectedContract && (
              <ContractPreviewModal
                show={showContractPreview}
                onClose={() => setShowContractPreview(false)}
                contractData={{
                  brandName:
                    selectedCampaign?.created_by?.first_name &&
                    selectedCampaign?.created_by?.last_name
                      ? `${selectedCampaign.created_by.first_name} ${selectedCampaign.created_by.last_name}`
                      : selectedCampaign?.created_by?.first_name || "Brand",
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
