import { Skeleton, SkeletonText } from "@/common/components/loader/skeleton-loader.component";

export default function BlogPostSkeleton() {
  return (
    <article className="w-full" aria-busy="true" aria-label="Loading blog post">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <Skeleton className="min-h-[220px] w-full rounded-xl sm:min-h-[280px] lg:min-h-[360px]" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-10 w-full max-w-xl sm:h-12" />
          <Skeleton className="h-4 w-full max-w-lg" />
          <div className="space-y-2 pt-2">
            <Skeleton className="h-3 w-56" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-40" />
          </div>
          <Skeleton className="h-px w-full" />
          <div className="flex items-center gap-2">
            <Skeleton circle className="h-8 w-8" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:gap-10">
        <div className="w-full space-y-4 lg:w-72">
          <div className="rounded-lg border border-gray-200 p-4">
            <Skeleton className="h-3 w-32" />
            <div className="mt-4 space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-11/12" />
              <Skeleton className="h-3 w-10/12" />
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 p-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-2 h-3 w-full" />
            <Skeleton className="mt-4 h-8 w-full rounded-md" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <SkeletonText lines={8} />
          <SkeletonText lines={6} className="mt-6" />
        </div>
      </div>
    </article>
  );
}
