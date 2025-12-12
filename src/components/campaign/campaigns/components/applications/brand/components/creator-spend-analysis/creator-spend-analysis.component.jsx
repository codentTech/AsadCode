import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import Modal from "@/common/components/modal/modal.component";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import {
  PLATFORM_OPTIONS,
  FOLLOWER_OPTIONS,
  AGE_OPTIONS,
  NICHE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/common/constants/options.constant";
import { Filter, Search } from "lucide-react";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  onClearCreator,
  filters,
  onCampaignSelect,
  onFilterChange,
  onClearFilters,
  fetchIndividualCollaborations: fetchFromHook,
}) => {
  const {
    open,
    handleOpenModal,
    handleCloseModal,
    showFilterModal,
    setShowFilterModal,
    filterType,
    setFilterType,
    isMultiCreator,
    individualCollaborations,
    individualCollaborationsLoading,
    campaignsData,
    campaignsLoading,
    filteredCampaignOptions,
    isSelectedCampaignValid,
    selectedCampaignValue,
    handleToggleChange,
    handleCreatorPreview,
    handleSaveToShortlist,
    mapCreatorForCard,
    handleSortChange,
    sortOptions,
  } = useCreatorSpendAnalysis({
    selectedCampaign,
    appliedCreatorsData,
    appliedCreatorsLoading,
    onCreatorSelect,
    onClearCreator,
    filters,
    onCampaignSelect,
    onFilterChange,
    onClearFilters,
    fetchIndividualCollaborations: fetchFromHook,
  });

  // FilterButton component for consistent styling
  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          {/* Toggle Switch - First Row */}
          <div className="mb-3">
            <div className="bg-gray-100 rounded-lg p-3 max-w-[200px]">
              <CustomSwitch
                label="Campaign Type"
                checked={isMultiCreator}
                onChange={handleToggleChange}
                rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
                parentDivClassName="justify-between"
              />
            </div>
          </div>

          {/* Campaign Dropdown, Sort, Filters, and Start Campaign - Second Row */}
          <div className="flex items-center justify-between gap-3">
            {/* Campaign Dropdown - Left Side (only for Multi-Creator) */}
            {isMultiCreator ? (
              <div className="min-w-[240px] w-[260px]">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={filteredCampaignOptions}
                  isSearchable={true}
                  isMulti={false}
                  isLoading={campaignsLoading}
                  value={selectedCampaignValue}
                  onChange={(opt) => {
                    const id = opt?.value;
                    const campaign = campaignsData?.data?.find((c) => c.id === id);
                    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
                  }}
                />
              </div>
            ) : (
              <div></div>
            )}

            {/* Sort, Filters, and Start Campaign - Right Side */}
            <div className="flex items-center gap-3">
              <div className="w-full min-w-[230px]">
                <SimpleSelect
                  placeHolder="Sort by"
                  options={sortOptions}
                  value={
                    filters?.sort
                      ? {
                          value: filters.sort,
                          label: sortOptions.find((opt) => opt.value === filters.sort)?.label,
                        }
                      : null
                  }
                  onChange={handleSortChange}
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
                  onClick={handleOpenModal}
                  className="btn-primary !h-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Campaigns Loading */}
        {campaignsLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader loading={true} />
            <p className="text-xs text-gray-500 mt-2">Loading campaigns...</p>
          </div>
        )}

        {selectedCampaign ? (
          <>
            {/* Campaign Info */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                {selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? "Individual Collaborations"
                  : `Applied for "${selectedCampaign.campaign_title}"`}
              </h2>
              <p className="text-xs text-gray-600">
                {selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? `${Array.isArray(individualCollaborations) ? individualCollaborations.length : 0} individual collaboration${Array.isArray(individualCollaborations) && individualCollaborations.length !== 1 ? "s" : ""}`
                  : `${appliedCreatorsData?.data?.length || 0} creators have applied to this campaign`}
              </p>
            </div>

            {selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ? (
              individualCollaborationsLoading ? (
                <div className="text-center py-12 flex flex-col items-center">
                  <Loader loading={true} />
                  <p className="text-xs text-gray-500 mt-3">Loading collaborations...</p>
                </div>
              ) : Array.isArray(individualCollaborations) &&
                individualCollaborations.length === 0 ? (
                <div className="w-full flex flex-col items-center justify-center py-20 min-h-[300px]">
                  <div className="text-center max-w-sm">
                    <div className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">No Creators Found</h2>
                    <p className="text-sm text-gray-500">
                      No individual collaborations found at this time. Invite creators to start
                      collaborating.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                  {individualCollaborations.map((invitation) => {
                    const mapped = mapCreatorForCard(invitation);
                    return (
                      <div key={invitation.id} onClick={() => handleCreatorPreview(invitation)}>
                        <CreatorCard
                          creator={mapped}
                          tab="applications"
                          appliedDate={mapped.appliedDate}
                          onCreatorPreview={handleCreatorPreview}
                          onSaveToShortlist={handleSaveToShortlist}
                          onRemoveFromShortlist={() => {}}
                          onInviteClick={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <>
                {appliedCreatorsLoading ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <Loader loading={true} />
                    <p className="text-xs text-gray-500 mt-3">Loading creators...</p>
                  </div>
                ) : Array.isArray(appliedCreatorsData?.data) &&
                  appliedCreatorsData.data.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                    {appliedCreatorsData.data.map((creator) => {
                      const mapped = mapCreatorForCard(creator);
                      return (
                        <div key={creator.id} onClick={() => handleCreatorPreview(creator)}>
                          <CreatorCard
                            creator={mapped}
                            tab="applications"
                            appliedDate={mapped.appliedDate}
                            onCreatorPreview={handleCreatorPreview}
                            onSaveToShortlist={handleSaveToShortlist}
                            onRemoveFromShortlist={() => {}}
                            onInviteClick={() => {}}
                          />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20">
                    <NotFound
                      title="No Creators Found"
                      description="No creators have applied to this campaign yet. Try adjusting your filters or selecting a different campaign."
                    />
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <NotFound
              title="No Creators Found"
              description="No creators have applied to this campaign yet. Try adjusting your filters or selecting a different campaign."
            />
          </div>
        )}
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />

      {/* Filters Modal */}
      <Modal
        title="Filter Creators"
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        size="lg"
      >
        <div className="space-y-6">
          {/* Filter Type Toggle */}
          <div className="flex items-center justify-center">
            <div className="bg-gray-100 rounded-lg p-1 flex">
              <button
                onClick={() => setFilterType("creator")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "creator"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Creator Filters
              </button>
              <button
                onClick={() => setFilterType("audience")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  filterType === "audience"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Audience Filters
              </button>
            </div>
          </div>

          {/* Creator Filters */}
          {filterType === "creator" && (
            <div className="space-y-6">
              {/* Niche Categories */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Niche Categories</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {NICHE_OPTIONS.map((niche) => (
                    <FilterButton
                      key={niche.value}
                      active={filters?.niches?.includes(niche.value)}
                      onClick={() => {
                        const current = filters?.niches || [];
                        const next = current.includes(niche.value)
                          ? current.filter((n) => n !== niche.value)
                          : [...current, niche.value];
                        onFilterChange && onFilterChange("niches", next);
                      }}
                    >
                      {niche.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Platforms */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Platforms</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <FilterButton
                      key={platform.value}
                      active={filters?.platforms?.includes(platform.value)}
                      onClick={() => {
                        const current = filters?.platforms || [];
                        const next = current.includes(platform.value)
                          ? current.filter((p) => p !== platform.value)
                          : [...current, platform.value];
                        onFilterChange && onFilterChange("platforms", next);
                      }}
                    >
                      {platform.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Minimum Followers */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Minimum Followers</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {FOLLOWER_OPTIONS.map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters?.min_followers === option.value}
                      onClick={() =>
                        onFilterChange && onFilterChange("min_followers", option.value)
                      }
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Demographics */}
              <div className="grid grid-cols-1 gap-4">
                {/* Gender filter removed - field doesn't exist in backend schema */}

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Age Range</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {AGE_OPTIONS.map((option) => (
                      <FilterButton
                        key={option.value}
                        active={filters?.ageRange === option.value}
                        onClick={() => onFilterChange && onFilterChange("ageRange", option.value)}
                      >
                        {option.label}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Language</h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {LANGUAGE_OPTIONS.map((option) => (
                      <FilterButton
                        key={option.value}
                        active={filters?.languages?.includes(option.value)}
                        onClick={() => {
                          const current = filters?.languages || [];
                          const next = current.includes(option.value)
                            ? current.filter((l) => l !== option.value)
                            : [...current, option.value];
                          onFilterChange && onFilterChange("languages", next);
                        }}
                      >
                        {option.label}
                      </FilterButton>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-2 gap-4">
                <CountrySelect
                  label="Country"
                  value={
                    filters?.country
                      ? {
                          countryName: filters.country,
                          countryCode: filters?.countryCode || "",
                        }
                      : null
                  }
                  onChange={(option) => {
                    if (!onFilterChange) return;
                    onFilterChange("country", option?.countryName || "");
                    onFilterChange("countryCode", option?.countryCode || "");
                    onFilterChange("city", "");
                    onFilterChange("cityCountryCode", "");
                  }}
                  helperText=""
                />
                <CitySelect
                  label="City"
                  countryCode={filters?.countryCode || ""}
                  value={
                    filters?.city
                      ? {
                          cityName: filters.city,
                          countryCode: filters?.cityCountryCode || filters?.countryCode || "",
                        }
                      : null
                  }
                  onChange={(option) => {
                    onFilterChange && onFilterChange("city", option?.cityName || "");
                    onFilterChange && onFilterChange("cityCountryCode", option?.countryCode || "");
                  }}
                  disabled={!filters?.country}
                />
              </div>
            </div>
          )}

          {/* Audience Filters */}
          {filterType === "audience" && (
            <div className="space-y-6">
              {/* Audience Gender */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Audience Gender</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "mostly-male", label: "Mostly Male" },
                    { value: "mostly-female", label: "Mostly Female" },
                  ].map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters?.audienceGender === option.value}
                      onClick={() =>
                        onFilterChange && onFilterChange("audienceGender", option.value)
                      }
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Audience Age Ranges */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Age Ranges</h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {[
                    { value: "13-17", label: "13–17" },
                    { value: "18-24", label: "18–24" },
                    { value: "25-34", label: "25–34" },
                    { value: "35-44", label: "35–44" },
                    { value: "45-54", label: "45–54" },
                    { value: "55+", label: "55+" },
                  ].map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters?.audienceAgeRanges?.includes(option.value)}
                      onClick={() => {
                        const current = filters?.audienceAgeRanges || [];
                        const next = current.includes(option.value)
                          ? current.filter((a) => a !== option.value)
                          : [...current, option.value];
                        onFilterChange && onFilterChange("audienceAgeRanges", next);
                      }}
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Audience Countries */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Countries</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {[
                    { value: "us", label: "US" },
                    { value: "ca", label: "Canada" },
                    { value: "uk", label: "UK" },
                    { value: "au", label: "Australia" },
                    { value: "de", label: "Germany" },
                    { value: "fr", label: "France" },
                    { value: "es", label: "Spain" },
                    { value: "it", label: "Italy" },
                  ].map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters?.audienceCountries?.includes(option.value)}
                      onClick={() => {
                        const current = filters?.audienceCountries || [];
                        const next = current.includes(option.value)
                          ? current.filter((c) => c !== option.value)
                          : [...current, option.value];
                        onFilterChange && onFilterChange("audienceCountries", next);
                      }}
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>

              {/* Audience City */}
              <div>
                <CustomInput
                  label="Audience City"
                  placeholder="Enter audience city"
                  value={filters?.audienceCity || ""}
                  onChange={(e) => onFilterChange && onFilterChange("audienceCity", e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex justify-between items-center mt-6">
          <CustomButton onClick={onClearFilters} text="Clear All" className="btn-cancel" />
          <div className="flex gap-3">
            <CustomButton
              onClick={() => setShowFilterModal(false)}
              text="Cancel"
              className="btn-cancel"
            />
            <CustomButton
              onClick={() => setShowFilterModal(false)}
              text="Apply Filters"
              className="btn-primary"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreatorSpendAnalysis;
