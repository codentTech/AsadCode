export function getGalleryVideoPlaybackSrc(item) {
  if (!item || item.media_type !== "video") return null;
  const src = item.file_url || item.phyllo_preview_url;
  if (typeof src === "string" && src.trim()) return src.trim();
  return null;
}
