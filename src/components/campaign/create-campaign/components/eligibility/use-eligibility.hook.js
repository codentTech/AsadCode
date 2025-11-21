"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const LANGUAGES = [
  "English",
  "Spanish",
  "French",
  "German",
  "Italian",
  "Portuguese",
  "Japanese",
  "Korean",
  "Mandarin",
  "Hindi",
  "Arabic",
  "Dutch",
  "Swedish",
  "Norwegian",
  "Russian",
  "Polish",
  "Turkish",
  "Urdu",
];

export default function useEligibility({ campaignData, handleChange, setValue }) {
  const [languageSearch, setLanguageSearch] = useState(campaignData?.creator_language || "");
  const [selectedCountry, setSelectedCountry] = useState(() => {
    if (!campaignData?.creator_country_code) return null;
    return {
      countryName: campaignData.creator_country,
      countryCode: campaignData.creator_country_code,
      phoneCode: campaignData.creator_country_phone_code,
    };
  });
  const [selectedCity, setSelectedCity] = useState(() => {
    if (!campaignData?.creator_city) return null;
    return {
      cityName: campaignData.creator_city,
      // countryCode:
      //   campaignData.creator_city_country_code || campaignData.creator_country_code || "",
      // region: campaignData.creator_city_region || "",
      // geonameId: campaignData.creator_city_geoname_id || null,
      // latitude: campaignData.creator_city_latitude ?? null,
      // longitude: campaignData.creator_city_longitude ?? null,
    };
  });

  useEffect(() => {
    setLanguageSearch(campaignData?.creator_language || "");
  }, [campaignData?.creator_language]);

  useEffect(() => {
    if (campaignData?.creator_country_code) {
      setSelectedCountry({
        countryName: campaignData.creator_country,
        countryCode: campaignData.creator_country_code,
        phoneCode: campaignData.creator_country_phone_code,
      });
    } else {
      setSelectedCountry(null);
    }
  }, [
    campaignData?.creator_country,
    campaignData?.creator_country_code,
    campaignData?.creator_country_phone_code,
  ]);

  useEffect(() => {
    if (campaignData?.creator_city) {
      setSelectedCity({
        cityName: campaignData.creator_city,
        countryCode:
          campaignData.creator_city_country_code || campaignData.creator_country_code || "",
        region: campaignData.creator_city_region || "",
        geonameId: campaignData.creator_city_geoname_id || null,
        latitude: campaignData.creator_city_latitude ?? null,
        longitude: campaignData.creator_city_longitude ?? null,
      });
    } else {
      setSelectedCity(null);
    }
  }, [
    campaignData?.creator_city,
    campaignData?.creator_city_country_code,
    campaignData?.creator_city_region,
    campaignData?.creator_city_geoname_id,
    campaignData?.creator_city_latitude,
    campaignData?.creator_city_longitude,
    campaignData?.creator_country_code,
  ]);

  const filteredLanguages = useMemo(() => {
    if (!languageSearch) {
      return LANGUAGES;
    }

    const normalized = languageSearch.toLowerCase();
    return LANGUAGES.filter((language) => language.toLowerCase().includes(normalized));
  }, [languageSearch]);

  const handleLanguageInputChange = useCallback(
    (nextValue) => {
      setLanguageSearch(nextValue);
      if (!nextValue) {
        handleChange({ target: { name: "creator_language", value: "" } });
      }
    },
    [handleChange]
  );

  const handleLanguageSelect = useCallback(
    (language) => {
      handleChange({ target: { name: "creator_language", value: language } });
      setLanguageSearch(language);
    },
    [handleChange]
  );

  const normalizedSelectedLanguage = (campaignData?.creator_language || "").trim().toLowerCase();
  const showLanguageOptions =
    Boolean(languageSearch) && languageSearch.trim().toLowerCase() !== normalizedSelectedLanguage;

  const handleCountrySelect = useCallback(
    (selection) => {
      const nextCountryName = selection?.countryName || "";
      const nextCountryCode = selection?.countryCode || "";
      const nextPhoneCode = selection?.phoneCode || "";

      setValue("creator_country", nextCountryName, { shouldValidate: true, shouldDirty: true });
      setValue("creator_country_code", nextCountryCode, {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("creator_country_phone_code", nextPhoneCode, {
        shouldValidate: false,
        shouldDirty: true,
      });

      setSelectedCountry(selection ? { ...selection } : null);

      setValue("creator_city", "", { shouldValidate: true, shouldDirty: true });
      setValue("creator_city_country_code", "", { shouldValidate: false, shouldDirty: true });
      setValue("creator_city_region", "", { shouldValidate: false, shouldDirty: true });
      setValue("creator_city_geoname_id", null, { shouldValidate: false, shouldDirty: true });
      setValue("creator_city_latitude", null, { shouldValidate: false, shouldDirty: true });
      setValue("creator_city_longitude", null, { shouldValidate: false, shouldDirty: true });
      setSelectedCity(null);
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (selection) => {
      const nextCityName = selection?.cityName || "";
      setValue("creator_city", nextCityName, { shouldValidate: true, shouldDirty: true });
      setValue("creator_city_country_code", selection?.countryCode || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("creator_city_region", selection?.region || "", {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("creator_city_geoname_id", selection?.geonameId || null, {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("creator_city_latitude", selection?.latitude ?? null, {
        shouldValidate: false,
        shouldDirty: true,
      });
      setValue("creator_city_longitude", selection?.longitude ?? null, {
        shouldValidate: false,
        shouldDirty: true,
      });

      setSelectedCity(selection ? { ...selection } : null);
    },
    [setValue]
  );

  const countrySelectValue = selectedCountry;
  const citySelectValue = selectedCity;
  const isCityDisabled = !selectedCountry?.countryCode;

  return {
    languageSearch,
    filteredLanguages,
    handleLanguageInputChange,
    handleLanguageSelect,
    showLanguageOptions,
    countrySelectValue,
    handleCountrySelect,
    citySelectValue,
    handleCitySelect,
    isCityDisabled,
  };
}
