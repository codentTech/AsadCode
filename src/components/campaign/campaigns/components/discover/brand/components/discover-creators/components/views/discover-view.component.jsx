import { Loader2 } from "lucide-react";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import PageHeader from "../headers/page-header.component";
import ActiveFilters from "../filters/active-filters.component";
import CreatorGrid from "../grid/creator-grid.component";
import NicheCategory from "../grid/niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";

const DiscoverView = ({
  isDiscoverInitialLoading = false,
  isDiscoverRefetching = false,
  searchKeyword,
  selectedSort,
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
  onFollowerSelect,
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
}) => {
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
          onFollowerSelect={onFollowerSelect}
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
            <CreatorGrid
              creators={creators}
              onCreatorPreview={onCreatorPreview}
              onSaveToShortlist={onSaveToShortlist}
              onRemoveFromShortlist={onRemoveFromShortlist}
              onInviteClick={onInviteClick}
            />
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
            nicheCategories.map((category) => (
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
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default DiscoverView;
