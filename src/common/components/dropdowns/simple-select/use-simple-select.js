/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/function-component-definition */
import CrossIcon from "@/common/icons/cross.icon";
import React, { useEffect, useRef, useState } from "react";

const CloseIcon = () => {
  return (
    <svg height="20" width="20" viewBox="0 0 20 20">
      <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
    </svg>
  );
};

function useSimpleSelect({ placeHolder, options, isMulti, isSearchable, onChange, defaultValue, value }) {
  const [showMenu, setShowMenu] = useState(false);
  const [selectedValue, setSelectedValue] = useState(isMulti ? [] : null);
  const [searchValue, setSearchValue] = useState("");
  const searchRef = useRef();
  const inputRef = useRef();

  // Use controlled value if provided, otherwise use internal state
  // If value is null/undefined, use selectedValue; otherwise use value directly
  const currentValue = value !== undefined && value !== null ? value : selectedValue;

  useEffect(() => {
    setSearchValue("");
    if (showMenu && searchRef.current) {
      searchRef.current.focus();
    }
  }, [showMenu]);

  useEffect(() => {
    const handler = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    window.addEventListener("click", handler);
    return () => {
      window.removeEventListener("click", handler);
    };
  });
  const handleInputClick = (e) => {
    setShowMenu(!showMenu);
  };

  // Handle defaultValue (uncontrolled) - only set on initial mount
  useEffect(() => {
    if (value !== undefined) return; // Don't use defaultValue if value is provided (controlled)

    if (!options) return;

    if (isMulti) {
      if (Array.isArray(defaultValue) && defaultValue.length) {
        const selectedOptions = options.filter((option) => defaultValue.includes(option.value));
        setSelectedValue(selectedOptions);
      } else if (!defaultValue || defaultValue.length === 0) {
        setSelectedValue([]);
      }
      return;
    }

    if (!defaultValue) {
      setSelectedValue(null);
      return;
    }

    if (typeof defaultValue === "object" && defaultValue?.value) {
      setSelectedValue(defaultValue);
      return;
    }

    const defaultOption = options.find((option) => option.value === defaultValue);
    if (defaultOption) {
      setSelectedValue(defaultOption);
    }
  }, [defaultValue, options, isMulti, value]);

  // Handle controlled value prop - sync internal state for display
  useEffect(() => {
    if (value === undefined) return; // Not controlled

    if (isMulti) {
      if (Array.isArray(value) && value.length) {
        const selectedOptions = options?.filter((option) => 
          value.some((v) => (typeof v === 'object' ? v.value : v) === option.value)
        ) || [];
        setSelectedValue(selectedOptions);
      } else {
        setSelectedValue([]);
      }
      return;
    }

    // For single select, if value is null, clear selection
    if (value === null) {
      setSelectedValue(null);
      return;
    }

    // If value is an object with value and label, use it directly
    if (typeof value === "object" && value?.value !== undefined && value?.label !== undefined) {
      setSelectedValue(value);
      return;
    }

    // If value is a primitive, find matching option
    if (typeof value !== "object") {
      const valueOption = options?.find((option) => option.value === value);
      if (valueOption) {
        setSelectedValue(valueOption);
      } else {
        setSelectedValue(null);
      }
      return;
    }

    // Fallback: use value as-is if it's an object
    setSelectedValue(value);
  }, [value, options, isMulti]);

  const getDisplay = () => {
    // Use value prop directly if provided (controlled), otherwise use selectedValue
    const displayValue = value !== undefined && value !== null ? value : selectedValue;
    
    if (!displayValue) {
      return placeHolder || "";
    }

    if (isMulti) {
      if (!Array.isArray(displayValue) || displayValue.length === 0) {
        return placeHolder || "";
      }
      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <div className="flex flex-wrap gap-[5px]">
          {displayValue.map((option) => (
            <div key={option.value} className="flex gap-3 items-center rounded-lg bg-gray-100 px-2">
              {option.label}
              <span onClick={(e) => onTagRemove(e, option)} className="flex items-center ml-1">
                <CrossIcon size="small" />
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Single select - displayValue should be an object with label
    if (typeof displayValue === "object" && displayValue.label) {
      return displayValue.label;
    }

    return placeHolder || "";
  };

  const onTagRemove = (e, option) => {
    e.stopPropagation();
    const current = currentValue || [];
    const newValue = current.filter((o) => o.value !== option.value);
    
    // Only update internal state if not controlled
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    onChange(newValue);
  };

  const onItemClick = (option) => {
    let newValue;
    if (isMulti) {
      const current = currentValue || [];
      if (current.findIndex((o) => o.value === option.value) >= 0) {
        newValue = current.filter((o) => o.value !== option.value);
      } else {
        newValue = [...current, option];
      }
    } else {
      newValue = option;
    }
    
    // Only update internal state if not controlled
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    onChange(newValue);
  };

  const isSelected = (option) => {
    const current = currentValue;
    
    if (isMulti) {
      if (!Array.isArray(current)) return false;
      return current.filter((o) => o.value === option.value).length > 0;
    }

    if (!current) {
      return false;
    }

    return current.value === option.value;
  };

  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  const getOptions = () => {
    if (!searchValue) {
      return options;
    }

    return (
      options &&
      options.filter(
        (option) => option && option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
      )
    );
  };
  return {
    inputRef,
    handleInputClick,
    getDisplay,
    showMenu,
    onSearch,
    searchValue,
    searchRef,
    getOptions,
    onItemClick,
    isSelected,
  };
}

export default useSimpleSelect;
