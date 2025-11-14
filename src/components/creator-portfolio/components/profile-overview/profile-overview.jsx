import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar } from "@/common/constants/auth.constant";
import FacebookIcon from "@/common/icons/facebook";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import Niche from "@/components/niche/niche";
import { getCreatorById } from "@/provider/features/creator-profile/creator-profile.slice";
import {
  BookmarkPlus,
  Edit,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Star,
  StarHalf,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ProfileEditModal from "../edit-profile-modal/edit-profile-modal.component";

const ProfileOverview = ({ onProfileUpdate, refreshKey = 0, creatorId = null }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [creator, setCreator] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const loadCreatorData = useCallback(async () => {
    if (creatorId) {
      // Load creator by ID for brand view
      try {
        const result = await dispatch(getCreatorById(creatorId)).unwrap();
        if (result.success && result.data) {
          const creatorData = result.data;
          setCreator({
            name:
              `${creatorData.first_name || ""} ${creatorData.last_name || ""}`.trim() || "Creator",
            handle: `@${creatorData.email?.split("@")[0] || "creator"}`,
            location:
              creatorData.city && creatorData.country
                ? `${creatorData.city}, ${creatorData.country}`
                : creatorData.city || creatorData.country || "Location not set",
            rating: creatorData.creator_profile?.rating || 0, // Default rating since not in API
            reviewCount: 0, // Default since not in API
            followers: 0, // Default since not in API
            following: 0, // Default since not in API
            socialMedia:
              creatorData.creator_profile?.social_platforms?.map((platform) =>
                platform.platform.toLowerCase()
              ) || [],
            profilePic: creatorData.creator_profile?.profile_photo_url || avatar,
            bio: creatorData.creator_profile?.bio || "",
            categories: creatorData.creator_profile?.categories || [],
            contentRates: creatorData.creator_profile?.content_rates || [],
            gallery: creatorData.creator_profile?.gallery || [],
            user: creatorData,
            miniProfilePictures: creatorData.creator_profile?.mini_profile_pictures || [],
          });
        }
      } catch (error) {
        console.error("Failed to load creator:", error);
      }
    } else {
      // Load current user's profile (creator mode)
      const user = getUser();
      if (user && user.creator_profile) {
        setCreator({
          name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Creator",
          handle: `@${user.email?.split("@")[0] || "creator"}`,
          location:
            user.city && user.country
              ? `${user.city}, ${user.country}`
              : user.city || user.country || "Location not set",
          rating: user.creator_profile?.rating || 0, // Default rating since not in API
          reviewCount: 0, // Default since not in API
          followers: 0, // Default since not in API
          following: 0, // Default since not in API
          socialMedia:
            user.creator_profile.social_platforms?.map((platform) =>
              platform.platform.toLowerCase()
            ) || [],
          profilePic: user.creator_profile.profile_photo_url || avatar,
          bio: user.creator_profile.bio || "",
          categories: user.creator_profile.categories || [],
          contentRates: user.creator_profile.content_rates || [],
          gallery: user.creator_profile.gallery || [],
          user: user,
          miniProfilePictures: user.creator_profile.mini_profile_pictures || [],
        });
      }
    }
    setIsLoading(false);
  }, [creatorId, dispatch]);

  // Load data on component mount
  useEffect(() => {
    loadCreatorData();
  }, [loadCreatorData]);

  // Refresh when refreshKey changes (following the same pattern as other components)
  useEffect(() => {
    if (refreshKey > 0) {
      loadCreatorData();
    }
  }, [refreshKey, loadCreatorData]);

  if (isLoading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-32 w-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/4 mx-auto"></div>
        </div>
      </section>
    );
  }

  if (!creator) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-gray-500">
          <p>Creator profile not found</p>
        </div>
      </section>
    );
  }

  const getSocialIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <InstagramIcon />;
      case "youtube":
        return <YoutubeIcon />;
      case "tiktok":
        return <TikTokIcon />;
      case "facebook":
        return <FacebookIcon />;
      default:
        return null;
    }
  };

  const renderRatingStars = () => {
    const ratingValue = Number(creator.rating) || 0;
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.5;

    return Array.from({ length: 5 }).map((_, index) => {
      if (index < fullStars) {
        return <Star key={index} className="w-4 h-4 text-yellow-500 fill-current" />;
      }

      if (hasHalfStar && index === fullStars) {
        return <StarHalf key={index} className="w-4 h-4 text-yellow-500 fill-current" />;
      }

      return <Star key={index} className="w-4 h-4 text-gray-300" />;
    });
  };

  return (
    <>
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row justify-between">
          {/* Left Side - Profile Info */}
          <div className="flex flex-col lg:flex-row items-center md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={creator.profilePic}
                alt={creator.name}
                className="rounded-full w-32 h-32 object-cover border-4 border-white shadow-md ring-2 ring-primary"
              />

              {/* Showcase Images (Mini Profile Pictures) */}
              {creator.miniProfilePictures && creator.miniProfilePictures.length > 0 && (
                <div className="mt-3 flex gap-2 justify-center">
                  {creator.miniProfilePictures.map((pic, index) => (
                    <div key={index} className="relative">
                      <img
                        src={pic}
                        alt={`Showcase ${index + 1}`}
                        className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="text-center md:text-left">
              <h2 className="text-xl font-semibold text-gray-900">{creator.name}</h2>
              <p className="text-gray-500">{creator.handle}</p>

              {/* Rating */}
              <div className="flex items-center justify-center md:justify-start gap-1 mb-1">
                {renderRatingStars()}
                <span className="text-sm m-1 text-gray-700">
                  {creator.rating} ({creator.reviewCount})
                </span>
              </div>

              {/* Social Media */}
              <div className="flex space-x-3 justify-center md:justify-start mb-3">
                {creator.socialMedia.map((platform, index) => (
                  <div key={index}>{getSocialIcon(platform)}</div>
                ))}
              </div>

              {/* Location */}
              <div className="flex text-xs items-center justify-center md:justify-start text-gray-600 mb-3">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{creator.location}</span>
              </div>

              {/* Niche Tags */}
              <Niche categories={creator.categories} />
            </div>
          </div>

          {/* Right Side - Stats & Actions */}
          <div className="mt-6 md:mt-0 flex flex-col items-center md:items-end">
            {/* Edit Icon (visible to profile owner only) */}
            {isCreatorMode() && !creatorId && (
              <div
                className="self-end p-2 text-white bg-primary rounded-lg cursor-pointer hover:bg-indigo-700 mb-4 transition-colors duration-200 hover:scale-105"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="w-5 h-5" />
              </div>
            )}

            {/* Followers/Following */}
            <div className="flex gap-6 mb-4 text-center">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {creator.followers.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Followers</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {creator.following.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Following</p>
              </div>
            </div>

            {/* Action Buttons */}
            {creatorId ? (
              <div className="flex flex-col gap-2 w-full md:w-auto">
                <CustomButton text="Follow" startIcon={<Heart className="w-4 h-4" />} />

                <div className="flex flex-col sm:flex-row gap-2 w-full">
                  <CustomButton
                    text="Message"
                    className="btn-outline"
                    startIcon={<MessageCircle className="w-4 h-4" />}
                  />
                  <CustomButton text="Shortlist" startIcon={<BookmarkPlus className="w-4 h-4" />} />

                  <CustomButton
                    text="share"
                    className="btn-outline"
                    startIcon={<Share2 className="w-4 h-4" />}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <CustomButton
                  text="Share Your Profile"
                  className="btn-outline"
                  startIcon={<Share2 className="w-4 h-4" />}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        creator={creator}
        onSave={() => {
          const user = getUser();
          if (user && user.creator_profile) {
            setCreator({
              name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || "Creator",
              handle: `@${user.email?.split("@")[0] || "creator"}`,
              location:
                user.city && user.country
                  ? `${user.city}, ${user.country}`
                  : user.city || user.country || "Location not set",
              rating: 4.8,
              reviewCount: 0,
              followers: 0,
              following: 0,
              socialMedia:
                user.creator_profile.social_platforms?.map((platform) =>
                  platform.platform.toLowerCase()
                ) || [],
              profilePic: user.creator_profile.profile_photo_url || avatar,
              bio: user.creator_profile.bio || "",
              categories: user.creator_profile.categories || [],
              contentRates: user.creator_profile.content_rates || [],
              gallery: user.creator_profile.gallery || [],
              user: user,
              miniProfilePictures: user.creator_profile.mini_profile_pictures || [],
            });
          }

          if (onProfileUpdate) {
            onProfileUpdate();
          }
        }}
      />
    </>
  );
};

export default ProfileOverview;
