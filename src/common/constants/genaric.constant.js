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

export function categoriesToNicheOptions(categories) {
  if (!Array.isArray(categories)) return [];
  const seen = new Set();
  const out = [];
  categories.forEach((c) => {
    const name = String(c ?? "").trim();
    if (!name || seen.has(name)) return;
    seen.add(name);
    out.push({ id: name, name });
  });
  return out;
}

export function mergeNicheOptionLists(primary, secondary) {
  const map = new Map();
  [...(primary || []), ...(secondary || [])].forEach((n) => {
    if (n?.id != null && String(n.id).trim()) {
      map.set(String(n.id), { id: String(n.id), name: n.name || String(n.id) });
    }
  });
  return Array.from(map.values());
}
