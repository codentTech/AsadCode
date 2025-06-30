import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Star, Bookmark, Mail } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";

const CreatorSpendAnalysis = () => {
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

  const handleCreatorPreview = (creator) => {
    console.log("Preview creator:", creator);
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

  const CreatorCard = ({ creator, isRecommended = false }) => (
    <div
      className="group relative flex-shrink-0 snap-start w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden"
      onClick={() => handleCreatorPreview(creator)}
    >
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {creator.portfolioImages && creator.portfolioImages.length >= 3 ? (
          <div className="flex h-full">
            {creator.portfolioImages.slice(0, 3).map((image, index) => (
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
          <div className="w-full h-full bg-gray-200"></div>
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
        {/* Profile Image - positioned at base of cover images */}
        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <img src={creator.image} alt={creator.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Name, Rating and Location */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h4 className="text-gray-900 font-semibold text-sm">{creator.name}</h4>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">{creator.rating}</span>
              <span className="text-xs text-gray-400">({creator.reviewCount || 0})</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            {creator.age} • {creator.location}
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-col justify-center items-center text-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            Applied on {creator.appliedDate}
          </span>
        </div>

        {/* Stats - just total followers */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">
            {creator.followers >= 1000000
              ? `${(creator.followers / 1000000).toFixed(1)}M Total Followers`
              : `${(creator.followers / 1000).toFixed(0)}K Total Followers`}
          </span>
        </div>

        {/* Compact Social Icons with follower counts */}
        <div className="flex justify-center space-x-4">
          {Object.entries(creator.platforms).map(([platform, data]) => (
            <div key={platform} className="flex flex-col items-center space-y-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded ${getPlatformColor(platform)} bg-gray-100`}
                title={`${platform}: ${formatFollowers(data.followers)} followers`}
              >
                <div className="scale-75">{getPlatformIcon(platform)}</div>
              </div>
              <span className="text-xs text-gray-500">{formatFollowers(data.followers)}</span>
            </div>
          ))}
        </div>

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

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100 pb-10">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">Discover top creators for your campaigns</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-sm">
              <SimpleSelect
                placeHolder="Select an option"
                options={sortOptions}
                className="w-full max-w-[400px]"
              />
            </div>
            <div className="w-full max-w-[200px]">
              <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Creator Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 mb-8">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>

        {/* Compact Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm rounded-full font-medium text-gray-600 bg-gray-200 px-4 py-2">
            Recommended
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Recommended Creators */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Recommended Creators</h3>
            <p className="text-sm text-gray-600">Similar niches and high engagement rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4">
            {creators.map((creator) => (
              <CreatorCard key={`rec-${creator.id}`} creator={creator} isRecommended={true} />
            ))}
          </div>
        </div>
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
