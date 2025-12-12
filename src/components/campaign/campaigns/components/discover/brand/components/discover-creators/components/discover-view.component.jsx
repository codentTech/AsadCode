import PageHeader from "./page-header.component";
import ActiveFilters from "./active-filters.component";
import CreatorGrid from "./creator-grid.component";
import NicheCategory from "./niche-category.component";
import NotFound from "@/common/components/not-found/not-found.component";

const DiscoverView = ({
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
        <div className="space-y-4">
          {creators.length === 0 ? (
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
        <div className="space-y-6">
          {nicheCategories.length === 0 ? (
            <NotFound
              title="No Niches Found"
              description="No niches found. Try adjusting your search or filters."
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

