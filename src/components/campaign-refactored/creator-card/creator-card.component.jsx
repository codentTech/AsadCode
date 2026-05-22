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
  onReinstateClick,
  onViewNotesClick,
  isReinstateLoading = false,
  hideActions = false,
  creatorType = creator?.creator_profile?.creator_type,
}) => {
  console.log("creator", creator);
  const type = creatorType || creator?.creator_profile?.creator_type;
  const tagMeta = type ? getCreatorTagMeta(type) : null;
  const ratingValue =
    creator?.rating ??
    creator?.creator_profile?.rating ??
    creator?.creator?.creator_profile?.rating ??
    0;
  const reviewCountValue =
    creator?.reviewCount ??
    creator?.review_count ??
    creator?.creator_profile?.reviewCount ??
    creator?.creator_profile?.review_count ??
    creator?.creator?.creator_profile?.reviewCount ??
    creator?.creator?.creator_profile?.review_count ??
    0;

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
    displayNiches,
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
  const uniquePlatforms = Array.from(
    new Set((creator.platforms || []).map((platform) => String(platform || "").toLowerCase()))
  ).filter(Boolean);

  return (
    <div
      className={`relative flex h-full min-h-0 flex-shrink-0 flex-col self-stretch snap-start ${
        isShortlist ? "w-full" : "w-[18rem]"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        onCreatorPreview ? "cursor-pointer" : "cursor-default"
      } bg-white border border-gray-200 overflow-hidden`}
      onClick={() => {
        if (onCreatorPreview) handleCardClick();
      }}
    >
      {/* Cover */}
      <div className="relative h-32 shrink-0 bg-gray-100 overflow-hidden">
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

      <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-4">
        {/* Avatar */}
        <div className="absolute top-[-55px] left-1/2 -translate-x-1/2">
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

        <div className="flex flex-col gap-3 my-4">
          {/* Name */}
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-1">
              <h4 className="text-sm font-semibold leading-snug text-gray-900 m-0">
                {creator.name}
              </h4>
              <div className="inline-flex items-center gap-1 text-sm leading-none">
                <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-current" />
                <span className="text-gray-500 mt-1 ml-0.5">{ratingValue}</span>
                <span className="text-gray-400 mt-1">({reviewCountValue})</span>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              {creator.age} •{" "}
              {creator.city && creator.country
                ? `${creator?.state || creator?.creator_profile?.shipping_address?.state},
 ${creator.city}, ${creator.country}`
                : creator.location}
            </p>
          </div>

          {/* Niches */}
          <div className="flex min-h-[3.25rem] flex-wrap content-start items-start justify-center gap-1">
            {displayNiches.map((niche) => (
              <span
                key={niche}
                className="px-2 py-1 bg-gray-100 text-xs rounded-lg text-gray-600 capitalize whitespace-nowrap"
              >
                {niche}
              </span>
            ))}
          </div>

          {/* Bio */}
          <p className="min-h-[3rem] line-clamp-3 text-center text-xs text-gray-500">
            {creator.bio || creator.tagline || ""}
          </p>

          {creator.id === "onboarding-preview" && creator.longBio && (
            <div className="text-center bg-gray-100 p-2 rounded-lg">
              <p className="line-clamp-2 text-xs text-gray-500 break-words">{creator.longBio}</p>
            </div>
          )}
        </div>

        {!hideActions && (
          <div className="flex flex-col gap-3">
            <div
              className="flex min-h-[5.5rem] items-center justify-center rounded-lg bg-gray-100 py-2"
              onClick={(e) => e.stopPropagation()}
            >
              {uniquePlatforms.length > 0 ? (
                <div className="flex justify-center">
                  {uniquePlatforms.map((platform, index, arr) => {
                    const profileUrl = getPlatformProfileUrlFor(platform);
                    const platformBlock = (
                      <div className="flex flex-col items-center px-3">
                        <div className="flex h-8 w-8 items-center justify-center">
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
                            className="flex flex-col items-center px-3 transition-opacity hover:opacity-80"
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
              ) : (
                <p className="px-2 text-center text-[10px] leading-snug text-gray-400">
                  No social accounts connected
                </p>
              )}
            </div>
            {tab === "discover" && (
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
                    className="inline-flex rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <User className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
                <CustomButton text="Invite to Apply" onClick={handleInviteClickInternal} />
              </>
            )}

            {tab === "rejected" && (
              <>
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
              </>
            )}

            {tab !== "discover" && tab !== "rejected" && (
              <CustomButton
                text={isShortlist ? "Remove" : "Save"}
                className={`${isShortlist ? "btn-danger" : "btn-primary"} w-full rounded-lg`}
                onClick={handleSaveClick}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorCard;
