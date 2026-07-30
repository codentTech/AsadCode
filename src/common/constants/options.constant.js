import { CAMPAIGN_TYPE } from "./campaign.constant";

// Platform options for social media platforms
export const PLATFORM_OPTIONS = [
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
];

export const BRAND_ACCOUNT_TYPE_OPTIONS = [
  { value: "brand", label: "This is a brand account" },
  { value: "agency", label: "This is an agency account" },
];

export const IDEAL_CREATOR_GENDER_OPTIONS = [
  { id: "male", label: "Male", icon: "👨" },
  { id: "female", label: "Female", icon: "👩" },
  { id: "mixed", label: "Mixed/Any", icon: "👥" },
];

export const IDEAL_CREATOR_AGE_RANGES = [
  { id: "13-17", label: "13-17", desc: "Gen Z Early" },
  { id: "18-25", label: "18-25", desc: "Gen Z Core" },
  { id: "26-32", label: "26-32", desc: "Millennials" },
  { id: "33-40", label: "33-40", desc: "Elder Millennials" },
  { id: "41-50", label: "41-50", desc: "Gen X" },
  { id: "50+", label: "50+", desc: "Boomers+" },
];

// Follower count options for filtering
export const FOLLOWER_OPTIONS = [
  { value: "1000", label: "1K" },
  { value: "5000", label: "5K" },
  { value: "10000", label: "10K" },
  { value: "25000", label: "25K" },
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "250000", label: "250K" },
  { value: "500000", label: "500K" },
  { value: "1000000", label: "1M" },
];

// Gender options for creator filtering
export const GENDER_OPTIONS = [
  { value: "", label: "Select gender preference" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

// Age range options for creator filtering
export const AGE_OPTIONS = [
  { value: "18-24", label: "18-24" },
  { value: "25-34", label: "25-34" },
  { value: "35-44", label: "35-44" },
  { value: "45-54", label: "45-54" },
  { value: "55+", label: "55+" },
];

// Niche categories for creator filtering
export const NICHE_OPTIONS = [
  { value: "fitness", label: "Fitness" },
  { value: "food", label: "Food" },
  { value: "travel", label: "Travel" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "fashion", label: "Fashion" },
  { value: "beauty", label: "Beauty" },
  { value: "tech", label: "Technology" },
  { value: "gaming", label: "Gaming" },
  { value: "skincare", label: "Skincare" },
  { value: "other", label: "Other" },
];

// Sort by options for creator ordering
export const DISCOVER_CREATORS_DEFAULT_SORT_BY = "followers";

export const SORT_BY_OPTIONS = [
  { value: "followers", label: "Followers" },
  { value: "rating", label: "Rating" },
  { value: "engagement", label: "Engagement Rate" },
];

// Language options for creator filtering
export const LANGUAGE_OPTIONS = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "hindi", label: "Hindi" },
  { value: "other", label: "Other" },
];

// Audience gender options for audience filtering
export const AUDIENCE_GENDER_OPTIONS = [
  { value: "mostly-male", label: "Mostly Male" },
  { value: "mostly-female", label: "Mostly Female" },
];

// Audience age range options for audience filtering
export const AUDIENCE_AGE_OPTIONS = [
  { value: "13-17", label: "13–17" },
  { value: "18-24", label: "18–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55+", label: "55+" },
];

// Country options for location filtering
export const COUNTRY_OPTIONS = [
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "uk", label: "United Kingdom" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "es", label: "Spain" },
  { value: "it", label: "Italy" },
  { value: "jp", label: "Japan" },
  { value: "br", label: "Brazil" },
];

// Compensation type options for campaign filtering
export const COMPENSATION_TYPE_OPTIONS = [
  { value: "PAID", label: "Paid" },
  { value: "GIFTED_PRODUCT", label: "Gifted Product" },
  { value: "COMMISSION", label: "Affiliate" },
];

// Campaign type options
export const CAMPAIGN_TYPE_OPTIONS = [
  { label: "Sponsored Post", value: CAMPAIGN_TYPE.SPONSORED_POST },
  { label: "UGC", value: CAMPAIGN_TYPE.UGC },
  { label: "Gifted", value: CAMPAIGN_TYPE.GIFTED },
  { label: "Affiliate", value: CAMPAIGN_TYPE.AFFILIATE },
];

export const CREATOR_COMPENSATION_OPTIONS = [
  { label: "Suggested Range", value: "suggested" },
  { label: "Set Fixed Price", value: "set-price" },
];

// Location options for campaign filtering
export const LOCATION_OPTIONS = [
  { value: "Remote", label: "Remote" },
  { value: "On Location", label: "On Location" },
];

export const USAGE_RIGHTS_OPTIONS = [
  { value: "no_usage", label: "No Usage Rights" },
  { value: "3 months", label: "3 Months Usage" },
  { value: "6 months", label: "6 Months Usage" },
  { value: "12 months", label: "12 Months Usage" },
  { value: "permanent", label: "Permanent Usage" },
];

export const EXCLUSIVITY_CLAUSE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "3 months", label: "3 Months" },
  { value: "6 months", label: "6 Months" },
  { value: "12 months", label: "12 Months" },
];

