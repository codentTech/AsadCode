import { useState, useMemo } from "react";
import COUNTRIES from "@/common/constants/countries.constant";

export default function useFilterModal({ filters, onFiltersChange }) {
  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [countrySelectValue, setCountrySelectValue] = useState(null);

  // ============================================
  // 6. COMPUTED VALUES
  // ============================================
  const selectedCountries = Array.isArray(filters.countries)
    ? filters.countries
    : filters.country
      ? [filters.country]
      : [];

  const selectedCountryDetails = useMemo(() => {
    return selectedCountries
      .map((countryName) => {
        const countryMeta = COUNTRIES.find(
          (country) => country.label === countryName || country.code === countryName
        );
        return {
          code: countryMeta?.code || countryName,
          name: countryMeta?.label || countryName,
        };
      })
      .filter((country) => Boolean(country.code));
  }, [selectedCountries]);

  const allowedCountryCodes = useMemo(
    () =>
      selectedCountryDetails.length > 0
        ? selectedCountryDetails.map((country) => String(country.code).toUpperCase())
        : [],
    [selectedCountryDetails]
  );

  const primaryCountryCode = selectedCountryDetails[0]?.code || null;

  // ============================================
  // 5. CALLBACKS
  // ============================================
  const handleCountrySelect = (country) => {
    if (!country) {
      setCountrySelectValue(null);
      return;
    }

    const countryName = country.countryName || country.label || "";
    if (!countryName) return;

    const existing = selectedCountries || [];
    if (existing.includes(countryName)) {
      setCountrySelectValue(null);
      return;
    }

    const updated = [...existing, countryName];
    onFiltersChange({
      ...filters,
      countries: updated,
      country_code: country.countryCode || "",
      city: "",
      city_country_code: "",
      state: "",
      state_short: "",
    });
    setCountrySelectValue(null);
  };

  const handleCountryRemove = (countryName) => {
    const updated = selectedCountries.filter((c) => c !== countryName);
    const nextCountryCode =
      updated.length === 0
        ? ""
        : (() => {
            const firstName = updated[0];
            const meta = COUNTRIES.find(
              (c) => c.label === firstName || c.code === firstName
            );
            return meta?.code ? String(meta.code).toUpperCase() : "";
          })();
    onFiltersChange({
      ...filters,
      countries: updated,
      country_code: nextCountryCode,
      city: "",
      city_country_code: "",
      state: "",
      state_short: "",
    });
  };

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    countrySelectValue,
    setCountrySelectValue,
    selectedCountryDetails,
    allowedCountryCodes,
    primaryCountryCode,
    handleCountrySelect,
    handleCountryRemove,
  };
}
