function extractYoutubeVideoIdFromUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const trimmed = raw.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const urlObj = new URL(withProtocol);
    const host = urlObj.hostname.replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      const id = urlObj.pathname.replace(/^\//, "").split("/")[0];
      return id || null;
    }
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "music.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const fromQuery = urlObj.searchParams.get("v");
      if (fromQuery) return fromQuery;
      const shorts = urlObj.pathname.match(/\/shorts\/([A-Za-z0-9_-]+)/);
      if (shorts?.[1]) return shorts[1];
      const embed = urlObj.pathname.match(/\/embed\/([A-Za-z0-9_-]+)/);
      if (embed?.[1]) return embed[1];
      const live = urlObj.pathname.match(/\/live\/([A-Za-z0-9_-]+)/);
      if (live?.[1]) return live[1];
    }
  } catch {
    return null;
  }
  return null;
}

function extractTiktokVideoIdFromUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  try {
    const trimmed = raw.trim();
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const urlObj = new URL(withProtocol);
    const m = urlObj.pathname.match(/\/video\/(\d+)/);
    if (m?.[1]) return m[1];
  } catch {
    return null;
  }
  return null;
}

function isLikelyYoutubeVideoId(id) {
  return typeof id === "string" && /^[A-Za-z0-9_-]{11}$/.test(id.trim());
}

function isLikelyTiktokVideoId(id) {
  return typeof id === "string" && /^\d{8,24}$/.test(id.trim());
}

function firstHttpUrl(...candidates) {
  for (const c of candidates) {
    if (typeof c === "string" && /^https?:\/\//i.test(c.trim())) {
      return c.trim();
    }
  }
  return null;
}

export function resolveYoutubeVideoId(item) {
  const fromUrl = extractYoutubeVideoIdFromUrl(item?.post_url);
  if (isLikelyYoutubeVideoId(fromUrl)) return fromUrl.trim();

  const fromApi = String(item?.external_post_id || "").trim();
  if (isLikelyYoutubeVideoId(fromApi)) return fromApi;

  return null;
}

export function resolveTiktokVideoId(item) {
  const fromApi = String(item?.external_post_id || "").trim();
  if (isLikelyTiktokVideoId(fromApi)) return fromApi;

  const fromUrl = extractTiktokVideoIdFromUrl(item?.post_url);
  if (isLikelyTiktokVideoId(fromUrl)) return fromUrl;

  return null;
}

export function getGalleryVideoEmbedSrc(item) {
  if (!item || item.media_type !== "video" || item.source_type !== "post_link") {
    return null;
  }
  const pl = String(item.platform || "").toLowerCase();
  if (pl === "youtube") {
    const id = resolveYoutubeVideoId(item);
    if (!id) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }
  if (pl === "tiktok") {
    const id = resolveTiktokVideoId(item);
    if (!id) return null;
    return `https://www.tiktok.com/player/v1/${id}?controls=1`;
  }
  return null;
}

export function getGalleryVideoPlaybackSrc(item) {
  if (!item || item.media_type !== "video") return null;
  if (getGalleryVideoEmbedSrc(item)) return null;
  return firstHttpUrl(item.file_url, item.phyllo_preview_url);
}

export function getGalleryThumbnailSrc(item) {
  if (!item) return null;

  const direct = firstHttpUrl(item.thumbnail_url);
  if (direct) return direct;

  const pl = String(item.platform || "").toLowerCase();
  if (item.media_type === "video" && pl === "youtube") {
    const id = resolveYoutubeVideoId(item);
    if (id) return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  }

  if (item.media_type === "image") {
    return firstHttpUrl(item.file_url);
  }

  return null;
}

export function getGalleryMediaPresentation(item) {
  const embedSrc = item?.media_type === "video" ? getGalleryVideoEmbedSrc(item) : null;
  const playbackSrc = item?.media_type === "video" ? getGalleryVideoPlaybackSrc(item) : null;
  const thumbnailSrc = getGalleryThumbnailSrc(item);
  const isPostLinkVideo = item?.media_type === "video" && item?.source_type === "post_link";
  const isPreparingHosted =
    isPostLinkVideo && !embedSrc && !playbackSrc && Boolean(thumbnailSrc);

  return {
    embedSrc,
    playbackSrc,
    thumbnailSrc,
    isPreparingHosted,
    hasVisual: Boolean(embedSrc || playbackSrc || thumbnailSrc),
  };
}
