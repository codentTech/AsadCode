import PropTypes from "prop-types";
import { Skeleton, SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";

const ROOT_DEFAULT =
  "min-h-0 flex-1 border-r border-gray-200 bg-white p-3 sm:p-4";
const ROOT_EMBEDDED =
  "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col bg-white p-3 sm:p-4";
const ROOT_APPLICATIONS =
  "flex min-h-0 min-w-0 w-full flex-1 flex-col border-r border-gray-200 bg-white p-3 sm:p-4";
const GRID_DEFAULT = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3";
const GRID_APPLICATIONS =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3";

export default function MiddlePaneSkeleton({ variant = "default", embedded = false }) {
  const rootClassName =
    variant === "applications"
      ? ROOT_APPLICATIONS
      : embedded
        ? ROOT_EMBEDDED
        : ROOT_DEFAULT;
  const gridClassName = variant === "applications" ? GRID_APPLICATIONS : GRID_DEFAULT;

  return (
    <div className={rootClassName}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {variant === "applications" ? (
          <>
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="h-10 w-full max-w-[10rem] animate-pulse rounded bg-gray-200 sm:w-32" />
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full max-w-[10rem]" />
          </>
        )}
      </div>
      <SkeletonCardGrid count={6} gridClass={gridClassName} />
    </div>
  );
}

MiddlePaneSkeleton.propTypes = {
  variant: PropTypes.oneOf(["default", "applications"]),
  embedded: PropTypes.bool,
};
