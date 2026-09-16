import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { AlertTriangle, CheckCircle2, ExternalLink, Store } from "lucide-react";
import useShopifyIntegration from "./use-shopify.hook";

export default function ShopifyIntegration() {
  const {
    hasMounted,
    shopInput,
    handleShopInputChange,
    handleConnect,
    handleDisconnectClick,
    handleConfirmDisconnect,
    handleCloseDisconnectConfirm,
    showDisconnectConfirm,
    setShowDisconnectConfirm,
    disconnectConfirmSubText,
    isConnected,
    isAccessLost,
    statusConfig,
    connection,
    connectionLoading,
    connectLoading,
    disconnectLoading,
  } = useShopifyIntegration();

  if (!hasMounted) {
    return (
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Shopify</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Connect your Shopify store to run Affiliate campaigns and track sales on CleerCut.
        </p>
      </div>
    );
  }

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
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusConfig.badgeColor}`}
                      >
                        {statusConfig.badge}
                      </span>
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

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="p-3 sm:p-6">
            <h2 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">
              How Shopify works
            </h2>
            <ul className="mb-6 space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Connect your store once
                  </p>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Enter your Shopify domain and approve access. CleerCut links to that store for
                    your brand only — one store per brand.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Run Affiliate campaigns
                  </p>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Pick products from your catalogue, set shopper discount and creator commission,
                    then hire creators as usual.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Codes mint when creators accept
                  </p>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    CleerCut creates a unique discount code in your Shopify store for each creator.
                    They share it with their audience; sales happen on your storefront.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />
                <div>
                  <p className="text-xs font-medium text-gray-900 sm:text-sm">
                    Track sales and pay commission
                  </p>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Orders using those codes are attributed in CleerCut. After tracking ends and a
                    return hold, commission is settled through Stripe.
                  </p>
                </div>
              </li>
            </ul>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="mb-3 text-xs font-semibold text-gray-900 sm:text-sm">Quick tips</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="mb-1 text-xs font-medium text-gray-800 sm:text-sm">
                    What domain should I enter?
                  </h4>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Use your <span className="font-medium">.myshopify.com</span> domain (e.g.{" "}
                    <span className="font-medium">mystore.myshopify.com</span>) or just the store
                    handle (<span className="font-medium">mystore</span>). Custom domains alone
                    usually will not work for connect.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-medium text-gray-800 sm:text-sm">
                    Can I reconnect later?
                  </h4>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    Yes. Reconnecting the same store resumes tracking without reminting existing
                    codes. Disconnecting pauses sales tracking while campaigns are live.
                  </p>
                </div>
                <div>
                  <h4 className="mb-1 text-xs font-medium text-gray-800 sm:text-sm">
                    Do creators connect Shopify?
                  </h4>
                  <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
                    No. Only brands connect a store. Creators see their own discount code and
                    campaign results — not your Shopify admin.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        id={0}
        openConfirmationPopup={showDisconnectConfirm}
        setOpenConfirmationPopup={(open) => {
          if (open) setShowDisconnectConfirm(true);
          else handleCloseDisconnectConfirm();
        }}
        mainText="Disconnect Shopify?"
        subText={disconnectConfirmSubText}
        confirmText="Disconnect"
        closeText="Cancel"
        confirmLoading={disconnectLoading}
        action={handleConfirmDisconnect}
        type="danger"
      />
    </>
  );
}
