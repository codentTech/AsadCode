export function normalizePlatformConnection(connection) {
  if (!connection) return null;

  if (typeof connection === "string") {
    return {
      id: connection,
      name: connection.replace(/_/g, " "),
      followers: null,
      verified: false,
      platform: connection,
      engagementRate: null,
    };
  }

  if (typeof connection === "object") {
    const platform =
      connection.platform || connection.name || connection.type || connection.provider;
    if (!platform) return null;

    const rawFollowers =
      connection.followers ?? connection.followerCount ?? connection.audienceSize ?? null;
    const rawEngagement =
      connection.engagementRate ??
      connection.engagement_rate ??
      connection.metrics?.engagementRate ??
      connection.analytics?.engagementRate ??
      null;

    const followersNumber = Number(rawFollowers);
    const engagementNumber = Number(rawEngagement);

    return {
      id: connection.id || platform,
      name: connection.displayName || connection.name || platform.replace(/_/g, " "),
      followers: Number.isFinite(followersNumber) ? followersNumber : rawFollowers || 0,
      verified:
        connection.verified === true ||
        connection.isVerified === true ||
        connection.status === "verified",
      platform,
      lastSynced: connection.lastSynced || connection.syncedAt || null,
      engagementRate: Number.isFinite(engagementNumber)
        ? Number(engagementNumber)
        : (rawEngagement ?? null),
    };
  }

  return null;
}
