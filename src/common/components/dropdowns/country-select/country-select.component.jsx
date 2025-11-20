"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";
import TypeaheadSelect from "@/common/components/dropdowns/typeahead-select/typeahead-select.component";
import useCountrySelect from "./use-country-select.hook";

export default function CountrySelect({
  label = "Country",
  name = "country",
  value = null,
  onChange,
  autoDetect = false,
  isRequired = false,
  errors = {},
  helperText = "",
  disabled = false,
}) {
  const [isResolving, setIsResolving] = useState(false);

  const {
    options,
    searchCountries,
    resolveCountryDetails,
    isDetecting,
    isSearching,
    markManualOverride,
  } = useCountrySelect({
    autoDetect,
    onAutoDetect: (option) => {
      onChange?.({
        countryName: option.countryName || option.label,
        countryCode: option.countryCode || option.value,
        phoneCode: option.phoneCode || "",
      });
    },
    enabled: !disabled,
    hasInitialValue: Boolean(value),
  });

  const selectedValue = useMemo(() => {
    if (!value) return null;
    const countryName = value.countryName || value.name || value.label || "";
    const countryCode = value.countryCode || value.code || value.value || "";
    const phoneCode = value.phoneCode || value.dialCode || "";

    return {
      ...value,
      label: countryName,
      value: countryCode || countryName,
      countryName,
      countryCode,
      phoneCode,
    };
  }, [value]);

  const helper = useMemo(() => {
    if (isDetecting || isResolving) {
      return "Detecting your country...";
    }
    if (helperText) {
      return helperText;
    }
    return autoDetect ? "" : null;
  }, [autoDetect, helperText, isDetecting, isResolving]);

  const handleSelection = useCallback(
    async (option) => {
      if (!option) {
        markManualOverride();
        onChange?.(null);
        return;
      }

      markManualOverride();
      setIsResolving(true);
      try {
        const result = await resolveCountryDetails(option);
        if (result) {
          onChange?.(result);
        }
      } finally {
        setIsResolving(false);
      }
    },
    [markManualOverride, onChange, resolveCountryDetails]
  );

  const handleClear = useCallback(() => {
    markManualOverride();
    onChange?.(null);
  }, [markManualOverride, onChange]);

  return (
    <div className="flex flex-col gap-2">
      <TypeaheadSelect
        label={label}
        name={name}
        placeholder="Search countries"
        value={selectedValue}
        onChange={handleSelection}
        onClear={handleClear}
        options={options}
        onSearch={searchCountries}
        isLoading={isDetecting || isSearching || isResolving}
        isRequired={isRequired}
        errors={errors}
        helperText={helper}
        disabled={disabled}
        getOptionLabel={(option) =>
          option?.label || option?.countryName || option?.countryCode || ""
        }
        getOptionValue={(option) => option?.value || option?.countryCode || option?.label || ""}
        allowCustomSearch={false}
      />
    </div>
  );
}

CountrySelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.shape({
    countryName: PropTypes.string,
    countryCode: PropTypes.string,
    phoneCode: PropTypes.string,
  }),
  onChange: PropTypes.func,
  autoDetect: PropTypes.bool,
  isRequired: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  disabled: PropTypes.bool,
};
