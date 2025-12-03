"use client";

import { getOnboardingEmail, getOnboardingName } from "@/common/utils/users.util";
import { reset } from "@/provider/features/auth/auth.slice";
import { setupCreatorProfile } from "@/provider/features/creator-profile/creator-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  profilePhoto: Yup.mixed().required("Profile photo is required"),
  bio: Yup.string().max(200, "Bio must be less than 200 characters"),
  // socialPlatforms: Yup.array()
  //   .min(1, "At least one social platform is required")
  //   .of(
  //     Yup.object().shape({
  //       platform: Yup.string().required(),
  //       username: Yup.string().required("Username is required"),
  //     })
  //   ),
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

  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformUsernames, setPlatformUsernames] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [bio, setBio] = useState("");
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);

  const fileInputRef = useRef(null);

  const platforms = ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook"];

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
        console.error("File size too large. Maximum 5MB allowed.");
      }
    } else {
      console.error("Invalid file type. Only JPG and PNG are allowed.");
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

  const togglePlatform = (platform) => {
    const newSelectedPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(newSelectedPlatforms);
    updateSocialPlatforms(newSelectedPlatforms, platformUsernames);
  };

  const handleUsernameChange = (platform, username) => {
    const newUsernames = { ...platformUsernames, [platform]: username };
    setPlatformUsernames(newUsernames);
    updateSocialPlatforms(selectedPlatforms, newUsernames);
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

  const updateSocialPlatforms = (platforms, usernames) => {
    const socialPlatforms = platforms
      .map((platform) => ({
        platform,
        username: usernames[platform] || "",
      }))
      .filter((item) => item.username.trim() !== "");

    setValue("socialPlatforms", socialPlatforms);
    return socialPlatforms;
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
    const socialPlatforms =
      values.socialPlatforms && values.socialPlatforms.length > 0
        ? values.socialPlatforms
        : [
            {
              platform: "Instagram",
              username: "not_connected",
            },
          ];

    const payload = {
      profilePhotoUrl,
      bio: values.bio.trim(),
      socialPlatforms,
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
    // Social platforms
    platforms,
    selectedPlatforms,
    platformUsernames,
    togglePlatform,
    handleUsernameChange,
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
