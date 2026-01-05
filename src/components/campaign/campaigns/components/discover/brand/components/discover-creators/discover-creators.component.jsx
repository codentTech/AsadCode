import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import FilterModal from "./components/filters/filter-modal.component";
import InvitationModal from "@/components/campaign/campaigns/components/invitation-modal/invitation-modal.component";
import ShortlistView from "./components/views/shortlist-view.component";
import CategoryView from "./components/views/category-view.component";
import DiscoverView from "./components/views/discover-view.component";
import useDiscoverCreators from "./use-discover-creators.hook";

function DiscoverCreators({
  selectedShortlist,
  setSelectedShortlist,
  handleCreatorPreview,
  handleSaveToShortlist,
  getSortedCreators,
  handleRemoveFromShortlist,
  handleInviteToApply,
  userCampaigns = [],
}) {
  const {
    scrollRefs,
    creators,
    nicheCategories,
    loading,
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
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerSelect,
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
  } = useDiscoverCreators();

  if (loading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div className="text-center py-12 text-gray-600 text-sm">Loading creators...</div>
      </div>
    );
  }

  const handleBackClick = () => {
    handleBackToDiscover(setSelectedShortlist);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
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
          onFilterClick={() => setShowFilterModal(true)}
          onNewCampaignClick={() => setOpen(true)}
          onNicheToggle={handleNicheToggle}
          onPlatformToggle={handlePlatformToggle}
          onFollowerSelect={handleFollowerSelect}
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
        onFollowerSelect={handleFollowerSelect}
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
        onInviteSent={handleInviteToApply}
      />

      <CampaignCreationWizard open={open} close={() => setOpen(false)} />
    </div>
  );
}

export default DiscoverCreators;
