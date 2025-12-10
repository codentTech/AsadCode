import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import { SOURCE_PLATFORM } from "@/common/constants/campaign.constant";
import { Avatar } from "@mui/material";
import { Edit2, Star, Trash2 } from "lucide-react";
import React from "react";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({
  selectedCampaign,
  selectedCreator,
  isIndividualCreator = false,
}) => {
  const {
    messageThreadHook,
    creator,
    privateNotes,
    editingNote,
    newNoteText,
    setNewNoteText,
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
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
  } = useDeliverablesProgress(
    selectedCampaign?.id,
    selectedCampaign,
    selectedCreator,
    isIndividualCreator
  );

  const renderCampaignSelectionMessage = () => (
    <div className="py-16">
      <NotFound
        title="No Campaign Selected"
        description="Select a campaign from the list to view creator details and manage deliverables."
      />
    </div>
  );

  const renderNoCreatorFound = () => (
    <div className="py-16">
      <NotFound
        title="No Creator Found"
        description="No creators have applied to this campaign yet."
      />
    </div>
  );

  const renderCreatorProfile = () => (
    <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-1 top-0 bg-white z-10">
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
      <h3>
        {creator.name}
        <span className="text-lg text-gray-500 ml-1">({creator.rating})</span>
      </h3>
      <p className="flex items-center text-sm text-gray-500 -mt-1">
        {creator.age} • <span className="ml-1">{creator.location}</span>
      </p>

      <p className="text-sm text-gray-500 -mt-1">{creator?.bio}</p>
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h4>
      <div className="flex gap-2">
        <CustomButton
          text="Message"
          className="btn-primary w-full"
          onClick={messageThreadHook.openMessageModal}
        />
        <CustomButton
          text="Mark Complete"
          onClick={handleMarkCompleteClick}
          className={isMarkCompleteDisabled ? "btn-disabled w-full" : "btn-primary w-full"}
          disabled={isMarkCompleteDisabled}
          title={isMarkCompleteDisabled ? "Final content must be published before completion" : ""}
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
      if (selectedContract.contentFormat) {
        const deliverables = selectedContract.contentFormat.split(",").map((item) => {
          const trimmed = item.trim();
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
            </li>
          ))}
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

  const renderTimeline = () => {
    if (selectedCampaign?.source_platform === SOURCE_PLATFORM.OTHER) {
      return null;
    }

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
        <BrandTimelineSteps campaignId={selectedCampaign?.id} contracts={contracts} />
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
              </div>
            </div>
          ))}
        </div>
      )}
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
    </div>
  );

  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {!selectedCampaign && renderCampaignSelectionMessage()}
      {selectedCampaign && selectedCreator === null && renderNoCreatorFound()}
      {selectedCampaign && selectedCreator && (
        <>
          {renderCreatorProfile()}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {renderQuickActions()}
            {renderContractDetails()}
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
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          i < markCompleteRating ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                        onClick={() => setMarkCompleteRating(i + 1)}
                      />
                    ))}
                    {markCompleteRating > 0 && (
                      <span className="text-sm text-gray-600 ml-2">{markCompleteRating}/5</span>
                    )}
                  </div>
                </div>
                <div className="mb-4">
                  <TextArea
                    label="Feedback (Optional)"
                    placeholder="Share your experience working with this creator..."
                    value={markCompleteFeedback}
                    onChange={(e) => setMarkCompleteFeedback(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-xs text-blue-800">
                    <span className="font-semibold">Notice:</span> Marking complete will
                    automatically release the payment to the creator and close this collaboration.
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
                  text={
                    isMarkingComplete || isUpdateCampaignLoading ? "Completing..." : "Mark Complete"
                  }
                  className="btn-primary flex-1"
                  onClick={handleConfirmMarkComplete}
                  disabled={
                    isMarkingComplete || isUpdateCampaignLoading || markCompleteRating === 0
                  }
                />
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default DeliverablesProgress;
