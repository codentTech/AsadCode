import { CAMPAIGN_TYPE, PLATFORM_TYPE } from "@/common/constants/campaign.constant";

export const CREATOR_TAG_OPTIONS = [
  {
    value: CAMPAIGN_TYPE.UGC,
    label: "UGC Specialist",
    pillClass: "bg-blue-600 text-white",
    cardBorder: "border-blue-200 bg-blue-50/80",
    helper:
      "I create high-quality branded content for brands to use on their own channels.",
    tooltip:
      "Focused on content creation. Audience reach is not required.",
    allowedPlatforms: [PLATFORM_TYPE.INSTAGRAM],
  },
  {
    value: CAMPAIGN_TYPE.INFLUENCER,
    label: "Influencer",
    pillClass: "bg-purple-600 text-white",
    cardBorder: "border-purple-200 bg-purple-50/80",
    helper:
      "I promote brands by posting content to my own social media accounts and reaching my audience.",
    tooltip: "Focused on audience reach and performance.",
    allowedPlatforms: [
      PLATFORM_TYPE.INSTAGRAM,
      PLATFORM_TYPE.TIKTOK,
      PLATFORM_TYPE.YOUTUBE,
    ],
  },
  {
    value: CAMPAIGN_TYPE.HYBRID,
    label: "Hybrid",
    pillClass: "bg-emerald-600 text-white",
    cardBorder: "border-emerald-200 bg-emerald-50/80",
    helper:
      "I do both UGC content creation and I can also post organically to my own audience.",
    tooltip: "Delivers both content creation and audience distribution.",
    allowedPlatforms: [
      PLATFORM_TYPE.INSTAGRAM,
      PLATFORM_TYPE.TIKTOK,
      PLATFORM_TYPE.YOUTUBE,
    ],
  },
];

export const CREATOR_TYPE_QUESTION = "What type of creator are you?";

export const CREATOR_TYPE_QUESTION_HELPER =
  "This helps us show your profile correctly to brands and unlock the right tools for you.";

export function getAllowedPlatformsForCreatorType(creatorType) {
  const opt = CREATOR_TAG_OPTIONS.find((o) => o.value === creatorType);
  return opt?.allowedPlatforms ?? CREATOR_TAG_OPTIONS[0].allowedPlatforms;
}

export function isPlatformAllowedForCreatorType(platform, creatorType) {
  const allowed = getAllowedPlatformsForCreatorType(creatorType);
  return allowed.includes(String(platform).toUpperCase());
}

export function getCreatorTagMeta(creatorType) {
  return (
    CREATOR_TAG_OPTIONS.find((o) => o.value === creatorType) ?? CREATOR_TAG_OPTIONS[0]
  );
}
