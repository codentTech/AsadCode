"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import TypeaheadSelect from "@/common/components/dropdowns/typeahead-select/typeahead-select.component";
import useCitySelect from "./use-city-select.hook";

export default function CitySelect({
  label = "City",
  name = "city",
  countryCode,
  countryCodes = [],
  stateName = "",
  stateShort = "",
  value = null,
  onChange,
  isRequired = false,
  errors = {},
  helperText = "",
  disabled = false,
}) {
  const [isResolving, setIsResolving] = useState(false);
  const normalizedCodes = Array.isArray(countryCodes) ? countryCodes.filter(Boolean) : [];
  const hasAnyCountry = Boolean(countryCode) || normalizedCodes.length > 0;

  const { options, isLoading, searchCities, resolveCityDetails } = useCitySelect({
    countryCode,
    countryCodes: normalizedCodes,
    stateName,
    stateShort,
  });

  const handleSearch = useCallback(
    (term) => {
      if (!hasAnyCountry) return;
      searchCities(term);
    },
    [hasAnyCountry, searchCities]
  );

  const handleSelection = useCallback(
    async (option) => {
      if (!option) {
        onChange?.(null);
        return;
      }

      setIsResolving(true);
      try {
        const result = await resolveCityDetails(option);
        if (result) {
          onChange?.(result);
        }
      } finally {
        setIsResolving(false);
      }
    },
    [onChange, resolveCityDetails]
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const helper = useMemo(() => {
    if (helperText) return helperText;
    if (!hasAnyCountry) return "";

    return "";
  }, [helperText, hasAnyCountry]);

  const selectedValue = useMemo(() => {
    if (!value) return null;
    const parts = [value.cityName, value.region, value.countryCode].filter(Boolean);
    return {
      label: parts.join(", "),
      value: value.cityName || parts.join(", "),
      cityName: value.cityName,
      countryCode: value.countryCode,
    };
  }, [value]);

  return (
    <TypeaheadSelect
      label={label}
      name={name}
      placeholder={hasAnyCountry ? "Search cities" : "Select a country first"}
      value={selectedValue}
      onChange={handleSelection}
      onClear={handleClear}
      options={options}
      onSearch={handleSearch}
      isLoading={isLoading || isResolving}
      isRequired={isRequired}
      errors={errors}
      helperText={helper}
      disabled={disabled || !hasAnyCountry}
      getOptionLabel={(option) =>
        option?.label ||
        [option?.cityName, option?.region, option?.countryCode].filter(Boolean).join(", ")
      }
      getOptionValue={(option) => option?.value || option?.cityName || option?.label || ""}
      allowCustomSearch={false}
    />
  );
}

CitySelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  countryCode: PropTypes.string,
  countryCodes: PropTypes.arrayOf(PropTypes.string),
  stateName: PropTypes.string,
  stateShort: PropTypes.string,
  value: PropTypes.shape({
    cityName: PropTypes.string,
    countryCode: PropTypes.string,
    region: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    geonameId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
};
