import { Skeleton, SkeletonText } from "@/common/components/loader/skeleton-loader.component";

function BlogCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="relative aspect-[16/9] w-full bg-gray-100">
        <Skeleton className="h-full w-full rounded-none" />
        <Skeleton className="absolute bottom-2 left-2 h-5 w-24 rounded-full sm:bottom-3 sm:left-3" />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="mt-1 h-4 w-4/5" />
        <div className="mt-2 flex-1 rounded-lg bg-gray-100 p-2">
          <SkeletonText lines={2} />
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export default function BlogIndexSkeleton() {
  return (
    <ul
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
      aria-busy="true"
      aria-label="Loading blog posts"
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <li key={index}>
          <BlogCardSkeleton />
        </li>
      ))}
    </ul>
  );
}
