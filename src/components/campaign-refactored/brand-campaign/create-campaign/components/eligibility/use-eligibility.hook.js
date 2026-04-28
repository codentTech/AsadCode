import { useCallback, useMemo, useState } from "react";
import { REQUIREMENT_LEVEL } from "@/common/constants/campaign.constant";

export default function useEligibility({ campaignData, setValue }) {
  const [countrySelectValueForMulti, setCountrySelectValueForMulti] = useState(null);

  const selectedCountries = useMemo(() => {
    if (campaignData?.creator_countries && Array.isArray(campaignData.creator_countries)) {
      return campaignData.creator_countries;
    }
    return [];
  }, [campaignData?.creator_countries]);

  const countrySelectValue = useMemo(() => {
    if (selectedCountries.length > 0) {
      const first = selectedCountries[0];
      return {
        countryName: first.country,
        countryCode: first.countryCode,
        phoneCode: first.phoneCode || "",
      };
    }
    return null;
  }, [selectedCountries]);

  const citySelectValue = useMemo(() => {
    if (!campaignData?.creator_city) return null;
    return {
      cityName: campaignData.creator_city,
      countryCode: campaignData.creator_city_country_code || selectedCountries[0]?.countryCode || "",
      region: campaignData.creator_city_region || "",
      geonameId: campaignData.creator_city_geoname_id || null,
    };
  }, [campaignData?.creator_city, campaignData?.creator_city_country_code, campaignData?.creator_city_region, campaignData?.creator_city_geoname_id, selectedCountries]);

  const selectedLanguages = useMemo(() => {
    if (!campaignData?.creator_language) return [];
    const language = campaignData.creator_language;
    return Array.isArray(language) ? language : [language];
  }, [campaignData?.creator_language]);

  const handleLanguageChange = useCallback(
    (languages) => {
      const languageValue = Array.isArray(languages) && languages.length > 0 
        ? languages[0] 
        : "";
      setValue("creator_language", languageValue, { shouldDirty: true });
    },
    [setValue]
  );

  const handleCountriesChange = useCallback(
    (countries) => {
      setValue("creator_countries", countries, { shouldValidate: true, shouldDirty: true });

      if (countries && countries.length > 0) {
        const firstCountryCode = countries[0].countryCode;
        const cityCountryCode = campaignData?.creator_city_country_code;
        if (cityCountryCode && !countries.some((c) => c.countryCode === cityCountryCode)) {
          setValue("creator_city", "", { shouldValidate: true, shouldDirty: true });
          setValue("creator_city_country_code", "", { shouldValidate: false, shouldDirty: true });
        }
      } else {
        setValue("creator_city", "", { shouldValidate: true, shouldDirty: true });
        setValue("creator_city_country_code", "", { shouldValidate: false, shouldDirty: true });
      }
    },
    [setValue, campaignData?.creator_city_country_code]
  );

  const handleCitySelect = useCallback(
    (selection) => {
      setValue("creator_city", selection?.cityName || "", { shouldValidate: true, shouldDirty: true });
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
    },
    [setValue]
  );

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
    selectedLanguages,
    handleLanguageChange,
    countrySelectValue,
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
