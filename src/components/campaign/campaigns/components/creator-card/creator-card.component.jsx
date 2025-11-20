import CustomButton from "@/common/components/custom-button/custom-button.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { Bookmark, Mail, Star } from "lucide-react";
import { useRouter } from "next/navigation";

const CreatorCard = ({
  creator,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onMessageCreator,
  onInviteClick,
  tab = "discover", // "discover" | "applications" | "rejected"
  appliedDate,
  rejectedDate,
  onReinstateClick,
  onViewNotesClick,
  isReinstateLoading = false,
}) => {
  const router = useRouter();
  const { getPlatformIcon } = useGetplatform();

  const handleSaveClick = (e) => {
    e.stopPropagation();
    if (isShortlist) {
      onRemoveFromShortlist(creator.id);
    } else {
      onSaveToShortlist(creator);
    }
  };

  const handleMessageClick = (e) => {
    e.stopPropagation();
    onMessageCreator(creator);
  };

  const handleInviteClickInternal = (e) => {
    e.stopPropagation();
    onInviteClick(creator, e);
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
      className={`group relative flex-shrink-0 snap-start ${
        isShortlist ? "w-full" : "w-64"
      } rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer bg-white border border-gray-200 overflow-hidden`}
      onClick={() => onCreatorPreview(creator)}
    >
      {/* Cover Images Section */}
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
          <div className="w-full h-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100"></div>
        )}
      </div>

      {/* Content Section */}
      <div className="relative px-4 pb-4 space-y-3">
        {/* Profile Image */}
        <div className="absolute top-[-70px] left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-16 rounded-full border-2 border-white bg-white overflow-hidden">
            <img
              src={creator.profileImage}
              alt={creator.name}
              className="w-full h-full object-cover"
            />
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

        {/* Niche Tags */}
        <div className="flex flex-wrap gap-1 justify-center">
          {creator.niches?.slice(0, 2).map((niche) => (
            <span
              key={niche}
              className="px-2 py-1 bg-gray-100 text-xs rounded-full text-gray-600 capitalize"
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

        {/* Short tagline bio */}
        <div className="text-center">
          <p className="text-xs text-gray-500 truncate">{creator.tagline}</p>
        </div>

        {/* Stats */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">{formatFollowers(creator.followers)} Total Followers</span>
        </div>

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
        {tab === "discover" && (
          <div className="flex justify-center space-x-2">
            <button
              onClick={handleSaveClick}
              className="p-2 rounded-full hover:bg-blue-100 transition"
              title={isShortlist ? "Remove from list" : "Save to list"}
            >
              <Bookmark
                className={`w-5 h-5 ${isShortlist ? "text-blue-700 fill-current" : "text-blue-600"}`}
              />
            </button>

            <button
              onClick={handleMessageClick}
              className="p-2 rounded-full hover:bg-purple-100 transition"
              title="Message"
            >
              <Mail className="w-5 h-5 text-purple-600" />
            </button>
          </div>
        )}

        {/* Actions Row */}
        {tab === "discover" ? (
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
            <CustomButton
              text="Message"
              className="w-full btn-outline rounded-lg"
              onClick={handleMessageClick}
            />
          </div>
        )}

        <CustomButton
          text="View Full Portfolio"
          className="w-full btn-primary rounded-lg"
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/creator-profile/${creator.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default CreatorCard;
