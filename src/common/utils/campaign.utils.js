import {
  CAMPAIGN_TYPE,
  COMPENSATION_TYPE,
  REQUIREMENT_LEVEL,
} from "../constants/campaign.constant";
import { CAMPAIGN_TYPE_OPTIONS } from "../constants/options.constant";
import { formatCompactCurrency } from "./format.utils";
import { capitalizeFirstWord } from "./helper.utils";
import {
  applyLivePipelineUrgency,
  resolveCreatorUrgency,
  sortCreatorsByUrgency,
} from "@/common/utils/creator-urgency.util";
import { PIPELINE_STATE } from "@/common/constants/creator-urgency.constant";

export const CAMPAIGN_TYPE_MAP = CAMPAIGN_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const deriveCompensation = (campaign) => {
  if (!campaign) {
    return {
      label: "Paid",
      detail: "Compensation TBD",
    };
  }

  if (campaign.creator_fixed_price) {
    return {
      label: "Paid",
      detail: `${formatCompactCurrency(Number(campaign.creator_fixed_price))}`,
    };
  }

  if (campaign.suggested_min && campaign.suggested_max) {
    return {
      label: "Paid",
      detail: `${formatCompactCurrency(Number(campaign.suggested_min))} - ${formatCompactCurrency(
        Number(campaign.suggested_max)
      )}`,
    };
  }

  if (campaign.product_value) {
    return {
      label: "Gifted",
      detail: `Product (${formatCompactCurrency(Number(campaign.product_value))} value)`,
    };
  }

  if (campaign.commission_percentage) {
    return {
      label: "Commission",
      detail: `${campaign.commission_percentage}% per sale`,
    };
  }

  return {
    label: "Paid",
    detail: "Budget available",
  };
};

export const getCompensationTypeLabel = (type) => {
  switch (type) {
    case COMPENSATION_TYPE.PAID:
      return "Paid";
    case COMPENSATION_TYPE.GIFTED_PRODUCT:
      return "Gifted Product";
    case COMPENSATION_TYPE.COMMISSION:
      return "Affiliate";
    default:
      return type || "—";
  }
};

export function requiresCollaborationPayment(source = {}) {
  const application =
    source.application && typeof source.application === "object" ? source.application : {};
  const stubContract =
    (source.contract && typeof source.contract === "object" ? source.contract : null) ||
    (application.contract && typeof application.contract === "object"
      ? application.contract
      : null) ||
    {};
  const campaign =
    (source.campaign && typeof source.campaign === "object" ? source.campaign : null) ||
    application.campaign ||
    source;

  const creatorUserId =
    source.creatorUserId ||
    source.creator?.id ||
    application.creator?.id ||
    null;

  const campaignContracts = Array.isArray(campaign?.contracts) ? campaign.contracts : [];
  const matchedContract = creatorUserId
    ? campaignContracts.find(
        (contractItem) =>
          contractItem?.creator_id === creatorUserId ||
          contractItem?.creatorId === creatorUserId ||
          contractItem?.creator?.id === creatorUserId,
      )
    : null;

  const contractHasPaymentFields = Boolean(
    stubContract?.compensationType ||
      stubContract?.compensation_type ||
      stubContract?.campaignType ||
      stubContract?.campaign_type ||
      stubContract?.productPrice ||
      stubContract?.product_price,
  );

  const contract = contractHasPaymentFields ? stubContract : matchedContract || stubContract;

  const formattedCompensation = (source.compensation || "").toString().toUpperCase();
  const formattedCampaignType =
    source.type === "Gifted"
      ? CAMPAIGN_TYPE.GIFTED
      : (source.campaignType || source.campaign_type || "").toString().toUpperCase();

  const compensationType = (
    contract.compensationType ||
    contract.compensation_type ||
    campaign.compensation_type ||
    campaign.compensationType ||
    source.compensationType ||
    source.compensation_type ||
    formattedCompensation ||
    ""
  )
    .toString()
    .toUpperCase();

  const campaignType = (
    contract.campaignType ||
    contract.campaign_type ||
    campaign.campaign_type ||
    campaign.campaignType ||
    formattedCampaignType ||
    source.campaignType ||
    source.campaign_type ||
    ""
  )
    .toString()
    .toUpperCase();

  if (
    compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
    compensationType === COMPENSATION_TYPE.COMMISSION
  ) {
    return false;
  }

  if (campaignType === CAMPAIGN_TYPE.GIFTED || campaignType === CAMPAIGN_TYPE.AFFILIATE) {
    return false;
  }

  const productValue = Number(
    contract.productPrice ||
      contract.product_price ||
      contract.productValue ||
      contract.product_value ||
      campaign.product_value ||
      campaign.productValue ||
      0,
  );
  const cashCompensation = Number(
    contract.totalCompensation ||
      contract.total_compensation ||
      campaign.creator_fixed_price ||
      campaign.creator_fee ||
      0,
  );

  if (
    productValue > 0 &&
    cashCompensation <= 0 &&
    compensationType !== COMPENSATION_TYPE.PAID
  ) {
    return false;
  }

  return true;
}

