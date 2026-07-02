/**
 * Returns the public profile URL for a platform given optional profileUrl, username, or platform name.
 * @param {string} platformName - e.g. "instagram", "Instagram", "youtube"
 * @param {string} [username] - handle without @
 * @param {string} [profileUrl] - if already known, use it
 * @returns {string|null} URL or null if not enough data
 */
export function getPlatformProfileUrl(platformName, username, profileUrl) {
  if (profileUrl && typeof profileUrl === "string" && profileUrl.startsWith("http")) {
    return profileUrl;
  }
  const u = (username || "").trim().replace(/^@/, "");
  if (!u) return null;
  const p = (platformName || "").toLowerCase();
  switch (p) {
    case "instagram":
      return `https://www.instagram.com/${u}/`;
    case "tiktok":
      return `https://www.tiktok.com/@${u}`;
    case "youtube":
      return u.startsWith("UC") || u.length > 15
        ? `https://www.youtube.com/channel/${u}`
        : `https://www.youtube.com/@${u}`;
    case "twitter":
    case "x":
      return `https://x.com/${u}`;
    case "facebook":
      return `https://www.facebook.com/${u}`;
    default:
      return null;
  }
}
