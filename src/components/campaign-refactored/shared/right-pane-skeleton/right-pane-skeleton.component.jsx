import PropTypes from "prop-types";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

export default function RightPaneSkeleton({ layout = "narrow" }) {
  const isFluid = layout === "fluid";

  return (
    <div
      className={
        isFluid
          ? "flex min-h-0 w-full flex-1 flex-col border-l border-gray-200 bg-white md:max-w-md md:flex-[0_1_38%] lg:max-w-lg lg:flex-[0_1_34%]"
          : "flex h-screen w-[27%] flex-col border-l bg-white"
      }
    >
      <div
        className={
          isFluid
            ? "flex flex-col items-center gap-1 border-b border-gray-100 px-3 pb-3 pt-3 sm:px-4"
            : "flex flex-col items-center gap-1 border-b px-4 pb-4 pt-3"
        }
      >
        <Skeleton
          circle
          className={isFluid ? "h-16 w-16 shrink-0 sm:h-20 sm:w-20" : "h-20 w-20 shrink-0"}
        />
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div
        className={
          isFluid
            ? "flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 sm:gap-4 sm:p-4"
            : "flex flex-col gap-4 overflow-y-auto p-4"
        }
      >
        <div className="grid w-full grid-cols-3 gap-2">
          <Skeleton className="h-9 flex-1 rounded" />
          <Skeleton className="h-9 flex-1 rounded" />
          <Skeleton className="h-9 flex-1 rounded" />
        </div>
        <div className="rounded-lg border p-3">
          <Skeleton className="mb-2 h-4 w-36" />
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded border p-2">
                <Skeleton className="mb-1 h-3 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <Skeleton className="mb-2 h-4 w-40" />
          <Skeleton className="h-20 w-full rounded" />
        </div>
      </div>
    </div>
  );
}

RightPaneSkeleton.propTypes = {
  layout: PropTypes.oneOf(["narrow", "fluid"]),
};
