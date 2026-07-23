import React, { memo } from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import DeferredImage from "@/common/components/deferred-image/deferred-image.component";
import MediaKitIcon from "@/common/components/media-kit-icon/media-kit-icon.component";
import UrgencyPill from "@/common/components/urgency-pill/urgency-pill.component";
import { getCreatorTagMeta } from "@/common/constants/creator-tag.constant";
import { HIDE_CREATOR_RATING_UI } from "@/common/utils/campaign.utils";
import { Bookmark, Star, User } from "lucide-react";
import { useCreatorCard } from "./use-creator-card.hook";

const CreatorCard = ({
  creator,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  tab = "discover",
  onReinstateClick,
  onViewNotesClick,
  isReinstateLoading = false,
  hideActions = false,
  creatorType = creator?.creator_profile?.creator_type,
  urgencyLabel,
  urgencyTier,
  isInvited = false,
}) => {
  const type = creatorType || creator?.creator_profile?.creator_type;
  const tagMeta = type ? getCreatorTagMeta(type) : null;
  const isApplicationsTab = tab === "applications";
  const showRating = !HIDE_CREATOR_RATING_UI;
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
  const applicationMessage = creator?.applicationMessage?.trim() || "";
  const profileInitials =
    `${creator.name?.charAt(0) || ""}${creator.name?.split(" ")[1]?.charAt(0) || ""}`.trim();

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
    uniquePlatforms,
    hasConnectedSocialAccounts,
    showMediaKitOnCard,
    mediaKitHref,
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
      className={`relative flex h-full min-h-0 flex-shrink-0 flex-col self-stretch snap-start ${
        isShortlist ? "w-full" : "w-[18rem]"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        onCreatorPreview ? "cursor-pointer" : "cursor-default"
      } bg-white border border-gray-200 overflow-hidden`}
      onClick={() => {
        if (onCreatorPreview) handleCardClick();
      }}
    >
      <div className="relative h-32 shrink-0 bg-gray-100 overflow-hidden">
        {Array.isArray(creator.portfolioImages) && creator.portfolioImages.some(Boolean) ? (
          <div className="flex h-full">
            {[0, 1, 2].map((index) => {
              const image = creator.portfolioImages[index];
              return (
                <div key={index} className="flex-1 relative">
                  {image ? (
                    <DeferredImage
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      placeholderClassName="bg-primary/15"
                      rootMargin={index === 0 ? "420px 0px" : "280px 0px"}
                      priority={index === 0}
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

        {isApplicationsTab && isInvited ? (
          <div className="absolute left-1 top-1 z-[1] rounded-lg bg-black px-2 py-1 text-[10px] font-semibold text-white shadow-sm">
            Invited
          </div>
        ) : null}

        {isApplicationsTab && urgencyLabel ? (
          <div className="absolute right-1 top-1 z-[1] max-w-[9rem]">
            <UrgencyPill label={urgencyLabel} tier={urgencyTier} />
          </div>
        ) : null}

        {!isApplicationsTab && tagMeta ? (
          <div
            className={`absolute top-1 right-1 max-w-[9rem] truncate px-2 py-1 text-[10px] font-semibold rounded-lg shadow-sm ${tagMeta.pillClass}`}
          >
            {tagMeta.label}
          </div>
        ) : null}
      </div>

      <div className="relative flex min-h-0 flex-1 flex-col px-4 pb-4">
        <div className="absolute top-[-55px] left-1/2 -translate-x-1/2">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white bg-primary">
            {creator.profileImage ? (
              <>
                <span className="absolute inset-0 flex items-center justify-center text-2xl font-semibold text-white">
                  {profileInitials}
                </span>
                <DeferredImage
                  src={creator.profileImage}
                  alt={creator.name}
                  placeholderClassName="bg-transparent"
                  rootMargin="360px 0px"
                  priority
                  className="relative z-[1]"
                />
              </>
            ) : (
              <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-white">
                {profileInitials}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 my-4">
          <div className="text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 mb-1">
              <h4 className="text-sm font-semibold leading-snug text-gray-900 m-0">
                {creator.name}
              </h4>
              {showRating ? (
                <div className="inline-flex items-center gap-1 text-sm leading-none">
                  <Star className="h-4 w-4 shrink-0 text-yellow-400 fill-current" />
                  <span className="text-gray-500 mt-1 ml-0.5">{ratingValue}</span>
                  <span className="text-gray-400 mt-1">({reviewCountValue})</span>
                </div>
              ) : null}
            </div>
            <p className="text-xs text-gray-500">
              {creator.age} •{" "}
              {creator.city && creator.country
                ? `${creator.city}, ${creator?.state || creator?.creator_profile?.shipping_address?.state},
                   ${creator.country}`
                : creator.location}
            </p>
          </div>

          <div className="min-h-[3rem] flex flex-wrap content-start items-start justify-center gap-1">
            {displayNiches.length > 0 ? (
              displayNiches.map((niche) => (
                <span
                  key={niche}
                  className="px-2 py-1 bg-gray-100 text-xs rounded-lg text-gray-600 capitalize whitespace-nowrap"
                >
                  {niche}
                </span>
              ))
            ) : (
              <span className="px-2 py-1 bg-gray-100 text-xs rounded-lg text-gray-600 capitalize whitespace-nowrap">
                No niches available
              </span>
            )}
          </div>

          {isApplicationsTab ? (
            <p className="min-h-[3rem] line-clamp-3 text-center text-xs">
              {applicationMessage ? (
                <span className="text-gray-500">{applicationMessage}</span>
              ) : (
                <span className="italic text-gray-400">No application message</span>
              )}
            </p>
          ) : (
            <p className="min-h-[3rem] line-clamp-3 text-center text-xs text-gray-500">
              {creator.bio || creator.tagline || ""}
            </p>
          )}

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
              {hasConnectedSocialAccounts && uniquePlatforms.length > 0 ? (
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
              ) : showMediaKitOnCard ? (
                <a
                  href={mediaKitHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center px-3 transition-opacity hover:opacity-80"
                >
                  <MediaKitIcon size="discovery" />
                  <span className="mt-1 text-xs text-gray-500">Media Kit</span>
                </a>
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

            {isApplicationsTab && (
              <div className="flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleSaveClick}
                  className="rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                >
                  <Bookmark
                    className={`h-5 w-5 ${
                      isShortlist ? "text-primary fill-current" : "text-gray-600"
                    }`}
                  />
                </button>
                <button
                  type="button"
                  onClick={handleViewProfileClick}
                  className="inline-flex rounded-lg bg-gray-100 p-2 hover:bg-gray-200"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(CreatorCard);
