import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import Loading from "@/common/components/loadar/loading.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomSwitch from "@/common/components/custom-switch/custom-switch.component";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";
import { useSelector } from "react-redux";

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
    isSelectedCampaignValid,
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

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="mb-3 flex justify-between items-center gap-3">
            {onSwitchToApplications && (
              <CustomButton
                text="Applications"
                onClick={onSwitchToApplications}
                className="btn-outline !h-9"
              />
            )}
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

            <div className="flex justify-end items-center gap-3">
              <div className="w-full min-w-[230px]">
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
        {(() => {
          const isIndividualMode = !isMultiCreator;
          let dataToDisplay = null;
          let isLoading = appliedCreatorsLoading;

          if (isIndividualMode) {
            isLoading = individualCollaborationsState?.isLoading || false;
            dataToDisplay = individualCollaborationsData?.data;
          } else {
            dataToDisplay = appliedCreatorsData?.data;
          }

          if (isLoading) {
            return <Loading />;
          }

          if (isIndividualMode) {
            if (!dataToDisplay || !Array.isArray(dataToDisplay) || dataToDisplay.length === 0) {
              return (
                <div className="flex flex-col items-center justify-center py-20">
                  <NotFound
                    title="No Rejected Creators"
                    description="No rejected individual creators found."
                  />
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                {dataToDisplay.map((invitation) => {
                  const mappedCreator = mapCreatorForCard(invitation);
                  return (
                    <div
                      key={invitation.id || invitation.creator?.id}
                      onClick={() => handleCreatorPreview(invitation)}
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
                        onReinstateClick={(mappedCreator, e) => handleReinstateClick(invitation, e)}
                        onViewNotesClick={(invitation, e) => {
                          e.stopPropagation();
                        }}
                        isReinstateLoading={reinstateLoading}
                      />
                    </div>
                  );
                })}
              </div>
            );
          }

          if (!selectedCampaign) {
            return (
              <NotFound
                title="No Campaign Selected"
                description="Select a campaign from the dropdown to view rejected creators."
              />
            );
          }

          if (!dataToDisplay || !Array.isArray(dataToDisplay) || dataToDisplay.length === 0) {
            return (
              <div className="flex flex-col items-center justify-center py-20">
                <NotFound
                  title="No Rejected Creators"
                  description="No creators have been rejected for this campaign yet."
                />
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
              {dataToDisplay.map((creator) => {
                const mappedCreator = mapCreatorForCard(creator);
                return (
                  <CreatorCard
                    key={creator.id}
                    creator={mappedCreator}
                    isShortlist={false}
                    onCreatorPreview={handleCreatorPreview}
                    onSaveToShortlist={() => handleSaveToShortlistClick(creator)}
                    onRemoveFromShortlist={() => {}}
                    onInviteClick={() => {}}
                    tab="rejected"
                    appliedDate={new Date(creator.applied_at).toLocaleDateString()}
                    rejectedDate={
                      creator.rejected_at
                        ? new Date(creator.rejected_at).toLocaleDateString()
                        : "N/A"
                    }
                    onReinstateClick={(mappedCreator, e) => handleReinstateClick(creator, e)}
                    onViewNotesClick={(creator, e) => {
                      e.stopPropagation();
                    }}
                    isReinstateLoading={reinstateLoading}
                  />
                );
              })}
            </div>
          );
        })()}
      </div>

      <ConfirmationDialog
        show={showReinstateConfirmation}
        onClose={handleCancelReinstate}
        onConfirm={handleConfirmReinstate}
        message="Reinstate Creator"
        content={
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              Are you sure you want to reinstate this creator's application?
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
            <div className="text-center py-8">
              <Loading />
            </div>
          ) : shortlists.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-2">No shortlists available</p>
              <p className="text-sm text-gray-500">Create a shortlist first to save creators</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Select a shortlist to save {creatorToSave?.creator?.first_name || "this creator"}:
              </p>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {shortlists.map((shortlist) => (
                  <button
                    key={shortlist.id}
                    onClick={() => handleConfirmSaveToShortlist(shortlist.id)}
                    className="w-full p-3 border border-gray-200 rounded-lg hover:border-primary hover:bg-indigo-50 transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{shortlist.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {shortlist.user_count || 0} creator
                          {(shortlist.user_count || 0) !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="text-primary">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
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
