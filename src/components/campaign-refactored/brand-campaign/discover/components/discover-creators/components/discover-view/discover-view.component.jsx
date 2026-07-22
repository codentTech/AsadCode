import { Loader2 } from "lucide-react";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CREATOR_CARD_GRID_CLASS } from "@/common/constants/creator-card-layout.constant";
import PageHeader from "../page-header/page-header.component";
import ActiveFilters from "../active-filters/active-filters.component";
import CreatorGrid from "../creator-grid/creator-grid.component";
import NicheCategory from "../niche-category/niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";

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
}) => {
  const shownCreatorsCount = creators.length;
  const totalCount = totalCreatorsCount || shownCreatorsCount;
  const progressValue = totalCount > 0 ? Math.min((shownCreatorsCount / totalCount) * 100, 100) : 0;

  const loadMoreSection = hasMoreCreators ? (
    <div className="sticky bottom-2 z-[5] rounded-xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 sm:bottom-3 sm:p-4">
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
              />
              {loadMoreSection}
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
            <SkeletonCardGrid count={8} gridClass={CREATOR_CARD_GRID_CLASS} />
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
              {loadMoreSection}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
