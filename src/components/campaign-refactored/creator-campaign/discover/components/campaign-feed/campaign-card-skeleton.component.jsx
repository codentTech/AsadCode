import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

function CampaignCardSkeleton() {
  return (
    <div className="h-fit w-full self-start rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-3 sm:p-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
            <Skeleton className="h-14 w-14 shrink-0 rounded-lg sm:h-16 sm:w-16" />
            <div className="min-w-0 flex-1 space-y-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-40" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Skeleton className="h-6 w-20 rounded-lg" />
            <Skeleton className="h-3.5 w-28" />
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="min-w-0 flex-1 space-y-3">
            <Skeleton className="h-3.5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>
            <Skeleton className="h-3.5 w-20" />
            <Skeleton className="h-3 w-2/3" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="mx-auto h-36 w-full max-w-[200px] shrink-0 rounded-lg sm:mx-0 sm:h-44 sm:w-44" />
        </div>
      </div>

      <div className="flex gap-2 border-t border-gray-100 px-3 py-2.5 sm:px-4 sm:py-3">
        <Skeleton className="h-8 flex-1 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  );
}

export default CampaignCardSkeleton;
