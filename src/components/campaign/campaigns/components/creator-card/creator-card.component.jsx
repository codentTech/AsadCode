import React from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { getCreatorTagMeta } from "@/common/constants/creator-tag.constant";
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
  hideActions = false,
  creatorType,
}) => {
  const tagMeta = creatorType ? getCreatorTagMeta(creatorType) : null;
  const {
    getPlatformIcon,
    getPlatformProfileUrlFor,
    handleCardClick,
    handleSaveClick,
    handleInviteClickInternal,
    handleReinstateClickInternal,
    handleViewNotesClickInternal,
    handleViewProfileClick,
    formatFollowers,
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

  const isClickable = typeof onCreatorPreview === "function";

  return (
    <div
      className={`relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } bg-white border border-gray-200 overflow-hidden`}
      onClick={() => {
        if (isClickable) handleCardClick();
      }}
    >
      {/* Cover */}
      <div className="relative h-32 bg-gray-100 overflow-hidden">
        {Array.isArray(creator.portfolioImages) && creator.portfolioImages.some(Boolean) ? (
          <div className="flex h-full">
            {[0, 1, 2].map((index) => {
              const image = creator.portfolioImages[index];
              return (
                <div key={index} className="flex-1 relative">
                  {image ? (
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary" />
                  )}
                  {index < 2 && <div className="absolute right-0 top-0 w-px h-full bg-white/30" />}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full bg-primary" />
        )}

        {tagMeta ? (
          <div
            className={`absolute top-1 right-1 max-w-[9rem] truncate px-2 py-1 text-[10px] font-semibold rounded-lg shadow-sm ${tagMeta.pillClass}`}
          >
            {tagMeta.label}
          </div>
        ) : null}
      </div>

      <div className="relative px-4 pb-4 space-y-3">
        {/* Avatar */}
        <div className="absolute top-[-70px] left-1/2 -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            {creator.profileImage ? (
              <img
                src={creator.profileImage}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white bg-primary rounded-full w-full h-full flex items-center justify-center font-semibold text-2xl">
                {creator.name?.charAt(0) + creator.name?.split(" ")[1]?.charAt(0)}
              </span>
            )}
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

        {creator.id === "onboarding-preview" && creator.longBio && (
          <div className="text-center bg-gray-100 p-2 rounded-lg">
            <p className="text-xs text-gray-500 break-all">{creator.longBio}</p>
          </div>
        )}

        {/* Social Platforms */}
        {creator.platforms && creator.platforms.length > 0 && (
          <div
            className="flex justify-center bg-gray-100 py-2 rounded-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {(creator.platforms || []).map((platform, index, arr) => {
              const profileUrl = getPlatformProfileUrlFor(platform);
              const platformBlock = (
                <div className="flex flex-col items-center px-3">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {getPlatformIcon(platform)}
                  </div>
                  <span className="text-xs text-gray-500">
                    {formatFollowers(getPlatformFollowers(platform))}
                  </span>
                </div>
              );
              return (
                <div key={platform} className="flex items-center">
                  {profileUrl ? (
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center px-3 hover:opacity-80 transition-opacity"
                    >
                      {platformBlock}
                    </a>
                  ) : (
                    platformBlock
                  )}
                  {arr.length > 1 && index < arr.length - 1 && (
                    <div className="h-10 w-px bg-indigo-300" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Discover actions */}
        {!hideActions && tab === "discover" && (
          <>
            <div className="flex justify-center gap-3">
              <button
                type="button"
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
                type="button"
                onClick={handleViewProfileClick}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 inline-flex"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <CustomButton text="Invite to Apply" onClick={handleInviteClickInternal} />
          </>
        )}

        {/* Rejected tab */}
        {!hideActions && tab === "rejected" && (
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

        {/* Applications / other tab */}
        {!hideActions && tab !== "discover" && tab !== "rejected" && (
          <div className="flex flex-col gap-3">
            <CustomButton
              text={isShortlist ? "Remove" : "Save"}
              className={`${isShortlist ? "btn-danger" : "btn-primary"} w-full rounded-lg`}
              onClick={handleSaveClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorCard;
