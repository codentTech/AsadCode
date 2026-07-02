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
