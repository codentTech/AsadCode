import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  selectedCreator,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  onCampaignSelect,
  onReinstateCreator,
  reinstateLoading,
  filters,
  sortBy,
  onFilterChange,
  onClearFilters,
  onSortChange,
  onSaveToShortlist,
}) => {
  const {
    showReinstateConfirmation,
    creatorToReinstate,
    campaignsData,
    campaignsLoading,
    campaignOptions,
    handleCampaignChange,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
    formatFollowers,
    showSaveToShortlistModal,
    creatorToSave,
    shortlists,
    shortlistsLoading,
    handleSaveToShortlistClick,
    handleConfirmSaveToShortlist,
    handleCancelSaveToShortlist,
  } = useCreatorSpendAnalysis({
    selectedCampaign,
    onCampaignSelect,
    onReinstateCreator,
    onSaveToShortlist,
  });

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleRemoveFromShortlist = (creatorId) => {
    // Handle remove from shortlist
  };

  const handleInviteClick = (creator, e) => {
    // Handle invite click
  };

  // Map API data to CreatorCard format
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
      rating: profile?.rating || 0,
      reviewCount: 0,
      followers: profile?.total_followers || 0,
      niches: profile?.niches || [],
      tagline: profile?.bio || "Creating authentic content that resonates with audiences",
      portfolioImages: profile?.mini_profile_pictures || [],
      platforms: profile?.social_platforms?.map((p) => p.platform) || [],
      platformStats:
        profile?.social_platforms?.reduce((acc, platform) => {
          acc[platform.platform] = { followers: platform.followers };
          return acc;
        }, {}) || {},
    };
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-bold text-gray-900">Rejected Creators</h1>
              <p className="text-xs text-gray-500">Manage rejected creator applications</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-64">
                <SimpleSelect
                  placeHolder="Select a campaign"
                  options={campaignOptions}
                  isSearchable={true}
                  isMulti={false}
                  onChange={handleCampaignChange}
                  value={campaignOptions.find((opt) => opt.value === selectedCampaign?.id)}
                  isLoading={campaignsLoading}
                />
              </div>
              <div className="w-48">
                <SimpleSelect
                  placeHolder="Sort by"
                  options={sortOptions}
                  className="w-full"
                  value={sortOptions.find((opt) => opt.value === sortBy)}
                  onChange={(selectedOption) => onSortChange(selectedOption?.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {appliedCreatorsLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader loading={true} />
            <p className="text-xs text-gray-500 mt-2">Loading rejected creators...</p>
          </div>
        ) : !selectedCampaign ? (
          <NotFound
            title="No Campaign Selected"
            description="Select a campaign from the dropdown to view rejected creators."
          />
        ) : appliedCreatorsData?.data?.length === 0 ? (
          <NotFound
            title="No Rejected Creators"
            description="No creators have been rejected for this campaign yet."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
            {appliedCreatorsData?.data?.map((creator) => {
              const mappedCreator = mapCreatorForCard(creator);
              const isSelected = selectedCreator?.id === creator?.id;

              return (
                <CreatorCard
                  key={creator.id}
                  creator={mappedCreator}
                  isShortlist={false}
                  onCreatorPreview={handleCreatorPreview}
                  onSaveToShortlist={() => handleSaveToShortlistClick(creator)}
                  onRemoveFromShortlist={handleRemoveFromShortlist}
                  onInviteClick={handleInviteClick}
                  tab="rejected"
                  appliedDate={new Date(creator.applied_at).toLocaleDateString()}
                  rejectedDate={
                    creator.rejected_at ? new Date(creator.rejected_at).toLocaleDateString() : "N/A"
                  }
                  onReinstateClick={(mappedCreator, e) => handleReinstateClick(creator, e)}
                  onViewNotesClick={(creator, e) => {
                    e.stopPropagation();
                    // Handle view notes
                  }}
                  isReinstateLoading={reinstateLoading}
                />
              );
            })}
          </div>
        )}
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

      {/* Save to Shortlist Modal */}
      <Modal
        title="Save to Shortlist"
        show={showSaveToShortlistModal}
        onClose={handleCancelSaveToShortlist}
      >
        <div className="space-y-4">
          {shortlistsLoading ? (
            <div className="text-center py-8">
              <Loader loading={true} />
              <p className="text-sm text-gray-500 mt-2">Loading shortlists...</p>
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
    </div>
  );
};

export default CreatorSpendAnalysis;