export const sanitizeGuidelines = (list = []) =>
  (Array.isArray(list) ? list : [])
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);

export const formatCountriesDisplay = (countries = []) => {
  if (!Array.isArray(countries) || countries.length === 0) return null;
  return countries.map((c) => c.country).filter(Boolean).join(", ");
};

const formatRequirementSuffix = (requirement) => {
  if (!requirement || requirement === REQUIREMENT_LEVEL.NONE) return "";
  const label = String(requirement).charAt(0).toUpperCase() + String(requirement).slice(1);
  return ` (${label})`;
};

export const formatCountriesWithRequirement = (
  countries = [],
  legacyCountry = null,
  legacyRequirement = null
) => {
  if (Array.isArray(countries) && countries.length > 0) {
    const mandatory = countries.filter((c) => c.requirement === REQUIREMENT_LEVEL.MANDATORY);
    const preferred = countries.filter((c) => c.requirement === REQUIREMENT_LEVEL.PREFERRED);

    if (mandatory.length > 0) {
      return `${formatCountriesDisplay(mandatory)}${formatRequirementSuffix(REQUIREMENT_LEVEL.MANDATORY)}`;
    }

    if (preferred.length > 0) {
      return `${formatCountriesDisplay(preferred)}${formatRequirementSuffix(REQUIREMENT_LEVEL.PREFERRED)}`;
    }

    return formatCountriesDisplay(countries);
  }

  if (legacyCountry) {
    return `${legacyCountry}${formatRequirementSuffix(legacyRequirement)}`;
  }

  return null;
};

export const formatCampaignGeographySummary = (campaign = {}) => {
  const fromCountries = formatCountriesWithRequirement(
    campaign.creator_countries,
    campaign.creator_country,
    campaign.country_requirement
  );

  if (fromCountries) {
    const citySuffix =
      campaign.creator_city && campaign.city_requirement !== REQUIREMENT_LEVEL.NONE
        ? ` • ${campaign.creator_city}${formatRequirementSuffix(campaign.city_requirement)}`
        : campaign.creator_city
          ? ` • ${campaign.creator_city}`
          : "";
    return `${fromCountries}${citySuffix}`;
  }

  if (campaign.creator_city) {
    return `${campaign.creator_city}${formatRequirementSuffix(campaign.city_requirement)}`;
  }

  const locationOptions = Array.isArray(campaign.location_options)
    ? campaign.location_options
    : [];

  if (locationOptions.includes("on-location") || locationOptions.includes("on_location")) {
    return "On Location";
  }

  if (locationOptions.includes("remote")) {
    return "Remote";
  }

  return null;
};

