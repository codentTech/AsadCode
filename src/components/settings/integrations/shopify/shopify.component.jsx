import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { AlertTriangle, ExternalLink, Store } from "lucide-react";
import useShopifyIntegration from "./use-shopify.hook";

export default function ShopifyIntegration() {
  const {
    shopInput,
    handleShopInputChange,
    handleConnect,
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleCloseDisconnectConfirm,
    showDisconnectConfirm,
    isConnected,
    isAccessLost,
    statusConfig,
    connection,
    connectionLoading,
    connectLoading,
    disconnectLoading,
  } = useShopifyIntegration();

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Shopify</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Connect your Shopify store to run Affiliate campaigns and track sales on CleerCut.
        </p>
      </div>

      <div className="space-y-6">
        {isAccessLost && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 sm:p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <h3 className="mb-1 text-xs font-semibold text-amber-900 sm:text-sm">
                  Sales tracking is paused
                </h3>
                <p className="text-xs text-amber-900 sm:text-sm">
                  We have lost connection to your Shopify. Reconnect the same store to resume
                  tracking. Existing codes are not reminted.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-3 sm:p-6">
            <div className="mb-4 flex items-center justify-between sm:mb-6">
              <h2 className="text-sm font-semibold text-gray-900 sm:text-lg">Shopify store</h2>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                    <Store className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusConfig.badgeColor}`}
                      >
                        {statusConfig.badge}
                      </span>
                      {(connection?.shopName || connection?.shopDomain) && (
                        <span className="truncate text-xs text-gray-600 sm:text-sm">
                          {connection?.shopName || connection?.shopDomain}
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-[10px] leading-snug text-gray-500 sm:text-xs">
                      {statusConfig.description}
                    </p>
                  </div>
                </div>

                {isConnected ? (
                  <CustomButton
                    text="Disconnect"
                    className="btn-danger-outline w-full sm:w-auto"
                    onClick={handleDisconnectClick}
                    loading={disconnectLoading}
                    disabled={disconnectLoading || connectionLoading}
                  />
                ) : null}
              </div>

              {!isConnected && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
                  <p className="mb-3 text-xs text-gray-700 sm:text-sm">
                    Enter your Shopify store domain to connect. Use{" "}
                    <span className="font-medium">mystore</span> or{" "}
                    <span className="font-medium">mystore.myshopify.com</span>.
                  </p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                    <div className="min-w-0 flex-1">
                      <CustomInput
                        label="Store domain"
                        placeholder="mystore.myshopify.com"
                        value={shopInput}
                        onChange={handleShopInputChange}
                      />
                    </div>
                    <CustomButton
                      text="Connect Shopify"
                      className="btn-primary w-full sm:w-auto"
                      onClick={handleConnect}
                      startIcon={<ExternalLink size={16} />}
                      loading={connectLoading}
                      disabled={connectLoading || !shopInput.trim()}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        id={0}
        openConfirmationPopup={showDisconnectConfirm}
        setOpenConfirmationPopup={(open) => {
          if (!open) handleCloseDisconnectConfirm();
        }}
        mainText="Disconnect Shopify?"
        subText="You have a live campaign. Disconnecting will stop sales tracking. Are you sure?"
        confirmText="Disconnect"
        closeText="Cancel"
        confirmLoading={disconnectLoading}
        action={handleConfirmDisconnect}
        type="danger"
      />
    </>
  );
}
