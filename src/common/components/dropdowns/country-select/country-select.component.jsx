"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
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
  const handleSelection = useCallback(
    (option) => {
      if (!option) {
        onChange?.(null);
        return;
      }

      onChange?.({
        countryName: option.label,
        countryCode: option.value,
        phoneCode: option.phone,
      });
    },
    [onChange]
  );

  const { options, detectCountry, isDetecting } = useCountrySelect({
    autoDetect,
    onAutoDetect: handleSelection,
    enabled: !disabled,
  });

  const selectedOption = useMemo(() => {
    if (!value) return null;

    const code = value.countryCode || value.code || value.value;
    if (!code) {
      return null;
    }

    return options.find((option) => option.value === code) || null;
  }, [options, value]);

  const helper = useMemo(() => {
    if (isDetecting) {
      return "Detecting your country...";
    }
    if (helperText) {
      return helperText;
    }
    return autoDetect
      ? "We attempt to detect your country automatically. You can change it anytime."
      : null;
  }, [autoDetect, helperText, isDetecting]);

  return (
    <div className="flex flex-col gap-2">
      <TypeaheadSelect
        label={label}
        name={name}
        placeholder="Search countries"
        value={selectedOption}
        onChange={handleSelection}
        options={options}
        isLoading={isDetecting}
        isRequired={isRequired}
        errors={errors}
        // helperText={helper}
        disabled={disabled}
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => option.value}
        allowCustomSearch={true}
      />

      {/* {autoDetect && !disabled && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={detectCountry}
            disabled={isDetecting}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 disabled:text-gray-400"
          >
            {isDetecting ? "Detecting..." : "Detect automatically"}
          </button>
        </div>
      )} */}
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
