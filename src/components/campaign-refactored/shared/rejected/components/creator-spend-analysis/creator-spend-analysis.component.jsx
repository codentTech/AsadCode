import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { SkeletonCardGrid } from "@/common/components/loader/skeleton-loader.component";
import Loading from "@/common/components/loader/loading.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import CampaignCreationWizard from "@/components/campaign-refactored/shared/create-campaign/create-campaign.component";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";
import { useSelector } from "react-redux";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  onClearCreator,
  onCampaignSelect,
  onReinstateCreator,
  reinstateLoading,
  sortBy,
  onSortChange,
  onSaveToShortlist,
  onSwitchToApplications,
}) => {
  const individualCollaborationsState = useSelector(
    (state) => state.invitation.getBrandRejectedIndividualCollaborations || {}
  );
  const individualCollaborationsData = individualCollaborationsState?.data;

  const {
    showReinstateConfirmation,
    campaignsData,
    campaignsLoading,
    filteredCampaignOptions,
    selectedCampaignValue,
    handleToggleChange,
    handleSortChange,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
    showSaveToShortlistModal,
    creatorToSave,
    shortlists,
    shortlistsLoading,
    handleSaveToShortlistClick,
    handleConfirmSaveToShortlist,
    handleCancelSaveToShortlist,
    open,
    isMultiCreator,
    sortOptions,
    handleOpenModal,
    handleCloseModal,
    handleCreatorPreview,
    mapCreatorForCard,
  } = useCreatorSpendAnalysis({
    selectedCampaign,
    onCampaignSelect,
    onReinstateCreator,
    onSaveToShortlist,
    onSortChange,
    onCreatorSelect,
    onClearCreator,
  });

  const isIndividualMode = !isMultiCreator;
  const individualCollaborationsLoading = individualCollaborationsState?.isLoading || false;

  let dataToDisplay = null;
  if (isIndividualMode) {
    dataToDisplay = individualCollaborationsData?.data;
  } else {
    dataToDisplay = appliedCreatorsData?.data;
  }

  const leftContentLoading =
    campaignsLoading ||
    (isIndividualMode && individualCollaborationsLoading) ||
    (!isIndividualMode && !!selectedCampaign && appliedCreatorsLoading);

  const renderCardGrid = (items, renderItem) => (
    <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3">
      {items.map(renderItem)}
    </div>
  );

  const renderScrollBody = () => {
    if (leftContentLoading) {
      return (
        <SkeletonCardGrid
          count={8}
          gridClass="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-3"
        />
      );
    }

    if (isIndividualMode) {
      if (!dataToDisplay || !Array.isArray(dataToDisplay) || dataToDisplay.length === 0) {
        return (
          <div className="flex flex-col items-center justify-center py-12 sm:py-20">
            <NotFound
              title="No Rejected Creators"
              description="No rejected individual creators found."
            />
          </div>
        );
      }

      const count = dataToDisplay.length;
      return (
        <>
          <div className="mb-4 rounded-lg border bg-white p-3 sm:mb-6 sm:p-4">
            <h2 className="text-sm font-semibold text-gray-900">
              {count} rejected individual collaboration{count === 1 ? "" : "s"}
            </h2>
          </div>
          {renderCardGrid(dataToDisplay, (invitation) => {
            const mappedCreator = mapCreatorForCard(invitation);
            return (
              <div
                key={invitation.id || invitation.creator?.id}
                onClick={() => handleCreatorPreview(invitation)}
                className="min-w-0"
              >
                <CreatorCard
                  creator={mappedCreator}
                  isShortlist={false}
                  onCreatorPreview={handleCreatorPreview}
                  onSaveToShortlist={() => handleSaveToShortlistClick(invitation)}
                  onRemoveFromShortlist={() => {}}
                  onInviteClick={() => {}}
                  tab="rejected"
                  appliedDate={mappedCreator.appliedDate}
                  rejectedDate={mappedCreator.rejectedDate}
                  onReinstateClick={(mc, e) => handleReinstateClick(invitation, e)}
                  onViewNotesClick={(inv, e) => {
                    e.stopPropagation();
                  }}
                  isReinstateLoading={reinstateLoading}
                />
              </div>
            );
          })}
        </>
      );
    }

    if (!selectedCampaign) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <NotFound
            title="No Campaign Selected"
            description="Select a campaign from the dropdown to view rejected creators."
          />
        </div>
      );
    }

    if (!dataToDisplay || !Array.isArray(dataToDisplay) || dataToDisplay.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 sm:py-20">
          <NotFound
            title="No Rejected Creators"
            description="No creators have been rejected for this campaign yet."
          />
        </div>
      );
    }

    const count = dataToDisplay.length;
    const isIndivCampaign =
      selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    return (
      <>
        <div className="mb-4 rounded-lg border bg-white p-3 sm:mb-6 sm:p-4">
          <h2 className="text-sm font-semibold text-gray-900">
            {isIndivCampaign
              ? `${count} rejected individual collaboration${count === 1 ? "" : "s"}`
              : `${count} creator${count === 1 ? "" : "s"} rejected for "${selectedCampaign.campaign_title}"`}
          </h2>
        </div>
        {renderCardGrid(dataToDisplay, (creator) => {
          const mappedCreator = mapCreatorForCard(creator);
          return (
            <div key={creator.id} onClick={() => handleCreatorPreview(creator)} className="min-w-0">
              <CreatorCard
                creator={mappedCreator}
                isShortlist={false}
                onCreatorPreview={handleCreatorPreview}
                onSaveToShortlist={() => handleSaveToShortlistClick(creator)}
                onRemoveFromShortlist={() => {}}
                onInviteClick={() => {}}
                tab="rejected"
                appliedDate={new Date(creator.applied_at).toLocaleDateString()}
                rejectedDate={
                  creator.rejected_at ? new Date(creator.rejected_at).toLocaleDateString() : "N/A"
                }
                onReinstateClick={(mc, e) => handleReinstateClick(creator, e)}
                onViewNotesClick={(c, e) => {
                  e.stopPropagation();
                }}
                isReinstateLoading={reinstateLoading}
              />
            </div>
          );
        })}
      </>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-gray-100">
      <div className="shrink-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="p-3 sm:p-4">
          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="w-full min-w-0 sm:w-[280px] bg-gray-100 rounded-lg p-3">
              <CustomSwitch
                label="Campaign Type"
                checked={isMultiCreator}
                onChange={(event) => handleToggleChange(event.target.checked)}
                rightLabelText={isMultiCreator ? "Multi-Creator" : "Individual Creator"}
                parentDivClassName="justify-between"
              />
            </div>
            {onSwitchToApplications && (
              <CustomButton
                text="Applications"
                onClick={onSwitchToApplications}
                className="btn-outline w-full shrink-0 !h-9 sm:w-auto"
              />
            )}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            {isMultiCreator && (
              <div className="min-w-0 w-full sm:max-w-[min(100%,280px)] sm:flex-1">
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
            )}
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end sm:gap-2">
              <div className="min-w-0 w-full sm:w-44 md:max-w-[230px]">
                <SimpleSelect
                  placeHolder="Sort by"
                  options={sortOptions}
                  value={
                    sortBy
                      ? {
                          value: sortBy,
                          label: sortOptions.find((opt) => opt.value === sortBy)?.label,
                        }
                      : null
                  }
                  onChange={handleSortChange}
                />
              </div>
              <CustomButton
                text="Start a new campaign"
                onClick={handleOpenModal}
                className="btn-primary w-full !h-9 !text-xs sm:!h-10 sm:w-auto sm:!text-sm md:max-w-[200px]"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4">
        {renderScrollBody()}
      </div>

      <ConfirmationDialog
        show={showReinstateConfirmation}
        onClose={handleCancelReinstate}
        onConfirm={handleConfirmReinstate}
        confirmLoading={reinstateLoading}
        message="Reinstate Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reinstate this creator&apos;s application?
            </p>
            <p className="text-sm text-gray-500">
              This will move the application back to pending status.
            </p>
          </div>
        }
      />

      <Modal
        title="Save to Shortlist"
        show={showSaveToShortlistModal}
        onClose={handleCancelSaveToShortlist}
      >
        <div className="space-y-4">
          {shortlistsLoading ? (
            <div className="py-8 text-center">
              <Loading />
            </div>
          ) : shortlists.length === 0 ? (
            <div className="py-8 text-center">
              <p className="mb-2 text-gray-600">No shortlists available</p>
              <p className="text-sm text-gray-500">Create a shortlist first to save creators</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Select a shortlist to save {creatorToSave?.creator?.first_name || "this creator"}:
              </p>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {shortlists.map((shortlist) => (
                  <button
                    key={shortlist.id}
                    type="button"
                    onClick={() => handleConfirmSaveToShortlist(shortlist.id)}
                    className="w-full rounded-lg border border-gray-200 p-3 text-left transition-all hover:border-primary hover:bg-indigo-50"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{shortlist.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {shortlist.user_count || 0} creator
                          {(shortlist.user_count || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-primary">
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          aria-hidden
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </Modal>

      <CampaignCreationWizard open={open} close={handleCloseModal} />
    </div>
  );
};

export default CreatorSpendAnalysis;
