import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import Modal from "@/common/components/modal/modal.component";
import { CircularProgress } from "@mui/material";
import { Check, Copy, MoreVertical, RefreshCw } from "lucide-react";
import useDiscountCodeTracking from "./use-discount-code-tracking.hook";

export default function DiscountCodeTracking({
  selectedCampaign,
  selectedContract,
  isManageEnabled = true,
  title = "Discount code",
}) {
  const {
    isAffiliate,
    isLoading,
    liveCode,
    historyCodes,
    isCodeCopied,
    trackingPaused,
    manageOpen,
    manageMenuRef,
    showRenameModal,
    renameValue,
    setRenameValue,
    showKillConfirm,
    handleCloseKillConfirm,
    showExtendModal,
    extendDateValue,
    setExtendDateValue,
    isRenameLoading,
    isManageActionLoading,
    isKillLoading,
    isExtendLoading,
    canRename,
    canExtendTracking,
    trackingEndDate,
    payoutDate,
    previewPayoutDate,
    formatDisplayDate,
    minExtendDate,
    usageCount,
    usageCap,
    hasUsageCap,
    handleCopyCode,
    handleRefreshCodes,
    handleToggleManage,
    handleOpenRename,
    handleCloseRename,
    handleConfirmRename,
    handleTurnOff,
    handleTurnOn,
    handleOpenKillConfirm,
    handleConfirmKill,
    handleOpenExtend,
    handleCloseExtend,
    handleConfirmExtend,
  } = useDiscountCodeTracking({
    selectedCampaign,
    selectedContract,
    isManageEnabled,
  });

  if (!isAffiliate) return null;

  const showCreatorRefresh = !isManageEnabled;
  const trackingEndLabel = formatDisplayDate(trackingEndDate);
  const payoutLabel = formatDisplayDate(payoutDate);
  const previewPayoutLabel = formatDisplayDate(previewPayoutDate);

  const renderManageButton = () => (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Manage discount code"
      onClick={handleToggleManage}
      disabled={isManageActionLoading}
    >
      {isManageActionLoading ? (
        <CircularProgress size={14} className="text-primary" />
      ) : (
        <MoreVertical className="h-4 w-4" />
      )}
    </button>
  );

  const renderRefreshButton = () => (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
      aria-label="Refresh shopper code"
      onClick={handleRefreshCodes}
      disabled={isLoading}
    >
      {isLoading ? (
        <CircularProgress size={14} className="text-primary" />
      ) : (
        <RefreshCw className="h-4 w-4" />
      )}
    </button>
  );

  const renderLiveRow = () => {
    if (isLoading && !liveCode) {
      return (
        <div className="flex flex-nowrap items-center justify-between gap-2">
          <Skeleton className="h-4 w-28 sm:w-36" />
          <div className="flex shrink-0 items-center gap-1">
            <Skeleton className="h-8 w-8 rounded-md" />
            {isManageEnabled ? <Skeleton className="h-8 w-8 rounded-md" /> : null}
          </div>
        </div>
      );
    }

    if (!liveCode) {
      return (
        <div className="flex items-center justify-between gap-2">
          <CircularProgress size={14} className="shrink-0 text-primary" />
          <span className="text-xs font-semibold text-gray-900 sm:text-sm">Setting up</span>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 sm:text-xs">
            Pending
          </span>
        </div>
      );
    }

    if (liveCode.status === "pending") {
      return (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <CircularProgress size={14} className="shrink-0 text-primary" />
            <span className="text-xs font-semibold text-gray-900 sm:text-sm">Creating</span>
          </div>
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 sm:text-xs">
            Pending
          </span>
        </div>
      );
    }

    if (liveCode.status === "deactivated") {
      return (
        <div className="space-y-2">
          <div className="flex flex-nowrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-gray-400 line-through sm:text-sm">
                {liveCode.code}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 sm:text-xs">
                Deactivated
              </span>
              {isManageEnabled ? (
                <div className="relative" ref={manageMenuRef}>
                  {renderManageButton()}
                  {manageOpen && !isManageActionLoading ? (
                    <div className="absolute right-0 top-9 z-20 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                      <button
                        type="button"
                        className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleTurnOn}
                        disabled={isManageActionLoading}
                      >
                        Turn back on
                      </button>
                      <button
                        type="button"
                        className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handleOpenKillConfirm}
                        disabled={isManageActionLoading}
                      >
                        Kill and reissue
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="flex flex-nowrap items-center justify-between gap-2">
          <p className="min-w-0 truncate bg-gray-200 p-2 rounded-lg text-xs font-semibold text-gray-900 sm:text-sm">
            {liveCode.code}
          </p>
          <div className="relative flex shrink-0 items-center gap-0.5" ref={manageMenuRef}>
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label={isCodeCopied ? "Copied" : "Copy discount code"}
              onClick={handleCopyCode}
              disabled={isManageActionLoading}
            >
              {isCodeCopied ? (
                <Check className="h-4 w-4 text-primary" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
            {isManageEnabled ? (
              <>
                {renderManageButton()}
                {manageOpen && !isManageActionLoading ? (
                  <div className="absolute right-0 top-9 z-20 min-w-[10rem] rounded-md border border-gray-200 bg-white py-1 shadow-md">
                    <button
                      type="button"
                      className={`block w-full px-3 py-1.5 text-left text-xs ${
                        canRename
                          ? "text-gray-700 hover:bg-gray-50"
                          : "cursor-not-allowed text-gray-300"
                      }`}
                      disabled={!canRename || isManageActionLoading}
                      onClick={handleOpenRename}
                    >
                      Rename code
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-1.5 text-left text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleTurnOff}
                      disabled={isManageActionLoading}
                    >
                      Turn off
                    </button>
                    <button
                      type="button"
                      className="block w-full px-3 py-1.5 text-left text-xs text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={handleOpenKillConfirm}
                      disabled={isManageActionLoading}
                    >
                      Kill and reissue
                    </button>
                  </div>
                ) : null}
              </>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h4 className="min-w-0 text-sm font-semibold text-gray-800">{title}</h4>
        {showCreatorRefresh ? renderRefreshButton() : null}
      </div>
      {trackingPaused ? (
        <p className="mb-2 text-[10px] text-gray-500 sm:text-xs">Tracking paused</p>
      ) : null}
      {renderLiveRow()}
      {hasUsageCap ? (
        <p className="mt-2 text-[10px] text-gray-600 sm:text-xs">
          {Number(usageCount) || 0} of {Number(usageCap)} used
        </p>
      ) : null}
      {isManageEnabled && trackingEndLabel ? (
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] text-gray-600 sm:text-xs">
              Tracking ends {trackingEndLabel}
            </p>
            {payoutLabel ? (
              <p className="text-[10px] text-gray-500 sm:text-xs">Payout {payoutLabel}</p>
            ) : null}
          </div>
          {canExtendTracking ? (
            <CustomButton
              text="Extend"
              className="btn-outline"
              onClick={handleOpenExtend}
              disabled={isManageActionLoading}
            />
          ) : null}
        </div>
      ) : null}
      {historyCodes.length > 0 ? (
        <div className="mt-3 border-t border-gray-100 pt-3">
          <div className="mb-2 flex items-center justify-between gap-2 bg-gray-100 p-1.5">
            <p className="text-[10px] font-semibold tracking-wide text-gray-600 sm:text-xs">
              Previous codes
            </p>
            <span className="rounded-full text-[10px] font-medium text-gray-600 sm:text-xs">
              {historyCodes.length}
            </span>
          </div>
          <ul className="space-y-1.5">
            {historyCodes.map((code) => (
              <li
                key={code.id}
                className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-gray-500 line-through sm:text-sm">
                    {code.code}
                  </p>
                  {code.deactivatedAt || code.deactivated_at ? (
                    <p className="mt-0.5 text-[10px] text-gray-400 sm:text-xs">
                      Ended{" "}
                      {new Date(code.deactivatedAt || code.deactivated_at).toLocaleDateString()}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600 sm:px-2 sm:text-xs">
                  Replaced
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Modal
        show={showRenameModal}
        onClose={handleCloseRename}
        title="Rename discount code"
        size="sm"
      >
        <div className="space-y-3">
          <CustomInput
            label="Code"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="CC-CREATOR"
            disabled={isRenameLoading}
          />
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={handleCloseRename}
              disabled={isRenameLoading}
            />
            <CustomButton
              text="Save"
              className="btn-primary"
              onClick={handleConfirmRename}
              disabled={!renameValue.trim() || isRenameLoading}
              loading={isRenameLoading}
            />
          </div>
        </div>
      </Modal>

      <Modal
        show={showExtendModal}
        onClose={handleCloseExtend}
        title="Extend tracking"
        size="sm"
      >
        <div className="space-y-3">
          <CustomInput
            label="New tracking end date"
            type="date"
            value={extendDateValue}
            onChange={(e) => setExtendDateValue(e.target.value)}
            inputProps={minExtendDate ? { min: minExtendDate } : undefined}
            disabled={isExtendLoading}
          />
          {previewPayoutLabel ? (
            <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
              This also moves this creator&apos;s payout date to {previewPayoutLabel}
            </p>
          ) : null}
          <div className="flex justify-end gap-2">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={handleCloseExtend}
              disabled={isExtendLoading}
            />
            <CustomButton
              text="Extend"
              className="btn-primary"
              onClick={handleConfirmExtend}
              disabled={!extendDateValue || isExtendLoading}
              loading={isExtendLoading}
            />
          </div>
        </div>
      </Modal>

      <DeleteConfirmationModal
        openConfirmationPopup={showKillConfirm}
        setOpenConfirmationPopup={handleCloseKillConfirm}
        mainText="Kill and reissue code?"
        subText={`This deactivates ${liveCode?.code || "this code"} and issues a new one. The creator will need the new code. Sales already credited stay on this creator.`}
        confirmText="Kill and reissue"
        closeText="Cancel"
        confirmLoading={isKillLoading}
        confirmLoadingText="Reissuing"
        action={handleConfirmKill}
      />
    </div>
  );
}
