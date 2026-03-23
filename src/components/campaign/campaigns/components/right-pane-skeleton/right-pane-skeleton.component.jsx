import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

/**
 * Single loading state for the applications right pane (creator details).
 * Use when list is loading or creator details are loading — one skeleton per pane.
 */
export default function RightPaneSkeleton() {
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b gap-1">
        <Skeleton circle className="h-20 w-20 flex-shrink-0" />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="flex flex-col overflow-y-auto p-4 gap-4">
        <div className="grid grid-cols-3 gap-2 w-full">
          <Skeleton className="h-9 flex-1 rounded" />
          <Skeleton className="h-9 flex-1 rounded" />
          <Skeleton className="h-9 flex-1 rounded" />
        </div>
        <div className="rounded-lg border p-3">
          <Skeleton className="h-4 w-36 mb-2" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border rounded p-2">
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg p-3">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-20 w-full rounded" />
        </div>
      </div>
    </div>
  );
}
