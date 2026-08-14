import { normalizeInviteToken } from "@/common/utils/invite-token.util";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import { STANDARD_CONTENT_TYPES } from "@/common/constants/profile-setup.constant";

export const readInviteTokenFromWindow = () => {
  if (typeof window === "undefined") return null;
  return normalizeInviteToken(new URLSearchParams(window.location.search).get("token"));
};

export const stripInviteTokenFromUrl = () => {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  if (!url.searchParams.has("token")) return;
  url.searchParams.delete("token");
  const next = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState({}, "", next);
};

export const getInviteResumeEmail = (validateTokenState) => {
  if (validateTokenState?.isSuccess && validateTokenState?.data?.email) {
    return validateTokenState.data.email;
  }
  return null;
};

export const getServerStep = (step, inviteTokenPresent) => {
  const n = Number(step) || 1;
  return inviteTokenPresent ? Math.max(n, 2) : n;
};

export const getStatusResumeStep = (onboardingStatus, inviteTokenPresent) => {
  const step = Number(onboardingStatus?.onboardingStep);
  if (!Number.isFinite(step) || step <= 0) return null;
  return getServerStep(step, inviteTokenPresent && !hasCreatedAccount(onboardingStatus));
};

export const getOnboardingResumeStepFromReject = (payload) => {
  const data =
    payload?.data ||
    payload?.payload?.response?.data?.data ||
    payload?.response?.data?.data ||
    null;
  const step = Number(data?.resumeStep);
  return Number.isFinite(step) && step > 0 ? step : null;
};

export const syncLocalOnboardingStep = (onboardingStatus) => {
  if (typeof window === "undefined") return;
  const step = Number(onboardingStatus?.onboardingStep);
  const email = onboardingStatus?.user?.email;
  if (!Number.isFinite(step) || !email) return;
  try {
    const raw = window.localStorage.getItem("user");
    if (!raw) return;
    const existing = JSON.parse(raw);
    if (!existing?.email || String(existing.email).toLowerCase() !== String(email).toLowerCase()) {
      return;
    }
    if (Number(existing.onboarding_step) === step) return;
    window.localStorage.setItem("user", JSON.stringify({ ...existing, onboarding_step: step }));
  } catch {
    // ignore
  }
};

export const isInvitePhaseStep = (step) => {
  const n = Number(step) || 1;
  return n <= ONBOARDING_STEPS.EMAIL_VERIFICATION;
};

export const hasCreatedAccount = (onboardingStatus) =>
  Boolean(onboardingStatus?.user?.email);

export const shouldBlockOnInvalidInvite = ({
  inviteToken,
  isTokenValid,
  isResumeInvite,
  hasValidatedToken,
  onboardingStatus,
  currentStep,
}) => {
  if (!inviteToken || !hasValidatedToken || isTokenValid || isResumeInvite) return false;
  if (hasCreatedAccount(onboardingStatus)) return false;
  if (!isInvitePhaseStep(currentStep) && Number(currentStep) >= ONBOARDING_STEPS.PROFILE_SETUP) {
    return false;
  }
  return true;
};

export const shouldShowCreatorApplication = ({
  isCreatorMode,
  inviteToken,
  isTokenValid,
  isResumeInvite,
  currentStep,
  showApplicationConfirmation,
}) =>
  Boolean(
    isCreatorMode &&
      !isResumeInvite &&
      (!inviteToken || !isTokenValid) &&
      currentStep === 2 &&
      !showApplicationConfirmation,
  );

export const getInviteValidationState = (inviteToken, validateTokenState) => {
  const data = validateTokenState?.data;
  const isValidatingToken = Boolean(inviteToken && validateTokenState?.isLoading);
  const isSuccess = Boolean(inviteToken && validateTokenState?.isSuccess);
  const isResumeInvite = Boolean(isSuccess && data?.resumeOnly);
  const isTokenValid = Boolean(isSuccess && !data?.resumeOnly);
  const tokenError = validateTokenState?.isError ? validateTokenState?.message : null;
  const hasValidatedToken =
    !inviteToken ||
    (!validateTokenState?.isLoading &&
      (validateTokenState?.isSuccess || validateTokenState?.isError));

  return {
    isValidatingToken,
    isTokenValid,
    isResumeInvite,
    tokenError,
    hasValidatedToken,
  };
};

