import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

export default function CreatorMiddlePaneSkeleton() {
  return (
    <div className="flex-1 border-r border-gray-200 bg-white p-6">
      <Skeleton circle className="mx-auto mb-4 h-20 w-20" />
      <Skeleton className="mx-auto mb-2 h-6 w-48" />
      <Skeleton className="mx-auto mb-6 h-4 w-32" />
      <div className="space-y-4">
        <div className="border rounded-lg p-4">
          <Skeleton className="mb-3 h-4 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="border rounded-lg p-4">
          <Skeleton className="mb-3 h-4 w-32" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
