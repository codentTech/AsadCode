import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import {
  USAGE_RIGHTS_OPTIONS,
  EXCLUSIVITY_CLAUSE_OPTIONS,
} from "@/common/constants/options.constant";
import { capitalizeFirstLetter } from "@/common/utils/common.utils";
import { formatShopifySelectionLabel } from "@/common/utils/shopify-product-label.utils";

/**
 * Quick field definitions for the campaign preview summary.
 * To add a new field: add one entry with id, label, and getValue.
 * getValue(ctx) returns the display value or null/undefined to hide the row.
 */

const formatRequirementLevel = (value) => {
  if (!value || value === "none") return null;
  const v = String(value).toLowerCase().replace(/_/g, " ");
  return capitalizeFirstLetter(v);
};

const withRequirement = (value, requirement) => {
  const level = formatRequirementLevel(requirement);
  const hasValue = value != null && value !== "";
  if (!hasValue && !level) return null;
  if (!hasValue) return level;
  if (!level) return value;
  return `${value} (${level})`;
};

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
  if (campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED) return "Your cost per unit";
  if (campaignData?.campaign_type === CAMPAIGN_TYPE.AFFILIATE) return "Commission rate";
  return "Total Budget";
};

const getPrimaryCompensationValue = (ctx) => {
  const { campaignData, formatCurrency, compensationItems, compensationTypeLabel } = ctx;
  const type = campaignData?.campaign_type;

  if (type === CAMPAIGN_TYPE.GIFTED) {
    if (campaignData.product_value != null && campaignData.product_value !== "") {
      return formatCurrency(campaignData.product_value);
    }
    return compensationItems[0]?.value ?? null;
  }

  if (type === CAMPAIGN_TYPE.AFFILIATE) {
    if (campaignData.commission_percentage != null && campaignData.commission_percentage !== "") {
      return `${campaignData.commission_percentage}%`;
    }
    return compensationItems[0]?.value ?? compensationTypeLabel;
  }

  return compensationItems[0]?.value ?? compensationTypeLabel;
};

const getShopifyProductNames = (campaignData) => {
  const products = campaignData?.shopify_products;
  if (!Array.isArray(products) || products.length === 0) return null;
  return products
    .map((product) =>
      formatShopifySelectionLabel({
        productTitle: product?.title,
        variantTitle: product?.variantTitle,
        sku: product?.sku,
      })
    )
    .filter(Boolean)
    .join(", ");
};

export const QUICK_FIELD_DEFINITIONS = [
  {
    id: "campaignType",
    label: "Campaign Type",
    getValue: (ctx) => ctx.campaignTypeLabel,
  },
  {
    id: "compensationType",
    label: "Compensation Type",
    getValue: (ctx) => {
      const type = ctx.campaignData?.campaign_type;
      if (type === CAMPAIGN_TYPE.AFFILIATE || type === CAMPAIGN_TYPE.GIFTED) {
        return ctx.compensationTypeLabel;
      }
      return null;
    },
  },
  {
    id: "budget",
    label: (ctx) => getCompensationLabel(ctx.campaignData),
    getValue: (ctx) => getPrimaryCompensationValue(ctx),
  },
  {
    id: "shopperDiscount",
    label: "Discount for the shopper",
    getValue: (ctx) => {
      if (ctx.campaignData?.campaign_type !== CAMPAIGN_TYPE.AFFILIATE) return null;
      const value = ctx.campaignData?.customer_discount_percent;
      if (value == null || value === "") return null;
      return `${value}%`;
    },
  },
  {
    id: "trackingEndDate",
    label: "Sales tracking ends",
    getValue: (ctx) => {
      if (ctx.campaignData?.campaign_type !== CAMPAIGN_TYPE.AFFILIATE) return null;
      return ctx.trackingEndDateLabel;
    },
  },
  {
    id: "shopifyProducts",
    label: (ctx) =>
      ctx.campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED
        ? "Gifted product"
        : "Promoted products",
    getValue: (ctx) => {
      const type = ctx.campaignData?.campaign_type;
      if (type !== CAMPAIGN_TYPE.AFFILIATE && type !== CAMPAIGN_TYPE.GIFTED) return null;
      return getShopifyProductNames(ctx.campaignData);
    },
  },
  {
    id: "shipsPhysicalProduct",
    label: "Ships physical product",
    getValue: (ctx) => {
      const type = ctx.campaignData?.campaign_type;
      if (
        type !== CAMPAIGN_TYPE.AFFILIATE &&
        type !== CAMPAIGN_TYPE.SPONSORED_POST &&
        type !== CAMPAIGN_TYPE.UGC
      ) {
        return null;
      }
      if (ctx.campaignData?.ships_physical_product == null) return null;
      return ctx.campaignData.ships_physical_product ? "Yes" : "No";
    },
  },
  {
    id: "creatorFee",
    label: "Creator Fee",
    getValue: (ctx) => {
      const type = ctx.campaignData?.campaign_type;
      if (type === CAMPAIGN_TYPE.AFFILIATE || type === CAMPAIGN_TYPE.GIFTED) return null;
      return ctx.compensationItems[1]?.value ?? null;
    },
  },
  {
    id: "earningsPerSale",
    label: "Est. earnings per sale",
    getValue: (ctx) => {
      if (ctx.campaignData?.campaign_type !== CAMPAIGN_TYPE.AFFILIATE) return null;
      return ctx.commissionPerSale > 0 ? ctx.formatCurrency(ctx.commissionPerSale) : null;
    },
  },
  {
    id: "deadline",
    label: "Application deadline",
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
  {
    id: "usageRights",
    label: "Usage Rights",
    getValue: (ctx) => {
      const valueLabel = getOptionLabel(USAGE_RIGHTS_OPTIONS, ctx.campaignData?.usageRights);
      return withRequirement(valueLabel, ctx.campaignData?.usageRightsRequirement);
    },
  },
  {
    id: "exclusivityClause",
    label: "Exclusivity Clause",
    getValue: (ctx) => {
      const valueLabel = getOptionLabel(
        EXCLUSIVITY_CLAUSE_OPTIONS,
        ctx.campaignData?.exclusivityClause
      );
      return withRequirement(valueLabel, ctx.campaignData?.exclusivityClauseRequirement);
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
