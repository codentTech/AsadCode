import { formatCreatorLocation } from "@/common/utils/creator-location.util";
import { HIDDEN_PLATFORM_KEYS } from "@/common/utils/creator-platforms.utils";
import { getCreatorCardThumbnailUrl } from "@/common/utils/creator-card-image.util";

export const mapUserToCreator = (user) => {
  const creatorProfile = user?.creator_profile || {};
  const {
    platformStats,
    platformList,
    hasConnectedSocialAccounts,
  } = buildSlimPlatformsFromUser(user);

  const name = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "Creator";
  const portfolioImages = (
    Array.isArray(creatorProfile?.mini_profile_pictures)
      ? creatorProfile.mini_profile_pictures
      : []
  )
    .filter(Boolean)
    .slice(0, 3)
    .map((url) => getCreatorCardThumbnailUrl(url, "portfolio"));

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
    id: user?.id,
    name,
    first_name: user?.first_name,
    last_name: user?.last_name,
    profileImage: getCreatorCardThumbnailUrl(
      creatorProfile?.profile_photo_url || "/assets/images/account.png",
      "avatar"
    ),
    portfolioImages,
    age,
    location,
    city: user?.city,
    country: user?.country,
    state: user?.state,
    niches: Array.isArray(creatorProfile?.categories) ? creatorProfile.categories : [],
    tagline: creatorProfile?.bio || "Creating authentic content that resonates with audiences",
    bio: creatorProfile?.bio || "",
    followers: Object.values(platformStats).reduce((sum, stat) => sum + (stat.followers || 0), 0),
    platforms: platformList,
    platformStats,
    rating: Number(creatorProfile?.rating) || 0,
    reviewCount: Number(creatorProfile?.reviewCount ?? creatorProfile?.review_count) || 0,
    mediaKitUrl: creatorProfile?.media_kit_url || null,
    hasConnectedSocialAccounts,
    creator_profile: {
      creator_type: creatorProfile?.creator_type,
      shipping_address: creatorProfile?.shipping_address
        ? { state: creatorProfile.shipping_address.state }
        : undefined,
    },
  };
};

export const mapDiscoverCardToCreator = (card) => {
  const platforms = Array.isArray(card?.platforms) ? card.platforms : [];
  const platformStats = {};
  const platformList = [];

  platforms.forEach((entry) => {
    const platform = String(entry?.platform || "").toLowerCase();
    if (!platform || HIDDEN_PLATFORM_KEYS.has(platform)) return;
    platformStats[platform] = {
      followers: Number(entry?.followers) || 0,
      username: entry?.username || null,
      profile_url: entry?.profile_url || null,
      profileUrl: entry?.profile_url || null,
    };
    if (!platformList.includes(platform)) platformList.push(platform);
  });

  const name = [card?.first_name, card?.last_name].filter(Boolean).join(" ") || "Creator";
  const portfolioImages = (Array.isArray(card?.mini_profile_pictures) ? card.mini_profile_pictures : [])
    .filter(Boolean)
    .slice(0, 3)
    .map((url) => getCreatorCardThumbnailUrl(url, "portfolio"));

  let age = "";
  if (card?.date_of_birth) {
    const birthDate = new Date(card.date_of_birth);
    const today = new Date();
    age = `${today.getFullYear() - birthDate.getFullYear()}`;
  }

  const location =
    formatCreatorLocation({
      city: card?.city,
      country: card?.country,
      state: card?.state,
      stateShort: card?.state_short,
    }) || "Location not specified";

  return {
    id: card?.id,
    name,
    first_name: card?.first_name,
    last_name: card?.last_name,
    profileImage: getCreatorCardThumbnailUrl(
      card?.profile_photo_url || "/assets/images/account.png",
      "avatar"
    ),
    portfolioImages,
    age,
    location,
    city: card?.city,
    country: card?.country,
    state: card?.state,
    niches: Array.isArray(card?.categories) ? card.categories : [],
    tagline: card?.bio || "Creating authentic content that resonates with audiences",
    bio: card?.bio || "",
    followers: Number(card?.total_followers) || 0,
    platforms: platformList,
    platformStats,
    rating: Number(card?.rating) || 0,
    reviewCount: Number(card?.reviewCount) || 0,
    mediaKitUrl: card?.media_kit_url || null,
    hasConnectedSocialAccounts: platformList.length > 0,
    creator_profile: {
      creator_type: card?.creator_type,
    },
  };
};

function buildSlimPlatformsFromUser(user) {
  const accounts = (user?.social_accounts || []).filter(
    (account) => account && account.is_active !== false
  );
  const platformStats = {};
  const platformList = [];

  accounts.forEach((account) => {
    const platform = String(account.platform || "").toLowerCase();
    if (!platform || HIDDEN_PLATFORM_KEYS.has(platform)) return;
    const pd = account.profile_data || {};
    const followers =
      Number(account.follower_count) ||
      Number(pd.followers) ||
      Number(pd.followers_count) ||
      Number(pd.follower_count) ||
      Number(pd.subscriber_count) ||
      Number(pd.reputation?.follower_count) ||
      Number(pd.reputation?.subscriber_count) ||
      0;
    const username = account.username || pd.username || pd.handle || null;
    const profile_url = pd.profile_url || pd.url || null;
    platformStats[platform] = { followers, username, profile_url, profileUrl: profile_url };
    if (!platformList.includes(platform)) platformList.push(platform);
  });

  return {
    platformStats,
    platformList,
    hasConnectedSocialAccounts: platformList.length > 0,
  };
}

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
    nicheKey: niche,
    creators: creatorsList.sort((a, b) => b.followers - a.followers).slice(0, 10),
  }));
};
