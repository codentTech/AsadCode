"use client";

import { getOnboardingEmail } from "@/common/utils/users.util";
import { reset } from "@/provider/features/auth/auth.slice";
import { setupCreatorProfile } from "@/provider/features/creator-profile/creator-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  profilePhoto: Yup.mixed().required("Profile photo is required"),
  bio: Yup.string().max(200, "Bio must be less than 200 characters"),
  socialPlatforms: Yup.array()
    .min(1, "At least one social platform is required")
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

  const { isLoading, updateProfile: updateProfileState } = useSelector((state) => state.auth);
  const { isSuccess, isError, message } = updateProfileState || {};

  const [profilePhotoFile, setProfilePhotoFile] = useState(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    getValues,
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

  const handleFileUpload = (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setProfilePhotoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfilePhotoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setValue("profilePhoto", file);
      } else {
        console.error("File size too large. Maximum 5MB allowed.");
      }
    } else {
      console.error("Invalid file type. Only JPG and PNG are allowed.");
    }
  };

  const uploadProfilePhoto = async (file) => {
    // This would typically upload to your file storage service
    // For now, returning a mock URL
    const formData = new FormData();
    formData.append("profilePhoto", file);

    // try {
    //   // Replace with your actual upload endpoint
    //   const response = await fetch("/api/upload/profile-photo", {
    //     method: "POST",
    //     body: formData,
    //   });

    //   if (!response.ok) {
    //     throw new Error("Upload failed");
    //   }

    //   const data = await response.json();
    //   return data.url;
    // } catch (error) {
    //   console.error("Photo upload error:", error);
    //   // Return mock URL for development
    //   return `https://example.com/profile-photos/${Date.now()}.jpg`;
    // }
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

  const onSubmit = async (values) => {
    try {
      let profilePhotoUrl = null;

      //   if (profilePhotoFile) {
      //     profilePhotoUrl = await uploadProfilePhoto(profilePhotoFile);
      //   }

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
    } catch (error) {
      console.error("Form submission error:", error.message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch,
    setValue,
    getValues,
    isLoading: isLoading || isSubmitting,
    isError,
    errorMessage: message,
    resetForm,
    // File upload methods
    handleFileUpload,
    profilePhotoFile,
    profilePhotoPreview,
    // Helper methods for updating form data
    updateSocialPlatforms,
    updateCategories,
    updateKeywordTags,
    updateContentRates,
    getStandardContentTypes,
  };
}
