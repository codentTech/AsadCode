"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import TypeaheadSelect from "@/common/components/dropdowns/typeahead-select/typeahead-select.component";
import useCitySelect from "./use-city-select.hook";

export default function CitySelect({
  label = "City",
  name = "city",
  countryCode,
  value = null,
  onChange,
  isRequired = false,
  errors = {},
  helperText = "",
  disabled = false,
}) {
  const isCountryMissing = !countryCode;

  const { options, isLoading, searchCities, hasNetworkFallback } = useCitySelect({
    countryCode,
  });

  const selectedOption = useMemo(() => {
    if (!value) return null;

    const matchByGeoId = value.geonameId
      ? options.find((option) => option.geonameId === value.geonameId)
      : null;

    if (matchByGeoId) return matchByGeoId;

    if (value.cityName && value.countryCode) {
      return (
        options.find(
          (option) =>
            option.cityName.toLowerCase() === value.cityName.toLowerCase() &&
            option.countryCode === value.countryCode
        ) || null
      );
    }

    return null;
  }, [options, value]);

  const handleSearch = useCallback(
    (term) => {
      if (isCountryMissing) return;
      searchCities(term);
    },
    [isCountryMissing, searchCities]
  );

  const handleSelection = useCallback(
    (option) => {
      if (!option) {
        onChange?.(null);
        return;
      }

      onChange?.({
        cityName: option.cityName,
        countryCode: option.countryCode,
        region: option.region,
        latitude: option.latitude,
        longitude: option.longitude,
        geonameId: option.geonameId,
      });
    },
    [onChange]
  );

  const helper = useMemo(() => {
    if (helperText) return helperText;
    if (isCountryMissing) return "Select a country first to enable city search.";

    return "Begin typing to search for verified cities.";
  }, [helperText, isCountryMissing, hasNetworkFallback]);

  return (
    <TypeaheadSelect
      label={label}
      name={name}
      placeholder={isCountryMissing ? "Select a country first" : "Search cities"}
      value={selectedOption}
      onChange={handleSelection}
      options={options}
      onSearch={handleSearch}
      isLoading={isLoading}
      isRequired={isRequired}
      errors={errors}
      helperText={helper}
      disabled={disabled || isCountryMissing}
      getOptionLabel={(option) => option.label}
      getOptionValue={(option) => option.value}
      allowCustomSearch={false}
    />
  );
}

CitySelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  countryCode: PropTypes.string,
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
