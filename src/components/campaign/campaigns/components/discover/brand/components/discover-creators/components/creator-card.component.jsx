import { Star, Bookmark, Mail } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import InstagramIcon from "@/common/icons/instagram";
import TiktokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";

const PlatformIcons = {
  instagram: <InstagramIcon />,
  youtube: <YoutubeIcon />,
  tiktok: <TiktokIcon />,
};

const CreatorCard = ({
  creator,
  isShortlist = false,
  onCreatorPreview,
  onSaveToShortlist,
  onRemoveFromShortlist,
  onMessageCreator,
  onInviteClick,
}) => {
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

        {/* Short tagline bio */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            {creator.tagline || "Creating authentic content that resonates with audiences"}
          </p>
        </div>

        {/* Stats */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-100 pt-2">
          <span className="font-medium">{formatFollowers(creator.followers)} Total Followers</span>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-4">
          {creator.platforms.map((platform) => (
            <div key={platform} className="flex flex-col items-center space-y-1">
              <div
                className="w-8 h-8 flex items-center justify-center rounded bg-gray-100"
                title={`${platform}: ${creator.platformStats?.[platform]?.followers || "N/A"} followers`}
              >
                <div className="scale-75">
                  {PlatformIcons[platform] || (
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

        {/* Icon Buttons */}
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

        {/* Invite Button */}
        <div className="flex items-center gap-3">
          <CustomButton
            text="Invite to Apply"
            onClick={handleInviteClickInternal}
            className="btn-outline w-full rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;