/** Hire/contract form values match API mapping (`3` → `3_months`). */
export const HIRE_USAGE_RIGHTS_OPTIONS = [
  { value: "no_usage", label: "No Usage Rights" },
  { value: "3", label: "3 Months Usage" },
  { value: "6", label: "6 Months Usage" },
  { value: "12", label: "12 Months Usage" },
  { value: "permanent", label: "Permanent Usage" },
];

export const HIRE_EXCLUSIVITY_CLAUSE_OPTIONS = [
  { value: "none", label: "None" },
  { value: "3", label: "3 Months" },
  { value: "6", label: "6 Months" },
  { value: "12", label: "12 Months" },
];

export const REVISION_LIMIT_OPTIONS = [
  { value: "0", label: "0 Revisions" },
  { value: "1", label: "1 Revision" },
  { value: "2", label: "2 Revisions" },
  { value: "3", label: "3 Revisions" },
  { value: "4", label: "4 Revisions" },
  { value: "5", label: "5 Revisions" },
];

export const NEGOTIATION_TOGGLE_OPTIONS = [
  {
    value: "negotiable",
    label: "Negotiable",
    activeClasses: "bg-primary/10 text-primary",
    inactiveClasses: "bg-gray-100 text-gray-600",
  },
  {
    value: "non_negotiable",
    label: "Non Negotiable",
    activeClasses: "bg-orange-100 text-orange-700",
    inactiveClasses: "bg-gray-100 text-gray-600",
  },
];

export const CREATOR_APPLICATION_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "DENIED", label: "Denied" },
  { value: "ONBOARDING_STARTED", label: "Onboarding Started" },
  { value: "APPROVED", label: "Approved" },
];

export const CREATOR_APPLICATION_SORT_OPTIONS = [
  { value: "created_at", label: "Date" },
  { value: "country", label: "Country" },
  { value: "status", label: "Status" },
];

export const CREATOR_APPLICATION_DEFAULT_SORT_BY = "created_at";
export const CREATOR_APPLICATION_DEFAULT_SORT_ORDER = "DESC";

export const CONNECTED_ACCOUNTS_PLATFORM_FILTER_OPTIONS = [
  { value: "ALL", label: "All platforms" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "facebook", label: "Facebook" },
  { value: "twitter", label: "Twitter" },
];

export const CONNECTED_ACCOUNTS_SORT_OPTIONS = [
  { value: "created_at", label: "Date connected" },
  { value: "platform", label: "Platform" },
  { value: "full_name", label: "Creator" },
  { value: "follower_count", label: "Followers" },
];

export const CONNECTED_ACCOUNTS_DEFAULT_SORT_BY = "created_at";
export const CONNECTED_ACCOUNTS_DEFAULT_SORT_ORDER = "DESC";

export const ADMIN_USERS_ROLE_FILTER_OPTIONS = [
  { value: "ALL", label: "All roles" },
  { value: "CREATOR", label: "Creator" },
  { value: "BRAND", label: "Brand" },
];

export const ADMIN_USERS_STATUS_FILTER_OPTIONS = [
  { value: "ALL", label: "All statuses" },
  { value: "ACTIVE", label: "Active" },
  { value: "BLOCKED", label: "Blocked" },
];

export const ADMIN_USERS_ONBOARDING_FILTER_OPTIONS = [
  { value: "ALL", label: "All onboarding" },
  { value: "COMPLETED", label: "Completed" },
  { value: "IN_PROGRESS", label: "In Progress" },
];

export const ADMIN_USERS_SORT_OPTIONS = [
  { value: "created_at", label: "Date joined" },
  { value: "name", label: "Name" },
];

export const ADMIN_USERS_DEFAULT_SORT_BY = "created_at";
export const ADMIN_USERS_DEFAULT_SORT_ORDER = "DESC";

export const ADMIN_WAITLIST_SORT_OPTIONS = [
  { value: "created_at", label: "Date" },
  { value: "email", label: "Email" },
];

export const ADMIN_WAITLIST_DEFAULT_SORT_BY = "created_at";
export const ADMIN_WAITLIST_DEFAULT_SORT_ORDER = "DESC";

export const ADMIN_PAYMENTS_FUNDING_FILTER_OPTIONS = [
  { value: "ALL", label: "All funding statuses" },
  { value: "not_required", label: "Not required" },
  { value: "pending", label: "Pending" },
  { value: "succeeded", label: "Succeeded" },
  { value: "failed_action_required", label: "Failed (action required)" },
];

export const ADMIN_PAYMENTS_PAYOUT_FILTER_OPTIONS = [
  { value: "ALL", label: "All payout statuses" },
  { value: "not_required", label: "Not required" },
  { value: "blocked", label: "Blocked" },
  { value: "ready", label: "Ready" },
  { value: "transferring", label: "Transferring" },
  { value: "transferred", label: "Transferred" },
  { value: "failed", label: "Failed" },
];

export const BLOG_CATEGORY_OPTIONS = [
  { value: "Influencer Marketing Strategy", label: "Influencer Marketing Strategy" },
  { value: "Platform Updates", label: "Platform Updates" },
  { value: "Creator Economy", label: "Creator Economy" },
];

export const BLOG_CATEGORY_FILTER_OPTIONS = [
  { value: "ALL", label: "All categories" },
  ...BLOG_CATEGORY_OPTIONS,
];