export const campaignHasGeographyRequirement = (campaign = {}) => {
  const hasCountries =
    Array.isArray(campaign.creator_countries) && campaign.creator_countries.length > 0;
  const hasLegacyCountry = Boolean(campaign.creator_country);
  const hasCity = Boolean(campaign.creator_city);
  return hasCountries || hasLegacyCountry || hasCity;
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
  if (campaign.product_value && campaign.campaign_type === CAMPAIGN_TYPE.UGC) return "Gifted";
  if (campaign.product_value && campaign.campaign_type !== CAMPAIGN_TYPE.UGC)
    return "Product value";

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

// --- Internal helpers (used by transformDataForAPI / formatCreatorFeeForDisplay; not exported) ---
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
      if (data.creator_fixed_price != null && data.creator_fixed_price > 0) {
        return data.creator_fixed_price;
      }
      if (data.suggested_min != null || data.suggested_max != null) {
        const min = data.suggested_min ?? data.suggested_max ?? 0;
        const max = data.suggested_max ?? data.suggested_min ?? 0;
        return `${min}-${max}`;
      }
      return 0;
    }
    if (data.suggested_min != null || data.suggested_max != null) {
      const min = data.suggested_min ?? data.suggested_max ?? 0;
      const max = data.suggested_max ?? data.suggested_min ?? 0;
      return `${min}-${max}`;
    }
    return 0;
  }

  if (data.campaign_type === CAMPAIGN_TYPE.GIFTED) {
    return data.product_value || 0;
  }

  if (data.campaign_type === CAMPAIGN_TYPE.AFFILIATE) {
    return data.commission_percentage || 0;
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
  if (campaign.campaign_type === CAMPAIGN_TYPE.GIFTED) {
    if (campaign.product_value) {
      return `$${campaign.product_value}`;
    }
    return "Gifted Product";
  }

  if (
    campaign.compensation_type === COMPENSATION_TYPE.GIFTED_PRODUCT &&
    campaign.product_value
  ) {
    return `$${campaign.product_value}`;
  }

  if (campaign.creator_fixed_price && campaign.creator_fixed_price > 0) {
    return `$${campaign.creator_fixed_price}`;
  }

  if (campaign.suggested_min || campaign.suggested_max) {
    return `$${campaign.suggested_min || 0} - $${campaign.suggested_max || 0}`;
  }

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

  if (campaign.product_value) {
    return `$${campaign.product_value}`;
  }

  return campaign.creator_fee && Number(campaign.creator_fee) > 0
    ? `$${campaign.creator_fee}`
    : "—";
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
    customer_discount_percent: toNumber(data.customer_discount_percent),
    tracking_end_date: data.tracking_end_date || null,
    usage_cap:
      data.usage_cap === "" || data.usage_cap == null
        ? null
        : toInteger(data.usage_cap),
    ships_physical_product: Boolean(data.ships_physical_product),
    shopify_products: Array.isArray(data.shopify_products) ? data.shopify_products : [],

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

    creator_fee: (() => {
      const fee = calculateCreatorFee(data);
      return typeof fee === "string" ? fee : Number(fee);
    })(),
  };
};

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
  customer_discount_percent: null,
  tracking_end_date: "",
  usage_cap: "",
  ships_physical_product: false,
  shopify_products: [],

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

export const resolveBrandMarkedCompleteAt = ({
  selectedCreator,
  selectedCampaign,
  selectedContract,
  isIndividualCreator,
}) => {
  const fromCreatorRow = selectedCreator?.completed_at ?? selectedCreator?.completedAt;
  if (fromCreatorRow) return fromCreatorRow;

  if (!isIndividualCreator) return null;

  const fromCampaign =
    selectedCreator?.campaign?.completed_date ??
    selectedCreator?.campaign?.completedDate ??
    selectedCampaign?.completed_date ??
    selectedCampaign?.completedDate;
  if (fromCampaign) return fromCampaign;

  const workStatus = selectedContract?.work_status ?? selectedContract?.workStatus;
  if (workStatus === "COMPLETED") {
    return selectedContract?.updated_at ?? selectedContract?.updatedAt ?? null;
  }

  return null;
};

export const resolveCampaignFeeForOffer = (campaign) => {
  if (
    campaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE ||
    campaign?.compensation_type === COMPENSATION_TYPE.COMMISSION
  ) {
    const rate = campaign?.commission_percentage;
    if (rate === undefined || rate === null || rate === "") return "";
    return String(rate);
  }

  const fee = campaign?.creator_fee ?? campaign?.creator_fixed_price;
  if (fee === undefined || fee === null || fee === "") return "";
  return String(fee);
};

export const HIDE_CREATOR_RATING_UI = true;

const APPLICATIONS_BOARD_COLUMNS = new Set(["applications", "negotiations"]);

