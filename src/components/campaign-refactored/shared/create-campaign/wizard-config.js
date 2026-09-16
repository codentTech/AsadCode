/**
 * Campaign creation wizard: step names, field validation per step, and step components.
 * Single source of truth for the wizard flow; no UI components in common/utils.
 */
import AudienceRequirementsExperience from "./components/audience-requirements/audience-requirements.component";
import CampaignTypeNiche from "./components/campaign-title.component/campaign-title.component";
import Compensation from "./components/compensation/compensation.component";
import Description from "./components/description/description.component";
import Eligibility from "./components/eligibility/eligibility.component";
import Preview from "./components/preview/preview.component";
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

export const STEP_NAMES = [
  "Campaign Title & Niche",
  "Audience Requirements",
  "Compensation",
  "Eligibility",
  "Description",
  "Preview & Publish",
];

export function getCompensationGuidanceInfo(campaignData = {}, stepMeta = {}) {
  const infoMap = stepMeta.compensationInfo || {};
  const compensationType = campaignData.compensation_type;
  const campaignType = campaignData.campaign_type;

  if (
    compensationType === COMPENSATION_TYPE.COMMISSION ||
    campaignType === CAMPAIGN_TYPE.AFFILIATE
  ) {
    return infoMap.commission || null;
  }
  if (
    compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
    campaignType === CAMPAIGN_TYPE.GIFTED
  ) {
    return infoMap.gifted || null;
  }
  if (
    compensationType === COMPENSATION_TYPE.PAID ||
    campaignType === CAMPAIGN_TYPE.SPONSORED_POST ||
    campaignType === CAMPAIGN_TYPE.UGC
  ) {
    return infoMap.paid || null;
  }
  return null;
}

export const STEP_META = [
  {
    description: "Name your campaign, pick niches, and set deliverables.",
    tip: "A clear title and focused niches help the right creators find you faster.",
    guide: [
      "Use a specific title creators can scan quickly.",
      "Pick 1–3 niches that match your brand.",
      "List every deliverable with quantity before moving on.",
    ],
  },
  {
    description: "Define follower counts and which platforms creators must use.",
    tip: "Keep requirements realistic — tighter filters mean fewer, better-fit applicants.",
    guide: [
      "Set a combined follower floor that matches your budget.",
      "Only require platforms you will actually use.",
      "Optional platform minimums help without blocking good fits.",
    ],
  },
  {
    description: "Choose campaign type and set budget, rates, or affiliate terms.",
    tip: "Transparent ranges reduce back-and-forth and speed up hiring.",
    guide: [
      "Pick the campaign type that matches how you pay creators.",
      "Show a clear fee range or fixed price.",
      "Affiliate campaigns need Shopify connected to continue.",
    ],
    compensationInfo: {
      paid: {
        title: "Fixed Payment (Budget-based)",
        detail: "Set a budget and choose a suggested range or fixed price for creators.",
      },
      gifted: {
        title: "Product Gifting Only",
        detail: "Creators receive product only — no monetary compensation.",
      },
      commission: {
        title: "Affiliate (commission per sale)",
        detail: "Creators earn commission on Shopify sales with a unique discount code.",
      },
    },
  },
  {
    description: "Set location, demographics, language, and application deadline.",
    tip: "Only mark criteria mandatory when they are truly non-negotiable.",
    guide: [
      "Prefer Preferred over Mandatory when possible.",
      "Add a deadline so applications stay fresh.",
      "Location details matter most for in-person filming.",
    ],
  },
  {
    description: "Add your brief, campaign image, guidelines, and creator questions.",
    tip: "Creators apply more when the brief is specific about tone, goals, and must-haves.",
    guide: [
      "Lead with a short description, then add detail.",
      "Upload a clear campaign image creators will recognize.",
      "Do’s and don’ts reduce revision rounds later.",
    ],
  },
  {
    description: "Review everything, accept terms, then launch your campaign.",
    tip: "Double-check compensation and deadline before you publish.",
    guide: [
      "Scan niches, deliverables, and pay one more time.",
      "Confirm the application deadline is correct.",
      "Accept terms to unlock Launch Campaign.",
    ],
  },
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
    "customer_discount_percent",
    "tracking_end_date",
    "shopify_products",
    "ships_physical_product",
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
