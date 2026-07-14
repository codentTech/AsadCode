import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { AlertCircle, Check, X } from "lucide-react";
import useBulkMessageModal, { resolveCreatorUserId } from "./use-bulk-message-modal.hook";

const BulkMessageModal = ({ isOpen, onClose, creators, selectedCampaign }) => {
  const { getPlatformIcon, getPlatformColor, formatFollowers, getVisiblePlatformEntries } =
    useGetplatform();

  const {
    selectedCreatorIds,
    messageText,
    setMessageText,
    selectionError,
    messageError,
    isSending,
    sendResults,
    showResults,
    resultSummary,
    activeCreators,
    selectedCount,
    totalCount,
    isAllSelected,
    isMessageOverLimit,
    maxMessageLength,
    handleCreatorToggle,
    handleSelectAllToggle,
    handleSendMessages,
    resetState,
    handleDismissResults,
  } = useBulkMessageModal(creators, selectedCampaign, isOpen);

  const handleClose = () => {
    if (!isSending) {
      resetState();
      onClose();
    }
  };

  return (
    <Modal
      show={isOpen}
      title={
        <>
          <span className="sm:hidden">Bulk message to creators</span>
          <span className="hidden sm:inline">Bulk message to creators in this campaign</span>
        </>
      }
      onClose={handleClose}
      size="lg"
    >
      <div className="relative flex min-h-0 flex-col gap-4 p-1 sm:gap-5 sm:p-0">
        <p className="text-[11px] leading-snug text-gray-600 sm:text-sm">
          This message will be sent as a direct message to each selected creator separately.
        </p>

        {selectionError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:text-sm">
            {selectionError}
          </div>
        ) : null}

        {showResults && resultSummary ? (
          <div
            className={`space-y-3 rounded-lg border px-3 py-3 sm:px-4 ${
              sendResults.failed.length === 0
                ? "border-green-200 bg-green-50"
                : sendResults.success.length > 0
                  ? "border-amber-200 bg-amber-50"
                  : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              {sendResults.success.length > 0 ? (
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600 sm:h-5 sm:w-5" />
                  <p className="text-xs font-medium text-green-900 sm:text-sm">{resultSummary}</p>
                </div>
              ) : (
                <div className="flex min-w-0 flex-1 items-start gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 sm:h-5 sm:w-5" />
                  <p className="text-xs font-medium text-red-900 sm:text-sm">{resultSummary}</p>
                </div>
              )}

              <button
                type="button"
                onClick={handleDismissResults}
                className="shrink-0 rounded p-0.5 text-gray-500 transition-colors hover:bg-black/5 hover:text-gray-700"
                aria-label="Dismiss result"
              >
                <X className="h-4 w-4 shrink-0" />
              </button>
            </div>

            {sendResults.failed.length > 0 ? (
              <ul className="ml-6 space-y-1 sm:ml-7">
                {sendResults.failed.map((result) => (
                  <li key={result.creatorId} className="text-[10px] text-red-700 sm:text-xs">
                    {result.creatorName}: {result.error}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {activeCreators.length > 0 ? (
          <div className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-100 px-3 py-2.5">
            <CustomCheckboxGroup
              name="bulk-message-select-all"
              options={[{ label: "Select all", value: "all" }]}
              values={isAllSelected ? ["all"] : []}
              onChange={(selectedValues) => handleSelectAllToggle(selectedValues.includes("all"))}
              inlineLabel
              labelClassName="text-xs font-medium text-gray-900 normal-case sm:text-sm"
            />
            <span className="text-[10px] text-gray-600 sm:text-xs">
              Selected: {selectedCount} of {totalCount} creators
            </span>
          </div>
        ) : null}

        <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white p-2 sm:max-h-64 sm:p-3">
          {activeCreators.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-500 sm:text-sm">
              No active creators found in this campaign.
            </div>
          ) : (
            <div className="space-y-2">
              {activeCreators.map((creator) => {
                const creatorId = resolveCreatorUserId(creator);
                if (!creatorId) return null;
                const isSelected = selectedCreatorIds.has(creatorId);
                const isFailed =
                  showResults && sendResults.failed.some((f) => f.creatorId === creatorId);
                const visiblePlatforms = getVisiblePlatformEntries(creator.platforms);

                return (
                  <div
                    key={creatorId}
                    className={`flex flex-col gap-1.5 rounded-lg border p-2.5 transition-all md:flex-row md:items-center md:justify-between md:gap-3 md:p-3 ${
                      isFailed
                        ? "border-red-300 bg-red-50"
                        : isSelected
                          ? "border-primary bg-indigo-100/60"
                          : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <CustomCheckboxGroup
                        name={`bulk-message-creator-${creatorId}`}
                        options={[{ label: "", value: creatorId }]}
                        values={isSelected ? [creatorId] : []}
                        onChange={() => handleCreatorToggle(creatorId)}
                        inlineLabel
                      />

                      <img
                        src={creator.image || avatar}
                        alt={creator.name}
                        className="h-9 w-9 shrink-0 rounded-full border-2 border-gray-200 object-cover sm:h-10 sm:w-10"
                        onError={(e) => {
                          e.target.src = avatar;
                        }}
                      />

                      <h4 className="min-w-0 flex-1 truncate text-xs font-semibold text-gray-900 sm:text-sm">
                        {creator.name}
                      </h4>

                      {isFailed ? (
                        <AlertCircle className="h-4 w-4 shrink-0 text-red-600 md:hidden sm:h-5 sm:w-5" />
                      ) : null}
                    </div>

                    {visiblePlatforms.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-gray-200 p-1 pl-9 md:shrink-0 md:rounded-none md:bg-transparent md:p-0 md:pl-0">
                        {visiblePlatforms.map(([platform, data]) => (
                          <div
                            key={platform}
                            className="flex items-center gap-1"
                            title={`${platform}: ${formatFollowers(data.followers || 0)} followers`}
                          >
                            <div className={`${getPlatformColor(platform)} rounded p-0.5`}>
                              {getPlatformIcon(platform)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {isFailed ? (
                      <AlertCircle className="hidden h-4 w-4 shrink-0 text-red-600 md:block sm:h-5 sm:w-5" />
                    ) : null}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-700 sm:text-sm">
            Message to send <span className="text-red-500">*</span>
          </label>
          <TextArea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Enter your message"
            disabled={isSending || activeCreators.length === 0}
            className={messageError || isMessageOverLimit ? "border-red-500" : ""}
          />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            {messageError ? (
              <span className="text-[10px] text-red-600 sm:text-xs">{messageError}</span>
            ) : (
              <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
                This message will appear in each creator chat thread for this campaign.
              </p>
            )}

            <div className="flex flex-col items-end gap-1 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
              <span
                className={`text-[10px] sm:text-xs ${
                  isMessageOverLimit ? "font-medium text-red-600" : "text-gray-500"
                }`}
              >
                {messageText.length} / {maxMessageLength} characters
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-gray-200 pt-4 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <CustomButton
            text="Cancel"
            onClick={handleClose}
            disabled={isSending}
            className="btn-secondary w-full sm:w-auto"
          />
          <CustomButton
            text="Send message"
            onClick={handleSendMessages}
            disabled={
              isSending || selectedCount === 0 || activeCreators.length === 0 || isMessageOverLimit
            }
            loading={isSending}
            loadingText="Sending"
            className="btn-primary w-full sm:w-auto"
          />
        </div>
      </div>
    </Modal>
  );
};

export default BulkMessageModal;
