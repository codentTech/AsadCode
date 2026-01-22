import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loading from "@/common/components/loadar/loading.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import FilterModal from "@/components/campaign/campaigns/components/discover/brand/components/discover-creators/components/filters/filter-modal.component";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { Filter } from "lucide-react";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";

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

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
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

          <div className="flex items-center justify-between gap-3">
            {isMultiCreator && (
              <div className="min-w-[240px] w-[260px]">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={filteredCampaignOptions}
                  isLoading={campaignsLoading}
                  value={selectedCampaignValue}
                  onChange={(opt) => {
                    const id = opt?.value;
                    const campaign = campaignsData?.data?.find((c) => c.id === id);
                    if (onCampaignSelect && campaign) onCampaignSelect(campaign);
                  }}
                />
              </div>
            )}

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
        {campaignsLoading && <Loading />}

        {selectedCampaign ? (
          <>
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
                <Loading />
              ) : Array.isArray(individualCollaborations) &&
                individualCollaborations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <NotFound
                    title="No Creators Found"
                    description="No individual collaborations found at this time. Invite creators to start collaborating."
                  />
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
                  <Loading />
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

      <FilterModal
        show={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        filterType={filterType}
        setFilterType={setFilterType}
        filters={filters || {}}
        audienceFilters={
          filters
            ? {
                audienceGender: filters.audienceGender || "",
                audienceAgeRanges: filters.audienceAgeRanges || [],
                audienceCountries: filters.audienceCountries || [],
                audienceCity: filters.audienceCity || "",
              }
            : {}
        }
        onNicheToggle={(niche) => {
          const current = filters?.niches || [];
          const next = current.includes(niche)
            ? current.filter((n) => n !== niche)
            : [...current, niche];
          onFilterChange && onFilterChange("niches", next);
        }}
        onPlatformToggle={(platform) => {
          const current = filters?.platforms || [];
          const next = current.includes(platform)
            ? current.filter((p) => p !== platform)
            : [...current, platform];
          onFilterChange && onFilterChange("platforms", next);
        }}
        onFollowerSelect={(minFollowers) => {
          onFilterChange && onFilterChange("min_followers", minFollowers);
        }}
        onGenderSelect={(gender) => {
          onFilterChange && onFilterChange("gender", gender);
        }}
        onAgeSelect={(ageRange) => {
          onFilterChange && onFilterChange("ageRange", ageRange);
        }}
        onLanguageToggle={(language) => {
          const current = filters?.languages || [];
          const next = current.includes(language)
            ? current.filter((l) => l !== language)
            : [...current, language];
          onFilterChange && onFilterChange("languages", next);
        }}
        onAudienceGenderSelect={(audienceGender) => {
          onFilterChange && onFilterChange("audienceGender", audienceGender);
        }}
        onAudienceAgeToggle={(ageRange) => {
          const current = filters?.audienceAgeRanges || [];
          const next = current.includes(ageRange)
            ? current.filter((a) => a !== ageRange)
            : [...current, ageRange];
          onFilterChange && onFilterChange("audienceAgeRanges", next);
        }}
        onAudienceCountryToggle={(country) => {
          const current = filters?.audienceCountries || [];
          const next = current.includes(country)
            ? current.filter((c) => c !== country)
            : [...current, country];
          onFilterChange && onFilterChange("audienceCountries", next);
        }}
        onFiltersChange={(updatedFilters) => {
          if (onFilterChange) {
            Object.keys(updatedFilters).forEach((key) => {
              onFilterChange(key, updatedFilters[key]);
            });
          }
        }}
        onAudienceFiltersChange={(updatedAudienceFilters) => {
          if (onFilterChange) {
            Object.keys(updatedAudienceFilters).forEach((key) => {
              onFilterChange(key, updatedAudienceFilters[key]);
            });
          }
        }}
        onClearAllFilters={() => {
          onClearFilters && onClearFilters();
        }}
        onApplyFilters={() => {
          setShowFilterModal(false);
        }}
      />
    </div>
  );
};

export default CreatorSpendAnalysis;
