import { Skeleton, SkeletonText } from "@/common/components/loader/skeleton-loader.component";

export default function BlogPostSkeleton() {
  return (
    <article
      className="w-full space-y-4 sm:space-y-6"
      aria-busy="true"
      aria-label="Loading blog post"
    >
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <Skeleton className="aspect-[16/9] w-full rounded-none lg:aspect-[2.5/1]" />
        <div className="border-t border-indigo-100 bg-white px-4 py-4">
          <Skeleton className="mt-2 h-6 w-full max-w-2xl sm:h-7" />
          <div className="mt-2 w-full rounded-lg bg-gray-100 p-2">
            <Skeleton className="h-3 w-full sm:h-4" />
            <Skeleton className="mt-1.5 h-3 w-4/5 sm:h-4" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
        <div className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 shadow-sm lg:col-span-2">
          <SkeletonText lines={8} />
          <SkeletonText lines={6} className="mt-4" />
          <SkeletonText lines={4} className="mt-4" />
        </div>

        <aside className="flex flex-col gap-4 lg:col-span-1">
          <div className="rounded-xl border border-indigo-100 bg-white p-4">
            <Skeleton className="h-3 w-24" />
            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-2">
                <Skeleton circle className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Skeleton circle className="mt-0.5 h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
            </div>
          </div>
          <Skeleton className="h-10 w-full rounded-xl" />
        </aside>
      </div>
    </article>
  );
}
