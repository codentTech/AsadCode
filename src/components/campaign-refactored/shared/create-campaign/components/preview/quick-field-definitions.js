import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  USAGE_RIGHTS_OPTIONS,
  EXCLUSIVITY_CLAUSE_OPTIONS,
} from "@/common/constants/options.constant";
import { capitalizeFirstLetter } from "@/common/utils/common.utils";

/**
 * Quick field definitions for the campaign preview summary.
 * To add a new field: add one entry with id, label, and getValue.
 * getValue(ctx) returns the display value or null/undefined to hide the row.
 */

/** Format requirement level for display (only first letter capitalized); returns null for "none". */
const formatRequirementLevel = (value) => {
  if (!value || value === "none") return null;
  const v = String(value).toLowerCase().replace(/_/g, " ");
  return capitalizeFirstLetter(v);
};

/** Append (Requirement) to value when requirement is not "none". Returns null if both value and requirement are empty. */
const withRequirement = (value, requirement) => {
  const level = formatRequirementLevel(requirement);
  const hasValue = value != null && value !== "";
  if (!hasValue && !level) return null;
  if (!hasValue) return level;
  if (!level) return value;
  return `${value} (${level})`;
};

/** Get label from options by value, or format value as "X Months" (capitalize each word). */
const getOptionLabel = (options, value) => {
  if (!value) return null;
  const option = options.find((o) => o.value === value);
  if (option) return option.label;
  return String(value)
    .split(" ")
    .map((word) => capitalizeFirstLetter(word.toLowerCase()))
    .join(" ");
};

const getCompensationLabel = (campaignData) => {
  if (campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED) return "Product Value";
  if (campaignData?.campaign_type === CAMPAIGN_TYPE.AFFILIATE) return "Commission Rate";
  return "Total Budget";
};

export const QUICK_FIELD_DEFINITIONS = [
  {
    id: "campaignType",
    label: "Campaign Type",
    getValue: (ctx) => ctx.campaignTypeLabel,
  },
  {
    id: "budget",
    label: (ctx) => getCompensationLabel(ctx.campaignData),
    getValue: (ctx) => ctx.compensationItems[0]?.value ?? ctx.compensationTypeLabel,
  },
  {
    id: "creatorFee",
    label: "Creator Fee",
    getValue: (ctx) => ctx.compensationItems[1]?.value ?? null,
  },
  {
    id: "earningsPerSale",
    label: "Earnings per Sale",
    getValue: (ctx) =>
      ctx.commissionPerSale > 0 ? ctx.formatCurrency(ctx.commissionPerSale) : null,
  },
  {
    id: "deadline",
    label: "Deadline",
    getValue: (ctx) => ctx.applicationDeadlineLabel,
  },
  {
    id: "workMode",
    label: "Work Mode",
    getValue: (ctx) => (ctx.workMode?.length > 0 ? ctx.workMode.join(" • ") : null),
  },
  {
    id: "countries",
    label: (ctx) =>
      (ctx.campaignData?.creator_countries?.length ?? 0) > 1 ? "Countries" : "Country",
    getValue: (ctx) => ctx.countriesDisplay ?? null,
  },
  {
    id: "city",
    label: "City",
    getValue: (ctx) => {
      const city = ctx.campaignData?.creator_city;
      const region = ctx.campaignData?.creator_city_region;
      const value = city ? (region ? `${city}, ${region}` : city) : null;
      return withRequirement(value, ctx.campaignData?.cityRequirement);
    },
  },
  {
    id: "language",
    label: "Language",
    getValue: (ctx) =>
      withRequirement(
        ctx.formatLanguageForDisplay(ctx.campaignData?.creator_language),
        ctx.campaignData?.languageRequirement
      ),
  },
  {
    id: "gender",
    label: "Gender",
    getValue: (ctx) =>
      withRequirement(
        ctx.formatGenderForDisplay(ctx.campaignData?.creator_gender),
        ctx.campaignData?.genderRequirement
      ),
  },
  {
    id: "ageRange",
    label: "Age Range",
    getValue: (ctx) =>
      withRequirement(ctx.ageRangeSummary ?? null, ctx.campaignData?.ageRequirement),
  },
  // Usage Rights: value (e.g. "3 months") + requirement → "3 Months (Non negotiable)"
  {
    id: "usageRights",
    label: "Usage Rights",
    getValue: (ctx) => {
      const valueLabel = getOptionLabel(
        USAGE_RIGHTS_OPTIONS,
        ctx.campaignData?.usageRights
      );
      return withRequirement(
        valueLabel,
        ctx.campaignData?.usageRightsRequirement
      );
    },
  },
  // Exclusivity Clause: value (e.g. "6 months") + requirement → "6 Months (Non negotiable)"
  {
    id: "exclusivityClause",
    label: "Exclusivity Clause",
    getValue: (ctx) => {
      const valueLabel = getOptionLabel(
        EXCLUSIVITY_CLAUSE_OPTIONS,
        ctx.campaignData?.exclusivityClause
      );
      return withRequirement(
        valueLabel,
        ctx.campaignData?.exclusivityClauseRequirement
      );
    },
  },
];

/**
 * Builds the quick fields array from definitions and context.
 * Only includes fields with a truthy value.
 */
export function buildQuickFields(context) {
  return QUICK_FIELD_DEFINITIONS.map((def) => {
    const value = def.getValue(context);
    if (value == null || value === "") return null;
    const label = typeof def.label === "function" ? def.label(context) : def.label;
    return { id: def.id, label, value };
  }).filter(Boolean);
}
