import CustomButton from "@/common/components/custom-button/custom-button.component";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { Bookmark, Star, User } from "lucide-react";
import { useRouter } from "next/navigation";

const CreatorCard = ({
  creator,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onInviteClick,
  tab = "discover", // "discover" | "applications" | "rejected"
  appliedDate,
  rejectedDate,
  onReinstateClick,
  onViewNotesClick,
  isReinstateLoading = false,
  hideActions = false,
  creatorType,
}) => {
  const router = useRouter();
  const { getPlatformIcon } = useGetplatform();
  const isClickable = typeof onCreatorPreview === "function";

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (typeof onSaveToShortlist !== "function" && typeof onRemoveFromShortlist !== "function") {
      return;
    }
    if (isShortlist) {
      onRemoveFromShortlist?.(creator.id);
    } else {
      onSaveToShortlist?.(creator);
    }
  };

  const handleInviteClickInternal = (e) => {
    e.stopPropagation();
    onInviteClick?.(creator, e);
  };

  const handleReinstateClickInternal = (e) => {
    e.stopPropagation();
    if (onReinstateClick) {
      onReinstateClick(creator, e);
    }
  };

  const handleViewNotesClickInternal = (e) => {
    e.stopPropagation();
    if (onViewNotesClick) {
      onViewNotesClick(creator, e);
    }
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
      className={`relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 ${
        isClickable ? "cursor-pointer" : "cursor-default"
      } bg-white border border-gray-200 overflow-hidden`}
      onClick={() => {
        if (isClickable) onCreatorPreview(creator);
      }}
    >
      {/* Cover Images Section */}
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
                    <div className="w-full h-full bg-primary"></div>
                  )}
                  {index < 2 && (
                    <div className="absolute right-0 top-0 w-px h-full bg-white/30"></div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="w-full h-full bg-primary"></div>
        )}

        {creatorType === CAMPAIGN_TYPE.UGC ? (
          <div className="absolute top-1 right-1 text-black px-2 py-1 text-xs border-indigo-200 bg-indigo-100 rounded-lg">
            UGC
          </div>
        ) : creatorType === CAMPAIGN_TYPE.INFLUENCER ? (
          <div className="absolute top-1 right-1 text-black px-2 py-1 text-xs border-purple-200 bg-purple-100 rounded-lg">
            INFLUENCER
          </div>
        ) : creatorType === CAMPAIGN_TYPE.HYBRID ? (
          <div className="absolute top-1 right-1 text-black px-2 py-1 text-xs border-green-200 bg-green-100 rounded-lg">
            HYBRID
          </div>
        ) : null}
      </div>

      {/* Content Section */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Profile Image */}
        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
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

        {/* Name, Rating and Location */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <h4 className="text-gray-900 font-semibold text-md">{creator.name}</h4>
            <div className="flex items-center space-x-1 mt-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-500">{creator.rating}</span>
              <span className="text-sm text-gray-400">({creator.reviewCount || 0})</span>
            </div>
          </div>
          <p className="text-gray-500 text-xs">
            {creator.age} • {creator.location}
          </p>
        </div>

        {/* Niche Tags */}
        <div className="flex gap-1 justify-center overflow-hidden">
          {creator.niches?.slice(0, 3).map((niche) => (
            <span
              key={niche}
              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 capitalize whitespace-nowrap flex-shrink-0"
            >
              {niche}
            </span>
          ))}
        </div>

        {/* Applied Date (Applications tab) */}
        {tab === "applications" && appliedDate && (
          <div className="flex flex-col justify-center items-center text-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              Applied on {appliedDate}
            </span>
          </div>
        )}

        {/* Rejected Status (Rejected tab) */}
        {tab === "rejected" && (
          <div className="flex flex-col justify-center items-center text-center gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
              Applied on {appliedDate}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-red-100 text-red-600 text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
              Rejected on {rejectedDate}
            </span>
          </div>
        )}

        {/* Bio */}
        <div className=" bg-gray-100 p-2 rounded-lg text-center">
          <p className="text-xs text-gray-500 line-clamp-2">{creator.bio || ""}</p>
        </div>

        {/* Long Bio */}
        {creator.id === "onboarding-preview" && (
          <div className="text-center bg-gray-100 p-2 rounded-lg">
            <p className="text-xs text-gray-500 break-all">{creator.longBio || ""}</p>
          </div>
        )}

        {/* Stats */}
        {creator.followers !== 0 && (
          <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
            <span className="font-medium">{formatFollowers(creator.followers)} Followers</span>
          </div>
        )}

        {/* Social Icons */}
        <div className="flex justify-center space-x-4">
          {formatFollowers(creator.followers) !== 0 &&
            (creator.platforms || []).map((platform) => (
              <div key={platform} className="flex flex-col items-center space-y-1">
                <div
                  className="w-8 h-8 flex items-center justify-center rounded bg-gray-100"
                  title={`${platform}: ${creator.platformStats?.[platform]?.followers || "N/A"} followers`}
                >
                  <div className="scale-75">
                    {getPlatformIcon(platform) || (
                      <span className="text-xs font-medium text-gray-600">
                        {platform.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {creator.platformStats?.[platform]?.followers
                    ? formatFollowers(creator.platformStats[platform].followers)
                    : "N/A"}
                </span>
              </div>
            ))}
        </div>

        {/* Icon Buttons (Discover tab) */}
        {!hideActions && tab === "discover" && (
          <div className="flex justify-center items-center gap-3">
            <div className="relative group">
              <button
                onClick={handleSaveClick}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Bookmark
                  className={`w-5 h-5 ${isShortlist ? "text-primary fill-current" : "text-gray-600"}`}
                />
              </button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {isShortlist ? "Remove from list" : "Save to List"}
              </span>
            </div>
            <div className="relative group">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/creator-profile/${creator.id}`);
                }}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <User className="w-5 h-5 text-gray-600" />
              </button>
              <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                View Full Profile
              </span>
            </div>
          </div>
        )}

        {/* Actions Row */}
        {!hideActions &&
          (tab === "discover" ? (
            <div className="flex items-center gap-3">
              <CustomButton
                text="Invite to Apply"
                onClick={handleInviteClickInternal}
                className="btn-outline w-full rounded-lg"
              />
            </div>
          ) : tab === "rejected" ? (
            <div className="flex flex-col items-center gap-3">
              <CustomButton
                text="Reinstate to Applications"
                className="w-full btn-secondary rounded-lg"
                onClick={handleReinstateClickInternal}
                disabled={isReinstateLoading}
              />
              <CustomButton
                text="View Notes"
                className="w-full btn-outline rounded-lg"
                onClick={handleViewNotesClickInternal}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <CustomButton
                text={isShortlist ? "Remove" : "Save"}
                className="w-full btn-secondary rounded-lg"
                onClick={handleSaveClick}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default CreatorCard;
