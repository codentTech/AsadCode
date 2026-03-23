"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createApplication } from "@/provider/features/creator-applications/creator-applications.slice";
import useGetplatform from "@/common/hooks/use-social-platform.hook";

const validationSchema = yup.object().shape({
  full_name: yup.string().required("Full name is required"),
  email: yup.string().email("Invalid email address").required("Email is required"),
  country: yup.string().required("Country is required"),
  primary_social_links: yup
    .array()
    .of(
      yup.object().shape({
        platform: yup.string().required(),
        url: yup.string().url("Invalid URL").required("URL is required"),
      })
    )
    .min(1, "At least one primary social media link is required"),
  additional_links: yup.array().of(
    yup.object().shape({
      url: yup.string().url("Invalid URL").optional(),
    })
  ),
});

export default function useCreatorApplication({ onSuccess }) {
  const dispatch = useDispatch();
  const { isLoading, isError, message } = useSelector(
    (state) => state.creatorApplications.createApplication
  );
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [socialLinkInputs, setSocialLinkInputs] = useState({
    instagram: "",
    tiktok: "",
    youtube: "",
  });
  const [additionalLinkInput, setAdditionalLinkInput] = useState("");
  const { getPlatformIcon } = useGetplatform();

  const socialPlatforms = [
    {
      key: "instagram",
      label: "Instagram",
      placeholder: "https://instagram.com/username",
    },
    {
      key: "tiktok",
      label: "TikTok",
      placeholder: "https://tiktok.com/@username",
    },
    {
      key: "youtube",
      label: "YouTube",
      placeholder: "https://youtube.com/@username",
    },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      full_name: "",
      email: "",
      country: "",
      primary_social_links: [],
      additional_links: [],
    },
  });

  const primarySocialLinks = watch("primary_social_links") || [];
  const additionalLinks = watch("additional_links") || [];

  const addPrimarySocialLink = (platform, url) => {
    const currentLinks = watch("primary_social_links") || [];
    const existingIndex = currentLinks.findIndex((link) => link.platform === platform);

    if (existingIndex >= 0) {
      const updated = [...currentLinks];
      updated[existingIndex] = { platform, url };
      setValue("primary_social_links", updated, { shouldValidate: true });
    } else {
      setValue("primary_social_links", [...currentLinks, { platform, url }], {
        shouldValidate: true,
      });
    }
  };

  const removePrimarySocialLink = (platform) => {
    const currentLinks = watch("primary_social_links") || [];
    setValue(
      "primary_social_links",
      currentLinks.filter((link) => link.platform !== platform),
      { shouldValidate: true }
    );
  };

  const addAdditionalLink = (url) => {
    const currentLinks = watch("additional_links") || [];
    if (url && !currentLinks.some((link) => link.url === url)) {
      setValue("additional_links", [...currentLinks, { url }], { shouldValidate: true });
    }
  };

  const removeAdditionalLink = (index) => {
    const currentLinks = watch("additional_links") || [];
    setValue(
      "additional_links",
      currentLinks.filter((_, i) => i !== index),
      { shouldValidate: true }
    );
  };

  const handleCountrySelect = (country) => {
    if (!country) {
      setSelectedCountry(null);
      setValue("country", "", { shouldValidate: true });
      return;
    }

    const normalizedCountry = {
      name: country.countryName || country.label || country.name || "",
      code: country.countryCode || country.value || country.code || "",
    };

    setSelectedCountry(normalizedCountry);
    setValue("country", normalizedCountry.name, { shouldValidate: true });
  };

  const handleSocialLinkChange = (platform, url) => {
    setSocialLinkInputs((prev) => ({ ...prev, [platform]: url }));
    if (url.trim()) {
      addPrimarySocialLink(platform, url.trim());
    } else {
      removePrimarySocialLink(platform);
    }
  };

  const handleAddAdditionalLink = () => {
    if (additionalLinkInput.trim()) {
      addAdditionalLink(additionalLinkInput.trim());
      setAdditionalLinkInput("");
    }
  };

  const onSubmit = async (data) => {
    const payload = {
      full_name: data.full_name,
      email: data.email,
      country: data.country,
      primary_social_links: data.primary_social_links || [],
      additional_links: (data.additional_links || [])
        .filter((link) => link.url && link.url.trim())
        .map((link) => link.url),
    };

    const response = await dispatch(createApplication(payload));
    if (createApplication.fulfilled.match(response)) {
      if (response.payload?.success || response.payload?.statusCode === 201) {
        onSuccess?.();
      }
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    watch,
    isLoading,
    isError,
    message,
    primarySocialLinks,
    additionalLinks,
    addPrimarySocialLink,
    removePrimarySocialLink,
    addAdditionalLink,
    removeAdditionalLink,
    selectedCountry,
    socialLinkInputs,
    additionalLinkInput,
    setSelectedCountry,
    setSocialLinkInputs,
    setAdditionalLinkInput,
    handleCountrySelect,
    handleSocialLinkChange,
    handleAddAdditionalLink,
    socialPlatforms,
    getPlatformIcon,
  };
}
