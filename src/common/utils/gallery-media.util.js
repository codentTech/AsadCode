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

export function getGalleryVideoEmbedSrc(item) {
  if (!item || item.media_type !== "video" || item.source_type !== "post_link") {
    return null;
  }
  const pl = String(item.platform || "").toLowerCase();
  if (pl === "youtube") {
    const fromApi = item.external_post_id && String(item.external_post_id).trim();
    const id = fromApi || extractYoutubeVideoIdFromUrl(item.post_url);
    if (!id || !/^[A-Za-z0-9_-]{6,128}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
  }
  if (pl === "tiktok") {
    let id = item.external_post_id && String(item.external_post_id).trim();
    if (!id || !/^\d{8,24}$/.test(id)) {
      id = extractTiktokVideoIdFromUrl(item.post_url);
    }
    if (!id || !/^\d{8,24}$/.test(id)) return null;
    return `https://www.tiktok.com/player/v1/${id}?controls=1`;
  }
  return null;
}

export function getGalleryVideoPlaybackSrc(item) {
  if (!item || item.media_type !== "video") return null;
  if (getGalleryVideoEmbedSrc(item)) return null;
  const src = item.file_url || item.phyllo_preview_url;
  if (typeof src === "string" && src.trim()) return src.trim();
  return null;
}
