const ACTION_LABELS = {
  IMPERSONATION_START: "Impersonation started",
  IMPERSONATION_END: "Impersonation ended",
};

const KEYS_NEVER_IN_DETAILS = new Set(["admin_email", "target_email"]);

const ROLE_LABELS = {
  BRAND: "Brand",
  CREATOR: "Creator",
  ADMIN: "Admin",
};

export function formatAuditLogAction(action) {
  if (!action) return "—";
  return ACTION_LABELS[action] ?? String(action).replace(/_/g, " ").toLowerCase();
}

function humanLabel(key) {
  const labels = {
    ip: "IP address",
    user_agent: "Browser",
    target_role: "Account type",
  };
  if (labels[key]) return labels[key];
  return String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function truncate(str, max) {
  const s = String(str);
  if (s.length <= max) return s;
  return `${s.slice(0, max)}…`;
}

function formatRole(raw) {
  const key = String(raw || "").trim().toUpperCase();
  return ROLE_LABELS[key] ?? truncate(String(raw).replace(/_/g, " ").toLowerCase(), 40);
}

function summarizeUserAgent(ua) {
  const s = String(ua || "");
  if (!s) return "";
  let os = "";
  if (/Windows NT/i.test(s)) os = "Windows";
  else if (/Mac OS X|Macintosh/i.test(s)) os = "macOS";
  else if (/Android/i.test(s)) os = "Android";
  else if (/iPhone|iPad|iPod/i.test(s)) os = "iOS";
  else if (/Linux/i.test(s)) os = "Linux";

  let browser = "";
  if (/Edg\//i.test(s)) browser = "Edge";
  else if (/Chrome\//i.test(s)) browser = "Chrome";
  else if (/Firefox\//i.test(s)) browser = "Firefox";
  else if (/Safari\//i.test(s) && !/Chrome/i.test(s)) browser = "Safari";

  if (browser && os) return `${browser} on ${os}`;
  if (browser) return browser;
  return truncate(s, 56);
}

const ORDER = ["ip", "user_agent", "target_role"];

export function getAuditLogDetailLines(metadata) {
  if (!metadata || typeof metadata !== "object") {
    return [];
  }
  const lines = [];
  const used = new Set();

  for (const key of ORDER) {
    if (!(key in metadata) || KEYS_NEVER_IN_DETAILS.has(key)) continue;
    const raw = metadata[key];
    if (raw == null || raw === "") continue;

    let value;
    if (key === "user_agent") {
      value = summarizeUserAgent(raw);
    } else if (key === "target_role") {
      value = formatRole(raw);
    } else if (key === "ip") {
      const ip = String(raw).trim();
      value =
        ip === "::1" || ip === "127.0.0.1" || ip === "0:0:0:0:0:0:0:1" ? "Local (this machine)" : ip;
    } else {
      value = truncate(String(raw), 120);
    }
    if (!value) continue;

    lines.push({ key, label: humanLabel(key), value });
    used.add(key);
  }

  for (const [key, raw] of Object.entries(metadata)) {
    if (used.has(key) || KEYS_NEVER_IN_DETAILS.has(key)) continue;
    if (raw == null || raw === "") continue;
    lines.push({ key, label: humanLabel(key), value: truncate(String(raw), 120) });
  }

  return lines;
}
