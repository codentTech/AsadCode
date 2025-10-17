import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import useDeliverablesProgress from "../../../../active/brand/components/deliverables-progress/use-deliverables-progress.hook";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";

const DeliverablesProgressCompleted = ({ selectedCampaign, selectedCreator }) => {
  // ==================== HOOK USAGE ====================
  const {
    // Message thread integration
    messageThreadHook,
    creator,

    // Project management
    project,
    editingItem,
    editForm,
    setEditForm,
    handleEdit,
    handleSave,
    handleCancel,
    toggleDeliverable,
    toggleTimelineStep,

    // Reviews
    campaignReviews,
    editingReview,
    editReviewForm,
    setEditReviewForm,
    newReviewText,
    setNewReviewText,
    newReviewRating,
    setNewReviewRating,
    handleEditReview,
    handleSaveEditReview,
    handleCancelEditReview,
    handleDeleteReview,
    handleSaveNewReview,
    handleCancelNewReview,

    // Notes
    privateNotes,
    editingNote,
    editNoteForm,
    setEditNoteForm,
    newNoteText,
    setNewNoteText,
    handleEditNote,
    handleSaveEditNote,
    handleCancelEditNote,
    handleDeleteNote,
    handleSaveNewNote,
    handleCancelNewNote,

    // Loading states
    isReviewsLoading,
    isCreateReviewLoading,
    isUpdateReviewLoading,
    isDeleteReviewLoading,
    isNotesLoading,
    isCreateNoteLoading,
    isUpdateNoteLoading,
    isDeleteNoteLoading,
    isContractsLoading,
    isUpdateCampaignLoading,

    // Contract data
    selectedContract,
    contracts,

    // Mark Complete functionality
    showMarkCompleteModal,
    isMarkingComplete,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,

    // Helper functions
    getStatusColor,
    getStatusIcon,

    // Review status for double-blind functionality
    reviewStatus,
  } = useDeliverablesProgress(selectedCampaign?.id, selectedCampaign, selectedCreator);

  // ==================== RENDER HELPERS ====================
  const renderCampaignSelectionMessage = () => (
    <div className="py-16">
      <NotFound
        title="No Campaign Selected"
        description="Select a completed campaign from the list to view creator details and deliverables."
      />
    </div>
  );

  const renderCreatorSelectionMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center px-3">
      <Loader loading={true} />
      <p className="text-sm text-gray-500 mt-3">Loading creators...</p>
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

  const renderCreatorProfile = () => (
    <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-2 top-0 bg-white z-10">
      <div className="relative">
        <Avatar
          src={creator?.image || avatar}
          alt={creator?.image || avatar}
          className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
        >
          {creator.name?.charAt(0) || "C"}
        </Avatar>
        <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{creator.name}</h3>

      <p className="text-xs text-gray-600 text-center line-clamp-2 px-2">{creator.bio}</p>

      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(creator.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <MapPin className="w-4 h-4" />
        <span>{creator.location}</span>
      </div>

      <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
        Campaign Completed
      </div>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h4>
      <div className="flex gap-2">
        <CustomButton
          text="Message"
          className="btn-outline w-full"
          onClick={messageThreadHook.openMessageModal}
        />
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

    const formatDate = (dateString) => {
      if (!dateString) return "Not set";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const formatCompensation = () => {
      if (selectedContract.compensationType === "PAID") {
        return `$${selectedContract.totalCompensation || 0}`;
      } else if (selectedContract.compensationType === "GIFTED_PRODUCT") {
        return `Product ($${selectedContract.productPrice || 0})`;
      } else if (selectedContract.compensationType === "COMMISSION") {
        return "Commission based";
      }
      return "Not specified";
    };

    const getDeliverables = () => {
      // Parse content format to extract deliverables
      if (selectedContract.contentFormat) {
        // Handle the specific format: "Quantity (1) Deliverable 'instagram post', Quantity (2) Deliverable 'instagram reel'"
        const deliverables = selectedContract.contentFormat.split(",").map((item) => {
          const trimmed = item.trim();
          // Extract quantity and deliverable name
          const match = trimmed.match(/Quantity \((\d+)\) Deliverable '([^']+)'/);
          if (match) {
            const quantity = match[1];
            const deliverable = match[2];
            return `${quantity} ${deliverable}`;
          }
          return trimmed;
        });
        return deliverables;
      }
      return ["Content deliverables"];
    };

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">
          Contract Agreement
        </h4>
        <ul className="space-y-2 text-xs text-gray-600">
          {getDeliverables().map((deliverable, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{deliverable}</span>
              <CheckCircle2 className="w-3 h-3 text-green-500" />
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
                Usage Rights: <span className="font-medium">{selectedContract.usageRights}</span>
              </span>
            </li>
          )}
          {selectedContract.exclusivityClause && (
            <li className="flex items-center justify-between">
              <span>
                Exclusivity:{" "}
                <span className="font-medium">{selectedContract.exclusivityClause}</span>
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

  const renderTimeline = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
      <BrandTimelineSteps />
    </div>
  );

  const renderNotes = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Campaign Notes</h4>
      {isNotesLoading ? (
        <div className="flex justify-center py-3">
          <Loader loading={true} />
        </div>
      ) : (
        <div className="space-y-2 text-xs text-gray-700 mb-3">
          {privateNotes.map((note, index) => (
            <div key={note.id || index} className="border-l-2 border-indigo-500 pl-3 py-1 group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col flex-1">
                  <span>{note.text}</span>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {note.created_at
                      ? new Date(note.created_at).toLocaleString("en-US", {
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : note.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ==================== REVIEWS (DOUBLE-BLIND) ====================
  const renderReviews = () => {
    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>

        {/* Double-blind indicators */}
        {/* Waiting for creator indicator (locked state) */}
        {reviewStatus &&
          !reviewStatus.isUnlocked &&
          reviewStatus.hasBrandReview &&
          !reviewStatus.hasCreatorReview && (
            <div className="mb-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-amber-800">Review Submitted</span>
              </div>
              <p className="text-[11px] text-amber-700 mt-1">
                Waiting for creator to submit their review to unlock both.
              </p>
            </div>
          )}

        {/* Creator submitted, waiting for brand */}
        {reviewStatus &&
          !reviewStatus.isUnlocked &&
          !reviewStatus.hasBrandReview &&
          reviewStatus.hasCreatorReview && (
            <div className="mb-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-800">
                  Creator submitted a review
                </span>
              </div>
              <p className="text-[11px] text-blue-700 mt-1">
                Submit your review to unlock both reviews.
              </p>
            </div>
          )}

        {/* Reviews list - shows creator's review after unlocking */}
        {isReviewsLoading ? (
          <div className="flex justify-center py-2">
            <Loader loading={true} />
          </div>
        ) : (
          <div className="space-y-2">
            {campaignReviews?.map((review, index) => (
              <div key={review.id || index} className="border-l-2 border-indigo-500 pl-3 py-1">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col flex-1">
                    <span className="text-[10px] font-semibold text-gray-500 mb-1">
                      Creator's Review
                    </span>
                    <div className="flex items-center gap-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700">{review.review}</p>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      {new Date(review.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create / Edit review form */}
            {(selectedCreator?.creator_profile_id || selectedCreator?.id) && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <h5 className="text-xs font-semibold text-gray-700 mb-2">
                  {editingReview ? "Edit Review" : "Add Review"}
                </h5>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-600">Rating:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 cursor-pointer ${i < newReviewRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          onClick={() => setNewReviewRating(i + 1)}
                        />
                      ))}
                    </div>
                  </div>
                  <TextArea
                    key={`review-textarea-${editingReview || "new"}`}
                    placeholder="Leave a review..."
                    value={newReviewText}
                    onChange={(e) => setNewReviewText(e.target.value)}
                    className="text-xs"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <CustomButton
                      text="Cancel"
                      className="btn-cancel text-xs py-1 px-2"
                      onClick={editingReview ? handleCancelEditReview : handleCancelNewReview}
                    />
                    <CustomButton
                      text={
                        isCreateReviewLoading || isUpdateReviewLoading ? (
                          <Loader loading={true} />
                        ) : editingReview ? (
                          "Update"
                        ) : (
                          "Save"
                        )
                      }
                      className="btn-primary text-xs py-1 px-2"
                      onClick={
                        editingReview
                          ? () => handleSaveEditReview(editingReview)
                          : handleSaveNewReview
                      }
                      disabled={
                        !newReviewText.trim() || isCreateReviewLoading || isUpdateReviewLoading
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Campaign Selection Message */}
      {!selectedCampaign && renderCampaignSelectionMessage()}

      {/* No Creator Found Message */}
      {selectedCampaign && selectedCreator === null && renderNoCreatorFound()}

      {/* Main Content - Only show when both campaign and creator are selected */}
      {selectedCampaign && selectedCreator && (
        <>
          {renderCreatorProfile()}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {renderQuickActions()}
            {renderContractDetails()}
            {renderTimeline()}
            {renderNotes()}
            {renderReviews()}
          </div>

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
        </>
      )}
    </div>
  );
};

export default DeliverablesProgressCompleted;
