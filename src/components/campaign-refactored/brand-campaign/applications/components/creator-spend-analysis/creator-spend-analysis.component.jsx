import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import FilterModal from "@/components/campaign-refactored/brand-campaign/discover/components/discover-creators/components/filter-modal/filter-modal.component";
import CampaignCreationWizard from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";

import { Filter, List } from "lucide-react";
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
  onSwitchToRejected,
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
    isSwitchingMode,
    individualCollaborations,
    individualCollaborationsLoading,
    campaignsData,
    campaignsLoading,
    filteredCampaignOptions,
    selectedCampaignValue,
    handleToggleChange,
    handleCreatorPreview,
    handleSaveToShortlist,
    confirmSaveToShortlist,
    showSaveToShortlistModal,
    setShowSaveToShortlistModal,
    shortlists,
    mapCreatorForCard,
    handleCampaignChange,
    handleSortChange,
    sortValue,
    sortOptions,
    handleNicheToggle,
    handlePlatformToggle,
    handleFollowerSelect,
    handleGenderSelect,
    handleAgeSelect,
    handleLanguageToggle,
    handleAudienceGenderSelect,
    handleAudienceAgeToggle,
    handleAudienceCountryToggle,
    handleFiltersChange,
    handleAudienceFiltersChange,
    handleClearAllFilters,
    handleApplyFilters,
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

  const leftContentLoading =
    campaignsLoading ||
    isSwitchingMode ||
    (selectedCampaign && (appliedCreatorsLoading || individualCollaborationsLoading));

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
      <div className="shrink-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="p-2.5 sm:p-4">
          <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="w-full min-w-0 sm:w-[280px] bg-gray-100 rounded-lg p-3">
              <CustomSwitch
                label="Campaign Type"
                checked={isMultiCreator}
                onChange={(event) => handleToggleChange(event.target.checked)}
                rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
                parentDivClassName="justify-between"
              />
            </div>
            {onSwitchToRejected && (
              <CustomButton
                text="Rejected"
                onClick={onSwitchToRejected}
                className="btn-outline w-full shrink-0 sm:w-auto"
              />
            )}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3 md:flex-nowrap md:items-center">
            {isMultiCreator && (
              <div className="min-w-0 w-full sm:max-w-[min(100%,280px)] sm:flex-1">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={filteredCampaignOptions}
                  isLoading={campaignsLoading}
                  value={selectedCampaignValue}
                  onChange={handleCampaignChange}
                />
              </div>
            )}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2 md:flex-nowrap">
              <div className="min-w-0 w-full sm:w-44 md:w-[180px] md:max-w-[230px]">
                <SimpleSelect
                  placeHolder="Sort by"
                  options={sortOptions}
                  value={sortValue}
                  onChange={handleSortChange}
                />
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap md:justify-end">
                <CustomButton
                  text="Filters"
                  onClick={() => setShowFilterModal(true)}
                  startIcon={<Filter className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />}
                  className="btn-outline min-w-0 flex-1 sm:flex-none md:flex-none md:min-w-[106px]"
                />
                <CustomButton
                  text="Start a new campaign"
                  onClick={handleOpenModal}
                  className="btn-primary min-w-0 flex-1 sm:flex-none sm:min-w-[10rem] md:w-auto md:max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-4">
        {leftContentLoading ? (
          <SkeletonCardGrid
            count={8}
            gridClass="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3 mb-8"
          />
        ) : selectedCampaign ? (
          <>
            <div className="mb-4 rounded-lg border bg-white p-3 sm:mb-6 sm:p-4">
              {/* <h2 className="text-sm font-semibold text-gray-900 mb-2">
                {selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? "Individual Collaborations"
                  : `Applied for "${selectedCampaign.campaign_title}"`}
              </h2> */}
              <h2 className="text-[10px] font-semibold leading-snug text-gray-900 sm:text-sm">
                {selectedCampaign.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
                  ? `${Array.isArray(individualCollaborations) ? individualCollaborations.length : 0} individual collaboration${Array.isArray(individualCollaborations) && individualCollaborations.length === 1 ? "" : "s"}`
                  : `${appliedCreatorsData?.data?.length || 0} creator${Array.isArray(appliedCreatorsData?.data) && appliedCreatorsData?.data?.length === 1 ? "" : "s"} ${Array.isArray(appliedCreatorsData?.data) && appliedCreatorsData?.data?.length === 1 ? "has" : "have"} applied to this campaign`}
              </h2>
            </div>

            {selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ? (
              Array.isArray(individualCollaborations) && individualCollaborations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <NotFound
                    title="No Creators Found"
                    description="No individual collaborations found at this time. Invite creators to start collaborating."
                  />
                </div>
              ) : (
                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:[grid-template-columns:repeat(auto-fit,minmax(17.5rem,1fr))]">
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
            ) : Array.isArray(appliedCreatorsData?.data) && appliedCreatorsData.data.length > 0 ? (
              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:[grid-template-columns:repeat(auto-fit,minmax(17.5rem,1fr))]">
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <NotFound
              title="No Campaign Selected"
              description="Select a campaign to view applications."
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
        filters={
          filters
            ? {
                ...filters,
                minFollowers: filters.minFollowers ?? filters.min_followers ?? "",
                maxFollowers: filters.maxFollowers ?? filters.max_followers ?? "",
                minRating: filters.minRating ?? filters.min_rating ?? "",
                maxRating: filters.maxRating ?? filters.max_rating ?? "",
              }
            : {}
        }
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
        onNicheToggle={handleNicheToggle}
        onPlatformToggle={handlePlatformToggle}
        onFollowerSelect={handleFollowerSelect}
        onGenderSelect={handleGenderSelect}
        onAgeSelect={handleAgeSelect}
        onLanguageToggle={handleLanguageToggle}
        onAudienceGenderSelect={handleAudienceGenderSelect}
        onAudienceAgeToggle={handleAudienceAgeToggle}
        onAudienceCountryToggle={handleAudienceCountryToggle}
        onFiltersChange={handleFiltersChange}
        onAudienceFiltersChange={handleAudienceFiltersChange}
        onClearAllFilters={handleClearAllFilters}
        onApplyFilters={handleApplyFilters}
      />

      <Modal
        title="Save to Shortlist"
        show={showSaveToShortlistModal}
        onClose={() => setShowSaveToShortlistModal(false)}
      >
        <div>
          <h5 className="text-primary font-bold mb-2">Click the shortlist to save</h5>
          <hr className="border border-primary" />
          {shortlists.length === 0 ? (
            <NotFound
              title="No Shortlists Found"
              description="Create a shortlist first to save creators."
              icon={List}
              showAnimation={false}
              className="py-8"
            />
          ) : (
            <ul className="space-y-2 mt-4">
              {shortlists.map((shortlist) => (
                <li key={shortlist.id}>
                  <div
                    className="w-full text-sm p-2 border border-gray-200 hover:border-primary hover:bg-indigo-50 rounded-lg cursor-pointer transition-all flex items-center"
                    onClick={() => confirmSaveToShortlist(shortlist.id)}
                  >
                    {shortlist.name}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default CreatorSpendAnalysis;
