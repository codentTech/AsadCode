"use client";

import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import Loader from "@/common/components/loader/loader.component";
import useTypeaheadSelect from "./use-typeahead-select.hook";
import { X } from "lucide-react";

const defaultGetOptionValue = (option) => option?.value ?? option?.code ?? option?.id ?? "";
const defaultGetOptionLabel = (option) => option?.label ?? option?.name ?? "";

export default function TypeaheadSelect({
  label,
  name,
  placeholder = "Type to search",
  value = null,
  onChange,
  options = [],
  onSearch,
  isLoading = false,
  isRequired = false,
  disabled = false,
  errors = {},
  helperText = "",
  renderOption,
  getOptionLabel = defaultGetOptionLabel,
  getOptionValue = defaultGetOptionValue,
  maxVisibleOptions = 12,
  allowCustomSearch = false,
}) {
  const {
    containerRef,
    isOpen,
    searchTerm,
    filteredOptions,
    highlightedIndex,
    handleSearchChange,
    highlightNext,
    highlightPrevious,
    closeMenu,
    openMenu,
    setSearchTerm,
    resetInputToValue,
  } = useTypeaheadSelect({
    value,
    options,
    onSearch,
    getOptionLabel,
    allowCustomSearch,
  });

  const hasError = Boolean(errors && name && errors[name]);

  const displayedOptions = useMemo(() => {
    if (!Array.isArray(filteredOptions)) return [];
    if (filteredOptions.length <= maxVisibleOptions) {
      return filteredOptions;
    }
    return filteredOptions.slice(0, maxVisibleOptions);
  }, [filteredOptions, maxVisibleOptions]);

  const handleOptionSelect = useCallback(
    (option) => {
      onChange?.(option);
      closeMenu();
      setSearchTerm(option ? getOptionLabel(option) : "");
    },
    [closeMenu, getOptionLabel, onChange, setSearchTerm]
  );

  const handleInputChange = useCallback(
    (event) => {
      handleSearchChange(event.target.value);
    },
    [handleSearchChange]
  );

  const handleInputFocus = useCallback(() => {
    openMenu();
  }, [openMenu]);

  const handleKeyDown = useCallback(
    (event) => {
      if (!isOpen && ["ArrowDown", "ArrowUp"].includes(event.key)) {
        openMenu();
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          highlightNext();
          break;
        case "ArrowUp":
          event.preventDefault();
          highlightPrevious();
          break;
        case "Enter":
          if (isOpen && displayedOptions[highlightedIndex]) {
            event.preventDefault();
            handleOptionSelect(displayedOptions[highlightedIndex]);
          }
          break;
        case "Escape":
          closeMenu();
          resetInputToValue();
          break;
        default:
          break;
      }
    },
    [
      closeMenu,
      displayedOptions,
      handleOptionSelect,
      highlightNext,
      highlightPrevious,
      highlightedIndex,
      isOpen,
      openMenu,
      resetInputToValue,
    ]
  );

  const renderListContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-4">
          <Loader loading={true} size={18} color="#4f46e5" />
        </div>
      );
    }

    if (!displayedOptions.length) {
      return <div className="px-3 py-2 text-sm text-gray-400">No matches found</div>;
    }

    return displayedOptions.map((option, index) => {
      const optionLabel = getOptionLabel(option);
      const optionValue = getOptionValue(option) ?? optionLabel;

      const optionClasses = [
        "w-full flex cursor-pointer items-center gap-2 px-3 py-2 text-sm",
        highlightedIndex === index ? "bg-secondary-light-blue text-gray-900" : "hover:bg-gray-50",
      ].join(" ");

      return (
        <button
          type="button"
          key={optionValue || `${optionLabel}-${index}`}
          className={optionClasses}
          onClick={() => handleOptionSelect(option)}
        >
          {renderOption ? renderOption(option) : optionLabel}
        </button>
      );
    });
  };

  return (
    <div className="flex w-full flex-col gap-2" ref={containerRef}>
      {label && <FieldLabel label={label} isRequired={isRequired} />}

      <div className="relative">
        <CustomInput
          name={name}
          value={searchTerm}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          errors={errors}
          readOnly={false}
        />

        {value && !disabled && (
          <button
            type="button"
            onClick={() => handleOptionSelect(null)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
            {renderListContent()}
          </div>
        )}
      </div>

      {helperText && !hasError && <span className="text-xs text-gray-500">{helperText}</span>}
    </div>
  );
}

TypeaheadSelect.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any),
  onSearch: PropTypes.func,
  isLoading: PropTypes.bool,
  isRequired: PropTypes.bool,
  disabled: PropTypes.bool,
  errors: PropTypes.object,
  helperText: PropTypes.string,
  renderOption: PropTypes.func,
  getOptionLabel: PropTypes.func,
  getOptionValue: PropTypes.func,
  maxVisibleOptions: PropTypes.number,
  allowCustomSearch: PropTypes.bool,
};
