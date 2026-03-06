"use client";

import { getOnboardingEmail, getOnboardingName } from "@/common/utils/users.util";
import { reset } from "@/provider/features/auth/auth.slice";
import { setupCreatorProfile } from "@/provider/features/creator-profile/creator-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { getSocialAccounts } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import usePhylloConnect from "@/components/social-connect/use-phyllo-connect.hook";
import { KNOWN_PLATFORMS } from "@/common/constants/genaric.constant";

const validationSchema = Yup.object().shape({
  profilePhoto: Yup.mixed().required("Profile photo is required"),
  bio: Yup.string().max(100, "Bio must be less than 100 characters"),
  socialPlatforms: Yup.array()
    .min(1, "At least one connected social account is required")
    .of(
      Yup.object().shape({
        platform: Yup.string().required(),
        username: Yup.string().required("Username is required"),
      })
    ),
  categories: Yup.array()
    .min(1, "At least one category is required")
    .max(5, "Maximum 5 categories allowed"),
  keywordTags: Yup.array().of(Yup.string()),
  contentRates: Yup.array().of(
    Yup.object().shape({
      contentType: Yup.string().required(),
      price: Yup.number().min(0, "Price must be positive"),
    })
  ),
});

export default function useProfileSetup({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();
  const name = getOnboardingName();

  const { isLoading } = useSelector((state) => state.auth);
  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);

  const { openConnect: openPhylloConnect } = usePhylloConnect();

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [bio, setBio] = useState("");
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);

  const fileInputRef = useRef(null);

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      bio: "",
      socialPlatforms: [],
      categories: [],
      keywordTags: [],
      contentRates: [],
    },
  });

  const loadConnectedAccounts = async () => {
    try {
      const result = await dispatch(getSocialAccounts()).unwrap();
      if (result?.success) {
        const accounts = Array.isArray(result.data) ? result.data : [];
        setConnectedAccounts(accounts);

        const socialPlatforms = accounts
          .filter((acc) => acc?.platform)
          .map((acc) => ({
            platform: acc.platform,
            username:
              acc?.profile_data?.username ||
              acc?.profile_data?.handle ||
              acc?.profile_data?.name ||
              "connected",
          }));

        setValue("socialPlatforms", socialPlatforms, { shouldValidate: true });
      }
    } catch (error) {}
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const pollConnectedAccounts = async (attempts = 18, intervalMs = 5000) => {
    for (let i = 0; i < attempts; i++) {
      await loadConnectedAccounts();
      await wait(intervalMs);
    }
  };

  useEffect(() => {
    loadConnectedAccounts();

    const onWindowFocus = () => {
      loadConnectedAccounts();
    };

    window.addEventListener("focus", onWindowFocus);

    return () => {
      window.removeEventListener("focus", onWindowFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileUpload = async (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 5 * 1024 * 1024) {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setValue("profilePhoto", file);

        // Upload photo immediately
        const uploadedUrl = await uploadProfilePhoto(file);
        if (uploadedUrl) {
          setProfilePhotoUrl(uploadedUrl);
        }
      } else {
      }
    } else {
    }
  };

  const uploadProfilePhoto = async (file) => {
    const response = await dispatch(
      uploadSingleFile({
        file,
        folder: "creator",
      })
    );

    if (response.payload?.url) {
      return response.payload.url;
    }
    return null;
  };

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleConnectSocialAccounts = async () => {
    await openPhylloConnect();
    // Webhook ingestion can lag while user finishes Connect flow.
    // Poll briefly so UI reflects newly linked accounts without manual refresh.
    await pollConnectedAccounts();
  };

  const handleCategoryChange = (niches) => {
    const limited = Array.isArray(niches) ? niches.slice(0, 5) : [];
    setSelectedCategories(limited);
    updateCategories(limited);
  };

  const handleCategoryRemove = (nicheToRemove) => {
    const filtered = selectedCategories.filter((niche) => niche !== nicheToRemove);
    setSelectedCategories(filtered);
    updateCategories(filtered);
  };

  const addKeywordTag = (tag) => {
    if (tag.trim() && !keywordTags.includes(tag.trim())) {
      const newTags = [...keywordTags, tag.trim()];
      setKeywordTags(newTags);
      updateKeywordTags(newTags);
    }
  };

  const removeKeywordTag = (index) => {
    const newTags = keywordTags.filter((_, i) => i !== index);
    setKeywordTags(newTags);
    updateKeywordTags(newTags);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleRateChange = (index, value) => {
    const newRates = { ...contentRates, [index]: value };
    setContentRates(newRates);
    updateContentRates(Object.values(newRates), customRates);
  };

  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx][field] = value;
    setCustomRates(updated);
    updateContentRates(Object.values(contentRates), updated);
  };

  const addCustomRateRow = () => {
    setCustomRates([...customRates, { contentType: "", price: "" }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    setCustomRates(updated.length ? updated : [{ contentType: "", price: "" }]);
    updateContentRates(
      Object.values(contentRates),
      updated.length ? updated : [{ contentType: "", price: "" }]
    );
  };

  const isPlatformConnected = (platform) => {
    return connectedAccounts.some((account) => account.platform === platform);
  };

  const getConnectedAccountData = (platform) => {
    return connectedAccounts.find((account) => account.platform === platform);
  };

  const updateCategories = (categories) => {
    setValue("categories", categories);
    return categories;
  };

  const updateKeywordTags = (tags) => {
    setValue("keywordTags", tags);
    return tags;
  };

  const updateContentRates = (rates, customRates = []) => {
    const standardRates = rates
      .map((rate, index) => ({
        contentType: getStandardContentTypes()[index],
        price: parseFloat(rate) || 0,
      }))
      .filter((item) => item.price > 0);

    const validCustomRates = customRates.filter((rate) => rate.contentType && rate.price > 0);

    const allRates = [...standardRates, ...validCustomRates];
    setValue("contentRates", allRates);
    return allRates;
  };

  const getStandardContentTypes = () => [
    "Instagram Post",
    "Instagram Reel",
    "TikTok Video",
    "YouTube Short",
    "Instagram Story",
    "UGC Video",
    "YouTube Feature",
  ];

  const handleFormSubmit = async (data) => {
    data.bio = bio;
    await onSubmit(data);
  };

  const onSubmit = async (values) => {
    const payload = {
      profilePhotoUrl,
      bio: values.bio.trim(),
      socialPlatforms: values.socialPlatforms,
      categories: values.categories,
      keywordTags: values.keywordTags,
      contentRates: values.contentRates,
    };

    const response = await dispatch(setupCreatorProfile({ payload, email }));
    if (response.payload.success) {
      onNext();
      resetForm();
      dispatch(reset());
    }
  };

  return {
    handleSubmit,
    errors,
    handleFormSubmit,
    isLoading: isLoading || isSubmitting || uploadState.isLoading,
    // File upload
    handleFileUpload,
    onFileChange,
    handlePhotoUpload,
    fileInputRef,
    profilePhotoPreview,
    // Social platforms (Phyllo-backed)
    platforms: KNOWN_PLATFORMS,
    connectedAccounts,
    isPlatformConnected,
    getConnectedAccountData,
    handleConnectSocialAccounts,
    loadConnectedAccounts,
    // Categories
    selectedCategories,
    handleCategoryChange,
    handleCategoryRemove,
    // Keywords
    keywordTags,
    addKeywordTag,
    removeKeywordTag,
    // Bio
    bio,
    handleBioChange,
    // Content rates
    contentRates,
    customRates,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    name,
  };
}
