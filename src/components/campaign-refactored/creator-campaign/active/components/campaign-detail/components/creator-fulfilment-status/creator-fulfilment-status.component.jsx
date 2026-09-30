import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import { AlertTriangle, Package, Truck } from "lucide-react";
import useCreatorFulfilmentStatus from "./use-creator-fulfilment-status.hook";

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

export default function CreatorFulfilmentStatus({
  selectedCampaign,
  selectedContract,
}) {
  const {
    isEligible,
    isLoading,
    fulfilment,
    statusLabel,
    defaultProductTitle,
  } = useCreatorFulfilmentStatus({
    selectedCampaign,
    selectedContract,
  });

  if (!isEligible) return null;

  if (isLoading && !fulfilment) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <div className="mb-3 flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
        </div>
      </div>
    );
  }

  const hasOrder = Boolean(fulfilment) && fulfilment.status !== "failed";
  const isFailed = fulfilment?.status === "failed";
  const displayProduct =
    fulfilment?.productTitle || defaultProductTitle || "Campaign product";
  const displayVariant = fulfilment?.variantTitle || null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
      <div className="mb-3 flex min-w-0 items-center gap-2">
        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-600">
          <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </span>
        <div className="min-w-0 text-left">
          <h4 className="text-sm font-semibold text-gray-900">Your product</h4>
          <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
            {hasOrder
              ? "Sent to your shipping address"
              : isFailed
                ? "There was a problem with the last send"
                : "Waiting for the brand to send your product"}
          </p>
        </div>
      </div>

      {hasOrder ? (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-xs ${statusPillClass(
                fulfilment.status
              )}`}
            >
              {fulfilment.status === "shipped" ||
              fulfilment.status === "delivered" ? (
                <Truck className="h-3 w-3" />
              ) : (
                <Package className="h-3 w-3" />
              )}
              {statusLabel}
            </span>
            {fulfilment.shopifyOrderName ? (
              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-gray-700 sm:text-xs">
                {fulfilment.shopifyOrderName}
              </span>
            ) : null}
          </div>

          <div className="space-y-1.5">
            <SummaryRow label="Product" value={displayProduct} />
            {displayVariant ? (
              <SummaryRow label="Variant" value={displayVariant} />
            ) : null}
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

          <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
            This is a free gift order. You do not pay for shipping.
          </p>
        </div>
      ) : null}

      {isFailed ? (
        <div className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 sm:p-3">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-600" />
            <span className="text-[10px] font-semibold text-amber-800 sm:text-xs">
              Send delayed
            </span>
          </div>
          <p className="text-left text-[10px] leading-snug text-amber-800 sm:text-xs">
            The brand had trouble sending this product and can try again. You
            don’t need to do anything.
          </p>
        </div>
      ) : null}

      {!fulfilment ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-2.5 py-3">
          <p className="text-[10px] leading-snug text-gray-600 sm:text-xs">
            When the brand sends a product to your shipping address, the status
            will appear here (Ordered → Shipped → Delivered).
          </p>
        </div>
      ) : null}
    </div>
  );
}
