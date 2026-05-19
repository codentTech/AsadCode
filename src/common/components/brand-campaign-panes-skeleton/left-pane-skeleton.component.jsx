import PropTypes from "prop-types";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";

const STANDALONE_ROOT =
  "hidden min-h-0 w-full shrink-0 space-y-4 border-r border-gray-200 bg-white p-4 md:block md:w-[min(100%,288px)] md:max-w-[26%] lg:max-w-[300px]";
const EMBEDDED_ROOT =
  "flex h-full min-h-0 w-full min-w-0 flex-1 flex-col space-y-4 bg-white p-3 sm:p-4";

export default function LeftPaneSkeleton({ embedded = false }) {
  return (
    <div className={embedded ? EMBEDDED_ROOT : STANDALONE_ROOT}>
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <div className="mt-4 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-lg border p-3">
            <Skeleton className="mb-2 h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

LeftPaneSkeleton.propTypes = {
  embedded: PropTypes.bool,
};
