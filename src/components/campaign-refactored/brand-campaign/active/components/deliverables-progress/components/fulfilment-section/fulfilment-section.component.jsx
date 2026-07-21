import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { Check, Copy, ExternalLink, MapPin, Package } from "lucide-react";
import SendProductModal from "./components/send-product-modal/send-product-modal.component";
import useFulfilmentSection from "./use-fulfilment-section.hook";

export default function FulfilmentSection({
  selectedCampaign,
  selectedContract,
  creator,
}) {
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
      <div className="rounded border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <Skeleton className="mb-2 h-4 w-28" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          <Package className="h-3.5 w-3.5 text-gray-500 sm:h-4 sm:w-4" />
          <h4 className="text-sm font-semibold text-gray-800">Fulfilment</h4>
        </div>

        {isConnected && fulfilment && fulfilment.status !== "failed" ? (
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-xs ${
                  fulfilment.status === "delivered"
                    ? "bg-green-50 text-green-700"
                    : fulfilment.status === "shipped"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-indigo-50 text-indigo-700"
                }`}
              >
                {statusLabel}
              </span>
              {fulfilment.shopifyOrderName ? (
                <span className="text-[10px] text-gray-500 sm:text-xs">
                  {fulfilment.shopifyOrderName}
                </span>
              ) : null}
            </div>
            {(fulfilment.productTitle || fulfilment.variantTitle) && (
              <p className="text-[10px] text-gray-700 sm:text-xs">
                {[fulfilment.productTitle, fulfilment.variantTitle].filter(Boolean).join(" · ")}
                {fulfilment.quantity ? ` · Qty ${fulfilment.quantity}` : ""}
              </p>
            )}
            {fulfilment.trackingNumber ? (
              <p className="text-[10px] text-gray-600 sm:text-xs">
                Tracking:{" "}
                {fulfilment.trackingUrl ? (
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
                )}
              </p>
            ) : null}
            {fulfilment.shopifyOrderUrl ? (
              <a
                href={fulfilment.shopifyOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-medium text-primary sm:text-xs"
              >
                View order in Shopify
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : null}
          </div>
        ) : null}

        {isConnected && isFailed ? (
          <div className="mb-3 space-y-2 rounded border border-red-200 bg-red-50 p-2.5 sm:p-3">
            <span className="inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold text-red-700 sm:px-2 sm:text-xs">
              Failed
            </span>
            <p className="text-[10px] leading-snug text-red-700 sm:text-xs">
              {fulfilment?.failureReason ||
                "This product send failed. You can try sending again."}
            </p>
          </div>
        ) : null}

        {isConnected && canSend ? (
          <div className="space-y-2">
            {!fulfilment || isFailed ? (
              <p className="text-[10px] text-gray-600 sm:text-xs">
                Ready to send{" "}
                <span className="font-medium text-gray-800">{defaultProductTitle}</span>
              </p>
            ) : null}
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
                <div className="space-y-1.5">
                  {shippingLines.map((line) => (
                    <div key={line} className="flex items-start gap-2">
                      <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gray-400" />
                      <p className="text-sm leading-relaxed text-gray-700">{line}</p>
                    </div>
                  ))}
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
              <p className="text-sm italic text-gray-500">Shipping address not provided</p>
            )}
            <p className="text-[10px] text-gray-500 sm:text-xs">
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
