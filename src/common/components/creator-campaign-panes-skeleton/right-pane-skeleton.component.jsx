import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

export default function CreatorRightPaneSkeleton({ variant = "active" }) {
  if (variant === "completed") {
    return (
      <div className="w-full bg-white p-4 md:w-[27%]">
        <Skeleton className="mb-4 h-6 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-2 h-8 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-4 md:w-[27%]">
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="mb-6 space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-3">
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
      <Skeleton className="mb-4 h-6 w-32" />
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-3 flex-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
