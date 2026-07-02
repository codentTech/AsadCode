"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import TypeaheadSelect from "@/common/components/dropdowns/typeahead-select/typeahead-select.component";
import useStateSelect from "./use-state-select.hook";

export default function StateSelect({
  label = "State or Province",
  name = "state",
  countryCode,
  countryCodes = [],
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

  const { options, isLoading, searchStates, resolveStateDetails } = useStateSelect({
    countryCode,
    countryCodes: normalizedCodes,
  });

  const handleSearch = useCallback(
    (term) => {
      if (!hasAnyCountry) return;
      searchStates(term);
    },
    [hasAnyCountry, searchStates]
  );

  const handleSelection = useCallback(
    async (option) => {
      if (!option) {
        onChange?.(null);
        return;
      }

      setIsResolving(true);
      try {
        const result = await resolveStateDetails(option);
        if (result) {
          onChange?.(result);
        }
      } finally {
        setIsResolving(false);
      }
    },
    [onChange, resolveStateDetails]
  );

  const handleClear = useCallback(() => {
    onChange?.(null);
  }, [onChange]);

  const selectedValue = useMemo(() => {
    if (!value) return null;
    const stateName = value.stateName || value.name || "";
    const stateShort = value.stateShort || "";
    const labelText = stateShort ? `${stateName} (${stateShort})` : stateName;
    return {
      label: labelText,
      value: value.placeId || stateName,
      stateName,
      stateShort,
      placeId: value.placeId,
    };
  }, [value]);

  return (
    <TypeaheadSelect
      label={label}
      name={name}
      placeholder={hasAnyCountry ? "Search states or provinces" : "Select a country first"}
      value={selectedValue}
      onChange={handleSelection}
      onClear={handleClear}
      options={options}
      onSearch={handleSearch}
      isLoading={isLoading || isResolving}
      isRequired={isRequired}
      errors={errors}
      helperText={helperText}
      disabled={disabled || !hasAnyCountry}
      getOptionLabel={(option) => option?.label || option?.stateName || ""}
      getOptionValue={(option) => option?.value || option?.stateName || option?.label || ""}
      allowCustomSearch={false}
    />
  );
}

StateSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  countryCode: PropTypes.string,
  countryCodes: PropTypes.arrayOf(PropTypes.string),
  value: PropTypes.shape({
    stateName: PropTypes.string,
    stateShort: PropTypes.string,
    placeId: PropTypes.string,
  }),
  onChange: PropTypes.func,
  isRequired: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
};
