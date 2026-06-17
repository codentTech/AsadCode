export const DEFAULT_PLATFORMS = {
  instagram: { followers: 0, verified: false },
  youtube: { followers: 0, verified: false },
  twitter: { followers: 0, verified: false },
  tiktok: { followers: 0, verified: false },
};

export const HIDDEN_PLATFORM_KEYS = new Set(["twitter", "facebook", "x"]);

export function isActiveSocialAccount(account) {
  return Boolean(account) && account.is_active !== false;
}

export function getFollowerCountFromSocialAccount(account) {
  if (!account) return 0;
  const pd = account.profile_data || {};
  return (
    Number(account.follower_count) ||
    Number(pd.followers) ||
    Number(pd.followers_count) ||
    Number(pd.follower_count) ||
    Number(pd.subscriber_count) ||
    Number(pd.subscribers) ||
    Number(pd.reputation?.follower_count) ||
    Number(pd.reputation?.subscriber_count) ||
    0
  );
}

export function getUsernameFromSocialAccount(account) {
  if (!account) return null;
  const pd = account.profile_data || {};
  return account.username || pd.username || pd.handle || pd.platform_username || null;
}

export function getProfileUrlFromSocialAccount(account) {
  if (!account) return null;
  const pd = account.profile_data || {};
  return pd.profile_url || pd.url || null;
}

export function buildConnectedPlatformsFromCreatorUser(creatorUser) {
  const accounts = (creatorUser?.social_accounts || []).filter(isActiveSocialAccount);
  const platforms = {};
  const platformStats = {};
  const platformList = [];

  accounts.forEach((account) => {
    const platform = String(account.platform || "").toLowerCase();
    if (!platform || HIDDEN_PLATFORM_KEYS.has(platform)) return;

    const followers = getFollowerCountFromSocialAccount(account);
    const username = getUsernameFromSocialAccount(account);
    const profile_url = getProfileUrlFromSocialAccount(account);

    platforms[platform] = {
      followers,
      verified: account.is_verified ?? account.profile_data?.is_verified ?? false,
      username,
      profile_url,
    };
    platformStats[platform] = {
      followers,
      username,
      profile_url,
      profileUrl: profile_url,
    };
    if (!platformList.includes(platform)) {
      platformList.push(platform);
    }
  });

  return {
    platforms,
    platformStats,
    platformList,
    hasConnectedSocialAccounts: platformList.length > 0,
  };
}

export function buildConnectedPlatformsFromPhylloAccounts(accounts) {
  const platforms = {};
  const platformStats = {};
  const platformList = [];

  (Array.isArray(accounts) ? accounts : [])
    .filter(isActiveSocialAccount)
    .forEach((account) => {
      const platform = String(account.platform || "").toLowerCase();
      if (!platform || HIDDEN_PLATFORM_KEYS.has(platform)) return;

      const pd = account.profile_data || {};
      const followers =
        Number(account.follower_count) ||
        Number(pd.follower_count) ||
        Number(pd.followers_count) ||
        Number(pd.followers) ||
        Number(pd.subscriber_count) ||
        Number(pd.reputation?.follower_count) ||
        Number(pd.reputation?.subscriber_count) ||
        0;
      const username = account.username || getUsernameFromSocialAccount(account);
      const profile_url = pd.profile_url || pd.url || null;

      platforms[platform] = {
        followers,
        verified: account.is_verified ?? pd.is_verified ?? false,
        username,
        profile_url,
      };
      platformStats[platform] = {
        followers,
        username,
        profile_url,
        profileUrl: profile_url,
      };
      if (!platformList.includes(platform)) {
        platformList.push(platform);
      }
    });

  return {
    platforms,
    platformStats,
    platformList,
    hasConnectedSocialAccounts: platformList.length > 0,
  };
}

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
  return buildConnectedPlatformsFromCreatorUser(creator).platforms;
}

function sumPlatformFollowers(platforms) {
  return Object.values(platforms || {}).reduce(
    (sum, item) => sum + (Number(item?.followers) || 0),
    0,
  );
}

export function resolveCreatorTotalFollowers(creatorRow, phylloAccounts = null) {
  const creatorUser = creatorRow?.creator;
  if (!creatorUser) return 0;

  if (Array.isArray(phylloAccounts) && phylloAccounts.length > 0) {
    const fromPhyllo = sumPlatformFollowers(
      buildConnectedPlatformsFromPhylloAccounts(phylloAccounts).platforms,
    );
    if (fromPhyllo > 0) return fromPhyllo;
  }

  const fromPlatforms = sumPlatformFollowers(
    buildConnectedPlatformsFromCreatorUser(creatorUser).platforms,
  );
  if (fromPlatforms > 0) return fromPlatforms;

  return Number(creatorUser.creator_profile?.total_followers) || 0;
}

export function buildPlatformsFromPhylloAccounts(accounts) {
  return buildConnectedPlatformsFromPhylloAccounts(accounts).platforms;
}

export function normalizeActivePhylloPlatforms(accounts) {
  const { platforms, platformStats, platformList, hasConnectedSocialAccounts } =
    buildConnectedPlatformsFromPhylloAccounts(accounts);

  const totalFollowers = Object.values(platformStats).reduce(
    (sum, stat) => sum + Number(stat?.followers || 0),
    0,
  );

  return {
    platforms: platformList,
    platformStats,
    totalFollowers,
    hasConnectedSocialAccounts,
    platformsMap: platforms,
  };
}

export function getConnectedPlatformEntries(platformsMap) {
  return Object.entries(platformsMap || {}).filter(
    ([platform]) => !HIDDEN_PLATFORM_KEYS.has(String(platform).toLowerCase()),
  );
}

const PLATFORM_DISPLAY_LABELS = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  twitter: "Twitter",
  facebook: "Facebook",
};

export function mapConnectedPlatformsForDisplay(accounts, { loading = false } = {}) {
  const { platformList, platformStats } = buildConnectedPlatformsFromPhylloAccounts(accounts);

  return platformList.map((key) => ({
    key,
    name: PLATFORM_DISPLAY_LABELS[key] || key,
    username: platformStats[key]?.username ?? null,
    followers: platformStats[key]?.followers ?? 0,
    profileUrl: platformStats[key]?.profile_url ?? platformStats[key]?.profileUrl ?? null,
    isVerified: platformStats[key]?.verified ?? false,
    isConnected: true,
    loading,
  }));
}
