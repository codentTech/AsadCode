"use client";

import { CAMPAIGN_TYPE, PLATFORM_TYPE } from "@/common/constants/campaign.constant";
import { getAllowedPlatformsForCreatorType } from "@/common/constants/creator-tag.constant";
import { STANDARD_CONTENT_TYPES } from "@/common/constants/profile-setup.constant";
import { getOnboardingEmail, getOnboardingName } from "@/common/utils/users.util";
import {
  hasMeaningfulCreatorProfile,
  mapCreatorProfileToSetupForm,
  readCreatorTypeDraft,
  readProfileSetupDraft,
  writeCreatorTypeDraft,
  writeProfileSetupDraft,
} from "@/common/utils/onboarding-flow.util";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";
import { reset as resetAuth } from "@/provider/features/auth/auth.slice";
import { setupCreatorProfile } from "@/provider/features/creator-profile/creator-profile.slice";
import {
  getOnboardingStatus,
  patchOnboardingCreatorProfile,
} from "@/provider/features/onboarding/onboarding.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { disconnectSocialAccount, getSocialAccounts } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  creatorType: Yup.string()
    .oneOf([CAMPAIGN_TYPE.UGC, CAMPAIGN_TYPE.INFLUENCER, CAMPAIGN_TYPE.HYBRID])
    .required("Select a creator type"),

  profilePhoto: Yup.mixed().required("Profile photo is required"),

  miniProfilePictures: Yup.array()
    .length(3, "Three showcase image slots are required")
    .test(
      "all-showcase-filled",
      "Upload all 3 showcase images",
      (value) =>
        Array.isArray(value) &&
        value.length === 3 &&
        value.every((item) => item != null && String(item).trim() !== "")
    ),

  bio: Yup.string()
    .trim()
    .required("Tagline is required")
    .max(75, "Tagline must be less than 75 characters"),

  longBio: Yup.string().max(500, "Full bio must be less than 500 characters").optional(),

  socialPlatforms: Yup.array()
    .of(
      Yup.object().shape({
        platform: Yup.string(),
        username: Yup.string(),
        followerCount: Yup.number().nullable(),
      })
    )
    .optional(),

  categories: Yup.array().min(1, "Select at least one niche").max(5, "Maximum 5 niches allowed"),

  keywordTags: Yup.array()
    .max(15, "Suggested maximum is 15 keyword tags")
    .test("no-duplicates", "Duplicate keyword tags are not allowed", (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return true;
      const normalized = arr
        .map((t) =>
          String(t || "")
            .trim()
            .toLowerCase()
        )
        .filter(Boolean);
      return normalized.length === new Set(normalized).size;
    })
    .of(
      Yup.string()
        .trim()
        .min(2, "Each tag must be at least 2 characters")
        .max(30, "Each tag must be at most 30 characters")
    )
    .optional(),

  subNiches: Yup.array()
    .of(
      Yup.object().shape({
        niche: Yup.string(),
        tags: Yup.array().of(Yup.string()),
      })
    )
    .optional(),

  contentCharacteristics: Yup.object().shape({
    tone: Yup.string().optional(),
    productionLevel: Yup.string().optional(),
    deliveryStyle: Yup.string().optional(),
    contentFocus: Yup.string().optional(),
    energy: Yup.string().optional(),
    brandIntegration: Yup.string().optional(),
    trustPositioning: Yup.string().optional(),
  }),

  contentRates: Yup.array()
    .of(
      Yup.object().shape({
        contentType: Yup.string().nullable(),
        price: Yup.number().min(0, "Price must be zero or greater").nullable(),
      })
    )
    .optional(),
});

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useProfileSetup({ onNext, onCreatorTypeChange }) {
  const dispatch = useDispatch();

  const email = getOnboardingEmail();
  const name = getOnboardingName();

  const { isLoading: authLoading } = useSelector((state) => state.auth);
  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const creatorProfile = onboardingStatus?.creatorProfile;
  const hasHydratedRef = useRef(false);

  const { openConnect: openPhylloConnect } = usePhylloConnect();

  /**
   * Form
   */
  const {
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    reset: resetForm,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      creatorType: CAMPAIGN_TYPE.UGC,
      profilePhoto: null,
      miniProfilePictures: [null, null, null],
      bio: "",
      longBio: "",
      socialPlatforms: [],
      categories: [],
      keywordTags: [],
      subNiches: [],
      contentCharacteristics: {},
      contentRates: [],
    },
  });

  const creatorType = watch("creatorType");
  const bio = watch("bio");
  const longBio = watch("longBio");
  const miniProfilePictures = watch("miniProfilePictures");
  const contentCharacteristics = watch("contentCharacteristics") || {};
  const subNichesForm = watch("subNiches") || [];

  /**
   * Local UI state
   */
  const fileInputRef = useRef(null);

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false);
  const [connectionLink, setConnectionLink] = useState(null);
  const [isConnectionLinkCopied, setIsConnectionLinkCopied] = useState(false);
  const copyConnectionLinkTimeoutRef = useRef(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [removedPlatformMessages, setRemovedPlatformMessages] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);

  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);

  const [miniProfilePicturesLoading, setMiniProfilePicturesLoading] = useState([
    false,
    false,
    false,
  ]);
  const [socialConnectLoadingMap, setSocialConnectLoadingMap] = useState({});

  const platforms = useMemo(() => getAllowedPlatformsForCreatorType(creatorType), [creatorType]);

  const applyHydration = useCallback(
    (mapped) => {
      if (!mapped) return;
      resetForm(mapped.formValues);
      setProfilePhotoUrl(mapped.profilePhotoUrl);
      setProfilePhotoPreview(mapped.profilePhotoPreview);
      setSelectedCategories(mapped.selectedCategories);
      setKeywordTags(mapped.keywordTags);
      setContentRates(mapped.contentRates);
      setCustomRates(mapped.customRates);
      if (mapped.formValues?.creatorType) {
        writeCreatorTypeDraft(email, mapped.formValues.creatorType);
        onCreatorTypeChange?.(mapped.formValues.creatorType);
      }
    },
    [email, onCreatorTypeChange, resetForm]
  );

  useEffect(() => {
    if (hasHydratedRef.current) return;
    const draft = readProfileSetupDraft(email);
    if (draft?.formValues) {
      hasHydratedRef.current = true;
      applyHydration(draft);
      return;
    }
    if (!hasMeaningfulCreatorProfile(creatorProfile)) return;
    const mapped = mapCreatorProfileToSetupForm(creatorProfile);
    if (!mapped) return;
    hasHydratedRef.current = true;
    applyHydration(mapped);
  }, [applyHydration, creatorProfile, email]);

  useEffect(() => {
    if (!creatorType) return;
    if (!hasHydratedRef.current && readCreatorTypeDraft(email)) return;
    writeCreatorTypeDraft(email, creatorType);
    onCreatorTypeChange?.(creatorType);
  }, [creatorType, email, onCreatorTypeChange]);

  useEffect(() => {
    if (!hasHydratedRef.current && !isDirty) return;
    writeProfileSetupDraft(email, {
      formValues: {
        creatorType,
        profilePhoto: profilePhotoUrl,
        miniProfilePictures,
        bio,
        longBio,
        socialPlatforms: watch("socialPlatforms") || [],
        categories: selectedCategories,
        keywordTags,
        subNiches: subNichesForm,
        contentCharacteristics,
        contentRates: watch("contentRates") || [],
      },
      profilePhotoUrl,
      profilePhotoPreview,
      selectedCategories,
      keywordTags,
      contentRates,
      customRates,
    });
  }, [
    email,
    isDirty,
    creatorType,
    profilePhotoUrl,
    profilePhotoPreview,
    miniProfilePictures,
    bio,
    longBio,
    selectedCategories,
    keywordTags,
    subNichesForm,
    contentCharacteristics,
    contentRates,
    customRates,
    watch,
  ]);

  useEffect(() => {
    setIsConnectionLinkCopied(false);
    if (copyConnectionLinkTimeoutRef.current) {
      clearTimeout(copyConnectionLinkTimeoutRef.current);
      copyConnectionLinkTimeoutRef.current = null;
    }
  }, [connectionLink]);

  const handleCopyConnectionLink = useCallback(() => {
    if (!connectionLink) return;
    navigator.clipboard.writeText(connectionLink).then(() => {
      setIsConnectionLinkCopied(true);
      if (copyConnectionLinkTimeoutRef.current) {
        clearTimeout(copyConnectionLinkTimeoutRef.current);
      }
      copyConnectionLinkTimeoutRef.current = setTimeout(() => {
        setIsConnectionLinkCopied(false);
        copyConnectionLinkTimeoutRef.current = null;
      }, 2000);
    });
  }, [connectionLink]);

  const prevCreatorTypeRef = useRef(creatorType);

  useEffect(() => {
    const prev = prevCreatorTypeRef.current;
    if (creatorType === CAMPAIGN_TYPE.UGC && prev !== CAMPAIGN_TYPE.UGC) {
      [PLATFORM_TYPE.TIKTOK, PLATFORM_TYPE.YOUTUBE].forEach((p) => {
        if (connectedAccounts.some((a) => a.platform === p)) {
          dispatch(disconnectSocialAccount(p));
        }
      });
    }
    prevCreatorTypeRef.current = creatorType;
  }, [creatorType, connectedAccounts, dispatch]);

  useEffect(() => {
    loadConnectedAccounts();

    const onWindowFocus = () => loadConnectedAccounts();
    window.addEventListener("focus", onWindowFocus);

    return () => window.removeEventListener("focus", onWindowFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Creator Type
   */
  const handleCreatorTypeChange = (type) => {
    setValue("creatorType", type, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
    writeCreatorTypeDraft(email, type);
    onCreatorTypeChange?.(type);
    dispatch(patchOnboardingCreatorProfile({ creator_type: type }));
  };

  /**
   * Social helpers
   */
  const extractFollowerCount = (acc) => {
    const p = acc?.profile_data || {};
    const candidates = [
      p.followers,
      p.follower_count,
      p.followers_count,
      p.subscribers,
      p.subscriber_count,
      p.subscribers_count,
      p.audience,
      p.audience_size,
    ];
    const n = candidates.find((v) => typeof v === "number" && !Number.isNaN(v));
    return typeof n === "number" ? n : 0;
  };

  /**
   * Social accounts
   */
  const loadConnectedAccounts = async () => {
    const result = await dispatch(getSocialAccounts());
    if (getSocialAccounts.rejected.match(result)) {
      setConnectedAccounts([]);
      setValue("socialPlatforms", [], { shouldValidate: true });
      return [];
    }
    const payload = result.payload;
    if (!payload?.success) {
      setConnectedAccounts([]);
      setValue("socialPlatforms", [], { shouldValidate: true });
      return [];
    }

    const accountsRaw = Array.isArray(payload.data) ? payload.data : [];
    const normalizedAccounts = accountsRaw
      .filter((acc) => acc?.platform)
      .map((acc) => ({
        ...acc,
        platform: String(acc.platform).toUpperCase(),
      }));

    const activeAccounts = normalizedAccounts.filter((acc) => acc?.is_active !== false);
    const removedByAdmin = normalizedAccounts.filter(
      (acc) => acc?.is_active === false && acc?.removed_by_admin
    );

    const removedMessages = removedByAdmin.reduce((map, acc) => {
      map[acc.platform] =
        acc.removed_message ||
        "This account was removed as it does not meet current platform requirements.";
      return map;
    }, {});

    setRemovedPlatformMessages(removedMessages);
    setConnectedAccounts(activeAccounts);

    const socialPlatformsRaw = activeAccounts.map((acc) => ({
      platform: acc.platform,
      username:
        acc?.profile_data?.username ||
        acc?.profile_data?.handle ||
        acc?.profile_data?.name ||
        "connected",
      followerCount: extractFollowerCount(acc),
    }));

    setValue("socialPlatforms", socialPlatformsRaw, { shouldValidate: true });
    return activeAccounts;
  };

  const pollConnectedAccounts = async (attempts = 18, intervalMs = 5000) => {
    for (let i = 0; i < attempts; i++) {
      await loadConnectedAccounts();
      await wait(intervalMs);
    }
  };

  const pollUntilPlatformConnected = async (targetPlatform, attempts = 18, intervalMs = 5000) => {
    for (let i = 0; i < attempts; i++) {
      const accounts = await loadConnectedAccounts();
      const connected = accounts.some((a) => a.platform === targetPlatform);
      if (connected) return true;
      await wait(intervalMs);
    }
    return false;
  };

  const waitForFocusAndCheckPlatform = (targetPlatform, timeoutMs = 20000) =>
    new Promise((resolve) => {
      let settled = false;

      const finalize = (value) => {
        if (settled) return;
        settled = true;
        window.removeEventListener("focus", onFocus);
        clearTimeout(timeoutId);
        resolve(value);
      };

      const onFocus = async () => {
        const accounts = await loadConnectedAccounts();
        const connected = accounts.some((a) => a.platform === targetPlatform);
        finalize(connected);
      };

      const timeoutId = setTimeout(() => finalize(false), timeoutMs);
      window.addEventListener("focus", onFocus);
    });

  const isPlatformConnected = (platform) => connectedAccounts.some((a) => a.platform === platform);

  const getConnectedAccountData = (platform) =>
    connectedAccounts.find((a) => a.platform === platform);

  const handleConnectSocialAccounts = async (platform) => {
    if (socialConnectLoadingMap?.[platform]) return;
    setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: true }));
    try {
      const result = await openPhylloConnect();
      setConnectionLink(result);
      await Promise.race([
        pollUntilPlatformConnected(platform),
        waitForFocusAndCheckPlatform(platform),
      ]);
    } finally {
      setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: false }));
    }
  };

  /**
   * Profile photo upload
   */
  const validateImageFile = (file) => {
    if (!file) return { ok: false, reason: "No file selected" };
    const isValidType = file.type === "image/jpeg" || file.type === "image/png";
    if (!isValidType) return { ok: false, reason: "Only JPG or PNG allowed" };
    const isValidSize = file.size <= 5 * 1024 * 1024;
    if (!isValidSize) return { ok: false, reason: "Max size is 5MB" };
    return { ok: true };
  };

  const createPreview = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });

  const uploadProfilePhoto = async (file) => {
    setProfilePhotoLoading(true);
    const result = await dispatch(uploadSingleFile({ file, folder: "creator" }));
    setProfilePhotoLoading(false);
    if (uploadSingleFile.fulfilled.match(result)) {
      return result.payload?.url || null;
    }
    return null;
  };

  const handleFileUpload = async (file) => {
    const validation = validateImageFile(file);
    if (!validation.ok) return;

    setValue("profilePhoto", file, { shouldValidate: true });

    const preview = await createPreview(file);
    setProfilePhotoPreview(preview);

    const uploadedUrl = await uploadProfilePhoto(file);
    if (uploadedUrl) setProfilePhotoUrl(uploadedUrl);
  };

  const handlePhotoUpload = () => fileInputRef.current?.click();

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileUpload(file);
  };

  const handleRemoveProfilePhoto = () => {
    setProfilePhotoUrl(null);
    setProfilePhotoPreview(null);
    setValue("profilePhoto", null, { shouldValidate: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /**
   * Covers (mini profile pictures) - KEEP ARRAY LENGTH 3 ALWAYS
   */
  const setMiniLoading = (index, value) => {
    setMiniProfilePicturesLoading((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleMiniProfilePictureUpload = async (index) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.multiple = false;

    input.onchange = async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setMiniLoading(index, true);

      const result = await dispatch(uploadSingleFile({ file, folder: "creator" }));

      if (uploadSingleFile.fulfilled.match(result) && result.payload?.url) {
        const next = [...(miniProfilePictures || [null, null, null])];
        next[index] = result.payload.url;

        setValue("miniProfilePictures", next, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }

      setMiniLoading(index, false);
    };

    input.click();
  };

  const removeMiniProfilePicture = (index) => {
    const next = [...(miniProfilePictures || [null, null, null])];
    next[index] = null;

    setValue("miniProfilePictures", next, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  /**
   * Categories & keywords
   */
  const updateCategories = (categories) => {
    setValue("categories", categories, { shouldValidate: true });
  };

  const handleCategoryChange = (niches) => {
    const limited = Array.isArray(niches) ? niches.slice(0, 5) : [];
    setSelectedCategories(limited);
    setValue("categories", limited, { shouldValidate: true, shouldDirty: true });
    const prev = watch("subNiches") || [];
    const next = limited.map((niche) => {
      const found = prev.find((x) => x.niche === niche);
      return found || { niche, tags: [] };
    });
    setValue("subNiches", next, { shouldValidate: true, shouldDirty: true });
  };

  const handleCategoryRemove = (nicheToRemove) => {
    const filtered = selectedCategories.filter((n) => n !== nicheToRemove);
    setSelectedCategories(filtered);
    setValue("categories", filtered, { shouldValidate: true, shouldDirty: true });
    const sub = (watch("subNiches") || []).filter((x) => x.niche !== nicheToRemove);
    setValue("subNiches", sub, { shouldValidate: true, shouldDirty: true });
  };

  const addSubNicheTag = (niche, tag) => {
    const cleaned = String(tag || "").trim();
    if (!cleaned || cleaned.length < 2 || cleaned.length > 30) return;
    const current = watch("subNiches") || [];
    const next = current.map((row) => {
      if (row.niche !== niche) return row;
      if (row.tags.length >= 20) return row;
      if (row.tags.some((t) => String(t).toLowerCase() === cleaned.toLowerCase())) return row;
      return { ...row, tags: [...row.tags, cleaned] };
    });
    setValue("subNiches", next, { shouldValidate: true, shouldDirty: true });
  };

  const removeSubNicheTag = (niche, tagIndex) => {
    const current = watch("subNiches") || [];
    const next = current.map((row) => {
      if (row.niche !== niche) return row;
      return { ...row, tags: row.tags.filter((_, i) => i !== tagIndex) };
    });
    setValue("subNiches", next, { shouldValidate: true, shouldDirty: true });
  };

  const handleContentCharacteristicChange = (key, value) => {
    const prev = watch("contentCharacteristics") || {};
    const next = { ...prev };
    if (prev[key] === value) {
      delete next[key];
    } else {
      next[key] = value;
    }
    setValue("contentCharacteristics", next, { shouldValidate: true, shouldDirty: true });
  };

  const updateKeywordTags = (tags) => {
    setValue("keywordTags", tags, { shouldValidate: true });
  };

  const addKeywordTag = (tag) => {
    const cleaned = String(tag || "").trim();
    if (!cleaned) return;

    // length rule
    if (cleaned.length < 2 || cleaned.length > 30) return;

    // suggested max
    if (keywordTags.length >= 15) return;

    // no duplicates (case-insensitive)
    const normalized = cleaned.toLowerCase();
    const exists = keywordTags.some((t) => String(t).trim().toLowerCase() === normalized);
    if (exists) return;

    const newTags = [...keywordTags, cleaned];
    setKeywordTags(newTags);
    setValue("keywordTags", newTags, { shouldValidate: true, shouldDirty: true });
  };

  const removeKeywordTag = (index) => {
    const newTags = keywordTags.filter((_, i) => i !== index);
    setKeywordTags(newTags);
    setValue("keywordTags", newTags, { shouldValidate: true, shouldDirty: true });
  };

  /**
   * Bio handlers
   */
  const handleBioChange = (e) => {
    const next = e.target.value || "";
    if (next.length > 75) return;
    setValue("bio", next, { shouldValidate: true });
  };

  const handleLongBioChange = (e) => {
    const next = e.target.value || "";
    if (next.length > 500) return;
    setValue("longBio", next, { shouldValidate: true });
  };

  /**
   * Rates
   */
  const updateContentRates = (ratesObj, customRatesArr) => {
    const standardRates = Object.values(ratesObj)
      .map((rate, index) => ({
        contentType: STANDARD_CONTENT_TYPES[index],
        price: parseFloat(rate) || 0,
      }))
      .filter((item) => item.price > 0);

    const validCustomRates = (customRatesArr || [])
      .filter((r) => r?.contentType && r?.price)
      .map((r) => ({
        contentType: r.contentType,
        price: parseFloat(r.price) || 0,
      }))
      .filter((r) => r.price > 0);

    const allRates = [...standardRates, ...validCustomRates];
    setValue("contentRates", allRates, { shouldValidate: true });
  };

  const handleRateChange = (index, value) => {
    const newRates = { ...contentRates, [index]: value };
    setContentRates(newRates);
    updateContentRates(newRates, customRates);
  };

  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx] = { ...updated[idx], [field]: value };
    setCustomRates(updated);
    updateContentRates(contentRates, updated);
  };

  const addCustomRateRow = () => {
    setCustomRates((prev) => [...prev, { contentType: "", price: "" }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    const safe = updated.length ? updated : [{ contentType: "", price: "" }];
    setCustomRates(safe);
    updateContentRates(contentRates, safe);
  };

  /**
   * Submit
   */
  const onSubmit = async (values) => {
    const socialPlatforms = (values.socialPlatforms || []).map(({ platform, username }) => ({
      platform,
      username,
    }));
    const chars = values.contentCharacteristics || {};
    const hasChars = Object.values(chars).some((v) => v != null && String(v).length > 0);
    const subNichesPayload = (values.subNiches || []).filter(
      (row) => row?.niche && Array.isArray(row.tags) && row.tags.length > 0
    );

    const payload = {
      creatorType: values.creatorType ?? CAMPAIGN_TYPE.UGC,
      profilePhotoUrl,
      miniProfilePictures: (values.miniProfilePictures || []).filter(Boolean),
      bio: (values.bio || "").trim(),
      longBio: (values.longBio || "").trim(),
      socialPlatforms,
      categories: values.categories || [],
      keywordTags: values.keywordTags || [],
      contentRates: values.contentRates,
      subNiches: subNichesPayload.length ? subNichesPayload : undefined,
      contentCharacteristics: hasChars ? chars : undefined,
    };

    const response = await dispatch(setupCreatorProfile({ payload, email }));
    if (response.payload?.success) {
      const savedType =
        response.payload?.data?.creator_profile?.creator_type ||
        response.payload?.data?.creator_profile?.creatorType ||
        payload.creatorType;
      writeCreatorTypeDraft(email, savedType);
      onCreatorTypeChange?.(savedType);
      dispatch(
        patchOnboardingCreatorProfile({
          profile_photo_url: profilePhotoUrl,
          mini_profile_pictures: payload.miniProfilePictures,
          bio: payload.bio,
          long_bio: payload.longBio,
          categories: payload.categories,
          keyword_tags: payload.keywordTags,
          content_rates: payload.contentRates,
          sub_niches: payload.subNiches,
          content_characteristics: payload.contentCharacteristics,
          social_platforms: socialPlatforms,
          ...(response.payload?.data?.creator_profile || {}),
          creator_type: savedType,
        })
      );
      writeProfileSetupDraft(email, {
        formValues: {
          ...values,
          profilePhoto: profilePhotoUrl,
          miniProfilePictures: values.miniProfilePictures,
        },
        profilePhotoUrl,
        profilePhotoPreview,
        selectedCategories,
        keywordTags,
        contentRates,
        customRates,
      });
      onNext?.();
      dispatch(resetAuth());
      if (email) {
        dispatch(getOnboardingStatus(email));
      }
    }
  };

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
  };

  return {
    // form
    handleSubmit,
    errors,
    handleFormSubmit,
    isDirty,
    isLoading: authLoading || isSubmitting || uploadState?.isLoading,

    // onboarding info
    name,

    // creator type
    creatorType,
    handleCreatorTypeChange,

    // profile photo
    fileInputRef,
    profilePhotoPreview,
    profilePhotoLoading,
    onFileChange,
    handlePhotoUpload,
    handleFileUpload,
    handleRemoveProfilePhoto,

    // covers
    miniProfilePictures,
    miniProfilePicturesLoading,
    handleMiniProfilePictureUpload,
    removeMiniProfilePicture,

    // text fields
    bio,
    longBio,
    handleBioChange,
    handleLongBioChange,

    // social
    platforms,
    connectedAccounts,
    isPlatformConnected,
    getConnectedAccountData,
    handleConnectSocialAccounts,
    loadConnectedAccounts,
    socialConnectLoadingMap,
    removedPlatformMessages,

    // categories/keywords
    selectedCategories,
    handleCategoryChange,
    handleCategoryRemove,
    keywordTags,
    addKeywordTag,
    removeKeywordTag,

    subNichesForm,
    addSubNicheTag,
    removeSubNicheTag,

    contentCharacteristics,
    handleContentCharacteristicChange,

    // rates
    contentRates,
    customRates,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,

    // connection link
    connectionLink,
    setConnectionLink,
    isConnectionLinkCopied,
    handleCopyConnectionLink,
  };
}
