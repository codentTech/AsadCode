import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import Modal from "@/common/components/modal/modal.component";
import NotFound from "@/common/components/not-found/not-found.component";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import FilterModal from "@/components/campaign-refactored/brand-campaign/discover/components/discover-creators/components/filter-modal/filter-modal.component";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import CampaignCreationWizard from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";
import ApplicationsSubtabToggle from "../applications-subtab-toggle/applications-subtab-toggle.component";
import PinnedInvitedSection from "../pinned-invited-section/pinned-invited-section.component";
import { Menu, MenuItem } from "@mui/material";
import { EllipsisVertical, Filter, List } from "lucide-react";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";

const GRID_CLASS =
  "mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:[grid-template-columns:repeat(auto-fit,minmax(17.5rem,1fr))]";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  onClearCreator,
  filters,
  onCampaignSelect,
  onFilterChange,
  onFiltersReplace,
  onClearFilters,
  fetchIndividualCollaborations: fetchFromHook,
  onSwitchToRejected,
  applicationsSubTab,
  onApplicationsSubTabChange,
  subTabCounts,
  displayCreators,
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
    sortedAppliedCreators,
    pinnedAppliedCreators,
    unpinnedAppliedCreators,
    pinnedIndividualCreators,
    unpinnedIndividualCreators,
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
    handleFollowerRangeChange,
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
    showCloseListingMenu,
    isSelectedCampaignListingOpen,
    isClosingListing,
    menuAnchorEl,
    showCloseListingModal,
    campaignToClose,
    handleMenuOpen,
    handleMenuClose,
    handleRequestCloseListing,
    handleCancelCloseListing,
    handleConfirmCloseListing,
  } = useCreatorSpendAnalysis({
    selectedCampaign,
    appliedCreatorsData,
    appliedCreatorsLoading,
    onCreatorSelect,
    onClearCreator,
    filters,
    onCampaignSelect,
    onFilterChange,
    onFiltersReplace,
    onClearFilters,
    fetchIndividualCollaborations: fetchFromHook,
    applicationsSubTab,
    displayCreators,
  });

  const leftContentLoading =
    campaignsLoading ||
    isSwitchingMode ||
    (selectedCampaign && (appliedCreatorsLoading || individualCollaborationsLoading));

  const renderCreatorCard = (sourceRow) => {
    const mapped = mapCreatorForCard(sourceRow);
    const rowKey = sourceRow.id || sourceRow.creator?.id || mapped.id;

    return (
      <div key={rowKey} onClick={() => handleCreatorPreview(sourceRow)}>
        <CreatorCard
          creator={mapped}
          tab="applications"
          isInvited={mapped.isInvited}
          urgencyLabel={mapped.urgencyLabel}
          urgencyTier={mapped.urgencyTier}
          onCreatorPreview={() => handleCreatorPreview(sourceRow)}
          onSaveToShortlist={handleSaveToShortlist}
          onRemoveFromShortlist={() => {}}
          onInviteClick={() => {}}
        />
      </div>
    );
  };

  const isIndividualCampaign =
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
      <div className="relative z-30 shrink-0 border-b border-gray-200 bg-white shadow-sm">
        <div className="p-2.5 sm:p-4">
          <div className="mb-2 flex flex-col gap-2 sm:mb-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <div className="w-full min-w-0 sm:w-[280px] rounded-lg bg-gray-100 p-3">
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

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
            {isMultiCreator ? (
              <div className="flex w-full min-w-0 items-center gap-2 sm:max-w-[min(100%,320px)] lg:flex-1 lg:gap-3">
                <div className="min-w-0 flex-1">
                  <SimpleSelect
                    placeHolder="Select a campaign"
                    options={filteredCampaignOptions}
                    isLoading={campaignsLoading}
                    value={selectedCampaignValue}
                    onChange={handleCampaignChange}
                  />
                </div>
                {showCloseListingMenu && selectedCampaign ? (
                  isSelectedCampaignListingOpen ? (
                    <button
                      type="button"
                      onClick={handleMenuOpen}
                      disabled={isClosingListing}
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                      aria-label="Campaign options"
                    >
                      <EllipsisVertical className="h-4 w-4" />
                    </button>
                  ) : (
                    <span className="shrink-0 rounded-md bg-gray-200 px-1.5 py-1.5 text-[10px] font-semibold text-gray-600 sm:px-2 sm:py-1.5 sm:text-xs">
                      Listing closed
                    </span>
                  )
                ) : null}
              </div>
            ) : (
              <div className="hidden lg:block lg:flex-1" />
            )}

            {isMultiCreator && onApplicationsSubTabChange ? (
              <div className="flex w-full justify-center lg:w-auto lg:shrink-0">
                <ApplicationsSubtabToggle
                  activeSubTab={applicationsSubTab}
                  onSubTabChange={onApplicationsSubTabChange}
                  counts={subTabCounts}
                />
              </div>
            ) : null}

            <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-2 lg:flex-1 lg:justify-end">
              <div className="min-w-0 w-full sm:w-44 md:w-[180px] md:max-w-[230px]">
                <SimpleSelect
                  placeHolder="Sort by"
                  options={sortOptions}
                  value={sortValue}
                  onChange={handleSortChange}
                />
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                <CustomButton
                  text="Filters"
                  onClick={() => setShowFilterModal(true)}
                  startIcon={<Filter className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden />}
                  className="btn-outline min-w-0 flex-1 sm:flex-none md:min-w-[106px]"
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

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2.5 sm:p-4 relative z-0">
        {leftContentLoading ? (
          <SkeletonCardGrid
            count={8}
            gridClass="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3 mb-8"
          />
        ) : selectedCampaign ? (
          <>
            {isIndividualCampaign ? (
              <div className="mb-4 rounded-lg border bg-white p-3 sm:mb-6 sm:p-4">
                <h2 className="text-[10px] font-semibold leading-snug text-gray-900 sm:text-sm">
                  {`${Array.isArray(individualCollaborations) ? individualCollaborations.length : 0} individual collaboration${Array.isArray(individualCollaborations) && individualCollaborations.length === 1 ? "" : "s"}`}
                </h2>
              </div>
            ) : null}

            {isIndividualCampaign ? (
              Array.isArray(individualCollaborations) && individualCollaborations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <NotFound
                    title="No Creators Found"
                    description="No individual collaborations found at this time. Invite creators to start collaborating."
                  />
                </div>
              ) : (
                <>
                  <PinnedInvitedSection
                    pinnedCreators={pinnedIndividualCreators}
                    renderCreatorCard={renderCreatorCard}
                  />
                  {unpinnedIndividualCreators.length > 0 ? (
                    <div className={GRID_CLASS}>
                      {unpinnedIndividualCreators.map((invitation) =>
                        renderCreatorCard(invitation)
                      )}
                    </div>
                  ) : null}
                </>
              )
            ) : sortedAppliedCreators.length > 0 ? (
              <>
                <PinnedInvitedSection
                  pinnedCreators={pinnedAppliedCreators}
                  renderCreatorCard={renderCreatorCard}
                />
                {unpinnedAppliedCreators.length > 0 ? (
                  <div className={GRID_CLASS}>
                    {unpinnedAppliedCreators.map((creator) => renderCreatorCard(creator))}
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <NotFound
                  title="No Creators Found"
                  description={
                    applicationsSubTab === "negotiations"
                      ? "No creators in negotiations for this campaign yet."
                      : "No creators have applied to this campaign yet. Try adjusting your filters or selecting a different campaign."
                  }
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
                minFollowersTo: filters.minFollowersTo ?? filters.max_followers ?? "",
                maxFollowers: filters.maxFollowers ?? filters.max_followers ?? "",
                minRating: filters.minRating ?? filters.min_rating ?? "",
                maxRating: filters.maxRating ?? filters.max_rating ?? "",
                state: filters.state || "",
                state_short: filters.stateShort || filters.state_short || "",
                city: filters.city || "",
                city_country_code: filters.city_country_code || "",
                countries: Array.isArray(filters.countries) ? filters.countries : [],
                country_code: filters.country_code || "",
                niches: Array.isArray(filters.niches) ? filters.niches : [],
                platforms: Array.isArray(filters.platforms) ? filters.platforms : [],
                languages: Array.isArray(filters.languages) ? filters.languages : [],
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
        onFollowerRangeChange={handleFollowerRangeChange}
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

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          elevation: 3,
          sx: { minWidth: 220, borderRadius: 2, mt: 1 },
        }}
      >
        <MenuItem
          onClick={handleRequestCloseListing}
          disabled={isClosingListing || !isSelectedCampaignListingOpen}
          sx={{ fontSize: "0.8125rem", py: 1.25, px: 2, whiteSpace: "normal" }}
        >
          Close listing to new applicants
        </MenuItem>
      </Menu>

      <ConfirmationModal
        show={showCloseListingModal}
        onCancel={handleCancelCloseListing}
        close={handleCancelCloseListing}
        onConfirm={handleConfirmCloseListing}
        message="Close listing to new applicants?"
        messageStyling="text-center text-sm font-semibold text-gray-900 sm:text-base"
        content={
          campaignToClose?.campaign_title
            ? `${campaignToClose.campaign_title} will be removed from Discover+ and will no longer accept new applications or hires.`
            : "This campaign will be removed from Discover+ and will no longer accept new applications or hires."
        }
        subContent="Existing applicants and hired creators are not affected."
        contentStyling="mt-2 max-w-sm text-center text-[10px] leading-snug text-gray-600 sm:text-xs"
        subContentStyling="mt-2 max-w-sm text-center text-[10px] text-gray-500 sm:text-xs"
        cancelText="Cancel"
        confirmText="Close listing"
        confirmLoading={isClosingListing}
        confirmLoadingText="Closing"
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
