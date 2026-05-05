import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

export default function CreatorLeftPaneSkeleton() {
  return (
    <div className="w-full border-r border-gray-200 bg-white p-4 space-y-3 md:w-[23%]">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="mb-3 flex items-center gap-3">
            <Skeleton circle className="h-12 w-12" />
            <div className="flex-1">
              <Skeleton className="mb-2 h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
          <Skeleton className="mb-1 h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  );
}
