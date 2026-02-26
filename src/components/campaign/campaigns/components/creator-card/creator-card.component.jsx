import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Bookmark, Star, User } from "lucide-react";
import { useCreatorCard } from "./use-creator-card.hook";

const CreatorCard = ({
  creator,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  tab = "discover", // discover | applications | rejected
  appliedDate,
  rejectedDate,
  onReinstateClick,
  onViewNotesClick,
  isReinstateLoading = false,
}) => {
  const {
    getPlatformIcon,
    handleCardClick,
    handleSaveClick,
    handleInviteClickInternal,
    handleReinstateClickInternal,
    handleViewNotesClickInternal,
    handleViewProfileClick,
    formatFollowers,
    combinedFollowers,
    getPlatformFollowers,
  } = useCreatorCard({
    creator,
    isShortlist,
    onCreatorPreview,
    onSaveToShortlist,
    onRemoveFromShortlist,
    onInviteClick,
    onReinstateClick,
    onViewNotesClick,
  });

  return (
    <div
      className={`relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden`}
      onClick={handleCardClick}
    >
      {/* Cover */}
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {creator.portfolioImages?.length >= 3 ? (
          <div className="flex h-full">
            {creator.portfolioImages.slice(0, 3).map((image, index) => (
              <div key={index} className="flex-1 relative">
                <img src={image} alt="" className="w-full h-full object-cover" />
                {index < 2 && <div className="absolute right-0 top-0 w-px h-full bg-white/30" />}
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100" />
        )}
      </div>

      {/* Content */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Avatar */}
        <div className="absolute top-[-70px] left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <img
              src={creator.profileImage}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h4 className="text-sm font-semibold text-gray-900">{creator.name}</h4>
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs text-gray-500">{creator.rating}</span>
              <span className="text-xs text-gray-400">({creator.reviewCount || 0})</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {creator.age} • {creator.location}
          </p>
        </div>

        {/* Niches */}
        {/* Niches */}
        <div className="flex flex-wrap justify-center gap-1">
          {(creator.niches || []).slice(0, 3).map((niche) => (
            <span
              key={niche}
              className="px-2 py-1 bg-gray-100 text-xs rounded-lg text-gray-600 capitalize whitespace-nowrap"
            >
              {niche}
            </span>
          ))}
        </div>

        {/* Bio */}
        <p className="text-xs text-gray-500 text-center line-clamp-2">
          {creator.bio || creator.tagline || ""}
        </p>

        {/* Social Platforms */}
        {creator.platforms && creator.platforms.length > 0 && (
          <div className="flex justify-center bg-gray-100 py-2 rounded-lg">
            {(creator.platforms || []).map((platform, index, arr) => (
              <div key={platform} className="flex items-center">
                {/* Platform item */}
                <div className="flex flex-col items-center px-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getPlatformIcon(platform)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatFollowers(getPlatformFollowers(platform))}
                  </span>
                </div>

                {/* Vertical divider (only if more than 1 & not last) */}
                {arr.length > 1 && index < arr.length - 1 && (
                  <div className="h-10 w-px bg-indigo-300" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Discover actions */}
        {tab === "discover" && (
          <>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <Bookmark
                  className={`w-5 h-5 ${
                    isShortlist ? "text-primary fill-current" : "text-gray-600"
                  }`}
                />
              </button>

              <button
                onClick={handleViewProfileClick}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <CustomButton
              text="Invite to Apply"
              onClick={handleInviteClickInternal}
              // className="btn-outline w-full rounded-lg"
            />
          </>
        )}

        {/* Rejected tab */}
        {tab === "rejected" && (
          <div className="flex flex-col gap-3">
            <CustomButton
              text="Reinstate to Applications"
              className="btn-secondary w-full rounded-lg"
              onClick={handleReinstateClickInternal}
              disabled={isReinstateLoading}
            />
            <CustomButton
              text="View Notes"
              className="btn-outline w-full rounded-lg"
              onClick={handleViewNotesClickInternal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorCard;
