import { Loader2 } from "lucide-react";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";
import PageHeader from "../page-header/page-header.component";
import ActiveFilters from "../active-filters/active-filters.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NicheCategory from "../niche-category/niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";

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
  onLoadMore,
  onRangeChanged,
  scrollParent,
}) => {
  const shownCreatorsCount = creators.length;
  const totalCount = totalCreatorsCount || shownCreatorsCount;
  const progressValue = totalCount > 0 ? Math.min((shownCreatorsCount / totalCount) * 100, 100) : 0;
  const showLoadMore = hasMoreCreators && shownCreatorsCount < totalCount;
  const paginationBusy = isLoadingMore || isDiscoverRefetching;

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
      />

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

      {hasActiveFilters() || searchKeyword || selectedSort ? (
        <div className="space-y-4 relative min-h-[280px]">
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
              <CreatorGrid
                creators={creators}
                onCreatorPreview={onCreatorPreview}
                onSaveToShortlist={onSaveToShortlist}
                onRemoveFromShortlist={onRemoveFromShortlist}
                onInviteClick={onInviteClick}
                onEndReached={onLoadMore}
                onRangeChanged={onRangeChanged}
                scrollParent={scrollParent}
              />
              {loadMoreSection}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 relative min-h-[320px]">
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
              <CreatorGrid
                creators={creators}
                onCreatorPreview={onCreatorPreview}
                onSaveToShortlist={onSaveToShortlist}
                onRemoveFromShortlist={onRemoveFromShortlist}
                onInviteClick={onInviteClick}
                onEndReached={onLoadMore}
                onRangeChanged={onRangeChanged}
                scrollParent={scrollParent}
              />
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
