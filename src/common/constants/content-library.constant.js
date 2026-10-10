export const CONTENT_LIBRARY_PAGE_LIMIT = 24;

export const CONTENT_LIBRARY_SORT_OPTIONS = [
  { label: "Newest approved", value: "newest_approved" },
  { label: "Oldest approved", value: "oldest_approved" },
  { label: "Recently added", value: "recently_added" },
  { label: "Creator A–Z", value: "creator_az" },
  { label: "Campaign A–Z", value: "campaign_az" },
];

export const CONTENT_LIBRARY_MEDIA_TYPE_OPTIONS = [
  { label: "All media types", value: "" },
  { label: "Video", value: "video" },
  { label: "Image", value: "image" },
  { label: "Document", value: "document" },
  { label: "Other", value: "other" },
];

export const CONTENT_LIBRARY_RIGHTS_OPTIONS = [
  { label: "Any status", value: "" },
  { label: "Active", value: "active" },
  { label: "Expiring soon", value: "expiring_soon" },
  { label: "Expired", value: "expired" },
  { label: "Unknown", value: "unknown" },
];

export const CONTENT_LIBRARY_STATE_OPTIONS = [
  { label: "Active", value: "active" },
  { label: "Archived", value: "archived" },
];

export const CONTENT_LIBRARY_RIGHTS_LABELS = {
  active: "Active",
  expiring_soon: "Expiring soon",
  expired: "Expired",
  unknown: "Unknown",
};

export const CONTENT_LIBRARY_USAGE_RIGHTS_LABELS = {
  no_usage: "No usage rights",
  "3_months": "3 months",
  "6_months": "6 months",
  "12_months": "12 months",
  permanent: "Permanent",
};
