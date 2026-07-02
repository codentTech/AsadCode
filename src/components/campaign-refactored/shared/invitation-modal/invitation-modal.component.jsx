// invitation-modal.component.jsx

import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import { CAMPAIGN_TYPE, COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import { Calendar, RefreshCw, User, UserPlus, Users } from "lucide-react";
import { useState } from "react";
import useInvitationModal from "./use-invitation-modal.hook";
import TextArea from "@/common/components/text-area/text-area.component";

const InvitationModal = ({
  isOpen,
  onClose,
  selectedCreator,
  userCampaigns = [],
  isCampaignsLoading = false,
  onRefreshCampaigns,
  onInviteSent,
}) => {
  const [invitationType, setInvitationType] = useState(COLLABORATION_TYPE.MULTI_CREATOR);

  const {
    customMessage,
    setCustomMessage,
    register,
    errors,
    isSending,
    selectedCampaign,
    handleCampaignSelect,
    handleSubmit,
    resetForm,
  } = useInvitationModal();

  const handleTypeChange = (type) => {
    setInvitationType(type);
    setCustomMessage("");

    if (selectedCampaign) {
      handleCampaignSelect(null);
    }
  };

  const canSubmit = () => {
    if (customMessage.length > 2000) return false;

    if (invitationType === COLLABORATION_TYPE.MULTI_CREATOR) {
      return selectedCampaign !== null;
    }

    return customMessage.trim().length > 0;
  };

  const handleModalClose = () => {
    if (!isSending) {
      resetForm();
      setInvitationType(COLLABORATION_TYPE.MULTI_CREATOR);
      onClose();
    }
  };

  return (
    <Modal show={isOpen} title="Invite to Apply" onClose={handleModalClose} size="lg">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center space-x-2.5 rounded-lg bg-gray-50 p-2 sm:space-x-3">
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
            <h3 className="text-xs font-medium text-gray-900 sm:text-sm">
              {selectedCreator?.first_name && selectedCreator?.last_name
                ? `${selectedCreator.first_name} ${selectedCreator.last_name}`
                : selectedCreator?.name || "Creator"}
            </h3>
            <p className="text-[10px] text-gray-500 sm:text-xs">
              {selectedCreator?.niches?.map((niche) => niche).join(", ") || "N/A"}
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            Select Invitation Type
          </label>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            <button
              type="button"
              onClick={() => handleTypeChange(COLLABORATION_TYPE.MULTI_CREATOR)}
              className={`rounded-lg border-2 p-2.5 text-left transition-all duration-200 sm:p-3 ${
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
                  <h4 className="mb-1 text-[10px] font-medium text-gray-900 sm:text-xs">
                    Multi Creator Campaign
                  </h4>
                  <p className="text-[10px] text-gray-500 sm:text-xs">
                    Invite to an existing campaign
                  </p>
                </div>

                {invitationType === COLLABORATION_TYPE.MULTI_CREATOR && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTypeChange(COLLABORATION_TYPE.INDIVIDUAL_CREATOR)}
              className={`rounded-lg border-2 p-2.5 text-left transition-all duration-200 sm:p-3 ${
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
                  <h4 className="mb-1 text-[10px] font-medium text-gray-900 sm:text-xs">
                    Individual Collaboration
                  </h4>
                  <p className="text-[10px] text-gray-500 sm:text-xs">One-off collaboration</p>
                </div>

                {invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR && (
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>

        {invitationType === COLLABORATION_TYPE.MULTI_CREATOR && (
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-gray-700">
                Select Campaign ({userCampaigns.length} available)
              </label>

              <button
                type="button"
                onClick={onRefreshCampaigns}
                disabled={isCampaignsLoading}
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-50 hover:text-primary"
                aria-label="Refresh campaigns"
                title="Refresh campaigns"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isCampaignsLoading ? "animate-spin" : ""}`} />
              </button>
            </div>

            <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
              {isCampaignsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={`campaign-skeleton-${index}`}
                    className="rounded-lg border border-gray-200 p-2.5"
                  >
                    <div className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-2.5 w-28 rounded bg-gray-200 animate-pulse" />
                      <div className="h-2.5 w-14 rounded bg-gray-200 animate-pulse" />
                    </div>
                  </div>
                ))
              ) : userCampaigns.length === 0 ? (
                <div className="rounded-lg border-2 border-dashed border-gray-200 p-3 text-center">
                  <Calendar className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs font-medium text-gray-500">No active campaigns available</p>
                  <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                    Create a campaign first to invite creators
                  </p>
                </div>
              ) : (
                userCampaigns.map((campaign) => (
                  <div
                    key={campaign.id}
                    className={`cursor-pointer rounded-lg border p-2.5 transition-all duration-200 ${
                      selectedCampaign?.id === campaign.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                    onClick={() => handleCampaignSelect(campaign)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate text-[10px] font-medium leading-tight text-gray-900 sm:text-xs">
                          {campaign.campaign_title}
                        </h4>

                        {(campaign.compensation_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                          campaign.compensation_type === CAMPAIGN_TYPE.UGC) && (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-medium text-primary sm:text-xs">
                              Budget Remaining: ${campaign.remaining_budget || 0}
                            </span>

                            {campaign.total_collaborators && (
                              <span className="text-[10px] text-gray-500 sm:text-xs">
                                {campaign.total_collaborators} spots
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {selectedCampaign?.id === campaign.id && (
                        <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium text-gray-700">
            {invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ? (
              <>
                Message <span className="text-red-500">*</span>
              </>
            ) : (
              "Custom Message (Optional)"
            )}
          </label>

          <TextArea
            {...register("customMessage")}
            name="customMessage"
            placeholder={
              invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                ? "Start the conversation"
                : "Add a personal message to your invitation"
            }
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            disabled={isSending}
            required={invitationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR}
            maxLength={2000}
          />

          <div className="flex justify-between items-center mt-1">
            {errors.customMessage && (
              <p className="text-[10px] text-red-500 sm:text-xs">{errors.customMessage.message}</p>
            )}
            <p
              className={`text-[10px] sm:text-xs ${
                customMessage.length >= 1800 ? "text-red-500" : "text-gray-500"
              }`}
            >
              {customMessage.length} / 2000 characters
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:space-x-2">
          <CustomButton
            text="Cancel"
            className="btn-secondary w-full sm:w-auto"
            onClick={handleModalClose}
            disabled={isSending}
          />

          <CustomButton
            text="Send Invitation"
            className="btn-primary w-full sm:w-auto"
            loading={isSending}
            onClick={async () => {
              await handleSubmit(selectedCreator, onInviteSent, handleModalClose, invitationType);
            }}
            disabled={isSending || !canSubmit()}
          />
        </div>
      </div>
    </Modal>
  );
};

export default InvitationModal;
