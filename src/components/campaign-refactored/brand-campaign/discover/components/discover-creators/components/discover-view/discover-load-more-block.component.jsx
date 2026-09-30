import { Loader2 } from "lucide-react";

const paginationBtnClass =
  "inline-flex h-7 items-center justify-center gap-1.5 px-2.5 text-xs font-medium font-dm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const DiscoverLoadMoreBlock = ({
  shownCreatorsCount,
  totalCount,
  progressValue,
  isLoadingMore,
  isDiscoverRefetching,
  onLoadMore,
}) => {
  const paginationBusy = isLoadingMore || isDiscoverRefetching;

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1.5 border-t border-gray-100 pt-3">
      <p className="text-xs text-gray-500">
        {shownCreatorsCount} of {totalCount}
      </p>
      <div className="h-1 w-20 overflow-hidden rounded-full bg-gray-200 sm:w-28">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressValue}%` }}
          aria-hidden
        />
      </div>
      <button
        type="button"
        onClick={onLoadMore}
        disabled={paginationBusy}
        className={`${paginationBtnClass} rounded-md bg-primary`}
      >
        {isLoadingMore ? <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden /> : null}
        Load More
      </button>
    </div>
  );
};

export default DiscoverLoadMoreBlock;
