import CustomButton from "@/common/components/custom-button/custom-button.component";

const DiscoverLoadMoreBlock = ({
  shownCreatorsCount,
  totalCount,
  progressValue,
  isLoadingMore,
  isDiscoverRefetching,
  onLoadMore,
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold text-gray-800 sm:text-xs">
          Showing {shownCreatorsCount} of {totalCount} creators
        </p>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-600 sm:text-xs">
          {Math.round(progressValue)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${progressValue}%` }}
          aria-hidden
        />
      </div>
      <CustomButton
        text="Load More"
        onClick={onLoadMore}
        loading={isLoadingMore}
        disabled={isDiscoverRefetching}
        className="btn-primary w-full sm:w-auto sm:min-w-[132px] sm:self-end"
      />
    </div>
  </div>
);

export default DiscoverLoadMoreBlock;
