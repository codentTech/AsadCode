/**
 * Prefer CDN resize only for known transformable hosts.
 * Do not mutate signed URLs (S3/CloudFront query signatures break if params are added).
 */
export function getCreatorCardThumbnailUrl(url, variant = "portfolio") {
  if (!url || typeof url !== "string") return url;
  if (url.startsWith("/") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const width = variant === "avatar" ? 128 : 320;

    if (parsed.hostname.includes("cloudinary.com") && parsed.pathname.includes("/upload/")) {
      if (parsed.pathname.includes("/f_auto,q_auto,")) return url;
      parsed.pathname = parsed.pathname.replace(
        "/upload/",
        `/upload/f_auto,q_auto,w_${width},c_fill/`
      );
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}
