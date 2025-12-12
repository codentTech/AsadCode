"use client";

import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import { X, Search } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import LANGUAGES, { COMMON_LANGUAGE_CODES } from "@/common/constants/languages.constant";

const matchLanguage = (term) => {
  const normalized = term.trim().toLowerCase();
  if (!normalized) return () => true;

  return (language) => {
    if (language.label.toLowerCase().includes(normalized)) return true;
    if (language.aliases?.some((alias) => alias.toLowerCase().includes(normalized))) {
      return true;
    }
    return false;
  };
};

export default function LanguageSelect({
  label = "Languages",
  name = "languages",
  value = [],
  onChange,
  maxSelections = 10,
  errors = {},
  helperText = "",
  quickSelectCodes = COMMON_LANGUAGE_CODES,
  disabled = false,
  isRequired = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabels = Array.isArray(value) ? value : [];
  const selectedSet = useMemo(
    () => new Set(selectedLabels.map((lang) => lang.toLowerCase())),
    [selectedLabels]
  );

  const availableOptions = useMemo(
    () => LANGUAGES.filter((language) => !selectedSet.has(language.label.toLowerCase())),
    [selectedSet]
  );

  const filteredOptions = useMemo(() => {
    if (!inputValue.trim()) {
      return availableOptions.slice(0, 10);
    }
    const predicate = matchLanguage(inputValue);
    return availableOptions.filter(predicate).slice(0, 10);
  }, [availableOptions, inputValue]);

  const quickSelectOptions = useMemo(
    () =>
      quickSelectCodes
        .map((code) => LANGUAGES.find((language) => language.code === code))
        .filter(Boolean),
    [quickSelectCodes]
  );

  const hasReachedLimit = selectedLabels.length >= maxSelections;
  const fieldError = errors && name ? errors[name] : null;

  const handleAddLanguage = (language) => {
    if (!language || hasReachedLimit) return;
    if (selectedSet.has(language.label.toLowerCase())) return;

    const updated = [...selectedLabels, language.label];
    onChange?.(updated);
    setInputValue("");
    setIsOpen(false);
  };

  const handleRemoveLanguage = (label) => {
    const updated = selectedLabels.filter(
      (language) => language.toLowerCase() !== label.toLowerCase()
    );
    onChange?.(updated);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    setIsOpen(true);
  };

  const handleInputKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (filteredOptions.length > 0) {
        handleAddLanguage(filteredOptions[0]);
      }
      return;
    }

    if (event.key === "Backspace" && !inputValue && selectedLabels.length > 0) {
      const lastLanguage = selectedLabels[selectedLabels.length - 1];
      handleRemoveLanguage(lastLanguage);
    }
  };

  const helper =
    helperText ||
    (hasReachedLimit
      ? `You can select up to ${maxSelections} languages`
      : "Start typing to search languages");

  return (
    <div className="flex flex-col gap-3">
      {label && (
        <label className="text-sm font-semibold text-gray-900">
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="flex flex-wrap gap-2">
        {quickSelectOptions.map((language) => {
          const isSelected = selectedSet.has(language.label.toLowerCase());
          return (
            <button
              key={language.code}
              type="button"
              disabled={disabled}
              onClick={() => handleAddLanguage(language)}
              className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:border-indigo-200"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {language.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <CustomInput
          name={`${name}_input`}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Search languages"
          disabled={disabled || hasReachedLimit}
          startIcon={<Search className="h-4 w-4 text-gray-400" />}
          errors={errors}
        />

        {isOpen && !disabled && filteredOptions.length > 0 && (
          <div className="absolute z-50 mt-2 max-h-56 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
            {filteredOptions.map((language) => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleAddLanguage(language)}
                className="flex w-full items-center justify-between px-3 py-2 text-sm text-gray-600 hover:bg-gray-50"
              >
                <span>{language.label}</span>
                <span className="text-xs text-gray-400">{language.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {helper && !fieldError && <p className="text-xs text-gray-500">{helper}</p>}

      {selectedLabels.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedLabels.map((language) => (
            <span
              key={language}
              className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
            >
              {language}
              <button
                type="button"
                disabled={disabled}
                onClick={() => handleRemoveLanguage(language)}
                className="text-gray-500 hover:text-gray-700 disabled:opacity-50"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {fieldError && <p className="text-xs text-red-600">{fieldError.message}</p>}
    </div>
  );
}

LanguageSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  maxSelections: PropTypes.number,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  quickSelectCodes: PropTypes.arrayOf(PropTypes.string),
  disabled: PropTypes.bool,
  isRequired: PropTypes.bool,
};
