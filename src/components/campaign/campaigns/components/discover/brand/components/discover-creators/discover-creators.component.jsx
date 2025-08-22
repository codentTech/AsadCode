import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";

import CreatorCard from "./components/creator-card.component";
import FilterModal from "./components/filter-modal.component";
import InviteModal from "./components/invite-modal.component";
import ActiveFilters from "./components/active-filters.component";
import useDiscoverCreators from "./use-discover-creators.hook";

import { ArrowLeft, ChevronRight, Filter, Users } from "lucide-react";
import { SORT_BY_OPTIONS } from "@/common/constants/options.constant";

function DiscoverCreators({
  selectedShortlist,
  setSelectedShortlist,
  handleCreatorPreview,
  handleSaveToShortlist,
  handleMessageCreator,
  getSortedCreators,
  handleRemoveFromShortlist,
  handleInviteToApply,
  userCampaigns = [],
}) {
  const {
    // Data
    scrollRefs,
    creators,
    nicheCategories,
    loading,
    error,

    // State
    filters,
    setFilters,
    audienceFilters,
    setAudienceFilters,
    searchKeyword,
    selectedSort,
    setSelectedSort,
    selectedCategory,
    filteredCreators,

    // Modal states
    open,
    setOpen,
    showInviteModal,
    setShowInviteModal,
    selectedCreator,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,

    // Functions
    hasActiveFilters,

    // Handlers
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

  // Reusable Components
  const SearchAndSortControls = ({ className = "" }) => (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="w-full min-w-[230px] bg-white">
        <CustomInput
          placeholder="Search creators"
          value={searchKeyword}
          startIcon={<SearchIcon />}
          onChange={handleSearchChange}
        />
      </div>

      <div className="w-full min-w-[230px]">
        <SimpleSelect
          placeHolder="Sort by"
          options={SORT_BY_OPTIONS}
          onChange={(opt) => setSelectedSort(opt?.value || "")}
        />
      </div>

      <div className="relative">
        <CustomButton
          text="Filters"
          onClick={() => setShowFilterModal(true)}
          startIcon={<Filter size={18} />}
          className="btn-outline !h-10"
        />
      </div>

      <div className="w-full max-w-[200px]">
        <CustomButton
          text="Start a new campaign"
          onClick={() => setOpen(true)}
          className="btn-primary !h-10"
        />
      </div>
    </div>
  );

  const PageHeader = ({ title, description, showControls = true }) => (
    <div className="bg-white border-b p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{title}</h1>
          {description && <p className="text-gray-600">{description}</p>}
        </div>
        {showControls && <SearchAndSortControls />}
      </div>
    </div>
  );

  const ViewHeader = ({ title, count, showBackButton = false, showControls = false }) => (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <button
            onClick={() => handleBackToDiscover(setSelectedShortlist)}
            className="cursor-pointer hover:text-primary transition-colors"
          >
            <ArrowLeft />
          </button>
        )}
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
          {count !== undefined && (
            <span className="text-lg text-gray-600"> ({count} creators)</span>
          )}
        </h3>
      </div>
      {showControls && <SearchAndSortControls />}
    </div>
  );

  const EmptyState = ({ title, description }) => (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
      <h4 className="text-lg font-medium text-gray-900 mb-1">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );

  const CreatorGrid = ({ creators: creatorsData, isShortlist = false }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {creatorsData.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          isShortlist={isShortlist}
          onCreatorPreview={handleCreatorPreview}
          onSaveToShortlist={handleSaveToShortlist}
          onRemoveFromShortlist={handleRemoveFromShortlist}
          onMessageCreator={handleMessageCreator}
          onInviteClick={handleInviteClick}
        />
      ))}
    </div>
  );

  const NicheCategory = ({ category }) => (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold text-gray-900">{category.name}</h4>
        <button
          onClick={() => handleSeeMoreClick(category)}
          className="flex items-center space-x-1 text-primary hover:text-indigo-800 text-sm font-medium transition-colors"
        >
          <span>See More</span>
          <ChevronRight size={14} />
        </button>
      </div>

      <div
        ref={(el) => {
          scrollRefs.current[category.id] = el;
        }}
        className="flex overflow-x-auto space-x-4 pb-4 scrollbar-thin scrollbar-thumb-gray-300 scroll-smooth snap-x"
      >
        {category.creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            onCreatorPreview={handleCreatorPreview}
            onSaveToShortlist={handleSaveToShortlist}
            onRemoveFromShortlist={handleRemoveFromShortlist}
            onMessageCreator={handleMessageCreator}
            onInviteClick={handleInviteClick}
          />
        ))}
      </div>
      <hr className="border-gray-200" />
    </div>
  );

  // Loading and Error States
  if (loading) {
    return (
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div className="text-center py-12 text-gray-600 text-sm">Loading creators...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div className="text-center py-12 text-red-600 text-sm">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
      {/* Shortlist View */}
      {selectedShortlist && (
        <div className="space-y-4">
          <ViewHeader
            title={selectedShortlist.name}
            count={getSortedCreators().length}
            showBackButton={true}
          />
          {getSortedCreators().length === 0 ? (
            <EmptyState
              title="No creators yet"
              description="Browse the Discover feed to add creators."
            />
          ) : (
            <CreatorGrid creators={getSortedCreators()} isShortlist={true} />
          )}
        </div>
      )}

      {/* Category View */}
      {selectedCategory && !selectedShortlist && (
        <div className="space-y-4">
          <ViewHeader
            title={selectedCategory.name}
            count={filteredCreators.length}
            showBackButton={true}
          />
          {filteredCreators.length === 0 ? (
            <EmptyState
              title="No creators yet"
              description="Browse the Discover feed to add creators."
            />
          ) : (
            <CreatorGrid creators={filteredCreators} />
          )}
        </div>
      )}

      {/* Main Discover View */}
      {!selectedShortlist && !selectedCategory && (
        <div className="space-y-6">
          <PageHeader
            title="Discover Creators"
            description="Find the perfect creators for your campaigns"
          />

          {/* Active Filters */}
          {hasActiveFilters() && (
            <ActiveFilters
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
            />
          )}

          {/* Main Content */}
          {hasActiveFilters() || searchKeyword || selectedSort ? (
            <div className="space-y-4">
              {creators.length === 0 ? (
                <EmptyState
                  title="No creators found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                <CreatorGrid creators={creators} />
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {nicheCategories.length === 0 ? (
                <EmptyState
                  title="No categories found"
                  description="Try adjusting your search or filters."
                />
              ) : (
                nicheCategories.map((category) => (
                  <NicheCategory key={category.id} category={category} />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals */}
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

      <InviteModal
        show={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        selectedCreator={selectedCreator}
        userCampaigns={userCampaigns}
        onInviteToApply={handleInviteToApply}
      />

      <CampaignCreationWizard open={open} close={() => setOpen(false)} />
    </div>
  );
}

export default DiscoverCreators;
