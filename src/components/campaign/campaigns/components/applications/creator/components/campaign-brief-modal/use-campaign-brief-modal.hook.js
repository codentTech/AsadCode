import { useMemo } from "react";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { formatDate } from "@/common/utils/formate-date";
import { campiagnDeliverable } from "@/common/utils/campaign.utils";

const friendlyCampaignTypeMap = CAMPAIGN_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const formatCurrency = (value) => {
  if (!value && value !== 0) return "—";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(numericValue);
};

const formatNumber = (value) => {
  if (!value && value !== 0) return "—";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);
  return new Intl.NumberFormat("en-US").format(numericValue);
};

const calculateCommissionPerSale = (price, percentage) => {
  if (!price || !percentage || price <= 0 || percentage <= 0) return 0;
  return (price * percentage) / 100;
};

export default function useCampaignBriefModal(campaign = {}) {
  // Normalize campaign data structure to handle both transformed (feed) and raw (applications) formats
  const normalizedCampaign = useMemo(() => {
    // If it's already in the raw format (has campaign_title), return as is
    if (campaign.campaign_title) {
      return campaign;
    }

    // Otherwise, it's in the transformed format from feed, map it
    return {
      campaign_title: campaign.title,
      campaign_type: campaign.campaign_type || campaign.type,
      compensation_type:
        campaign.compensation_type ||
        (campaign.creator_fixed_price
          ? "PAID"
          : campaign.commission_percentage
            ? "COMMISSION"
            : campaign.product_value
              ? "GIFTED_PRODUCT"
              : "PAID"),
      budget: campaign.budget,
      suggested_min: campaign.suggested_min,
      suggested_max: campaign.suggested_max,
      creator_fixed_price: campaign.creator_fixed_price,
      product_value: campaign.product_value,
      product_price: campaign.product_price,
      commission_percentage: campaign.commission_percentage,
      creator_fee: campaign.creator_fixed_price,
      application_deadline: campaign.campaign_deadline || campaign.application_deadline,
      min_combined_followers: campaign.min_combined_followers,
      niches: campaign.niches || campaign.niche || [],
      deliverables: campaign.deliverables || [],
      required_platforms: campaign.required_platforms || [],
      platform_minimums: campaign.platform_minimums || {},
      short_description: campaign.description || campaign.brief,
      long_description: campaign.brief || campaign.description,
      hashtags: campaign.hashtags,
      style_guide: campaign.style_guide,
      style_guide_file: campaign.style_guide_file,
      non_negotiables_do: campaign.non_negotiables_do || [],
      non_negotiables_dont: campaign.non_negotiables_dont || [],
      location_options: campaign.remote
        ? ["Remote"]
        : campaign.in_person_required
          ? ["On Location"]
          : [],
      creator_country: campaign.creator_country,
      creator_city: campaign.creator_city,
      language_requirement: campaign.language || campaign.creator_language,
      creator_language: campaign.creator_language || campaign.language,
      gender_requirement: campaign.creator_gender,
      creator_gender: campaign.creator_gender,
      min_age: campaign.min_age,
      max_age: campaign.max_age,
      campaign_image: campaign.productImage || campaign.campaign_image,
    };
  }, [campaign]);

  const campaignTypeLabel =
    friendlyCampaignTypeMap[normalizedCampaign.campaign_type] ||
    normalizedCampaign.campaign_type ||
    "Not specified";

  const applicationDeadline = normalizedCampaign.application_deadline
    ? formatDate(normalizedCampaign.application_deadline)
    : "—";
  const applicationDeadlineLabel =
    applicationDeadline === "—" ? "No deadline set" : applicationDeadline;

  const nicheTags = (normalizedCampaign.niches || []).map((niche, index) => ({
    id: `${niche}-${index}`,
    label: niche,
  }));

  const deliverableTags = (normalizedCampaign.deliverables || []).map((deliverable, index) => ({
    id: `deliverable-${index}`,
    label:
      typeof deliverable === "string"
        ? deliverable
        : deliverable?.displayText || deliverable?.text || JSON.stringify(deliverable),
  }));

  const requiredPlatforms = (normalizedCampaign.required_platforms || []).map(
    (platform, index) => ({
      id: `platform-${index}`,
      label: platform,
    })
  );

  const platformMinimums = Object.entries(normalizedCampaign.platform_minimums || {})
    .filter(([, value]) => value)
    .map(([platform, value]) => ({
      id: platform,
      platform,
      value: formatNumber(value),
    }));

  const commissionPerSale = calculateCommissionPerSale(
    normalizedCampaign.product_price,
    normalizedCampaign.commission_percentage
  );

  const compensationItems = [
    normalizedCampaign.budget && {
      label:
        normalizedCampaign?.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? "Product Value"
          : normalizedCampaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? "Commission Rate"
            : "Total Budget",
      value:
        normalizedCampaign?.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? formatCurrency(normalizedCampaign.product_value)
          : normalizedCampaign?.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? `${normalizedCampaign.commission_percentage}%`
            : formatCurrency(normalizedCampaign.budget),
    },
    normalizedCampaign.suggested_min &&
      normalizedCampaign.suggested_max && {
        label: "Suggested Range",
        value: `${formatCurrency(normalizedCampaign.suggested_min)} — ${formatCurrency(normalizedCampaign.suggested_max)}`,
      },
    normalizedCampaign.creator_fixed_price && {
      label: "Fixed Payment",
      value: formatCurrency(normalizedCampaign.creator_fixed_price),
    },
    normalizedCampaign.product_value && {
      label: "Product Value",
      value: formatCurrency(normalizedCampaign.product_value),
    },
    normalizedCampaign.product_price && {
      label: "Product Price",
      value: formatCurrency(normalizedCampaign.product_price),
    },
    normalizedCampaign.commission_percentage && {
      label: "Commission Rate",
      value: `${normalizedCampaign.commission_percentage}%`,
    },
    commissionPerSale > 0 && {
      label: "Earnings per Sale",
      value: formatCurrency(commissionPerSale),
    },
  ].filter(Boolean);

  const heroStats = [
    normalizedCampaign.budget && {
      label: "Budget",
      value: formatCurrency(normalizedCampaign.budget),
    },
    normalizedCampaign.min_combined_followers && {
      label: "Min Followers",
      value: formatNumber(normalizedCampaign.min_combined_followers),
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

  const workMode = [
    normalizedCampaign.location_options?.includes("Remote") && "Remote",
    normalizedCampaign.location_options?.includes("On Location") && "In-Person",
  ].filter(Boolean);

  const ageRangeSummary =
    normalizedCampaign.min_age || normalizedCampaign.max_age
      ? `${normalizedCampaign.min_age || "Any"} — ${normalizedCampaign.max_age || "Any"}`
      : null;

  const compensationTypeLabel = (() => {
    const type = normalizedCampaign.compensation_type?.toUpperCase();
    switch (type) {
      case COMPENSATION_TYPE.PAID:
        return "Fixed Payment";
      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        return "Gifted Product";
      case COMPENSATION_TYPE.COMMISSION:
        return "Commission Based";
      default:
        return type || "—";
    }
  })();

  const quickFields = [
    { label: "Campaign Type", value: campaignTypeLabel },
    {
      label: "Creator Fee",
      value: compensationItems[1]?.value || formatCurrency(normalizedCampaign.creator_fee),
    },
    commissionPerSale > 0 && {
      label: "Earnings per Sale",
      value: formatCurrency(commissionPerSale),
    },
    { label: "Deadline", value: applicationDeadlineLabel },
    { label: "Work Mode", value: workMode.join(" • ") || null },
    {
      label: "Country",
      value: normalizedCampaign.creator_country
        ? `${normalizedCampaign.creator_country}${normalizedCampaign.creator_country_code ? ` (${normalizedCampaign.creator_country_code})` : ""}`
        : null,
    },
    {
      label: "City",
      value: normalizedCampaign.creator_city
        ? `${normalizedCampaign.creator_city}${normalizedCampaign.creator_city_region ? `, ${normalizedCampaign.creator_city_region}` : ""}`
        : null,
    },
    {
      label: "Language",
      value: normalizedCampaign.language_requirement || normalizedCampaign.creator_language || null,
    },
    {
      label: "Gender",
      value: normalizedCampaign.gender_requirement || normalizedCampaign.creator_gender || null,
    },
    { label: "Age Range", value: ageRangeSummary },
  ].filter((field) => field.value);

  const sanitizeGuidelines = (list = []) =>
    (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

  const doGuidelines = sanitizeGuidelines(normalizedCampaign.non_negotiables_do);
  const dontGuidelines = sanitizeGuidelines(normalizedCampaign.non_negotiables_dont);

  const guidelineGroups = [];
  if (doGuidelines.length) {
    guidelineGroups.push({ title: "Do's", items: doGuidelines });
  }
  if (dontGuidelines.length) {
    guidelineGroups.push({ title: "Don'ts", items: dontGuidelines });
  }

  const contentSections = [
    normalizedCampaign.short_description && {
      title: "Campaign Overview",
      body: normalizedCampaign.short_description,
      tone: "muted",
    },
    normalizedCampaign.long_description && {
      title: "Detailed Brief",
      body: normalizedCampaign.long_description,
      tone: "rich",
    },
    normalizedCampaign.hashtags && {
      title: "Hashtags & Captions",
      body: normalizedCampaign.hashtags,
      tone: "accent",
    },
    normalizedCampaign.style_guide && {
      title: "Style Guide Notes",
      body: normalizedCampaign.style_guide,
      tone: "muted",
    },
  ].filter(Boolean);

  const styleGuideFileUrl =
    typeof normalizedCampaign.style_guide_file === "string"
      ? normalizedCampaign.style_guide_file
      : "";
  const styleGuideFileName = styleGuideFileUrl
    ? styleGuideFileUrl.split("/").pop() || "View style guide"
    : "";

  const imageSrc = normalizedCampaign.campaign_image || "";

  return {
    title: normalizedCampaign.campaign_title || "Untitled Campaign",
    campaignTypeLabel,
    imageSrc,
    applicationDeadline,
    heroStats,
    nicheTags,
    deliverableTags,
    requiredPlatforms,
    platformMinimums,
    compensationItems,
    workMode,
    contentSections,
    styleGuideFileUrl,
    styleGuideFileName,
    guidelineGroups,
    quickFields,
  };
}