const padMiniPictures = (pics) => {
  const list = Array.isArray(pics) ? pics.filter((u) => typeof u === "string" && u.trim()) : [];
  return [list[0] || null, list[1] || null, list[2] || null];
};

export const mapCreatorProfileToSetupForm = (profile) => {
  if (!profile) return null;

  const rates = Array.isArray(profile.content_rates) ? profile.content_rates : [];
  const contentRatesObj = {};
  const customRates = [];

  rates.forEach((rate) => {
    const type = rate?.contentType;
    const price = rate?.price;
    if (!type || price == null) return;
    const standardIdx = STANDARD_CONTENT_TYPES.findIndex(
      (t) => t.toLowerCase() === String(type).toLowerCase()
    );
    if (standardIdx >= 0) {
      contentRatesObj[standardIdx] = String(price);
    } else {
      customRates.push({ contentType: String(type), price: String(price) });
    }
  });

  const photoUrl = profile.profile_photo_url || null;
  const mini = padMiniPictures(profile.mini_profile_pictures);

  return {
    formValues: {
      creatorType: normalizeCreatorType(profile.creator_type || profile.creatorType) || CAMPAIGN_TYPE.UGC,
      profilePhoto: photoUrl,
      miniProfilePictures: mini,
      bio: profile.bio || "",
      longBio: profile.long_bio || "",
      socialPlatforms: Array.isArray(profile.social_platforms) ? profile.social_platforms : [],
      categories: Array.isArray(profile.categories) ? profile.categories : [],
      keywordTags: Array.isArray(profile.keyword_tags) ? profile.keyword_tags : [],
      subNiches: Array.isArray(profile.sub_niches) ? profile.sub_niches : [],
      contentCharacteristics: profile.content_characteristics || {},
      contentRates: rates,
    },
    profilePhotoUrl: photoUrl,
    profilePhotoPreview: photoUrl,
    selectedCategories: Array.isArray(profile.categories) ? profile.categories : [],
    keywordTags: Array.isArray(profile.keyword_tags) ? profile.keyword_tags : [],
    contentRates: contentRatesObj,
    customRates: customRates.length ? customRates : [{ contentType: "", price: "" }],
  };
};

export const hasMeaningfulCreatorProfile = (profile) => {
  if (!profile) return false;
  const shipping = profile.shipping_address || {};
  return Boolean(
    profile.bio ||
      profile.long_bio ||
      profile.profile_photo_url ||
      (Array.isArray(profile.categories) && profile.categories.length > 0) ||
      (Array.isArray(profile.mini_profile_pictures) &&
        profile.mini_profile_pictures.some((u) => typeof u === "string" && u.trim())) ||
      (Array.isArray(profile.campaign_types) && profile.campaign_types.length > 0) ||
      (Array.isArray(profile.languages) && profile.languages.length > 0) ||
      Boolean(shipping.street) ||
      Boolean(shipping.city) ||
      Boolean(shipping.country)
  );
};

export const mapCreatorProfileToCampaignPrefsForm = (profile) => {
  if (!profile) return null;
  const shipping = profile.shipping_address || {};
  const hasAny =
    (Array.isArray(profile.campaign_types) && profile.campaign_types.length > 0) ||
    (Array.isArray(profile.languages) && profile.languages.length > 0) ||
    Boolean(shipping.street) ||
    Boolean(shipping.city) ||
    Boolean(shipping.country);

  if (!hasAny) return null;

  return {
    campaignTypes: Array.isArray(profile.campaign_types) ? profile.campaign_types : [],
    languages: Array.isArray(profile.languages) ? profile.languages : [],
    ethnicity: profile.ethnicity || "",
    inPersonOpportunities:
      typeof profile.in_person_opportunities === "boolean"
        ? profile.in_person_opportunities
        : null,
    shippingAddress: {
      street: shipping.street || "",
      line2: shipping.line2 || "",
      line3: shipping.line3 || "",
      city: shipping.city || "",
      city_country_code: shipping.city_country_code || "",
      state: shipping.state || "",
      state_short: shipping.state_short || "",
      zipCode: shipping.zipCode || "",
      country: shipping.country || "",
      country_code: shipping.country_code || "",
    },
  };
};

const campaignDraftKey = (email) =>
  `cleercut:onboarding:campaign-prefs:${String(email || "").toLowerCase()}`;

