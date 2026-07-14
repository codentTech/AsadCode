import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

const ROW_KEYS = ["outreach", "negotiation", "active", "completed"];

const MessageTemplatesListSkeleton = () => (
  <div className="overflow-hidden rounded-lg border border-gray-200" aria-hidden>
    {ROW_KEYS.map((key, index) => (
      <div key={key} className={index === 0 ? "" : "border-t border-gray-200"}>
        <div className="flex items-center gap-3 px-4 py-3.5">
          <Skeleton className="h-4 w-4 shrink-0 rounded" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="ml-auto h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>
      </div>
    ))}
  </div>
);

export default MessageTemplatesListSkeleton;
