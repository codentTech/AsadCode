import React, { useState } from "react";
import { Send, User, Calendar, Users, UserPlus } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import useInvitationModal from "./use-invitation-modal.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const InvitationModal = ({
  isOpen,
  onClose,
  selectedCreator,
  userCampaigns = [],
  onInviteSent,
}) => {
  const [invitationType, setInvitationType] = useState(COLLABORATION_TYPE.MULTI_CREATOR);

  const {
    customMessage,
    setCustomMessage,
    isSending,
    selectedCampaign,
    handleCampaignSelect,
    handleClose,
    handleSubmit,
    formatCompensation,
    resetForm,
  } = useInvitationModal();

  const handleTypeChange = (type) => {
    setInvitationType(type);
    // Reset form when switching types
    setCustomMessage("");
    if (selectedCampaign) {
      handleCampaignSelect(null);
    }
  };

  const canSubmit = () => {
    if (invitationType === COLLABORATION_TYPE.MULTI_CREATOR) {
      return selectedCampaign !== null;
    } else {
      // INDIVIDUAL_CREATOR - message is mandatory
      return customMessage.trim().length > 0;
    }
  };

  const handleModalClose = () => {
    if (!isSending) {
      resetForm();
      setInvitationType(COLLABORATION_TYPE.MULTI_CREATOR);
      onClose();
    }
  };

  return (
    <Modal show={isOpen} title="Invite to Apply" onClose={handleModalClose} size="md">
      <div className="space-y-4">
        {/* Creator Info */}
        <div className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {selectedCreator?.profileImage ? (
              <img
                src={selectedCreator.profileImage}
                alt="Creator"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 text-sm">
              {selectedCreator?.first_name && selectedCreator?.last_name
                ? `${selectedCreator.first_name} ${selectedCreator.last_name}`
                : selectedCreator?.name || "Creator"}
            </h3>
            <p className="text-xs text-gray-500">
              {selectedCreator?.niches?.map((niche) => niche).join(", ") || "N/A"}
            </p>
          </div>
        </div>

        {/* Invitation Type Selection */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Select Invitation Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Option A: Multi Creator Campaign */}
            <button
              type="button"
              onClick={() => handleTypeChange(COLLABORATION_TYPE.MULTI_CREATOR)}
              className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                invitationType === COLLABORATION_TYPE.MULTI_CREATOR
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <Users
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    invitationType === COLLABORATION_TYPE.MULTI_CREATOR
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-xs mb-1">Multi Creator Campaign</h4>
                  <p className="text-xs text-gray-500">Invite to an existing campaign</p>
                </div>
                {invitationType === COLLABORATION_TYPE.MULTI_CREATOR && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>

            {/* Option B: Individual Collaboration */}
            <button
              type="button"
              onClick={() => handleTypeChange(COLLABORATION_TYPE.INDIVIDUAL_CREATOR)}
              className={`p-3 border-2 rounded-lg transition-all duration-200 text-left ${
                invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-start gap-2">
                <UserPlus
                  className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                      ? "text-primary"
                      : "text-gray-400"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-xs mb-1">
                    Individual Collaboration
                  </h4>
                  <p className="text-xs text-gray-500">One-off collaboration</p>
                </div>
                {invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Campaign Selection - Only for Multi Creator */}
        {invitationType === COLLABORATION_TYPE.MULTI_CREATOR && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Select Campaign ({userCampaigns.length} available)
            </label>
            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {userCampaigns.length === 0 ? (
                <div className="p-3 text-center border-2 border-dashed border-gray-200 rounded-lg">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-gray-500 text-xs font-medium">No active campaigns available</p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    Create a campaign first to invite creators
                  </p>
                </div>
              ) : (
                userCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`p-2.5 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedCampaign?.id === campaign.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => handleCampaignSelect(campaign)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-xs leading-tight truncate">
                          {campaign.campaign_title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-primary font-medium">
                            {formatCompensation(campaign)}
                          </span>
                          {campaign.total_collaborators && (
                            <span className="text-xs text-gray-500">
                              {campaign.total_collaborators} spots
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedCampaign?.id === campaign.id && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Custom Message */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ? (
              <>
                Message <span className="text-red-500">*</span>
              </>
            ) : (
              "Custom Message (Optional)"
            )}
          </label>
          <CustomInput
            type="textarea"
            name="customMessage"
            placeholder={
              invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                ? "Start the conversation... (Required)"
                : "Add a personal message to your invitation..."
            }
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            maxLength={500}
            rows={3}
            disabled={isSending}
            required={invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
          />
          <p className="text-xs text-gray-500 mt-1">{customMessage.length}/500 characters</p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <CustomButton
            text="Cancel"
            className="btn-secondary"
            onClick={handleModalClose}
            disabled={isSending}
          />
          <CustomButton
            text={isSending ? "Sending..." : "Send Invitation"}
            className="btn-primary"
            onClick={async () => {
              await handleSubmit(selectedCreator, onInviteSent, handleModalClose, invitationType);
            }}
            disabled={isSending || !canSubmit()}
            startIcon={
              isSending ? <Loader loading={true} size="small" /> : <Send className="w-4 h-4" />
            }
          />
        </div>
      </div>
    </Modal>
  );
};

export default InvitationModal;
