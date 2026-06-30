import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { buildConnectedPlatformsFromCreatorUser } from "@/common/utils/creator-platforms.utils";

export const mapUserToCreator = (user) => {
  const creatorProfile = user?.creator_profile || {};
  const {
    platformStats,
    platformList,
    hasConnectedSocialAccounts,
  } = buildConnectedPlatformsFromCreatorUser(user);

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Creator";
  const portfolioImages = Array.isArray(creatorProfile?.mini_profile_pictures)
    ? creatorProfile.mini_profile_pictures
    : [];

  let age = "";
  if (user?.date_of_birth) {
    const birthDate = new Date(user.date_of_birth);
    const today = new Date();
    const ageInYears = today.getFullYear() - birthDate.getFullYear();
    age = `${ageInYears}`;
  }

  const location =
    formatCreatorLocation({
      city: user?.city,
      country: user?.country,
      state: user?.state,
      stateShort: user?.state_short,
    }) || "Location not specified";

  return {
    ...user,
    creator_profile: creatorProfile,
    id: user?.id,
    name,
    profileImage: creatorProfile?.profile_photo_url || "/assets/images/account.png",
    portfolioImages,
    age,
    location,
    niches: creatorProfile?.categories || [],
    tagline: creatorProfile?.bio || "Creating authentic content that resonates with audiences",
    followers: Object.values(platformStats).reduce((sum, stat) => sum + (stat.followers || 0), 0),
    platforms: platformList,
    platformStats,
    rating: Number(creatorProfile?.rating) || 0,
    reviewCount: Number(creatorProfile?.reviewCount ?? creatorProfile?.review_count) || 0,
    mediaKitUrl: creatorProfile?.media_kit_url || null,
    hasConnectedSocialAccounts,
  };
};

export const groupCreatorsByNiche = (creators) => {
  const nicheGroups = {};

  creators.forEach((creator) => {
    if (creator.niches && Array.isArray(creator.niches) && creator.niches.length > 0) {
      const primaryNiche = creator.niches[0];
      if (!nicheGroups[primaryNiche]) {
        nicheGroups[primaryNiche] = [];
      }
      nicheGroups[primaryNiche].push(creator);
    }
  });

  return Object.entries(nicheGroups).map(([niche, creatorsList]) => ({
    id: niche.toLowerCase().replace(/\s+/g, "-"),
    name: `Top in ${niche.charAt(0).toUpperCase() + niche.slice(1)}`,
    creators: creatorsList.sort((a, b) => b.followers - a.followers).slice(0, 10),
  }));
};
