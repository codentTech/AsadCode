import { Loader2 } from "lucide-react";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import PageHeader from "../page-header/page-header.component";
import ActiveFilters from "../active-filters/active-filters.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NicheCategory from "../niche-category/niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";
import DiscoverLoadMoreBlock from "./discover-load-more-block.component";
import useDiscoverView from "./use-discover-view.hook";

const DiscoverView = ({
  scrollContainerRef,
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
}) => {
  const { loadMoreAnchorRef, showLoadMoreBar, shownCreatorsCount, totalCount, progressValue } =
    useDiscoverView({
      hasMoreCreators,
      scrollContainerRef,
      creators,
      nicheCategories,
      totalCreatorsCount,
      isDiscoverInitialLoading,
    });

  const loadMoreEndSentinel = (
    <div ref={loadMoreAnchorRef} className="h-px w-full shrink-0 scroll-mt-4" aria-hidden />
  );

  const loadMoreBlock = showLoadMoreBar ? (
    <DiscoverLoadMoreBlock
      shownCreatorsCount={shownCreatorsCount}
      totalCount={totalCount}
      progressValue={progressValue}
      isLoadingMore={isLoadingMore}
      isDiscoverRefetching={isDiscoverRefetching}
      onLoadMore={onLoadMore}
    />
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
              className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-16 pointer-events-none"
              aria-busy="true"
              aria-label="Loading creators"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : null}
          {isDiscoverInitialLoading && creators.length === 0 ? (
            <SkeletonCardGrid
              count={8}
              gridClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-4"
            />
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
              />
              {loadMoreEndSentinel}
              {loadMoreBlock}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6 relative min-h-[320px]">
          {isDiscoverRefetching ? (
            <div
              className="absolute inset-0 z-10 flex items-start justify-center bg-white/70 pt-24 pointer-events-none"
              aria-busy="true"
              aria-label="Loading creators"
            >
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : null}
          {isDiscoverInitialLoading && nicheCategories.length === 0 ? (
            <SkeletonCardGrid
              count={8}
              gridClass="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-5 gap-4"
            />
          ) : nicheCategories.length === 0 ? (
            <NotFound
              title="No Creators Found"
              description="No creators found. Try adjusting your search or filters."
            />
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
              {loadMoreEndSentinel}
              {loadMoreBlock}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
