export const DEFAULT_PLATFORMS = {
  instagram: { followers: 0, verified: false },
  youtube: { followers: 0, verified: false },
  twitter: { followers: 0, verified: false },
  tiktok: { followers: 0, verified: false },
};

export function ratingAndReviewCountFromCreatorUser(creatorUser) {
  const profile = creatorUser?.creator_profile;
  const rawRating = profile?.rating;
  const rating =
    rawRating != null && rawRating !== "" ? Number(rawRating) : 0;
  const rawCount = profile?.reviewCount ?? profile?.review_count;
  const reviewCount =
    rawCount != null && rawCount !== ""
      ? Number(rawCount)
      : Array.isArray(profile?.campaign_reviews)
        ? profile.campaign_reviews.length
        : 0;
  return {
    rating: Number.isFinite(rating) ? rating : 0,
    reviewCount: Number.isFinite(reviewCount) ? reviewCount : 0,
  };
}

export function buildPlatformsFromSocialAccounts(creator) {
  const accounts = creator?.social_accounts || [];
  const out = { ...DEFAULT_PLATFORMS };
  for (const acc of accounts) {
    const platform = String(acc.platform || "").toLowerCase();
    if (!platform) continue;
    const pd = acc.profile_data || {};
    const followers =
      Number(pd.followers) ||
      Number(pd.followers_count) ||
      Number(pd.follower_count) ||
      Number(pd.subscriber_count) ||
      0;
    if (!out[platform]) out[platform] = { followers: 0, verified: false };
    out[platform] = {
      followers,
      verified: acc.is_verified ?? out[platform].verified ?? false,
    };
  }
  return out;
}

export function buildPlatformsFromPhylloAccounts(accounts) {
  const out = { ...DEFAULT_PLATFORMS };
  const list = Array.isArray(accounts) ? accounts : [];
  for (const acc of list) {
    if (!acc?.is_active) continue;
    const platform = String(acc.platform || "").toLowerCase();
    if (!platform) continue;
    const followers =
      Number(acc.follower_count) ||
      Number(acc.profile_data?.follower_count) ||
      Number(acc.profile_data?.followers_count) ||
      Number(acc.profile_data?.followers) ||
      Number(acc.profile_data?.subscriber_count) ||
      0;
    if (!out[platform]) out[platform] = { followers: 0, verified: false };
    out[platform] = {
      followers,
      verified: acc.is_verified ?? out[platform].verified ?? false,
    };
  }
  return out;
}

export function normalizeActivePhylloPlatforms(accounts) {
  const list = Array.isArray(accounts) ? accounts : [];
  const platformStats = {};

  for (const acc of list) {
    if (!acc?.is_active) continue;
    const platform = String(acc.platform || "").toLowerCase();
    if (!platform) continue;

    const pd = acc.profile_data || {};
    const followers =
      Number(acc.follower_count) ||
      Number(pd.follower_count) ||
      Number(pd.subscriber_count) ||
      Number(pd.followers_count) ||
      Number(pd.followers) ||
      Number(pd.reputation?.follower_count) ||
      Number(pd.reputation?.subscriber_count) ||
      0;
    const username = acc.username || pd.username || pd.handle || pd.platform_username || null;
    const profileUrl = pd.profile_url || pd.url || null;

    const existing = platformStats[platform];
    if (!existing || followers >= Number(existing.followers || 0)) {
      platformStats[platform] = {
        followers,
        username,
        profile_url: profileUrl,
      };
    }
  }

  const platforms = Object.keys(platformStats);
  const totalFollowers = Object.values(platformStats).reduce(
    (sum, stat) => sum + Number(stat?.followers || 0),
    0
  );

  return { platforms, platformStats, totalFollowers };
}