export const readCampaignPrefsDraft = (email) => {
  if (typeof window === "undefined" || !email) return null;
  try {
    const raw = window.sessionStorage.getItem(campaignDraftKey(email));
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const writeCampaignPrefsDraft = (email, values) => {
  if (typeof window === "undefined" || !email || !values) return;
  try {
    window.sessionStorage.setItem(campaignDraftKey(email), JSON.stringify(values));
  } catch {
    // ignore quota errors
  }
};

export const clearCampaignPrefsDraft = (email) => {
  if (typeof window === "undefined" || !email) return;
  try {
    window.sessionStorage.removeItem(campaignDraftKey(email));
  } catch {
    // ignore
  }
};

const creatorTypeDraftKey = (email) =>
  `cleercut:onboarding:creator-type:${String(email || "").toLowerCase()}`;

const profileDraftKey = (email) =>
  `cleercut:onboarding:profile-setup:${String(email || "anon").toLowerCase()}`;

const mediaKitDraftKey = (email) =>
  `cleercut:onboarding:media-kit:${String(email || "anon").toLowerCase()}`;

const registerDraftKey = () => "cleercut:onboarding:register-form";

let rememberedCreatorType = null;

export const normalizeCreatorType = (value) => {
  if (!value) return null;
  const upper = String(value).toUpperCase();
  if (
    upper === CAMPAIGN_TYPE.UGC ||
    upper === CAMPAIGN_TYPE.INFLUENCER ||
    upper === CAMPAIGN_TYPE.HYBRID
  ) {
    return upper;
  }
  return null;
};

export const rememberCreatorType = (creatorType) => {
  const normalized = normalizeCreatorType(creatorType);
  if (normalized) rememberedCreatorType = normalized;
  return normalized;
};

export const getRememberedCreatorType = () => rememberedCreatorType;

export const readCreatorTypeDraft = (email) => {
  const remembered = getRememberedCreatorType();
  if (remembered) return remembered;
  if (typeof window === "undefined") return null;
  try {
    const scoped = email ? window.sessionStorage.getItem(creatorTypeDraftKey(email)) : null;
    const fallback = window.sessionStorage.getItem(creatorTypeDraftKey("anon"));
    return normalizeCreatorType(scoped || fallback);
  } catch {
    return null;
  }
};

export const writeCreatorTypeDraft = (email, creatorType) => {
  const normalized = rememberCreatorType(creatorType);
  if (!normalized || typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(creatorTypeDraftKey(email || "anon"), normalized);
    window.sessionStorage.setItem(creatorTypeDraftKey("anon"), normalized);
  } catch {
    // ignore
  }
};

const readJsonDraft = (key) => {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const writeJsonDraft = (key, value) => {
  if (typeof window === "undefined" || !value) return;
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
};

export const readProfileSetupDraft = (email) => readJsonDraft(profileDraftKey(email));

export const writeProfileSetupDraft = (email, values) => writeJsonDraft(profileDraftKey(email), values);

export const readMediaKitDraft = (email) => {
  if (typeof window === "undefined") return "";
  try {
    return window.sessionStorage.getItem(mediaKitDraftKey(email)) || "";
  } catch {
    return "";
  }
};

export const writeMediaKitDraft = (email, url) => {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(mediaKitDraftKey(email), String(url || ""));
  } catch {
    // ignore
  }
};

export const readRegisterDraft = () => readJsonDraft(registerDraftKey());

export const writeRegisterDraft = (values) => writeJsonDraft(registerDraftKey(), values);

export const resolveCreatorTypeFromSources = ({
  draftType,
  onboardingStatus,
  setupProfilePayload,
} = {}) => {
  const fromDraft = normalizeCreatorType(draftType) || getRememberedCreatorType();
  if (fromDraft) return fromDraft;

  const fromStatus = normalizeCreatorType(
    onboardingStatus?.creatorProfile?.creator_type ||
      onboardingStatus?.creatorProfile?.creatorType
  );
  if (fromStatus) return fromStatus;

  const response = setupProfilePayload?.data ?? setupProfilePayload;
  const user = response?.data ?? response;
  const fromSetup = normalizeCreatorType(
    user?.creator_profile?.creator_type ||
      user?.creator_profile?.creatorType ||
      user?.creatorProfile?.creator_type ||
      user?.creatorProfile?.creatorType
  );
  if (fromSetup) return fromSetup;

  return null;
};