const APPLICATIONS_PIPELINE_STATES = new Set([
  PIPELINE_STATE.NEEDS_REVIEW,
  PIPELINE_STATE.REVIEW_OVERDUE,
]);

export function resolveCreatorBoardColumn(creator) {
  const urgency = resolveCreatorUrgency(creator);
  if (urgency.boardColumn && APPLICATIONS_BOARD_COLUMNS.has(urgency.boardColumn)) {
    return urgency.boardColumn;
  }

  const pipelineState =
    urgency.pipelineState || creator?.pipeline?.pipeline_state || null;
  if (pipelineState && APPLICATIONS_PIPELINE_STATES.has(pipelineState)) {
    return "applications";
  }
  if (pipelineState) {
    return "negotiations";
  }

  return urgency.boardColumn || "applications";
}

export function isInvitedCreatorRow(creator) {
  return Boolean(
    creator?.is_invited ??
      creator?.isInvited ??
      creator?.source_invitation_id ??
      creator?.invitation_id,
  );
}

export function splitCreatorsByApplicationsSubTab(creators) {
  const rows = Array.isArray(creators) ? creators : [];
  const applications = [];
  const negotiations = [];

  rows.forEach((creator) => {
    const column = resolveCreatorBoardColumn(creator);
    if (column === "negotiations") {
      negotiations.push(creator);
      return;
    }
    if (column === "applications" || !column) {
      applications.push(creator);
    }
  });

  return { applications, negotiations };
}

export function partitionPinnedInvitedCreators(creators) {
  const rows = Array.isArray(creators) ? creators : [];
  const pinned = [];
  const unpinned = [];

  rows.forEach((creator) => {
    if (isInvitedCreatorRow(creator)) {
      pinned.push(creator);
    } else {
      unpinned.push(creator);
    }
  });

  return { pinned, unpinned };
}

function sortCreatorsClientSide(creators, sortKey) {
  if (!Array.isArray(creators) || creators.length === 0) return [];

  const rows = [...creators];

  switch (sortKey) {
    case "urgency":
      return sortCreatorsByUrgency(rows);
    case "oldest":
      return rows.sort((a, b) => {
        const aTime = new Date(a.applied_at || a.created_at || 0).getTime();
        const bTime = new Date(b.applied_at || b.created_at || 0).getTime();
        return aTime - bTime;
      });
    case "newest":
      return rows.sort((a, b) => {
        const aTime = new Date(a.applied_at || a.created_at || 0).getTime();
        const bTime = new Date(b.applied_at || b.created_at || 0).getTime();
        return bTime - aTime;
      });
    case "rating":
      return rows.sort((a, b) => {
        const aRating = parseFloat(a.creator?.creator_profile?.rating) || 0;
        const bRating = parseFloat(b.creator?.creator_profile?.rating) || 0;
        return bRating - aRating;
      });
    case "followers":
      return rows.sort((a, b) => {
        const aFollowers = a.creator?.creator_profile?.total_followers || 0;
        const bFollowers = b.creator?.creator_profile?.total_followers || 0;
        return bFollowers - aFollowers;
      });
    case "engagement":
      return rows.sort((a, b) => {
        const aRate = parseFloat(a.creator?.creator_profile?.engagement_rate) || 0;
        const bRate = parseFloat(b.creator?.creator_profile?.engagement_rate) || 0;
        return bRate - aRate;
      });
    default:
      return rows;
  }
}

export function sortApplicationsCreators(creators, sortKey) {
  const rows = Array.isArray(creators) ? creators.map(applyLivePipelineUrgency) : [];
  if (!rows.length) return [];

  const { pinned, unpinned } = partitionPinnedInvitedCreators(rows);
  const sortedPinned = sortCreatorsByUrgency(pinned);
  const sortedUnpinned =
    sortKey === "urgency" ? sortCreatorsByUrgency(unpinned) : sortCreatorsClientSide(unpinned, sortKey);

  return [...sortedPinned, ...sortedUnpinned];
}

export function creatorBelongsToApplicationsSubTab(creator, subTab) {
  const column = resolveCreatorBoardColumn(creator);
  if (subTab === "negotiations") {
    return column === "negotiations";
  }
  return column === "applications";
}
