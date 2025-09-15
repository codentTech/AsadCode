import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Star, Bookmark, Mail } from "lucide-react";
import useCreatorSpendAnalysis from "./use-creator-spend-analysis.hook";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  selectedCreator,
  filters,
}) => {
  const {
    creators,
    formatFollowers,
    getPlatformColor,
    messageDialogOpen,
    setMessageDialogOpen,
    open,
    handleOpenModal,
    handleCloseModal,
  } = useCreatorSpendAnalysis();

  const { getPlatformIcon } = useGetplatform();

  // Note: We don't need to fetch data here since it's passed from parent component
  // The parent Applications component handles all API calls and passes the data down

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleSaveToShortlist = (creator) => {
    console.log("Save to shortlist:", creator);
  };

  const handleMessageCreator = (creator) => {
    setMessageDialogOpen(true);
  };

  const handleInviteClick = (creator, e) => {
    e.stopPropagation();
    console.log("Invite creator:", creator);
  };

  const CreatorCard = ({ creator, isRecommended = false }) => {
    // Map API data directly in the card
    const creatorData = creator.creator;
    const profile = creatorData?.creator_profile;

    const mappedCreator = {
      id: creator.id,
      name: `${creatorData?.first_name || ""} ${creatorData?.last_name || ""}`,
      image: profile?.profile_photo_url || avatar,
      age: creatorData?.date_of_birth
        ? Math.floor(
            (new Date() - new Date(creatorData.date_of_birth)) / (365.25 * 24 * 60 * 60 * 1000)
          )
        : "N/A",
      location:
        `${creatorData?.city || ""} ${creatorData?.country || ""}`.trim() ||
        "Location not specified",
      rating: 4.5, // Mock rating
      reviewCount: 12, // Mock review count
      appliedDate: new Date(creator.applied_at).toLocaleDateString(),
      followers: 50000, // Mock followers count
      platforms: profile?.social_platforms,
      portfolioImages: profile?.mini_profile_pictures || [],
      status: creator.status,
      pitch: creator.pitch,
      niches: profile?.categories || [],
    };

    const formatFollowers = (followers) => {
      if (followers >= 1000000) {
        return `${(followers / 1000000).toFixed(1)}M`;
      }
      if (followers >= 1000) {
        return `${(followers / 1000).toFixed(0)}K`;
      }
      return followers;
    };

    return (
      <div
        className={`group relative flex-shrink-0 snap-start w-64 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden ${
          selectedCreator?.id === creator.id ? "border-primary shadow-md" : ""
        }`}
        onClick={() => handleCreatorPreview(creator)}
      >
        {/* Cover Images Section */}
        <div className="relative h-32 bg-gray-100 overflow-hidden">
          {mappedCreator.portfolioImages && mappedCreator.portfolioImages.length >= 3 ? (
            <div className="flex h-full">
              {mappedCreator.portfolioImages.slice(0, 3).map((image, index) => (
                <div key={index} className="flex-1 relative">
                  <img
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {index < 2 && (
                    <div className="absolute right-0 top-0 w-px h-full bg-white/30"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>
          )}

          {/* Recommended Badge */}
          {isRecommended && (
            <div className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
              Rec
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="relative px-4 pb-4 space-y-3">
          {/* Profile Image */}
          <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
            <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
              <img
                src={mappedCreator.image}
                alt={mappedCreator.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Name, Rating and Location */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <h4 className="text-gray-900 font-semibold text-sm">{mappedCreator.name}</h4>
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span className="text-xs text-gray-500">{mappedCreator.rating}</span>
                <span className="text-xs text-gray-400">({mappedCreator.reviewCount || 0})</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs">
              {mappedCreator.age} • {mappedCreator.location}
            </p>
          </div>

          {/* Niche Tags */}
          <div className="flex flex-wrap gap-1 justify-center">
            {mappedCreator.niches?.slice(0, 2).map((niche) => (
              <span
                key={niche}
                className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 capitalize"
              >
                {niche}
              </span>
            ))}
          </div>

          {/* Application Status Badge - Unique to our component */}
          <div className="flex flex-col justify-center items-center text-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              Applied on {mappedCreator.appliedDate}
            </span>
          </div>

          {/* Stats */}
          <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
            <span className="font-medium">
              {formatFollowers(mappedCreator.followers)} Total Followers
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-4">
            {mappedCreator.platforms &&
              mappedCreator.platforms?.map(({ platform }) => (
                <div key={platform} className="flex flex-col items-center space-y-1">
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded ${getPlatformColor(platform)}`}
                    title={`${platform}: ${formatFollowers(27000)} followers`}
                  >
                    <div className="scale-75">{getPlatformIcon(platform)}</div>
                  </div>
                  <span className="text-xs text-gray-500">{formatFollowers(27000)}</span>
                </div>
              ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {isRecommended ? (
              <CustomButton
                text="Invite to Apply"
                className="btn-outline rounded-lg"
                onClick={(e) => handleInviteClick(creator, e)}
              />
            ) : (
              <>
                <CustomButton
                  text="Save"
                  className="btn-secondary rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveToShortlist(creator);
                  }}
                />
                <CustomButton
                  text="Message"
                  className="btn-outline rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMessageCreator(creator);
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">Discover top creators for your campaigns</p>
            </div>
            <div className="w-full max-w-[200px]">
              <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Show message if no campaign is selected */}
        {!selectedCampaign ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-2">No Campaign Selected</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Select a campaign from the dropdown to view applied creators and their details
            </p>
          </div>
        ) : (
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
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center animate-pulse">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-2">Loading Creators...</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  Please wait while we fetch the applied creators for this campaign
                </p>
              </div>
            )}

            {/* Applied Creators Grid */}
            {!appliedCreatorsLoading &&
              appliedCreatorsData?.data &&
              appliedCreatorsData.data?.length !== 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
                  {appliedCreatorsData?.data?.map((creator) => (
                    <CreatorCard key={creator.id} creator={creator} />
                  ))}
                </div>
              )}

            {/* No Applied Creators */}
            {!appliedCreatorsLoading && appliedCreatorsData?.data?.length === 0 && (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                </div>
                <h3 className="text-base font-medium text-gray-800 mb-2">No Applications Yet</h3>
                <p className="text-sm text-gray-600 max-w-xs mx-auto">
                  This campaign hasn't received any creator applications yet. Check back later!
                </p>
              </div>
            )}
          </>
        )}
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />

      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />
          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>
    </div>
  );
};

export default CreatorSpendAnalysis;
