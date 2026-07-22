import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { AlertTriangle, Check, Copy, ExternalLink, MapPin, Package, Truck } from "lucide-react";
import SendProductModal from "./components/send-product-modal/send-product-modal.component";
import useFulfilmentSection from "./use-fulfilment-section.hook";

function statusPillClass(status) {
  if (status === "delivered") return "bg-green-50 text-green-700 border-green-200";
  if (status === "shipped") return "bg-blue-50 text-blue-700 border-blue-200";
  if (status === "failed") return "bg-red-50 text-red-700 border-red-200";
  return "bg-indigo-50 text-indigo-700 border-indigo-200";
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-md bg-gray-100 px-2.5 py-2">
      <span className="shrink-0 text-[10px] font-semibold text-gray-600 sm:text-xs">{label}</span>
      <span className="max-w-[70%] text-right text-[10px] font-medium leading-snug text-gray-900 sm:text-xs">
        {value || "—"}
      </span>
    </div>
  );
}

export default function FulfilmentSection({ selectedCampaign, selectedContract, creator }) {
  const {
    isEligible,
    isLoading,
    isConnected,
    fulfilment,
    statusLabel,
    isFailed,
    canSend,
    defaultProductTitle,
    showSendModal,
    isAddressCopied,
    isSendLoading,
    sendError,
    productOptions,
    productsLoading,
    initialProductId,
    initialVariantId,
    shippingAddress,
    shippingLines,
    creatorName,
    handleOpenSendModal,
    handleCloseSendModal,
    handleCopyAddress,
    handleSendProduct,
  } = useFulfilmentSection({
    selectedCampaign,
    selectedContract,
    creator,
  });

  if (!isEligible) return null;

  if (isLoading && !fulfilment) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  const showActiveOrder = isConnected && fulfilment && fulfilment.status !== "failed";
  const displayProduct = fulfilment?.productTitle || defaultProductTitle || "—";
  const displayVariant = fulfilment?.variantTitle || null;

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">
              <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
            <div className="min-w-0 text-left">
              <h4 className="text-sm font-semibold text-gray-900">Fulfilment</h4>
              <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
                {isConnected
                  ? showActiveOrder
                    ? "Product send status for this creator"
                    : isFailed
                      ? "Last send failed — you can try again"
                      : "Send a free product order from Shopify"
                  : "Copy the creator address to ship manually"}
              </p>
            </div>
          </div>
        </div>

        {showActiveOrder ? (
          <div className="space-y-2.5">
            <div className="flex justify-between items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-xs ${statusPillClass(
                  fulfilment.status
                )}`}
              >
                {fulfilment.status === "shipped" || fulfilment.status === "delivered" ? (
                  <Truck className="h-3 w-3" />
                ) : (
                  <Package className="h-3 w-3" />
                )}
                {statusLabel}
              </span>
              {fulfilment.shopifyOrderName ? (
                <span className="rounded bg-primary text-white px-1.5 py-0.5 text-[10px] font-medium tabular-nums sm:text-xs">
                  {fulfilment.shopifyOrderName}
                </span>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <SummaryRow label="Product" value={displayProduct} />
              {displayVariant ? <SummaryRow label="Variant" value={displayVariant} /> : null}
              <SummaryRow
                label="Quantity"
                value={fulfilment.quantity ? String(fulfilment.quantity) : null}
              />
              {fulfilment.trackingNumber ? (
                <SummaryRow
                  label="Tracking"
                  value={
                    fulfilment.trackingUrl ? (
                      <a
                        href={fulfilment.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                      >
                        {fulfilment.trackingNumber}
                      </a>
                    ) : (
                      fulfilment.trackingNumber
                    )
                  }
                />
              ) : null}
            </div>

            {fulfilment.shopifyOrderUrl ? (
              <a
                href={fulfilment.shopifyOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-end gap-1.5 text-[10px] font-medium text-primary sm:text-xs"
              >
                View order in Shopify
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        ) : null}

        {isConnected && isFailed ? (
          <div className="mb-3 space-y-2 rounded-lg border border-red-200 bg-red-50 p-2.5 sm:p-3">
            <div className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-red-600" />
              <span className="text-[10px] font-semibold text-red-700 sm:text-xs">Failed</span>
            </div>
            <p className="text-left text-[10px] leading-snug text-red-700 sm:text-xs">
              {fulfilment?.failureReason || "This product send failed. You can try sending again."}
            </p>
          </div>
        ) : null}

        {isConnected && canSend ? (
          <div className={`space-y-2.5 ${isFailed ? "" : showActiveOrder ? "mt-3" : ""}`}>
            {(!fulfilment || isFailed) && (
              <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-2.5 py-2 sm:px-3">
                <p className="text-[10px] text-gray-500 sm:text-xs">Ready to send</p>
                <p className="mt-0.5 text-xs font-semibold text-gray-900 sm:text-sm">
                  {defaultProductTitle}
                </p>
              </div>
            )}
            <CustomButton
              text="Send Product"
              className="btn-primary w-full"
              onClick={handleOpenSendModal}
            />
          </div>
        ) : null}

        {!isConnected ? (
          <div className="space-y-3">
            {shippingLines?.length ? (
              <>
                <div className="rounded-md border border-gray-100 bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500" />
                    <span className="text-[10px] font-semibold text-gray-700 sm:text-xs">
                      Shipping address
                    </span>
                  </div>
                  <div className="space-y-1 text-left">
                    {shippingLines.map((line) => (
                      <p key={line} className="text-[11px] leading-snug text-gray-700 sm:text-xs">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
                <CustomButton
                  text={isAddressCopied ? "Copied!" : "Copy Shipping Address"}
                  className={`w-full text-xs ${
                    isAddressCopied
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                      : "btn-secondary"
                  }`}
                  onClick={handleCopyAddress}
                  icon={
                    isAddressCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />
                  }
                  disabled={isAddressCopied}
                />
              </>
            ) : (
              <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-2.5 py-3 text-center">
                <p className="text-[10px] italic text-gray-500 sm:text-xs">
                  Shipping address not provided
                </p>
              </div>
            )}
            <p className="text-left text-[10px] leading-snug text-gray-500 sm:text-xs">
              Connect Shopify in Settings to send products from CleerCut.
            </p>
          </div>
        ) : null}
      </div>

      <SendProductModal
        show={showSendModal}
        creatorName={creatorName}
        productOptions={productOptions}
        productsLoading={productsLoading}
        initialProductId={initialProductId}
        initialVariantId={initialVariantId}
        shippingAddress={shippingAddress}
        shippingLines={shippingLines}
        isSendLoading={isSendLoading}
        sendError={sendError}
        onSend={handleSendProduct}
        onClose={handleCloseSendModal}
      />
    </>
  );
}
