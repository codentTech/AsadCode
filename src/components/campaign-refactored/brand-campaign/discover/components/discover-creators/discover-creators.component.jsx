import { useRef } from "react";
import InvitationModal from "@/components/campaign-refactored/shared/invitation-modal/invitation-modal.component";
import CampaignCreationWizard from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";
import FilterModal from "./components/filter-modal/filter-modal.component";
import CategoryView from "./components/category-view/category-view.component";
import DiscoverView from "./components/discover-view/discover-view.component";
import ShortlistView from "./components/shortlist-view/shortlist-view.component";
import useDiscoverCreators from "./use-discover-creators.hook";

function DiscoverCreators({
  selectedShortlist,
  setSelectedShortlist,
  handleCreatorPreview,
  handleSaveToShortlist,
  getSortedCreators,
  handleRemoveFromShortlist,
  handleInviteToApply,
  onRefreshCampaigns,
  isCampaignsLoading = false,
  userCampaigns = [],
}) {
  const {
    scrollRefs,
    creators,
    nicheCategories,
    isDiscoverInitialLoading,
    isDiscoverRefetching,
    isLoadingMore,
    totalCreatorsCount,
    filters,
    setFilters,
    audienceFilters,
    setAudienceFilters,
    searchKeyword,
    selectedSort,
    setSelectedSort,
    selectedCategory,
    filteredCreators,
    open,
    setOpen,
    showInviteModal,
    setShowInviteModal,
    selectedCreator,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    hasActiveFilters,
    hasMoreCreators,
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerRangeChange,
    handleGenderSelect,
    handleAgeSelect,
    handleLanguageToggle,
    handleAudienceGenderSelect,
    handleAudienceAgeToggle,
    handleAudienceCountryToggle,
    handleSeeMoreClick,
    handleBackToDiscover,
    clearAllFilters,
    handleInviteClick,
    handleSearchChange,
    handleApplyFilters,
    handleLoadMore,
  } = useDiscoverCreators();

  const discoverScrollRef = useRef(null);

  const handleBackClick = () => {
    handleBackToDiscover(setSelectedShortlist);
  };

  return (
    <div
      ref={discoverScrollRef}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-gray-100 p-2 sm:p-4"
    >
      {selectedShortlist && (
        <ShortlistView
          selectedShortlist={selectedShortlist}
          getSortedCreators={getSortedCreators}
          onBackClick={handleBackClick}
          onCreatorPreview={handleCreatorPreview}
          onSaveToShortlist={handleSaveToShortlist}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onInviteClick={handleInviteClick}
        />
      )}

      {selectedCategory && !selectedShortlist && (
        <CategoryView
          selectedCategory={selectedCategory}
          filteredCreators={filteredCreators}
          onBackClick={handleBackClick}
          onCreatorPreview={handleCreatorPreview}
          onSaveToShortlist={handleSaveToShortlist}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onInviteClick={handleInviteClick}
        />
      )}

      {!selectedShortlist && !selectedCategory && (
        <DiscoverView
          scrollContainerRef={discoverScrollRef}
          isDiscoverInitialLoading={isDiscoverInitialLoading}
          isDiscoverRefetching={isDiscoverRefetching}
          searchKeyword={searchKeyword}
          selectedSort={selectedSort}
          hasActiveFilters={hasActiveFilters}
          filters={filters}
          audienceFilters={audienceFilters}
          creators={creators}
          nicheCategories={nicheCategories}
          scrollRefs={scrollRefs}
          onSearchChange={handleSearchChange}
          onSortChange={setSelectedSort}
          isLoadingMore={isLoadingMore}
          hasMoreCreators={hasMoreCreators}
          totalCreatorsCount={totalCreatorsCount}
          onFilterClick={() => setShowFilterModal(true)}
          onNewCampaignClick={() => setOpen(true)}
          onNicheToggle={handleNicheToggle}
          onPlatformToggle={handlePlatformToggle}
          onFollowerRangeChange={handleFollowerRangeChange}
          onGenderSelect={handleGenderSelect}
          onAgeSelect={handleAgeSelect}
          onLanguageToggle={handleLanguageToggle}
          onAudienceGenderSelect={handleAudienceGenderSelect}
          onAudienceAgeToggle={handleAudienceAgeToggle}
          onAudienceCountryToggle={handleAudienceCountryToggle}
          onFiltersChange={setFilters}
          onAudienceFiltersChange={setAudienceFilters}
          onClearAllFilters={clearAllFilters}
          onSeeMoreClick={handleSeeMoreClick}
          onCreatorPreview={handleCreatorPreview}
          onSaveToShortlist={handleSaveToShortlist}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onInviteClick={handleInviteClick}
          onLoadMore={handleLoadMore}
        />
      )}

      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterType={filterType}
        setFilterType={setFilterType}
        filters={filters}
        audienceFilters={audienceFilters}
        onNicheToggle={handleNicheToggle}
        onPlatformToggle={handlePlatformToggle}
        onFollowerRangeChange={handleFollowerRangeChange}
        onGenderSelect={handleGenderSelect}
        onAgeSelect={handleAgeSelect}
        onLanguageToggle={handleLanguageToggle}
        onAudienceGenderSelect={handleAudienceGenderSelect}
        onAudienceAgeToggle={handleAudienceAgeToggle}
        onAudienceCountryToggle={handleAudienceCountryToggle}
        onFiltersChange={setFilters}
        onAudienceFiltersChange={setAudienceFilters}
        onClearAllFilters={clearAllFilters}
        onApplyFilters={handleApplyFilters}
      />

      <InvitationModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        selectedCreator={selectedCreator}
        userCampaigns={userCampaigns}
        onRefreshCampaigns={onRefreshCampaigns}
        isCampaignsLoading={isCampaignsLoading}
        onInviteSent={handleInviteToApply}
      />

      <CampaignCreationWizard open={open} close={() => setOpen(false)} />
    </div>
  );
}

export default DiscoverCreators;
