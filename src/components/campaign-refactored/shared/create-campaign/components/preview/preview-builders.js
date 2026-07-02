/**
 * Preview view-model builders: turn campaign form data into structures used by the preview UI.
 * Keeps preview-specific logic in the preview feature instead of common/utils.
 */
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { formatGenderForDisplay } from "@/common/utils/campaign.utils";

export function buildHeroStats(
  campaignData,
  formatCurrency,
  formatNumber,
  deliverableTags,
  requiredPlatforms
) {
  return [
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
}

export function buildCompensationItems(campaignData, formatCurrency, commissionPerSale) {
  return [
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
}

export function buildWorkMode(isRemote, inPersonRequired) {
  return [isRemote && "Remote", inPersonRequired && "In-Person"].filter(Boolean);
}

export function buildLocationMeta(campaignData, countriesDisplay) {
  return [
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
}

export function buildCreatorRequirements(campaignData) {
  return [
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
}

export function buildContentSections(campaignData) {
  return [
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
}

export function buildGuidelineGroups(doGuidelines, dontGuidelines) {
  const groups = [];
  if (doGuidelines.length) groups.push({ title: "Do's", items: doGuidelines });
  if (dontGuidelines.length) groups.push({ title: "Don'ts", items: dontGuidelines });
  return groups;
}
