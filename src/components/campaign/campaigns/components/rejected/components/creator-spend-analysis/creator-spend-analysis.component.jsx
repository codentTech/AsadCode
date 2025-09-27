import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { sortOptions } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { Star } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import { useState } from "react";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  appliedCreatorsData,
  appliedCreatorsLoading,
  onCreatorSelect,
  onReinstateCreator,
  reinstateLoading,
}) => {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);
  const [creatorToReinstate, setCreatorToReinstate] = useState(null);

  // Helper function to format followers
  const formatFollowers = (count) => {
    // Handle undefined, null, or non-numeric values
    if (count === undefined || count === null || isNaN(count)) {
      return "0";
    }

    const numCount = Number(count);
    if (numCount >= 1_000_000) return `${(numCount / 1_000_000).toFixed(1)}M`;
    if (numCount >= 1_000) return `${(numCount / 1_000).toFixed(0)}K`;
    return numCount.toString();
  };

  const handleCreatorPreview = (creator) => {
    if (onCreatorSelect) {
      onCreatorSelect(creator);
    }
  };

  const handleReinstateClick = (creator, e) => {
    e.stopPropagation();
    setCreatorToReinstate(creator);
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    if (onReinstateCreator && selectedCampaign && creatorToReinstate) {
      onReinstateCreator(selectedCampaign.id, creatorToReinstate.creator.id);
    }
    setShowReinstateConfirmation(false);
    setCreatorToReinstate(null);
  };

  const handleCancelReinstate = () => {
    setShowReinstateConfirmation(false);
    setCreatorToReinstate(null);
  };

  const CreatorCard = ({ creator }) => (
    <div
      className="group relative flex-shrink-0 snap-start w-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden"
      onClick={() => handleCreatorPreview(creator)}
    >
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {creator.creator?.creator_profile?.mini_profile_pictures &&
        creator.creator.creator_profile.mini_profile_pictures.length >= 3 ? (
          <div className="flex h-full">
            {creator.creator.creator_profile.mini_profile_pictures
              .slice(0, 3)
              .map((image, index) => (
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
      </div>

      {/* Content Section */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Profile Image - positioned at base of cover images */}
        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <img
              src={creator.creator?.creator_profile?.profile_photo_url || avatar}
              alt={creator.creator?.first_name || "Creator"}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name, Rating and Location */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h4 className="text-gray-900 font-semibold text-sm">
              {creator.creator?.first_name} {creator.creator?.last_name}
            </h4>
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">
                {creator.creator?.creator_profile?.rating || 0}
              </span>
              <span className="text-xs text-gray-400">(0)</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            {creator.creator?.city || "Unknown"} • {creator.creator?.country || "Unknown"}
          </p>
        </div>

        {/* Status badges */}
        <div className="flex flex-col justify-center items-center text-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
            Applied on {new Date(creator.applied_at).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium">
            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
            Rejected on{" "}
            {creator.rejected_at ? new Date(creator.rejected_at).toLocaleDateString() : "N/A"}
          </span>
        </div>

        {/* Stats - just total followers */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">
            {formatFollowers(creator.creator?.creator_profile?.total_followers)} Total Followers
          </span>
        </div>

        {/* Compact Social Icons with follower counts */}
        <div className="flex justify-center space-x-4">
          {creator.creator?.creator_profile?.social_platforms?.map((platform) => (
            <div key={platform.platform} className="flex flex-col items-center space-y-1">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded ${getPlatformColor(platform.platform)} bg-gray-100`}
                title={`${platform.platform}: ${formatFollowers(platform.followers)} followers`}
              >
                <div className="scale-75">{getPlatformIcon(platform.platform)}</div>
              </div>
              <span className="text-xs text-gray-500">{formatFollowers(platform.followers)}</span>
            </div>
          )) || []}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <CustomButton
            text="Reinstate to Applications"
            className="btn-secondary rounded-lg"
            onClick={(e) => handleReinstateClick(creator, e)}
            disabled={reinstateLoading}
          />
          <CustomButton
            text="View Notes"
            className="btn-outline rounded-lg"
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rejected Creators</h1>
              <p className="text-xs text-gray-500">Manage rejected creator applications</p>
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
            <span className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 text-sm font-medium">
              {appliedCreatorsData?.data?.length || 0} Results
            </span>
          </div>
        </div>
      </div>

      {/* Creator List */}
      <div className="flex-1 overflow-y-auto p-4">
        {appliedCreatorsLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading rejected creators...</div>
          </div>
        ) : appliedCreatorsData?.data?.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-2">No Rejected Creators</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              No creators have been rejected for this campaign yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
            {appliedCreatorsData?.data?.map((creator) => (
              <CreatorCard key={creator.id} creator={creator} />
            ))}
          </div>
        )}
      </div>

      {/* Reinstate Confirmation Modal */}
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
    </div>
  );
};

export default CreatorSpendAnalysis;
