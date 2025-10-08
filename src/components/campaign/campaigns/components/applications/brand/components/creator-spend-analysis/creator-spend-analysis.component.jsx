import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import {
  PLATFORM_OPTIONS,
  FOLLOWER_OPTIONS,
  AGE_OPTIONS,
  NICHE_OPTIONS,
  LANGUAGE_OPTIONS,
} from "@/common/constants/options.constant";
import { Filter } from "lucide-react";
import React from "react";
import useCampaignOverview from "../campaign-overview/use-campaign-overview.hook";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  selectedCreator,
  filters,
  onCampaignSelect,
  onFilterChange,
  onClearFilters,
  onMessageClick,
}) => {
  const { creators, formatFollowers, getPlatformColor, open, handleOpenModal, handleCloseModal } =
    useCreatorSpendAnalysis();

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [filterType, setFilterType] = React.useState("creator");
  const { campaignsData, campaignsLoading, campaignOptions } = useCampaignOverview();
  const hasAutoSelected = React.useRef(false);

  // Auto-select first campaign and notify parent once
  React.useEffect(() => {
    if (
      !selectedCampaign &&
      !hasAutoSelected.current &&
      Array.isArray(campaignsData?.data) &&
      campaignsData.data.length > 0 &&
      typeof onCampaignSelect === "function"
    ) {
      onCampaignSelect(campaignsData.data[0]);
      hasAutoSelected.current = true;
    }
  }, [selectedCampaign, campaignsData, onCampaignSelect]);

  // Note: We don't need to fetch data here since it's passed from parent component
  // The parent Applications component handles all API calls and passes the data down

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleSaveToShortlist = (creator) => {};

  const handleInviteClick = (creator, e) => {
    e.stopPropagation();
  };

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

  // Map API data to shared CreatorCard shape
  const mapCreatorForCard = (creator) => {
    const creatorData = creator.creator;
    const profile = creatorData?.creator_profile;
    return {
      id: creatorData.id,
      name: `${creatorData?.first_name || ""} ${creatorData?.last_name || ""}`.trim(),
      profileImage: profile?.profile_photo_url || avatar,
      age: creatorData?.date_of_birth
        ? Math.floor(
            (new Date() - new Date(creatorData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)
          )
        : "N/A",
      location:
        `${creatorData?.city || ""} ${creatorData?.country || ""}`.trim() ||
        "Location not specified",
      rating: 4.5,
      reviewCount: 12,
      followers: 0,
      platforms: (profile?.social_platforms || []).map(({ platform }) => platform).filter(Boolean),
      platformStats: {},
      portfolioImages: profile?.mini_profile_pictures || [],
      niches: profile?.categories || [],
      tagline: creator.pitch || "",
      appliedDate: new Date(creator.applied_at).toLocaleDateString(),
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 w-full">
              <div className="min-w-[240px] w-[260px]">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={campaignOptions}
                  isSearchable={true}
                  isMulti={false}
                  isLoading={campaignsLoading}
                  value={
                    selectedCampaign
                      ? { value: selectedCampaign.id, label: selectedCampaign.campaign_title }
                      : null
                  }
                  onChange={(opt) => {
                    const id = opt?.value;
                    const campaign = campaignsData?.data?.find((c) => c.id === id);
                    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
                  }}
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
            </div>
            <div className="w-full max-w-[200px]">
              <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
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

        {/* No Campaigns Found */}
        {!campaignsLoading &&
          (!Array.isArray(campaignsData?.data) || campaignsData.data.length === 0) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <NotFound
                title="No Campaigns Found"
                description="Create a campaign to see applications here."
              />
            </div>
          )}

        {selectedCampaign ? (
          <>
            {/* Campaign Info */}
            <div className="mb-6 p-4 bg-white rounded-lg border">
              <h2 className="text-sm font-semibold text-gray-900 mb-2">
                Applied Creators for "{selectedCampaign.campaign_title}"
              </h2>
              <p className="text-xs text-gray-600">
                {appliedCreatorsData?.data?.length || 0} creators have applied to this campaign
              </p>
            </div>

            {/* Loading State */}
            {selectedCampaign && appliedCreatorsLoading && (
              <div className="text-center py-8 flex flex-col items-center">
                <Loader loading={true} />
                <p className="text-xs text-gray-500 mt-2">Loading creators...</p>
              </div>
            )}

            {/* Applied Creators Grid */}
            {!appliedCreatorsLoading &&
              Array.isArray(appliedCreatorsData?.data) &&
              appliedCreatorsData.data.length > 0 && (
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
                          onMessageCreator={onMessageClick}
                          onInviteClick={() => {}}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

            {/* No Creators Found */}
            {!appliedCreatorsLoading &&
              (!Array.isArray(appliedCreatorsData?.data) ||
                appliedCreatorsData.data.length === 0) && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <NotFound
                    title="No Creators Found"
                    description="Try adjusting filters or selecting a different campaign."
                  />
                </div>
              )}
          </>
        ) : null}
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
                <CustomInput
                  label="Country"
                  placeholder="Enter country"
                  value={filters?.country || ""}
                  onChange={(e) => onFilterChange && onFilterChange("country", e.target.value)}
                />
                <CustomInput
                  label="City"
                  placeholder="Enter city"
                  value={filters?.city || ""}
                  onChange={(e) => onFilterChange && onFilterChange("city", e.target.value)}
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
