import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

const ROW_KEYS = ["one", "two", "three", "four"];

const MessageTemplatesListSkeleton = () => (
  <div className="space-y-2" aria-hidden>
    {ROW_KEYS.map((key) => (
      <div
        key={key}
        className="rounded-md border border-gray-200 bg-white p-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 shrink-0 rounded" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Skeleton className="h-7 w-7 rounded-md" />
            <Skeleton className="h-7 w-7 rounded-md" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MessageTemplatesListSkeleton;
