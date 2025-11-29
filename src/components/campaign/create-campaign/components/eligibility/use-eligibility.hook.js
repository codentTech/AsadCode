"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { REQUIREMENT_LEVEL } from "@/common/constants/campaign.constant";

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
  const [countrySelectValueForMulti, setCountrySelectValueForMulti] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(() => {
    // Use first country from creator_countries array if available
    if (
      campaignData?.creator_countries &&
      Array.isArray(campaignData.creator_countries) &&
      campaignData.creator_countries.length > 0
    ) {
      const firstCountry = campaignData.creator_countries[0];
      return {
        countryName: firstCountry.country,
        countryCode: firstCountry.countryCode,
        phoneCode: firstCountry.phoneCode || "",
      };
    }
    return null;
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
    // Update selectedCountry from creator_countries array for city selector
    if (
      campaignData?.creator_countries &&
      Array.isArray(campaignData.creator_countries) &&
      campaignData.creator_countries.length > 0
    ) {
      const firstCountry = campaignData.creator_countries[0];
      setSelectedCountry({
        countryName: firstCountry.country,
        countryCode: firstCountry.countryCode,
        phoneCode: firstCountry.phoneCode || "",
      });
    } else {
      setSelectedCountry(null);
    }
  }, [campaignData?.creator_countries]);

  useEffect(() => {
    if (campaignData?.creator_city) {
      setSelectedCity({
        cityName: campaignData.creator_city,
        countryCode:
          campaignData.creator_city_country_code ||
          campaignData?.creator_countries?.[0]?.countryCode ||
          "",
        region: campaignData.creator_city_region || "",
        geonameId: campaignData.creator_city_geoname_id || null,
      });
    } else {
      setSelectedCity(null);
    }
  }, [
    campaignData?.creator_city,
    campaignData?.creator_city_country_code,
    campaignData?.creator_city_region,
    campaignData?.creator_city_geoname_id,
    campaignData?.creator_countries,
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

  // Legacy handleCountrySelect - kept for backward compatibility but not used for multi-country
  const handleCountrySelect = useCallback((selection) => {
    // This is no longer used since we use multi-country selection
    // Keeping for backward compatibility
    if (selection) {
      setSelectedCountry(selection ? { ...selection } : null);
    }
  }, []);

  // Handle multi-country selection
  const handleCountriesChange = useCallback(
    (countries) => {
      // Update creator_countries array
      setValue("creator_countries", countries, { shouldValidate: true, shouldDirty: true });

      // Update selectedCountry for city selector (use first country)
      if (countries && countries.length > 0) {
        const firstCountry = countries[0];
        setSelectedCountry({
          countryName: firstCountry.country,
          countryCode: firstCountry.countryCode,
          phoneCode: firstCountry.phoneCode || "",
        });
      } else {
        setSelectedCountry(null);
      }

      // Clear city if countries change
      if (countries && countries.length > 0) {
        const firstCountryCode = countries[0].countryCode;
        // Only clear city if it doesn't match any selected country
        const cityCountryCode = campaignData?.creator_city_country_code;
        if (cityCountryCode && !countries.some((c) => c.countryCode === cityCountryCode)) {
          setValue("creator_city", "", { shouldValidate: true, shouldDirty: true });
          setValue("creator_city_country_code", "", { shouldValidate: false, shouldDirty: true });
          setSelectedCity(null);
        }
      } else {
        setValue("creator_city", "", { shouldValidate: true, shouldDirty: true });
        setValue("creator_city_country_code", "", { shouldValidate: false, shouldDirty: true });
        setSelectedCity(null);
      }
    },
    [setValue, campaignData?.creator_city_country_code]
  );

  // Initialize countries from campaignData
  const selectedCountries = useMemo(() => {
    if (campaignData?.creator_countries && Array.isArray(campaignData.creator_countries)) {
      return campaignData.creator_countries;
    }
    return [];
  }, [campaignData?.creator_countries]);

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

      setSelectedCity(selection ? { ...selection } : null);
    },
    [setValue]
  );

  const countrySelectValue =
    selectedCountry ||
    (selectedCountries.length > 0
      ? {
          countryName: selectedCountries[0].country,
          countryCode: selectedCountries[0].countryCode,
          phoneCode: selectedCountries[0].phoneCode || "",
        }
      : null);
  const citySelectValue = selectedCity;
  const isCityDisabled = !countrySelectValue?.countryCode || selectedCountries.length === 0;

  // Handle country removal
  const handleCountryRemove = useCallback(
    (countryCode) => {
      const updated = selectedCountries.filter(
        (c) => c.countryCode?.toUpperCase() !== String(countryCode).toUpperCase()
      );
      handleCountriesChange(updated);
    },
    [selectedCountries, handleCountriesChange]
  );

  // Handle requirement change for a specific country
  const handleRequirementChange = useCallback(
    (countryCode, newRequirement) => {
      const hasMultipleCountries = selectedCountries.length > 1;
      // If trying to set mandatory with multiple countries, prevent it
      if (newRequirement === REQUIREMENT_LEVEL.MANDATORY && hasMultipleCountries) {
        return;
      }

      const updated = selectedCountries.map((c) =>
        c.countryCode?.toUpperCase() === String(countryCode).toUpperCase()
          ? { ...c, requirement: newRequirement }
          : c
      );
      handleCountriesChange(updated);
    },
    [selectedCountries, handleCountriesChange]
  );

  // Handle country select for multi-select (add new country)
  const handleCountrySelectForMulti = useCallback(
    (country) => {
      if (!country) {
        setCountrySelectValueForMulti(null);
        return;
      }

      const countryCode = country.countryCode || country.value || country.code || "";
      if (!countryCode) {
        setCountrySelectValueForMulti(null);
        return;
      }

      // Check if country already exists
      const exists = selectedCountries.some(
        (c) => c.countryCode?.toUpperCase() === String(countryCode).toUpperCase()
      );
      if (exists) {
        setCountrySelectValueForMulti(null);
        return;
      }

      const willHaveMultiple = selectedCountries.length >= 1; // Will have multiple after adding

      const newCountry = {
        country: country.countryName || country.label || "",
        countryCode: countryCode,
        phoneCode: country.phoneCode || "",
        requirement: willHaveMultiple
          ? REQUIREMENT_LEVEL.PREFERRED
          : selectedCountries[0]?.requirement || REQUIREMENT_LEVEL.PREFERRED,
      };

      // If adding second country and first is mandatory, convert all to preferred
      const updatedCountries = selectedCountries.map((c) => ({
        ...c,
        requirement: willHaveMultiple ? REQUIREMENT_LEVEL.PREFERRED : c.requirement,
      }));

      handleCountriesChange([...updatedCountries, newCountry]);
      setCountrySelectValueForMulti(null); // Reset select value after adding
    },
    [selectedCountries, handleCountriesChange]
  );

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
    selectedCountries,
    handleCountriesChange,
    handleCountryRemove,
    handleRequirementChange,
    countrySelectValueForMulti,
    handleCountrySelectForMulti,
  };
}
