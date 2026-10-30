import { Bookmark, Loader2, UserPlus, X } from "lucide-react";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";
import PageHeader from "../page-header/page-header.component";
import ActiveFilters from "../active-filters/active-filters.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NicheCategory from "../niche-category/niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";
import useDiscoverView from "./use-discover-view.hook";

const paginationBtnClass =
  "inline-flex h-7 items-center justify-center gap-1.5 px-2.5 text-xs font-medium font-dm text-white transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const DiscoverView = ({
  isDiscoverInitialLoading = false,
  isDiscoverRefetching = false,
  searchKeyword,
  selectedSort,
  isLoadingMore = false,
  hasMoreCreators = false,
  totalCreatorsCount = 0,
  hasActiveFilters,
  filters,
  audienceFilters,
  creators,
  nicheCategories,
  scrollRefs,
  onSearchChange,
  onSortChange,
  onFilterClick,
  onNewCampaignClick,
  onNicheToggle,
  onPlatformToggle,
  onFollowerRangeChange,
  onGenderSelect,
  onAgeSelect,
  onLanguageToggle,
  onAudienceGenderSelect,
  onAudienceAgeToggle,
  onAudienceCountryToggle,
  onFiltersChange,
  onAudienceFiltersChange,
  onClearAllFilters,
  onSeeMoreClick,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  onBulkInvite,
  onBulkSaveToShortlist,
  onLoadMore,
  onRangeChanged,
  scrollParent,
}) => {
  const shownCreatorsCount = creators.length;
  const totalCount = totalCreatorsCount || shownCreatorsCount;
  const progressValue = totalCount > 0 ? Math.min((shownCreatorsCount / totalCount) * 100, 100) : 0;
  const showLoadMore = hasMoreCreators && shownCreatorsCount < totalCount;
  const paginationBusy = isLoadingMore || isDiscoverRefetching;

  const {
    isBulkMode,
    selectedCreatorIds,
    selectedCount,
    shownCount,
    allShownSelected,
    handleEnterBulkMode,
    handleCreatorToggle,
    handleSelectAllShown,
    handleClearSelection,
    handleBulkInvite,
    handleBulkSaveToShortlist,
  } = useDiscoverView({
    creators,
    onBulkInvite,
    onBulkSaveToShortlist,
  });

  const loadMoreSection = showLoadMore ? (
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
  ) : null;

  const creatorGrid = (
    <CreatorGrid
      creators={creators}
      isBulkMode={isBulkMode}
      selectedCreatorIds={selectedCreatorIds}
      onCreatorPreview={onCreatorPreview}
      onCreatorToggle={handleCreatorToggle}
      onSaveToShortlist={onSaveToShortlist}
      onRemoveFromShortlist={onRemoveFromShortlist}
      onInviteClick={onInviteClick}
      onEndReached={onLoadMore}
      onRangeChanged={onRangeChanged}
      scrollParent={scrollParent}
    />
  );

  const showFilteredOrSearchLayout = hasActiveFilters() || searchKeyword || selectedSort;
  const canBulkSelect = creators.length > 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Creators"
        description="Find the perfect creators for your campaigns"
        searchKeyword={searchKeyword}
        onSearchChange={onSearchChange}
        selectedSort={selectedSort}
        onSortChange={onSortChange}
        onFilterClick={onFilterClick}
        onNewCampaignClick={onNewCampaignClick}
        onBulkSelectClick={handleEnterBulkMode}
        isBulkMode={isBulkMode}
        showBulkSelect={canBulkSelect}
      />

      {isBulkMode && canBulkSelect && (
        <div className="rounded-lg border border-gray-200 bg-white">
          <div className="flex flex-col gap-3 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-4">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <label className="inline-flex h-9 min-h-9 cursor-pointer items-center gap-2 rounded-md border border-primary bg-white px-3 text-xs font-medium text-primary sm:h-10 sm:min-h-10">
                <input
                  type="checkbox"
                  checked={allShownSelected}
                  onChange={handleSelectAllShown}
                  className="h-4 w-4 rounded border-primary/40 text-primary focus:ring-primary"
                />
                Select all {shownCount} shown
              </label>
              <div className="inline-flex h-9 min-h-9 items-center rounded-md border border-primary bg-white px-3 sm:h-10 sm:min-h-10">
                <span className="text-xs font-semibold text-primary">
                  {selectedCount} selected
                </span>
              </div>
              {selectedCount === 0 && (
                <span className="text-[10px] text-gray-500 sm:text-xs">
                  Select at least one creator
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CustomButton
                text="Invite to Apply"
                onClick={handleBulkInvite}
                disabled={selectedCount === 0}
                startIcon={<UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-primary flex-1 sm:flex-none"
              />
              <CustomButton
                text="Add to Shortlist"
                onClick={handleBulkSaveToShortlist}
                disabled={selectedCount === 0}
                startIcon={<Bookmark className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-outline flex-1 sm:flex-none"
              />
              <CustomButton
                text="Clear Selection"
                onClick={handleClearSelection}
                startIcon={<X className="h-3 w-3 sm:h-4 sm:w-4" />}
                className="btn-outline flex-1 sm:flex-none"
              />
            </div>
          </div>
        </div>
      )}

      {hasActiveFilters() && (
        <ActiveFilters
          filters={filters}
          audienceFilters={audienceFilters}
          onNicheToggle={onNicheToggle}
          onPlatformToggle={onPlatformToggle}
          onFollowerRangeChange={onFollowerRangeChange}
          onGenderSelect={onGenderSelect}
          onAgeSelect={onAgeSelect}
          onLanguageToggle={onLanguageToggle}
          onAudienceGenderSelect={onAudienceGenderSelect}
          onAudienceAgeToggle={onAudienceAgeToggle}
          onAudienceCountryToggle={onAudienceCountryToggle}
          onFiltersChange={onFiltersChange}
          onAudienceFiltersChange={onAudienceFiltersChange}
          onClearAllFilters={onClearAllFilters}
        />
      )}

      {showFilteredOrSearchLayout || isBulkMode ? (
        <div className="relative min-h-[280px] space-y-4">
          {isDiscoverRefetching ? (
            <div
              className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm"
              aria-busy="true"
              aria-label="Loading creators"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}
          {isDiscoverInitialLoading && creators.length === 0 ? (
            <SkeletonCardGrid count={8} gridClass={CREATOR_CARD_GRID_CLASS} />
          ) : creators.length === 0 ? (
            <NotFound
              title="No Creators Found"
              description="Try adjusting your search or filters."
            />
          ) : (
            <div className="space-y-4">
              {creatorGrid}
              {loadMoreSection}
            </div>
          )}
        </div>
      ) : (
        <div className="relative min-h-[320px] space-y-6">
          {isDiscoverRefetching ? (
            <div
              className="pointer-events-none absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 shadow-sm"
              aria-busy="true"
              aria-label="Loading creators"
            >
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
            </div>
          ) : null}
          {isDiscoverInitialLoading && nicheCategories.length === 0 && creators.length === 0 ? (
            <SkeletonCardGrid count={8} gridClass={CREATOR_CARD_GRID_CLASS} />
          ) : nicheCategories.length === 0 && creators.length === 0 ? (
            <NotFound
              title="No Creators Found"
              description="No creators found. Try adjusting your search or filters."
            />
          ) : nicheCategories.length === 0 ? (
            <div className="space-y-4">
              {creatorGrid}
              {loadMoreSection}
            </div>
          ) : (
            <div className="space-y-6">
              {nicheCategories.map((category) => (
                <NicheCategory
                  key={category.id}
                  category={category}
                  scrollRef={(el) => {
                    scrollRefs.current[category.id] = el;
                  }}
                  onSeeMoreClick={onSeeMoreClick}
                  onCreatorPreview={onCreatorPreview}
                  onSaveToShortlist={onSaveToShortlist}
                  onRemoveFromShortlist={onRemoveFromShortlist}
                  onInviteClick={onInviteClick}
                />
              ))}
              {loadMoreSection}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
