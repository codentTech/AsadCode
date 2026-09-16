import { useEffect, useMemo, useState } from "react";
import { PLATFORM_OPTIONS } from "@/common/constants/options.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { formatDate } from "@/common/utils/formate-date";
import { formatCurrency, formatNumber, extractFileName } from "@/common/utils/format.utils";
import {
  calculateCommissionPayment,
  CAMPAIGN_TYPE_MAP,
  getCompensationTypeLabel,
  sanitizeGuidelines,
  formatCountriesWithRequirement,
  createTagArray,
  createPlatformMinimums,
  formatGenderForDisplay,
  formatLanguageForDisplay,
} from "@/common/utils/campaign.utils";
import {
  getLegalLinksForAudience,
  LEGAL_AUDIENCE,
} from "@/common/utils/legal.utils";
import {
  buildHeroStats,
  buildCompensationItems,
  buildWorkMode,
  buildContentSections,
  buildGuidelineGroups,
} from "./preview-builders";
import { buildQuickFields } from "./quick-field-definitions";

const getPlatformLabel = (value) =>
  PLATFORM_OPTIONS.find((option) => option.value === value)?.label || value;

export default function usePreview(campaignData = {}) {
  const [imageSrc, setImageSrc] = useState("");
  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  useEffect(() => {
    if (!campaignData?.campaignImage) {
      setImageSrc("");
      return;
    }

    if (typeof campaignData.campaignImage === "string") {
      setImageSrc(campaignData.campaignImage);
      return;
    }

    const objectUrl = URL.createObjectURL(campaignData.campaignImage);
    setImageSrc(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [campaignData?.campaignImage]);

  const title = campaignData.campaign_title || "Untitled Campaign";
  const campaignTypeLabel =
    CAMPAIGN_TYPE_MAP[campaignData.campaign_type] || campaignData.campaign_type || "Not specified";
  const applicationDeadline = formatDate(campaignData.application_deadline);
  const applicationDeadlineLabel =
    applicationDeadline === "—" ? "No deadline set" : applicationDeadline;
  const trackingEndDate = formatDate(campaignData.tracking_end_date);
  const trackingEndDateLabel =
    trackingEndDate === "—" ? null : trackingEndDate;
  const compensationTypeLabel = getCompensationTypeLabel(campaignData.compensation_type);

  const nicheTags = useMemo(
    () => createTagArray(campaignData.niches, "niche"),
    [campaignData.niches]
  );

  const deliverableTags = useMemo(
    () => createTagArray(campaignData.deliverables, "deliverable"),
    [campaignData.deliverables]
  );

  const requiredPlatforms = useMemo(
    () =>
      createTagArray(campaignData.required_platforms, "platform").map((platform) => ({
        ...platform,
        label: getPlatformLabel(platform.label),
        value: platform.label,
        icon: getPlatformIcon(platform.label),
        colorClasses: getPlatformColor(platform.label),
      })),
    [campaignData.required_platforms, getPlatformIcon, getPlatformColor]
  );

  const platformMinimums = useMemo(
    () =>
      createPlatformMinimums(campaignData.platformMinimums, formatNumber).map((minimum) => ({
        ...minimum,
        label: getPlatformLabel(minimum.platform),
        icon: getPlatformIcon(minimum.platform),
        colorClasses: getPlatformColor(minimum.platform),
      })),
    [campaignData.platformMinimums, getPlatformIcon, getPlatformColor]
  );

  const trimmedQuestions = useMemo(
    () => (campaignData.questions || []).map((q) => q?.trim()).filter(Boolean),
    [campaignData.questions]
  );

  const commissionPerSale = useMemo(
    () =>
      calculateCommissionPayment(campaignData.commission_percentage, campaignData.product_price),
    [campaignData.commission_percentage, campaignData.product_price]
  );

  const countriesDisplay = useMemo(
    () =>
      formatCountriesWithRequirement(
        campaignData?.creator_countries,
        null,
        campaignData?.countryRequirement
      ),
    [campaignData?.creator_countries, campaignData?.countryRequirement]
  );

  const heroStats = useMemo(
    () =>
      buildHeroStats(
        campaignData,
        formatCurrency,
        formatNumber,
        deliverableTags,
        requiredPlatforms
      ),
    [
      campaignData,
      campaignData.budget,
      campaignData.min_combined_followers,
      campaignData.commission_percentage,
      campaignData.customer_discount_percent,
      campaignData.product_value,
      campaignData.shopify_products,
      campaignData.campaign_type,
      deliverableTags,
      requiredPlatforms,
    ]
  );

  const compensationItems = useMemo(
    () => buildCompensationItems(campaignData, formatCurrency, commissionPerSale),
    [
      campaignData,
      campaignData.budget,
      campaignData.campaign_type,
      campaignData.product_value,
      campaignData.commission_percentage,
      campaignData.customer_discount_percent,
      campaignData.shopify_products,
      campaignData.suggested_min,
      campaignData.suggested_max,
      campaignData.creator_fixed_price,
      campaignData.product_price,
      commissionPerSale,
    ]
  );

  const workMode = useMemo(
    () => buildWorkMode(campaignData.isRemote, campaignData.inPersonRequired),
    [campaignData.isRemote, campaignData.inPersonRequired]
  );

  const ageRangeSummary = useMemo(
    () =>
      campaignData.min_age || campaignData.max_age
        ? `${campaignData.min_age || "Any"} — ${campaignData.max_age || "Any"}`
        : null,
    [campaignData.min_age, campaignData.max_age]
  );

  const doGuidelines = useMemo(
    () => sanitizeGuidelines(campaignData.nonNegotiablesDo),
    [campaignData.nonNegotiablesDo]
  );
  const dontGuidelines = useMemo(
    () => sanitizeGuidelines(campaignData.nonNegotiablesDont),
    [campaignData.nonNegotiablesDont]
  );

  const guidelineGroups = useMemo(
    () => buildGuidelineGroups(doGuidelines, dontGuidelines),
    [doGuidelines, dontGuidelines]
  );

  const contentSections = useMemo(
    () => buildContentSections(campaignData),
    [
      campaignData.short_description,
      campaignData.long_description,
      campaignData.hashtags,
      campaignData.styleGuide,
    ]
  );

  const styleGuideFileUrl =
    typeof campaignData.styleGuideFile === "string" ? campaignData.styleGuideFile : "";
  const styleGuideFileName = styleGuideFileUrl ? extractFileName(styleGuideFileUrl) : "";

  const quickFields = useMemo(
    () =>
      buildQuickFields({
        campaignData,
        campaignTypeLabel,
        compensationItems,
        compensationTypeLabel,
        commissionPerSale,
        formatCurrency,
        applicationDeadlineLabel,
        trackingEndDateLabel,
        workMode,
        countriesDisplay,
        ageRangeSummary,
        formatGenderForDisplay,
        formatLanguageForDisplay,
      }),
    [
      campaignData,
      campaignTypeLabel,
      compensationItems,
      compensationTypeLabel,
      commissionPerSale,
      applicationDeadlineLabel,
      trackingEndDateLabel,
      workMode,
      countriesDisplay,
      ageRangeSummary,
    ]
  );

  const clientLegalLinks = useMemo(
    () => getLegalLinksForAudience(LEGAL_AUDIENCE.CLIENT),
    []
  );

  return {
    title,
    imageSrc,
    heroStats,
    nicheTags,
    deliverableTags,
    requiredPlatforms,
    platformMinimums,
    contentSections,
    trimmedQuestions,
    styleGuideFileUrl,
    styleGuideFileName,
    guidelineGroups,
    quickFields,
    termsAgreed: Boolean(campaignData.termsAgreed),
    termsHref: clientLegalLinks.terms,
    privacyHref: clientLegalLinks.privacy,
  };
}
