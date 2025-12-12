"use client";

import { FormControl, FormLabel } from "@mui/material";
import PropTypes from "prop-types";

/**
 * CustomRadioGroup renders a styled radio button group with support for inline layout, form registration, and change handling.
 */
export default function CustomRadioGroup({
  radioOptions,
  name,
  register = null,
  label = null,
  defaultValue = null,
  value = null,
  inlineRadioButtons = false,
  onChange,
  errorMessage = "",
}) {
  const registerProps = register ? register(name) : {};
  const combinedOnChange = (event) => {
    registerProps?.onChange?.(event);
    onChange?.(event.target.value);
  };

  const getCheckedValue = () => {
    if (value !== null && value !== undefined) {
      return value;
    }
    return defaultValue;
  };

  const checkedValue = getCheckedValue();

  return (
    <FormControl className="w-full">
      {label && <FormLabel className="text-sm font-medium text-gray-700 mb-1">{label}</FormLabel>}
      <div className={`flex gap-4 ${inlineRadioButtons ? "flex-row" : "flex-col"}`}>
        {radioOptions?.map((option) => {
          const { ref, onChange: registerOnChange, ...restRegisterProps } = registerProps;
          return (
            <label key={option.value} className="flex items-center text-xs gap-2 cursor-pointer">
              <input
                {...(register ? restRegisterProps : {})}
                type="radio"
                value={option.value}
                checked={checkedValue === option.value}
                name={name}
                onChange={combinedOnChange}
                className="w-4 h-4 accent-blue-600"
                {...(register && ref ? { ref } : {})}
              />
              {option.label}
            </label>
          );
        })}
      </div>
      {errorMessage ? <p className="mt-1 text-xs text-red-500">{errorMessage}</p> : null}
    </FormControl>
  );
}

CustomRadioGroup.propTypes = {
  radioOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ),
  label: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  register: PropTypes.func,
  inlineRadioButtons: PropTypes.bool,
  onChange: PropTypes.func,
  errorMessage: PropTypes.string,
};
