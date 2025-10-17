import React from "react";
import { Send, User, Calendar } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import useInvitationModal from "./use-invitation-modal.hook";

const InvitationModal = ({
  isOpen,
  onClose,
  selectedCreator,
  userCampaigns = [],
  onInviteSent,
}) => {
  const {
    customMessage,
    setCustomMessage,
    isSending,
    selectedCampaign,
    handleCampaignSelect,
    handleClose,
    handleSubmit,
    formatCompensation,
  } = useInvitationModal();

  return (
    <Modal show={isOpen} title="Invite to Apply" onClose={() => handleClose(onClose)} size="md">
      <div className="space-y-3">
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

        {/* Campaign Selection */}
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
                        <span className="text-xs text-green-600 font-medium">
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

        {/* Custom Message */}
        {selectedCampaign && (
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Custom Message (Optional)
            </label>
            <CustomInput
              type="textarea"
              name="customMessage"
              placeholder="Add a personal message to your invitation..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              maxLength={500}
              rows={3}
              disabled={isSending}
            />
            <p className="text-xs text-gray-500 mt-1">{customMessage.length}/500 characters</p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-2 pt-2">
          <CustomButton
            text="Cancel"
            className="btn-secondary"
            onClick={() => handleClose(onClose)}
            disabled={isSending}
          />
          <CustomButton
            text={isSending ? "Sending..." : "Send Invitation"}
            className="btn-primary"
            onClick={() => handleSubmit(selectedCreator, onInviteSent, onClose)}
            disabled={isSending || !selectedCampaign}
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
