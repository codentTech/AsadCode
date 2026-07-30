/**
 * Normalize campaign or UI duration values into hire-form contract values.
 * Campaign wizard stores "3 months"; hire form / API mapper use "3" → "3_months".
 * Also accepts hire labels ("12 Months Usage") and API enums ("12_months").
 */
function canonicalizeTerm(raw) {
  if (raw == null || raw === "") return "";
  return String(raw)
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\busage\s*rights?\b/g, "")
    .replace(/\busage\b/g, "")
    .replace(/\bmonths?\b/g, "months")
    .trim();
}

export function normalizeHireUsageRights(raw) {
  if (raw == null || raw === "") return null;
  const value = canonicalizeTerm(raw);

  if (
    value === "no" ||
    value === "no usage" ||
    value === "no_usage" ||
    value === "none"
  ) {
    return "no_usage";
  }
  if (value === "permanent" || value === "permanent usage") {
    return "permanent";
  }
  if (value === "3" || value === "3 months" || value === "3_months") {
    return "3";
  }
  if (value === "6" || value === "6 months" || value === "6_months") {
    return "6";
  }
  if (value === "12" || value === "12 months" || value === "12_months") {
    return "12";
  }
  return null;
}

export function normalizeHireExclusivity(raw) {
  if (raw == null || raw === "") return null;
  const value = canonicalizeTerm(raw);

  if (value === "none" || value === "no" || value === "") {
    return "none";
  }
  if (value === "3" || value === "3 months" || value === "3_months") {
    return "3";
  }
  if (value === "6" || value === "6 months" || value === "6_months") {
    return "6";
  }
  if (value === "12" || value === "12 months" || value === "12_months") {
    return "12";
  }
  return null;
}

/** Human-readable usage rights for contract preview text. */
export function formatUsageRightsForDisplay(raw) {
  const normalized = normalizeHireUsageRights(raw);
  if (!normalized) return "[enter usage rights]";
  if (normalized === "no_usage") return "No usage rights";
  if (normalized === "permanent") return "Permanent usage rights";
  return `${normalized} months usage rights`;
}

/** Human-readable exclusivity for contract preview text. */
export function formatExclusivityForDisplay(raw) {
  const normalized = normalizeHireExclusivity(raw);
  if (!normalized || normalized === "none") return "None";
  return `${normalized} months`;
}
