/**
 * Allow only same-origin relative paths (open-redirect safe).
 * @param {unknown} raw
 * @returns {string | null}
 */
export function sanitizeReturnTo(raw) {
  if (typeof raw !== "string") return null;
  const value = raw.trim();
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//")) return null;
  if (value.includes("://") || value.includes("\\")) return null;
  return value;
}

/**
 * @param {string} [pathname]
 * @param {string} [search] query string with or without leading ?
 * @returns {string | null}
 */
export function buildReturnTo(pathname, search) {
  const path = typeof pathname === "string" ? pathname.trim() : "";
  if (!path.startsWith("/")) return null;
  const q = typeof search === "string" ? search.trim() : "";
  if (!q) return sanitizeReturnTo(path);
  const withQuery = `${path}${q.startsWith("?") ? q : `?${q}`}`;
  return sanitizeReturnTo(withQuery);
}

/**
 * @param {string | null | undefined} returnTo
 * @returns {string}
 */
export function buildLoginUrl(returnTo) {
  const safe = sanitizeReturnTo(returnTo);
  if (!safe) return "/login";
  return `/login?returnTo=${encodeURIComponent(safe)}`;
}
