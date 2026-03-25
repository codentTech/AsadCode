"use client";

import { CAMPAIGN_TYPE, MIN_FOLLOWERS, PLATFORM_TYPE } from "@/common/constants/campaign.constant";
import { getOnboardingEmail, getOnboardingName } from "@/common/utils/users.util";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";
import { reset as resetAuth } from "@/provider/features/auth/auth.slice";
import { setupCreatorProfile } from "@/provider/features/creator-profile/creator-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { getSocialAccounts } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

/**
 * Validation
 */
const validationSchema = Yup.object().shape({
  creatorType: Yup.string()
    .oneOf([CAMPAIGN_TYPE.UGC, CAMPAIGN_TYPE.INFLUENCER, CAMPAIGN_TYPE.HYBRID])
    .required("Creator type is required"),

  profilePhoto: Yup.mixed().required("Profile photo is required"),

  miniProfilePictures: Yup.array()
    .required("Showcase covers are required")
    .length(3, "3 showcase covers are required")
    .test("all-filled", "All 3 showcase covers are required", (arr) => {
      if (!Array.isArray(arr)) return false;
      return arr.every((x) => typeof x === "string" && x.trim().length > 0);
    }),

  bio: Yup.string()
    .required("Tagline is required")
    .max(75, "Tagline must be less than 75 characters"),

  longBio: Yup.string().max(500, "Full bio must be less than 500 characters"),

  socialPlatforms: Yup.array()
    .min(1, "At least one connected social account is required")
    .of(
      Yup.object().shape({
        platform: Yup.string().required(),
        username: Yup.string().required("Username is required"),
        followerCount: Yup.number().nullable(),
      })
    )
    .test(
      "ugc-instagram-only",
      "UGC Specialists can only connect Instagram.",
      function (socialPlatforms) {
        const { creatorType } = this.parent;
        if (creatorType !== CAMPAIGN_TYPE.UGC) return true;
        const platforms = (socialPlatforms || []).map((x) => x.platform);
        return platforms.every((p) => p === PLATFORM_TYPE.INSTAGRAM);
      }
    )
    .test(
      "min-followers-influencer-hybrid",
      `Influencer/Hybrid must connect at least one account with ${MIN_FOLLOWERS}+ followers/subscribers (and any connected platform must meet the minimum).`,
      function (socialPlatforms) {
        const { creatorType } = this.parent;
        if (creatorType === CAMPAIGN_TYPE.UGC) return true;

        const list = socialPlatforms || [];
        if (list.length === 0) return false;

        const eachMeetsMin = list.every((x) => (x.followerCount ?? 0) >= MIN_FOLLOWERS);
        if (!eachMeetsMin) return false;

        return list.some((x) => (x.followerCount ?? 0) >= MIN_FOLLOWERS);
      }
    ),

  categories: Yup.array().max(5, "Maximum 5 niches allowed"),

  keywordTags: Yup.array()
    .required("Keyword tags are required")
    .min(5, "Add at least 5 keyword tags")
    .max(15, "Suggested maximum is 15 keyword tags")
    .test("no-duplicates", "Duplicate keyword tags are not allowed", (arr) => {
      if (!Array.isArray(arr)) return false;
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
        .required("Tag is required")
    ),

  contentRates: Yup.array().of(
    Yup.object().shape({
      contentType: Yup.string().required(),
      price: Yup.number().min(0, "Price must be positive"),
    })
  ),
});

/**
 * Standard content types (kept stable order, used for rate mapping)
 */
const STANDARD_CONTENT_TYPES = [
  "Instagram Post",
  "Instagram Reel",
  "TikTok Video",
  "YouTube Short",
  "Instagram Story",
  "UGC Video",
  "YouTube Feature",
];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function useProfileSetup({ onNext }) {
  const dispatch = useDispatch();

  const email = getOnboardingEmail();
  const name = getOnboardingName();

  const { isLoading: authLoading } = useSelector((state) => state.auth);
  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);

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
      creatorType: CAMPAIGN_TYPE.UGC, // exactly one tag at all times
      profilePhoto: null,
      miniProfilePictures: [null, null, null],
      bio: "",
      longBio: "",
      socialPlatforms: [],
      categories: [],
      keywordTags: [],
      contentRates: [],
    },
  });

  const creatorType = watch("creatorType");
  const bio = watch("bio");
  const longBio = watch("longBio");
  const miniProfilePictures = watch("miniProfilePictures");

  /**
   * Local UI state
   */
  const fileInputRef = useRef(null);

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [profilePhotoLoading, setProfilePhotoLoading] = useState(false);

  const [connectedAccounts, setConnectedAccounts] = useState([]);
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

  const platforms = useMemo(
    () => [PLATFORM_TYPE.INSTAGRAM, PLATFORM_TYPE.TIKTOK, PLATFORM_TYPE.YOUTUBE],
    []
  );

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

    // enforce IG-only if switched to UGC
    if (type === CAMPAIGN_TYPE.UGC) {
      const current = watch("socialPlatforms") || [];
      const instagramOnly = current.filter((x) => x.platform === PLATFORM_TYPE.INSTAGRAM);
      setValue("socialPlatforms", instagramOnly, { shouldValidate: true, shouldDirty: true });
    }
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
    try {
      const result = await dispatch(getSocialAccounts()).unwrap();
      if (!result?.success) return [];

      const accountsRaw = Array.isArray(result.data) ? result.data : [];
      const accounts = accountsRaw
        .filter((acc) => acc?.platform)
        .map((acc) => ({
          ...acc,
          // Backend uses "instagram"/"tiktok"/"youtube"; frontend constants use "INSTAGRAM"/...
          platform: String(acc.platform).toUpperCase(),
        }));
      setConnectedAccounts(accounts);

      const socialPlatformsRaw = accounts.map((acc) => ({
          platform: acc.platform,
          username:
            acc?.profile_data?.username ||
            acc?.profile_data?.handle ||
            acc?.profile_data?.name ||
            "connected",
          followerCount: extractFollowerCount(acc),
        }));

      const socialPlatforms =
        creatorType === CAMPAIGN_TYPE.UGC
          ? socialPlatformsRaw.filter((x) => x.platform === PLATFORM_TYPE.INSTAGRAM)
          : socialPlatformsRaw;

      setValue("socialPlatforms", socialPlatforms, { shouldValidate: true });
      return accounts;
    } catch (e) {
      // silent by design
      return [];
    }
  };

  const pollConnectedAccounts = async (attempts = 18, intervalMs = 5000) => {
    for (let i = 0; i < attempts; i++) {
      await loadConnectedAccounts();
      await wait(intervalMs);
    }
  };

  const pollUntilPlatformConnected = async (
    targetPlatform,
    attempts = 18,
    intervalMs = 5000
  ) => {
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

  const isPlatformConnected = (platform) =>
    connectedAccounts.some((a) => a.platform === platform);

  const getConnectedAccountData = (platform) =>
    connectedAccounts.find((a) => a.platform === platform);

  const handleConnectSocialAccounts = async (platform) => {
    if (creatorType === CAMPAIGN_TYPE.UGC && platform !== PLATFORM_TYPE.INSTAGRAM) return;
    if (socialConnectLoadingMap?.[platform]) return;
    setSocialConnectLoadingMap((prev) => ({ ...prev, [platform]: true }));
    try {
      await openPhylloConnect();
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
    try {
      setProfilePhotoLoading(true);
      const response = await dispatch(uploadSingleFile({ file, folder: "creator" })).unwrap();
      return response?.url || null;
    } catch (e) {
      return null;
    } finally {
      setProfilePhotoLoading(false);
    }
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

      try {
        const response = await dispatch(uploadSingleFile({ file, folder: "creator" })).unwrap();

        if (response?.url) {
          const next = [...(miniProfilePictures || [null, null, null])];
          next[index] = response.url;

          setValue("miniProfilePictures", next, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
        }
      } catch (err) {
        // silent by design
      } finally {
        setMiniLoading(index, false);
      }
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
  };

  const handleCategoryRemove = (nicheToRemove) => {
    const filtered = selectedCategories.filter((n) => n !== nicheToRemove);
    setSelectedCategories(filtered);
    setValue("categories", filtered, { shouldValidate: true, shouldDirty: true });
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
    const payload = {
      creatorType: values.creatorType,
      profilePhotoUrl,
      miniProfilePictures: (values.miniProfilePictures || []).filter(Boolean),
      bio: values.bio.trim(),
      longBio: values.longBio.trim(),
      socialPlatforms: values.socialPlatforms,
      categories: values.categories,
      keywordTags: values.keywordTags,
      contentRates: values.contentRates,
    };

    const response = await dispatch(setupCreatorProfile({ payload, email }));
    if (response.payload?.success) {
      onNext?.();
      resetForm();
      dispatch(resetAuth());
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

    // categories/keywords
    selectedCategories,
    handleCategoryChange,
    handleCategoryRemove,
    keywordTags,
    addKeywordTag,
    removeKeywordTag,

    // rates
    contentRates,
    customRates,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
  };
}
