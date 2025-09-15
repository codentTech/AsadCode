import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Loader from "@/common/components/loader/loader.component";
import { avatar } from "@/common/constants/auth.constant";
import { Avatar } from "@mui/material";
import {
  CheckCircle2,
  MapPin,
  Star,
  Edit2,
  Trash2,
  MessageCircle,
  CheckCircle,
} from "lucide-react";
import BrandTimelineSteps from "../brand-timeline/brand-timeline";
import MessageThreadModal from "../message-thread-modal/message-thread-modal.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ isCompleted = false, selectedCampaign, selectedCreator }) => {
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

    // Helper functions
    getStatusColor,
    getStatusIcon,
  } = useDeliverablesProgress(selectedCampaign?.id, selectedCampaign, selectedCreator);

  // ==================== RENDER HELPERS ====================
  const renderCampaignSelectionMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center px-3">
      <Loader loading={true} />
      <p className="text-sm text-gray-500 mt-3">
        {isCompleted ? "Loading completed campaigns..." : "Loading active campaigns..."}
      </p>
    </div>
  );

  const renderCreatorSelectionMessage = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center px-3">
      <Loader loading={true} />
      <p className="text-sm text-gray-500 mt-3">Loading creators...</p>
    </div>
  );

  const renderCreatorProfile = () => (
    <div className="flex flex-col items-center pt-2 pb-3 px-3 border-b bg-white sticky top-0 z-10">
      <div className="relative">
        <Avatar
          src={
            selectedCreator.user?.profile_photo_url || selectedCreator.profile_photo_url || avatar
          }
          alt={selectedCreator.user?.first_name || selectedCreator.name || "Creator"}
          className="h-16 w-16 border-2 border-white shadow-sm ring-1 ring-indigo-500"
        >
          {(selectedCreator.user?.first_name || selectedCreator.name || "C")?.charAt(0)}
        </Avatar>
        <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full ring-2 ring-white"></span>
        {isCompleted && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-3 h-3 text-white" />
          </span>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-900 mt-1">
        {selectedCreator.user?.first_name || selectedCreator.name || "Creator"}{" "}
        <span className="text-xs text-gray-500">
          ({selectedCreator.user?.age || selectedCreator.age || "N/A"})
        </span>
      </h3>

      <div className="flex items-center mt-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(selectedCreator.rating || 0)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({selectedCreator.reviewCount || 0})</span>
      </div>
      <div className="flex items-center mt-1 text-xs text-gray-600">
        <MapPin className="w-3 h-3 mr-1" />
        <span>
          {selectedCreator.shipping_address?.city ||
            selectedCreator.location ||
            "Location not specified"}
        </span>
      </div>

      {isCompleted && (
        <div className="mt-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
          Completed
        </div>
      )}
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h4>
      <div className="flex gap-2">
        <CustomButton text="Mark Complete" />
        <CustomButton
          text="Message"
          className="btn-outline w-full"
          onClick={messageThreadHook.openMessageModal}
        />
      </div>
    </div>
  );

  const renderContractDetails = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2 border-b pb-1">Contract Agreement</h4>
      <ul className="space-y-2 text-xs text-gray-600">
        <li className="flex items-center justify-between">
          <span>1 Instagram video</span>
          {isCompleted && <CheckCircle2 className="w-3 h-3 text-green-500" />}
        </li>
        <li className="flex items-center justify-between">
          <span>2 Instagram stories</span>
          {isCompleted && <CheckCircle2 className="w-3 h-3 text-green-500" />}
        </li>
        <li className="flex items-center justify-between">
          <span>
            {isCompleted ? "Completed:" : "Deadline:"}
            <span className="font-medium ml-1">20 May 2025</span>
          </span>
        </li>
        <li className="flex items-center justify-between">
          <span>
            Payment: <span className="font-medium">$600</span>
            {isCompleted && <span className="text-green-600 text-xs">(Paid)</span>}
          </span>
        </li>
      </ul>
    </div>
  );

  const renderTimeline = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
      <BrandTimelineSteps />
    </div>
  );

  const renderReviews = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Reviews</h4>
      {isReviewsLoading ? (
        <div className="flex justify-center py-3">
          <Loader loading={true} />
        </div>
      ) : (
        <div className="space-y-2">
          {campaignReviews.map((review, index) => (
            <div key={review.id || index} className="border-l-2 border-indigo-500 pl-3 py-1 group">
              <div className="flex justify-between items-start">
                <div className="flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-700">{review.review}</p>
                  <span className="text-xs text-gray-400 mt-0.5">
                    {new Date(review.created_at).toLocaleString()}
                  </span>
                </div>
                {!isCompleted && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEditReview(review.id)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit review"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review.id)}
                      disabled={isDeleteReviewLoading}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete review"
                    >
                      {isDeleteReviewLoading ? (
                        <Loader loading={true} />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {!isCompleted && (selectedCreator?.creator_profile_id || selectedCreator?.id) && (
            <div className="mt-3 p-3 bg-gray-50 rounded">
              <h5 className="text-xs font-semibold text-gray-700 mb-2">
                {editingReview ? "Edit Review" : "Add Review"}
              </h5>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Rating:</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 cursor-pointer ${
                          i < newReviewRating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
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

  const renderNotes = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">
        {isCompleted ? "Campaign Notes" : "Private Notes"}
      </h4>
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
                {!isCompleted && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 ml-2">
                    <button
                      onClick={() => handleEditNote(note.id)}
                      className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      title="Edit note"
                    >
                      <Edit2 className="w-3 h-3" />
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
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {!isCompleted && (
        <React.Fragment>
          <TextArea
            key={`note-textarea-${editingNote || "new"}`}
            label={editingNote ? "Edit note..." : "Add a new note..."}
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            className="text-xs"
            rows={2}
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
              onClick={editingNote ? () => handleSaveEditNote(editingNote) : handleSaveNewNote}
              disabled={!newNoteText.trim() || isCreateNoteLoading || isUpdateNoteLoading}
            />
          </div>
        </React.Fragment>
      )}
    </div>
  );

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Campaign Selection Message */}
      {!selectedCampaign && renderCampaignSelectionMessage()}

      {/* Creator Selection Message */}
      {selectedCampaign && !selectedCreator && renderCreatorSelectionMessage()}

      {/* Main Content - Only show when both campaign and creator are selected */}
      {selectedCampaign && selectedCreator && (
        <>
          {renderCreatorProfile()}

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {renderQuickActions()}
            {renderContractDetails()}
            {renderTimeline()}
            {renderReviews()}
            {renderNotes()}
          </div>

          {/* Message Thread Modal */}
          <MessageThreadModal
            isOpen={messageThreadHook.isModalOpen}
            onClose={messageThreadHook.closeMessageModal}
            creator={creator}
          />
        </>
      )}
    </div>
  );
};

export default DeliverablesProgress;
