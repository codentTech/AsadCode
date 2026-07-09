import React from "react";
import { Check, AlertCircle } from "lucide-react";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import useBulkMessageModal, {
  resolveCreatorUserId,
} from "./use-bulk-message-modal.hook";

const BulkMessageModal = ({ isOpen, onClose, creators, selectedCampaign }) => {
  const { getPlatformIcon, getPlatformColor, formatFollowers } = useGetplatform();

  const {
    selectedCreatorIds,
    messageText,
    setMessageText,
    validationError,
    isSending,
    sendResults,
    showResults,
    activeCreators,
    selectedCount,
    totalCount,
    handleCreatorToggle,
    handleSelectAll,
    handleDeselectAll,
    handleSendMessages,
    resetState,
  } = useBulkMessageModal(creators, selectedCampaign);

  const handleClose = () => {
    if (!isSending) {
      resetState();
      onClose();
    }
  };

  const handleModalSend = async () => {
    await handleSendMessages();
  };

  const isAllSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <Modal
      show={isOpen}
      title="Bulk message to creators in this campaign"
      onClose={handleClose}
      size="lg"
    >
      <div className="space-y-4 relative">
        <p className="text-sm text-gray-600">
          This message will be sent as a direct message to each selected creator separately.
        </p>

        {activeCreators.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isAllSelected ? "Deselect All" : "Select All"}
              </button>
              <span className="text-sm text-gray-600">
                Selected: {selectedCount} of {totalCount} creators
              </span>
            </div>
          </div>
        )}

        {showResults && (
          <div className="p-4 rounded-lg border-2 border-gray-200 bg-gray-100 space-y-3">
            {sendResults.success.length > 0 && (
              <div className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900">
                    Successfully sent to {sendResults.success.length} creator
                    {sendResults.success.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            )}

            {sendResults.failed.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900">
                      Failed to send to {sendResults.failed.length} creator
                      {sendResults.failed.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <ul className="ml-7 space-y-1">
                  {sendResults.failed.map((result) => (
                    <li key={result.creatorId} className="text-xs text-red-700">
                      {result.creatorName}: {result.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="max-h-64 overflow-y-auto space-y-2 border border-gray-200 rounded-lg p-3">
          {activeCreators.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-500">
              No active creators found in this campaign.
            </div>
          ) : (
            activeCreators.map((creator) => {
              const creatorId = resolveCreatorUserId(creator);
              if (!creatorId) return null;
              const isSelected = selectedCreatorIds.has(creatorId);
              const isFailed =
                showResults && sendResults.failed.some((f) => f.creatorId === creatorId);

              return (
                <div
                  key={creatorId}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    isFailed
                      ? "border-red-300 bg-red-50"
                      : isSelected
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleCreatorToggle(creatorId)}
                    disabled={isSending}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 mt-0.5"
                  />

                  <div className="flex-shrink-0">
                    <img
                      src={creator.image || avatar}
                      alt={creator.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                      onError={(e) => {
                        e.target.src = avatar;
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 truncate">{creator.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {creator.platforms &&
                        Object.entries(creator.platforms).map(([platform, data]) => {
                          if (!data || (data.followers === 0 && !data.verified)) return null;
                          return (
                            <div
                              key={platform}
                              className="flex items-center gap-1"
                              title={`${platform}: ${formatFollowers(data.followers || 0)} followers`}
                            >
                              <div className={`${getPlatformColor(platform)} p-0.5 rounded`}>
                                {getPlatformIcon(platform)}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {isFailed && <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />}
                </div>
              );
            })
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <CustomInput
            type="textarea"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Enter your message (5-2000 characters)..."
            rows={5}
            disabled={isSending || activeCreators.length === 0}
            className={validationError ? "border-red-500" : ""}
          />
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs text-gray-500">{messageText.length} / 2000 characters</span>
            {validationError && <span className="text-xs text-red-600">{validationError}</span>}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <CustomButton
            text="Cancel"
            onClick={handleClose}
            disabled={isSending}
            className="btn-secondary"
          />
          <CustomButton
            text={
              isSending
                ? "Sending..."
                : `Send to ${selectedCount} Creator${selectedCount !== 1 ? "s" : ""}`
            }
            onClick={handleModalSend}
            disabled={isSending || selectedCount === 0 || activeCreators.length === 0}
            className="btn-primary"
          />
        </div>

        {isSending && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg z-10">
            <Loader />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BulkMessageModal;
