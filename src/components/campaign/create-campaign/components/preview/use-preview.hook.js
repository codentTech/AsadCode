"use client";

import { useEffect, useMemo, useState } from "react";
import { CAMPAIGN_TYPE_OPTIONS } from "@/common/constants/options.constant";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import { formatDate } from "@/common/utils/formate-date";

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

const extractFileName = (urlOrPath = "") => {
  if (!urlOrPath) return "";
  try {
    return decodeURIComponent(urlOrPath.split("/").pop() || "");
  } catch (error) {
    return urlOrPath;
  }
};

const calculateCommissionPerSale = (productPrice, commissionPercentage) => {
  const price = Number(productPrice);
  const percentage = Number(commissionPercentage);
  if (Number.isNaN(price) || Number.isNaN(percentage) || price <= 0 || percentage <= 0) return 0;
  return (price * percentage) / 100;
};

export default function usePreview(campaignData = {}) {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    if (!campaignData?.campaignImage) {
      setImageSrc("");
      return undefined;
    }

    if (typeof campaignData.campaignImage === "string") {
      setImageSrc(campaignData.campaignImage);
      return undefined;
    }

    const objectUrl = URL.createObjectURL(campaignData.campaignImage);
    setImageSrc(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [campaignData?.campaignImage]);

  const campaignTypeLabel =
    friendlyCampaignTypeMap[campaignData.campaign_type] ||
    campaignData.campaign_type ||
    "Not specified";
  const applicationDeadline = formatDate(campaignData.application_deadline);
  const applicationDeadlineLabel =
    applicationDeadline === "—" ? "No deadline set" : applicationDeadline;

  const trimmedQuestions = useMemo(
    () => (campaignData.questions || []).map((question) => question?.trim()).filter(Boolean),
    [campaignData.questions]
  );

  const nicheTags = (campaignData.niches || []).map((niche, index) => ({
    id: `${niche}-${index}`,
    label: niche,
  }));

  const deliverableTags = (campaignData.deliverables || []).map((deliverable, index) => ({
    id: `deliverable-${index}`,
    label:
      typeof deliverable === "string"
        ? deliverable
        : deliverable?.displayText || deliverable?.text || JSON.stringify(deliverable),
  }));

  const requiredPlatforms = (campaignData.required_platforms || []).map((platform, index) => ({
    id: `platform-${index}`,
    label: platform,
  }));

  const platformMinimums = Object.entries(campaignData.platformMinimums || {})
    .filter(([, value]) => value)
    .map(([platform, value]) => ({
      id: platform,
      platform,
      value: formatNumber(value),
    }));

  const commissionPerSale = calculateCommissionPerSale(
    campaignData.product_price,
    campaignData.commission_percentage
  );

  const compensationItems = [
    campaignData.budget && {
      label:
        campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? "Product Value"
          : campaignData?.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? "Commission Rate"
            : "Total Budget",
      value:
        campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? formatCurrency(campaignData.product_value)
          : campaignData?.campaign_type === CAMPAIGN_TYPE.AFFILIATE
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

  const heroStats = [
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

  const workMode = [
    campaignData.isRemote && "Remote",
    campaignData.inPersonRequired && "In-Person",
  ].filter(Boolean);

  // Format countries from creator_countries array
  const countriesDisplay = useMemo(() => {
    if (
      campaignData?.creator_countries &&
      Array.isArray(campaignData.creator_countries) &&
      campaignData.creator_countries.length > 0
    ) {
      return campaignData.creator_countries
        .map((country) => {
          return country.country;
        })
        .join(", ");
    }
    return null;
  }, [campaignData?.creator_countries]);

  const locationMeta = [
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

  const creatorRequirements = [
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
    campaignData.creator_gender && {
      label: "Preferred Gender",
      value: campaignData.creator_gender,
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

  const ageRangeSummary =
    campaignData.min_age || campaignData.max_age
      ? `${campaignData.min_age || "Any"} — ${campaignData.max_age || "Any"}`
      : null;

  const sanitizeGuidelines = (list = []) =>
    (Array.isArray(list) ? list : [])
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean);

  const doGuidelines = sanitizeGuidelines(campaignData.nonNegotiablesDo);
  const dontGuidelines = sanitizeGuidelines(campaignData.nonNegotiablesDont);

  const legacyNonNegotiables =
    typeof campaignData.nonNegotiables === "string" && campaignData.nonNegotiables.trim()
      ? campaignData.nonNegotiables.trim()
      : "";

  const guidelineGroups = [];
  if (doGuidelines.length) {
    guidelineGroups.push({ title: "Do's", items: doGuidelines });
  }
  if (dontGuidelines.length) {
    guidelineGroups.push({ title: "Don'ts", items: dontGuidelines });
  }

  const contentSections = [
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
    !guidelineGroups.length &&
      legacyNonNegotiables && {
        title: "Content Guidelines",
        body: legacyNonNegotiables,
        tone: "warning",
      },
    campaignData.styleGuide && {
      title: "Style Guide Notes",
      body: campaignData.styleGuide,
      tone: "muted",
    },
  ].filter(Boolean);

  const styleGuideFileUrl =
    typeof campaignData.styleGuideFile === "string" ? campaignData.styleGuideFile : "";
  const styleGuideFileName = styleGuideFileUrl ? extractFileName(styleGuideFileUrl) : "";

  const compensationTypeLabel = (() => {
    const type = campaignData.compensation_type;
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
  })();

  return {
    title: campaignData.campaign_title || "Untitled Campaign",
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
    locationMeta,
    creatorRequirements,
    contentSections,
    trimmedQuestions,
    styleGuideFileUrl,
    styleGuideFileName,
    guidelineGroups,
    quickFields: [
      { label: "Campaign Type", value: campaignTypeLabel },
      {
        label:
          campaignData?.campaign_type === CAMPAIGN_TYPE.GIFTED
            ? "Product Value"
            : campaignData?.campaign_type === CAMPAIGN_TYPE.AFFILIATE
              ? "Commission Rate"
              : "Total Budget",
        value: compensationItems[0]?.value || compensationTypeLabel,
      },
      {
        label: "Creator Fee",
        value: compensationItems[1]?.value,
      },
      commissionPerSale > 0 && {
        label: "Earnings per Sale",
        value: formatCurrency(commissionPerSale),
      },
      { label: "Deadline", value: applicationDeadlineLabel },
      { label: "Work Mode", value: workMode.join(" • ") || null },
      {
        label: campaignData.creator_countries?.length > 1 ? "Countries" : "Country",
        value: countriesDisplay || null,
      },
      {
        label: "City",
        value: campaignData.creator_city
          ? `${campaignData.creator_city}${campaignData.creator_city_region ? `, ${campaignData.creator_city_region}` : ""}`
          : null,
      },
      { label: "Language", value: campaignData.creator_language || null },
      { label: "Gender", value: campaignData.creator_gender || null },
      { label: "Age Range", value: ageRangeSummary },
    ].filter((field) => field.value),
    termsAgreed: Boolean(campaignData.termsAgreed),
  };
}
