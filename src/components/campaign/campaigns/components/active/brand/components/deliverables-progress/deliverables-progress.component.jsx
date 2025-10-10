import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import { SOURCE_PLATFORM } from "@/common/constants/campaign.constant";
import { Avatar } from "@mui/material";
import { CheckCircle2, Edit2, MapPin, Star, Trash2 } from "lucide-react";
import React from "react";
import MessageThreadModal from "../../../../message-thread-modal/message-thread-modal.component";
import BrandTimelineSteps from "../brand-timeline/brand-timeline.component";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ selectedCampaign, selectedCreator }) => {
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
  } = useDeliverablesProgress(selectedCampaign?.id, selectedCampaign, selectedCreator);

  // ==================== RENDER HELPERS ====================
  const renderCampaignSelectionMessage = () => (
    <div className="py-16">
      <NotFound
        title="No Campaign Selected"
        description="Select a campaign from the list to view creator details and manage deliverables."
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
        description="No creators have applied to this campaign yet."
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
    </div>
  );

  const renderQuickActions = () => (
    <div className="bg-white rounded border p-3">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h4>
      <div className="flex gap-2">
        <CustomButton text="Mark Complete" onClick={handleMarkCompleteClick} />
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
    // Only show timeline for CleerCut campaigns
    if (selectedCampaign?.source_platform !== SOURCE_PLATFORM.CLEERCUT) {
      return null;
    }

    return (
      <div className="bg-white rounded border p-3">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Timeline</h4>
        <BrandTimelineSteps campaignId={selectedCampaign?.id} />
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
                {
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
                }
              </div>
            </div>
          ))}
        </div>
      )}
      {
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
      }
    </div>
  );

  // Reviews block intentionally not rendered in Active tab

  // ==================== MAIN RENDER ====================
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Campaign Selection Message */}
      {!selectedCampaign && renderCampaignSelectionMessage()}

      {/* Creator Selection Message */}
      {/* {selectedCampaign && !selectedCreator && renderCreatorSelectionMessage()} */}

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
          </div>

          {/* Message Thread Modal */}
          <MessageThreadModal
            isOpen={messageThreadHook.isModalOpen}
            onClose={messageThreadHook.closeMessageModal}
            creator={creator}
          />

          {/* Mark Complete Confirmation Modal */}
          <Modal
            show={showMarkCompleteModal}
            onClose={handleCancelMarkComplete}
            title="Mark Campaign Complete"
            size="sm"
          >
            <div className="p-4">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Confirm Campaign Completion
                </h3>
                <p className="text-sm text-gray-600">
                  By continuing, you are acknowledging that{" "}
                  <span className="font-semibold">{creator.name}</span> has completed their
                  agreement.
                </p>
                {selectedContract && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Contract Value:</span>{" "}
                      {selectedContract.compensationType === "PAID"
                        ? `$${selectedContract.totalCompensation || 0}`
                        : selectedContract.compensationType === "GIFTED_PRODUCT"
                          ? `Product ($${selectedContract.productPrice || 0})`
                          : "Commission based"}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <CustomButton
                  text="Cancel"
                  className="btn-cancel flex-1"
                  onClick={handleCancelMarkComplete}
                  disabled={isMarkingComplete || isUpdateCampaignLoading}
                />
                <CustomButton
                  text={isMarkingComplete || isUpdateCampaignLoading ? "Completing..." : "Complete"}
                  className="btn-primary flex-1"
                  onClick={handleConfirmMarkComplete}
                  disabled={isMarkingComplete || isUpdateCampaignLoading}
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
