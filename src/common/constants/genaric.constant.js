export const PLATFORM_PRIORITY = ["instagram", "tiktok", "youtube"];
export const KNOWN_PLATFORMS = ["instagram", "tiktok", "youtube"];

export function getDefaultCreatorPlatformFromConnectedList(entries) {
  if (!Array.isArray(entries) || entries.length === 0) return null;
  const normalized = entries
    .map((e) =>
      typeof e === "string"
        ? e.toLowerCase()
        : String(e?.platform ?? e?.name ?? "").toLowerCase(),
    )
    .filter(Boolean);
  if (!normalized.length) return null;
  for (const p of PLATFORM_PRIORITY) {
    if (normalized.includes(p)) return p;
  }
  return normalized[0] || null;
}
