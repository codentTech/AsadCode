import {
  CAMPAIGN_TYPE,
  COMPENSATION_TYPE,
  COLLABORATION_TYPE,
} from "@/common/constants/campaign.constant";
import {
  CAMPAIGN_TYPE_OPTIONS,
  EXCLUSIVITY_CLAUSE_OPTIONS,
  USAGE_RIGHTS_OPTIONS,
} from "@/common/constants/options.constant";
import { useMemo } from "react";
import { formatDate } from "@/common/utils/formate-date";
import { formatGenderForDisplay, formatLanguageForDisplay } from "@/common/utils/campaign.utils";

const friendlyCampaignTypeMap = CAMPAIGN_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const usageRightsMap = USAGE_RIGHTS_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

const exclusivityClauseMap = EXCLUSIVITY_CLAUSE_OPTIONS.reduce((acc, option) => {
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

export default function useCampaignBriefModal(campaign = {}, isIndividualCreator = false) {
  const normalizedCampaign = useMemo(() => {
    if (isIndividualCreator) {
      return {
        campaign_title: "Individual Collaboration",
        campaign_type: campaign.campaignType || campaign.campaign_type || null,
        compensation_type:
          campaign.compensation_type || campaign.compensationType || COMPENSATION_TYPE.PAID,
        budget: campaign.total_compensation || campaign.totalCompensation || null,
        creator_fee: campaign.total_compensation || campaign.totalCompensation || null,
        product_value: campaign.product_value || campaign.productValue || null,
        product_price: campaign.product_price || campaign.productPrice || null,
        application_deadline: campaign.completion_deadline || campaign.completionDeadline || null,
        deliverables: campaign.contentFormat
          ? typeof campaign.contentFormat === "string"
            ? campaign.contentFormat.split(",").map((d) => d.trim())
            : [campaign.contentFormat]
          : [],
        short_description: campaign.content_guidelines || campaign.contentGuidelines || "",
        long_description: campaign.content_guidelines || campaign.contentGuidelines || "",
        hashtags: campaign.hashtags || null,
        style_guide: null,
        style_guide_file: null,
        non_negotiables_do: [],
        non_negotiables_dont: [],
        location_options:
          campaign.in_person_required || campaign.inPersonRequired ? ["On Location"] : ["Remote"],
        niches: [],
        required_platforms: [],
        platform_minimums: {},
        min_combined_followers: null,
        usage_rights: (campaign.usage_rights || campaign.usageRights)?.replace("_", " "),
        exclusivity_clause: (campaign.exclusivity_clause || campaign.exclusivityClause)?.replace(
          "_",
          " "
        ),
        revisions_limit: campaign.revisions_limit || campaign.revisionsLimit || null,
        start_date: campaign.start_date || campaign.startDate || null,
        first_draft_deadline: campaign.first_draft_deadline || campaign.firstDraftDeadline || null,
        collaboration_type: COLLABORATION_TYPE.INDIVIDUAL_CREATOR,
      };
    }

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
              ? "GIFTED PRODUCT"
              : "PAID"),
      budget: campaign.budget,
      suggested_min: campaign.suggested_min,
      suggested_max: campaign.suggested_max,
      creator_fixed_price: campaign.creator_fixed_price,
      product_value: campaign.product_value,
      product_price: campaign.product_price,
      commission_percentage: campaign.commission_percentage,
      creator_fee: campaign.creator_fixed_price,
      application_deadline: campaign.application_deadline,
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
      language_requirement: campaign.language_requirement,
      creator_language: campaign.creator_language || campaign.language,
      gender_requirement: campaign.gender_requirement,
      creator_gender: campaign.creator_gender,
      min_age: campaign.min_age,
      max_age: campaign.max_age,
      campaign_image: campaign.productImage || campaign.campaign_image,
      usage_rights: campaign.usage_rights,
      usage_rights_requirement: campaign.usage_rights_requirement,
      exclusivity_clause: campaign.exclusivity_clause,
    };
  }, [campaign, isIndividualCreator]);

  const campaignTypeLabel =
    friendlyCampaignTypeMap[normalizedCampaign.campaign_type] ||
    normalizedCampaign.campaign_type ||
    "Not specified";

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
        return "Paid";
      case COMPENSATION_TYPE.GIFTED_PRODUCT:
        return "Gifted Product";
      case COMPENSATION_TYPE.COMMISSION:
        return "Commission Based";
      default:
        return type || "—";
    }
  })();

  // Determine if creator fee should show "Negotiable"
  const getCreatorFeeDisplay = () => {
    // If there's an explicit creator_fee value (and it's not 0), show it
    if (normalizedCampaign.creator_fee && normalizedCampaign.creator_fee > 0) {
      return formatCurrency(normalizedCampaign.creator_fee);
    }

    // If there's a fixed price or suggested range, show that
    if (normalizedCampaign.creator_fixed_price) {
      return formatCurrency(normalizedCampaign.creator_fixed_price);
    }
    if (normalizedCampaign.suggested_min || normalizedCampaign.suggested_max) {
      return `${formatCurrency(normalizedCampaign.suggested_min || 0)} — ${formatCurrency(normalizedCampaign.suggested_max || 0)}`;
    }

    // For PAID campaigns (SPONSORED_POST or UGC) with no fixed price or range, show "Negotiable"
    if (
      (normalizedCampaign.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
        normalizedCampaign.campaign_type === CAMPAIGN_TYPE.UGC) &&
      normalizedCampaign.compensation_type === COMPENSATION_TYPE.PAID &&
      !normalizedCampaign.creator_fixed_price &&
      !normalizedCampaign.suggested_min &&
      !normalizedCampaign.suggested_max
    ) {
      return "Negotiable";
    }

    // Fallback to compensation items or "—"
    return compensationItems[1]?.value || "Negotiable";
  };

  const quickFields = [
    { label: "Campaign Type", value: campaignTypeLabel },
    {
      label: "Creator Fee",
      value: getCreatorFeeDisplay(),
    },
    commissionPerSale > 0 && {
      label: "Earnings per Sale",
      value: formatCurrency(commissionPerSale),
    },
    {
      label: "Deadline",
      value: normalizedCampaign.application_deadline
        ? formatDate(normalizedCampaign.application_deadline)
        : "No deadline set",
    },
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
      value: (() => {
        // Prioritize creator_language first, then language_requirement
        // Only use language_requirement if creator_language is not available
        const language =
          normalizedCampaign.creator_language &&
          normalizedCampaign.creator_language !== "none" &&
          normalizedCampaign.creator_language !== ""
            ? normalizedCampaign.creator_language
            : normalizedCampaign.language_requirement;
        const formattedLanguage = formatLanguageForDisplay(language);
        const requirement = normalizedCampaign.language_requirement;
        if (formattedLanguage && requirement && requirement !== "none") {
          const requirementLabel = (
            requirement.charAt(0).toUpperCase() + requirement.slice(1)
          )?.replace("_", " ");
          return `${formattedLanguage} (${requirementLabel})`;
        }
        return formattedLanguage;
      })(),
    },
    {
      label: "Gender",
      value: (() => {
        // Prioritize creator_gender first, then gender_requirement
        // Only use gender_requirement if creator_gender is not available
        const gender =
          normalizedCampaign.creator_gender &&
          normalizedCampaign.creator_gender !== "none" &&
          normalizedCampaign.creator_gender !== ""
            ? normalizedCampaign.creator_gender
            : normalizedCampaign.gender_requirement;
        const formattedGender = formatGenderForDisplay(gender);
        const requirement = normalizedCampaign.gender_requirement;
        if (formattedGender && requirement && requirement !== "none") {
          const requirementLabel = (
            requirement.charAt(0).toUpperCase() + requirement.slice(1)
          )?.replace("_", " ");
          return `${formattedGender} (${requirementLabel})`;
        }
        return formattedGender;
      })(),
    },
    { label: "Age Range", value: ageRangeSummary },
    {
      label: "Usage Rights",
      value: (() => {
        const usageRights = normalizedCampaign.usage_rights
          ? usageRightsMap[normalizedCampaign.usage_rights] || normalizedCampaign.usage_rights
          : null;
        const requirement = normalizedCampaign.usage_rights_requirement;
        if (usageRights && requirement && requirement !== "none") {
          const requirementLabel = (
            requirement.charAt(0).toUpperCase() + requirement.slice(1)
          )?.replace("_", " ");
          return `${usageRights} (${requirementLabel})`;
        }
        return usageRights;
      })(),
    },
    {
      label: "Exclusivity Clause",
      value: normalizedCampaign.exclusivity_clause
        ? exclusivityClauseMap[normalizedCampaign.exclusivity_clause] ||
          normalizedCampaign.exclusivity_clause
        : null,
    },
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
    !isIndividualCreator &&
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

  const title = isIndividualCreator
    ? normalizedCampaign.campaign_title || "Individual Collaboration"
    : normalizedCampaign.campaign_title || "Untitled Campaign";

  return {
    title,
    isIndividualCreator,
    campaignTypeLabel,
    imageSrc,
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
