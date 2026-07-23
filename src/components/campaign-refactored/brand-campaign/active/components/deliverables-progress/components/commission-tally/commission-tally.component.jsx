import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import useCommissionTally from "./use-commission-tally.hook";

export default function CommissionTally({
  selectedCampaign,
  selectedContract,
  title = "Commission tally",
}) {
  const { isAffiliate, isLoading, tally, formatMoney, lockHint } = useCommissionTally({
    selectedCampaign,
    selectedContract,
  });

  if (!isAffiliate) return null;

  if (isLoading && !tally) {
    return (
      <div className="rounded border border-gray-200 bg-white p-3">
        <Skeleton className="mb-2 h-4 w-32" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded border border-gray-200 bg-white p-3">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">{title}</h4>
      {tally?.trackingPaused ? (
        <p className="mb-2 text-[10px] text-gray-500 sm:text-xs">Tracking paused</p>
      ) : null}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <span className="text-[10px] font-semibold text-gray-600 sm:text-xs">
            Attributed sales
          </span>
          <span className="text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
            {formatMoney(tally?.salesTotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5">
          <span className="text-[10px] font-semibold text-gray-600 sm:text-xs">
            Commission
          </span>
          <span className="text-sm font-bold tabular-nums text-gray-900 sm:text-base md:text-lg">
            {formatMoney(tally?.commissionTotal)}
          </span>
        </div>
      </div>
      {lockHint ? (
        <p className="mt-2 text-[10px] leading-snug text-gray-500 sm:text-xs">{lockHint}</p>
      ) : null}
    </div>
  );
}
