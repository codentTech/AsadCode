import AudienceRequirementsExperience from "@/components/campaign/create-campaign/components/audience-requirements-experience/audience-requirements-experience";
import CampaignTypeNiche from "@/components/campaign/create-campaign/components/campaign-type-niche.component/campaign-type-niche.component";
import Compensation from "@/components/campaign/create-campaign/components/compensation/compensation";
import Description from "@/components/campaign/create-campaign/components/description/description";
import Eligibility from "@/components/campaign/create-campaign/components/eligibility/eligibility";
import Preview from "@/components/campaign/create-campaign/components/preview/preview";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "../constants/campaign.constant";
import { CAMPAIGN_TYPE_OPTIONS } from "../constants/options.constant";
import { capitalizeFirstWord } from "./helper.utils";

export const CAMPAIGN_TYPE_MAP = CAMPAIGN_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const getCompensationTypeLabel = (type) => {
  switch (type) {
    case COMPENSATION_TYPE.PAID:
      return "Paid";
    case COMPENSATION_TYPE.GIFTED_PRODUCT:
      return "Gifted Product";
    case COMPENSATION_TYPE.COMMISSION:
      return "Commission";
    default:
      return type || "—";
  }
};

export const sanitizeGuidelines = (list = []) =>
  (Array.isArray(list) ? list : [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

export const formatCountriesDisplay = (countries = []) => {
  if (!Array.isArray(countries) || countries.length === 0) return null;
  return countries.map((c) => c.country).join(", ");
};

export const createTagArray = (items = [], prefix = "item") =>
  items.map((item, index) => ({
    id: `${prefix}-${index}`,
    label:
      typeof item === "string" ? item : item?.displayText || item?.text || JSON.stringify(item),
  }));

export const createPlatformMinimums = (platformMinimums = {}, formatNumber) =>
  Object.entries(platformMinimums)
    .filter(([, value]) => value)
    .map(([platform, value]) => ({
      id: platform,
      platform,
      value: formatNumber(value),
    }));

export const buildHeroStats = (
  campaignData,
  formatCurrency,
  formatNumber,
  deliverableTags,
  requiredPlatforms
) =>
  [
    campaignData.budget && {
      label: "Budget",
      value: formatCurrency(campaignData.budget),
    },
    campaignData.min_combined_followers && {
      label: "Min Followers",
      value: formatNumber(campaignData.min_combined_followers),
    },
    deliverableTags.length > 0 && {
      label: "Deliverables",
      value: deliverableTags.length,
    },
    requiredPlatforms.length > 0 && {
      label: "Platforms",
      value: requiredPlatforms.length,
    },
  ].filter(Boolean);

export const buildCompensationItems = (campaignData, formatCurrency, commissionPerSale) =>
  [
    campaignData.budget && {
      label:
        campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? "Product Value"
          : campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? "Commission Rate"
            : "Total Budget",
      value:
        campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? formatCurrency(campaignData.product_value)
          : campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? `${campaignData.commission_percentage}%`
            : formatCurrency(campaignData.budget),
      hint: "Private",
    },
    campaignData.suggested_min &&
      campaignData.suggested_max && {
        label: "Suggested Range",
        value: `${formatCurrency(campaignData.suggested_min)} — ${formatCurrency(campaignData.suggested_max)}`,
      },
    campaignData.creator_fixed_price && {
      label: "Fixed Payment",
      value: formatCurrency(campaignData.creator_fixed_price),
    },
    campaignData.product_value && {
      label: "Product Value",
      value: formatCurrency(campaignData.product_value),
    },
    campaignData.product_price && {
      label: "Product Price",
      value: formatCurrency(campaignData.product_price),
    },
    campaignData.commission_percentage && {
      label: "Commission Rate",
      value: `${campaignData.commission_percentage}%`,
    },
    commissionPerSale > 0 && {
      label: "Earnings per Sale",
      value: formatCurrency(commissionPerSale),
    },
  ].filter(Boolean);

export const buildWorkMode = (isRemote, inPersonRequired) =>
  [isRemote && "Remote", inPersonRequired && "In-Person"].filter(Boolean);

export const buildLocationMeta = (campaignData, countriesDisplay) =>
  [
    campaignData.location_details && {
      label: "Location Details",
      value: campaignData.location_details,
    },
    countriesDisplay && {
      label: campaignData.creator_countries?.length > 1 ? "Countries" : "Country",
      value: countriesDisplay,
    },
    campaignData.creator_city && {
      label: "City",
      value: `${campaignData.creator_city}${campaignData.creator_city_region ? `, ${campaignData.creator_city_region}` : ""}`,
    },
  ].filter(Boolean);

export const buildCreatorRequirements = (campaignData) =>
  [
    campaignData.countryRequirement &&
      campaignData.countryRequirement !== "none" && {
        label: "Country Requirement",
        value: campaignData.countryRequirement,
      },
    campaignData.cityRequirement &&
      campaignData.cityRequirement !== "none" && {
        label: "City Requirement",
        value: campaignData.cityRequirement,
      },
    campaignData.ageRequirement &&
      campaignData.ageRequirement !== "none" && {
        label: "Age Requirement",
        value: campaignData.ageRequirement,
      },
    (campaignData.min_age || campaignData.max_age) && {
      label: "Age Range",
      value: `${campaignData.min_age || "Any"} — ${campaignData.max_age || "Any"}`,
    },
    campaignData.genderRequirement &&
      campaignData.genderRequirement !== "none" && {
        label: "Gender Requirement",
        value: campaignData.genderRequirement,
      },
    {
      label: "Preferred Gender",
      value: formatGenderForDisplay(campaignData.creator_gender),
    },
    campaignData.languageRequirement &&
      campaignData.languageRequirement !== "none" && {
        label: "Language Requirement",
        value: campaignData.languageRequirement,
      },
    campaignData.creator_language && {
      label: "Preferred Language",
      value: campaignData.creator_language,
    },
  ].filter(Boolean);

export const buildContentSections = (campaignData) =>
  [
    campaignData.short_description && {
      title: "Campaign Overview",
      body: campaignData.short_description,
      tone: "muted",
    },
    campaignData.long_description && {
      title: "Detailed Brief",
      body: campaignData.long_description,
      tone: "rich",
    },
    campaignData.hashtags && {
      title: "Hashtags & Captions",
      body: campaignData.hashtags,
      tone: "accent",
    },
    campaignData.styleGuide && {
      title: "Style Guide Notes",
      body: campaignData.styleGuide,
      tone: "muted",
    },
  ].filter(Boolean);

export const buildGuidelineGroups = (doGuidelines, dontGuidelines) => {
  const groups = [];
  if (doGuidelines.length) groups.push({ title: "Do's", items: doGuidelines });
  if (dontGuidelines.length) groups.push({ title: "Don'ts", items: dontGuidelines });
  return groups;
};

export const buildQuickFields = (
  campaignData,
  campaignTypeLabel,
  compensationItems,
  compensationTypeLabel,
  commissionPerSale,
  formatCurrency,
  applicationDeadlineLabel,
  workMode,
  countriesDisplay,
  ageRangeSummary
) =>
  [
    { label: "Campaign Type", value: campaignTypeLabel },
    {
      label:
        campaignData.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? "Product Value"
          : campaignData.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? "Commission Rate"
            : "Total Budget",
      value: compensationItems[0]?.value || compensationTypeLabel,
    },
    compensationItems[1] && { label: "Creator Fee", value: compensationItems[1].value },
    commissionPerSale > 0 && {
      label: "Earnings per Sale",
      value: formatCurrency(commissionPerSale),
    },
    { label: "Deadline", value: applicationDeadlineLabel },
    workMode.length > 0 && { label: "Work Mode", value: workMode.join(" • ") },
    countriesDisplay && {
      label: campaignData.creator_countries?.length > 1 ? "Countries" : "Country",
      value: countriesDisplay,
    },
    campaignData.creator_city && {
      label: "City",
      value: `${campaignData.creator_city}${campaignData.creator_city_region ? `, ${campaignData.creator_city_region}` : ""}`,
    },
    { label: "Language", value: formatLanguageForDisplay(campaignData.creator_language) },
    { label: "Gender", value: formatGenderForDisplay(campaignData.creator_gender) },
    ageRangeSummary && { label: "Age Range", value: ageRangeSummary },
  ]
    .filter(Boolean)
    .filter((field) => field.value);

export const campaignTitle = (campaignType) => {
  if (campaignType === CAMPAIGN_TYPE.SPONSORED_POST) {
    return "SPONSORED POST";
  }
  if (campaignType === CAMPAIGN_TYPE.UGC) {
    return "UGC";
  }
  if (campaignType === CAMPAIGN_TYPE.GIFTED) {
    return "GIFTED";
  }
  if (campaignType === CAMPAIGN_TYPE.AFFILIATE) {
    return "AFFILIATE";
  }
};

export const getCompensationType = (campaign) => {
  if (campaign.creator_fixed_price) return "Paid";
  if (campaign.commission_percentage) return "Commission";
  if (campaign.product_value) return "Gifted";
  return "Paid";
};

export const getCompensationTypeKey = (campaign) => {
  if (campaign.creator_fixed_price) return "fixed";
  if (campaign.commission_percentage) return "commission";
  if (campaign.product_value) return "gifted";
  return "fixed";
};

export const getCompensationAmount = (campaign) => {
  if (campaign.creator_fixed_price) {
    return `$${campaign.creator_fixed_price}`;
  }
  if (campaign.commission_percentage) {
    return `${campaign.commission_percentage}% Commission`;
  }
  if (campaign.product_value) {
    return `Product ($${campaign.product_value} value)`;
  }
  if (campaign.suggested_min && campaign.suggested_max) {
    return `$${campaign.suggested_min} - $${campaign.suggested_max}`;
  }
  return "$0";
};

export const getCompensationValue = (campaign) => {
  if (campaign.creator_fixed_price) return campaign.creator_fixed_price;
  if (campaign.suggested_max) return campaign.suggested_max;
  if (campaign.product_value) return campaign.product_value;
  return 0;
};

const trim = (value) => (typeof value === "string" ? value.trim() : "");
const toNumber = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};
const toInteger = (value) => {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};
const sanitizeArray = (items) =>
  Array.isArray(items) ? items.filter((item) => item !== null && item !== undefined) : [];

const sanitizeStrings = (items) =>
  sanitizeArray(items)
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

export const calculateCommissionPayment = (commissionPercentage, productPrice) => {
  const percentage = Number(commissionPercentage || 0);
  const price = Number(productPrice || 0);
  return (percentage / 100) * price;
};

const calculateCreatorFee = (data) => {
  const commissionPayment = calculateCommissionPayment(
    data.commission_percentage,
    data.product_price
  );

  if (
    data?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
    data?.campaign_type === CAMPAIGN_TYPE.UGC
  ) {
    if (data.compensation_type === COMPENSATION_TYPE.PAID) {
      return data.creator_fixed_price || 0;
    }
    return `${data.suggested_min || 0} - ${data.suggested_max || 0} (Range)` || 0;
  }

  if (data.campaign_type === CAMPAIGN_TYPE.GIFTED) {
    return data.product_value || 0;
  }

  if (data.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    return commissionPayment || 0;
  }

  return 0;
};

/**
 * Formats gender for display, showing "No preference" instead of null, empty, or "none"
 */
export const formatGenderForDisplay = (gender) => {
  if (!gender || gender === "" || gender === "none" || gender === null || gender === undefined) {
    return "No preference";
  }
  // Capitalize first letter
  return capitalizeFirstWord(gender);
};

/**
 * Formats language for display, showing "No preference" instead of null, empty, or "none"
 */
export const formatLanguageForDisplay = (language) => {
  if (
    !language ||
    language === "" ||
    language === "none" ||
    language === null ||
    language === undefined
  ) {
    return "No preference";
  }
  // Capitalize first letter
  return capitalizeFirstWord(language);
};

/**
 * Formats creator fee for display, showing "Negotiable" instead of $0 when appropriate
 */
export const formatCreatorFeeForDisplay = (campaign) => {
  // If there's a fixed price, show it
  if (campaign.creator_fixed_price && campaign.creator_fixed_price > 0) {
    return `$${campaign.creator_fixed_price}`;
  }

  // If there's a suggested range, show it
  if (campaign.suggested_min || campaign.suggested_max) {
    return `$${campaign.suggested_min || 0} - $${campaign.suggested_max || 0}`;
  }

  // For PAID campaigns (SPONSORED_POST or UGC) with no fixed price or range, show "Negotiable"
  if (
    (campaign.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
      campaign.campaign_type === CAMPAIGN_TYPE.UGC) &&
    campaign.compensation_type === COMPENSATION_TYPE.PAID &&
    (!campaign.creator_fixed_price || campaign.creator_fixed_price === 0) &&
    !campaign.suggested_min &&
    !campaign.suggested_max &&
    (!campaign.creator_fee || campaign.creator_fee === 0)
  ) {
    return "Negotiable";
  }

  // For gifted campaigns, show product value
  if (campaign.campaign_type === CAMPAIGN_TYPE.GIFTED && campaign.product_value) {
    return `$${campaign.product_value}`;
  }

  // For affiliate campaigns, show commission
  if (campaign.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    const commissionPayment = calculateCommissionPayment(
      campaign.commission_percentage,
      campaign.product_price
    );
    if (commissionPayment > 0) {
      return `$${commissionPayment}`;
    }
  }

  // If creator_fee exists and is > 0, show it
  if (campaign.creator_fee && campaign.creator_fee > 0) {
    return `$${campaign.creator_fee}`;
  }

  // Default fallback
  return campaign.creator_fee || "Negotiable";
};

export const transformDataForAPI = (data) => {
  const doItems = sanitizeStrings(data.nonNegotiablesDo);
  const dontItems = sanitizeStrings(data.nonNegotiablesDont);

  return {
    campaign_title: trim(data.campaign_title) || "",
    campaign_type: data.campaign_type || "",
    niches: data.niches,
    deliverables: data.deliverables,
    usage_rights: data.usageRights || null,
    usage_rights_requirement: data.usageRightsRequirement || "negotiable",
    exclusivity_clause: data.exclusivityClause || null,
    exclusivity_clause_requirement: data.exclusivityClauseRequirement || "negotiable",
    application_deadline: data.application_deadline || null,

    min_combined_followers: toNumber(data.min_combined_followers),
    platform_minimums: {
      instagram: trim(data.platformMinimums?.instagram) || null,
      tiktok: trim(data.platformMinimums?.tiktok) || null,
      youtube: trim(data.platformMinimums?.youtube) || null,
      facebook: trim(data.platformMinimums?.facebook) || null,
      pinterest: trim(data.platformMinimums?.pinterest) || null,
    },
    required_platforms: sanitizeStrings(data.required_platforms),

    compensation_type: data.compensation_type || null,
    budget: toNumber(data.budget),
    remaining_budget: toNumber(data.budget),
    suggested_min: toNumber(data.suggested_min),
    suggested_max: toNumber(data.suggested_max),
    creator_fixed_price: toNumber(data.creator_fixed_price),
    product_value: toNumber(data.product_value),
    commission_percentage: toNumber(data.commission_percentage),
    product_price: toNumber(data.product_price),

    location_options: data.locationOptions || "",
    creator_countries: data.creator_countries || [],
    creator_city: trim(data.creator_city),
    country_requirement: data.countryRequirement || "none",
    city_requirement: data.cityRequirement || "none",
    min_age: toInteger(data.min_age),
    max_age: toInteger(data.max_age),
    age_requirement: data.ageRequirement || "none",
    creator_gender: trim(data.creator_gender),
    gender_requirement: data.genderRequirement || "none",
    creator_language: trim(data.creator_language),
    language_requirement: data.languageRequirement || "none",

    short_description: trim(data.short_description),
    long_description: trim(data.long_description),
    campaign_image: data.campaignImage || "",
    hashtags: trim(data.hashtags),
    non_negotiables_do: doItems,
    non_negotiables_dont: dontItems,
    style_guide: trim(data.styleGuide),
    style_guide_file: data.styleGuideFile || "",
    questions: sanitizeStrings(data.questions),

    creator_fee: Number(calculateCreatorFee(data)),
  };
};

export const STEP_NAMES = [
  "Campaign Title & Niche",
  "Audience Requirements",
  "Compensation",
  "Eligibility",
  "Description",
  "Preview & Publish",
];

export const STEP_FIELDS = {
  0: ["campaign_title", "niches"],
  1: ["min_combined_followers", "required_platforms"],
  2: [
    "campaign_type",
    "budget",
    "suggested_min",
    "suggested_max",
    "creator_fixed_price",
    "product_value",
    "commission_percentage",
    "product_price",
  ],
  3: [
    "creator_countries",
    "creator_city",
    "min_age",
    "max_age",
    "creator_gender",
    "creator_language",
    "application_deadline",
  ],
  4: ["short_description", "campaignImage"],
  5: ["termsAgreed"],
};

export const STEP_COMPONENTS = [
  {
    component: CampaignTypeNiche,
    getProps: (commonProps, extraProps) => ({
      ...commonProps,
      addDeliverable: extraProps.addDeliverable,
      removeDeliverable: extraProps.removeDeliverable,
    }),
  },
  {
    component: AudienceRequirementsExperience,
    getProps: (commonProps) => commonProps,
  },
  {
    component: Compensation,
    getProps: (commonProps) => commonProps,
  },
  {
    component: Eligibility,
    getProps: (commonProps, extraProps) => ({
      ...commonProps,
      handleRequirementToggle: extraProps.handleRequirementToggle,
      getWatchedValue: extraProps.getWatchedValue,
    }),
  },
  {
    component: Description,
    getProps: (commonProps) => commonProps,
  },
  {
    component: Preview,
    getProps: (commonProps, extraProps) => ({
      ...commonProps,
      handleSubmit: extraProps.handleSubmit,
      isLoading: extraProps.isLoading,
      isError: extraProps.isError,
      message: extraProps.message,
    }),
  },
];

export const getDefaultValues = () => ({
  campaign_title: "",
  campaign_type: "",
  niches: [],
  deliverables: [],
  usageRights: "no_usage",
  usageRightsRequirement: "negotiable",
  exclusivityClause: "none",
  exclusivityClauseRequirement: "negotiable",

  min_combined_followers: null,
  platformMinimums: {
    instagram: null,
    tiktok: null,
    youtube: null,
    facebook: null,
    pinterest: null,
  },
  required_platforms: [],

  compensation_type: "PAID",
  budget: null,
  suggested_min: null,
  suggested_max: null,
  creator_fixed_price: null,
  product_value: null,
  commission_percentage: null,
  product_price: null,

  locationOptions: ["remote"],
  creator_countries: [],
  creator_city: "",
  countryRequirement: "none",
  cityRequirement: "none",
  min_age: null,
  max_age: null,
  ageRequirement: "none",
  creator_gender: "",
  genderRequirement: "none",
  creator_language: "",
  languageRequirement: "none",
  application_deadline: "",

  short_description: "",
  long_description: "",
  campaignImage: "",
  hashtags: "",
  nonNegotiablesDo: [""],
  nonNegotiablesDont: [""],
  styleGuide: "",
  styleGuideFile: null,
  questions: [""],

  termsAgreed: false,
});

/**
 * Aggregates per-creator metrics into combined campaign-level metrics.
 *
 * Formula reference (spec §3):
 *   combinedViews       = sum of all views
 *   combinedEngagement  = sum of all engagement
 *   combinedER          = AVERAGE of individual ERs  (NOT recalculated from totals)
 *   combinedCPE         = AVERAGE of individual CPEs (NOT total spend / total engagement)
 */
export function computeCombinedMetrics(creatorMetricsArray) {
  const valid = creatorMetricsArray.filter((m) => m?.metrics != null);
  if (valid.length === 0) return null;

  const combinedViews = valid.reduce((sum, m) => sum + m.metrics.views, 0);
  const combinedEngagement = valid.reduce((sum, m) => sum + m.metrics.totalEngagement, 0);

  const erValues = valid.map((m) => m.metrics.engagementRate);
  const combinedEngagementRate = erValues.reduce((s, v) => s + v, 0) / erValues.length;

  const cpeValues = valid
    .map((m) => m.metrics.costPerEngagement)
    .filter((v) => v !== null && v !== undefined);
  const combinedCostPerEngagement =
    cpeValues.length > 0 ? cpeValues.reduce((s, v) => s + v, 0) / cpeValues.length : null;

  return {
    totalViews: combinedViews,
    totalEngagement: combinedEngagement,
    engagementRate: combinedEngagementRate,
    costPerEngagement: combinedCostPerEngagement,
    creatorCount: valid.length,
  };
}

/**
 * Returns true when the campaign type is UGC — metrics should be hidden.
 */
export function isUgcCampaign(campaign) {
  return campaign?.campaign_type === CAMPAIGN_TYPE.UGC;
}
