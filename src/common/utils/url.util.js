export function parseHttpUrlInput(raw) {
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  if (!trimmed) {
    return { ok: false, error: "Enter a URL" };
  }
  let parsed;
  try {
    parsed = new URL(trimmed);
  } catch {
    if (/^\s*https?:\/\//i.test(trimmed)) {
      return { ok: false, error: "Enter a valid URL" };
    }
    try {
      parsed = new URL(`https://${trimmed}`);
    } catch {
      return { ok: false, error: "Enter a valid URL" };
    }
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, error: "Use a link starting with http:// or https://" };
  }
  return { ok: true, href: parsed.href };
}

function isCleercutS3Hostname(hostname) {
  const host = String(hostname || "").toLowerCase();
  return (
    /^[a-z0-9.-]+\.s3\.[a-z0-9-]+\.amazonaws\.com$/.test(host) ||
    /^[a-z0-9.-]+\.s3\.amazonaws\.com$/.test(host)
  );
}

export function isAllowedMediaUrl(raw) {
  if (!raw || typeof raw !== "string") return false;
  try {
    const parsed = new URL(raw.trim());
    if (parsed.protocol !== "https:") return false;
    if (parsed.username || parsed.password) return false;
    if (!isCleercutS3Hostname(parsed.hostname)) return false;
    const path = decodeURIComponent(parsed.pathname || "");
    return path.includes("/cleercut/");
  } catch {
    return false;
  }
}

export function getSafeMediaUrl(raw) {
  return isAllowedMediaUrl(raw) ? raw.trim() : null;
}
