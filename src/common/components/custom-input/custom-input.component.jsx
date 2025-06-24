/* eslint-disable react/forbid-prop-types */

"use client";

import FieldError from "@/common/components/field-error/field-error.component";
import { Input, InputAdornment } from "@mui/material";
import PropTypes from "prop-types";
import FieldLabel from "../field-label/field-label.component";
import useCustomInput from "./use-custom-input.hook";

/**
 * @param type - The type of input
 * @param placeholder - The placeholder text
 * @param onChange - The function to call when the input changes
 * @param name - The name of input to get value in onSubmit
 * @param defaultValue - The value that will be displayed on input field on first time
 * @param value - The value of the input
 * @param className - is used to add custom styles classes to button
 * @param endIcon - The icon to display at the end of the input
 * @param startIcon - The icon to display at the start of the input
 * @param disabled - Whether the input is disabled
 * @param regex - The regex to match the input against
 * @param matchRegex - Whether the input should match the regex and only allow matching input, or not match the regex and only allow non-matching input
 * @param error - The error text message to be shown below input field
 * @returns A custom input component
 */

export default function CustomInput({
  type = "text",
  placeholder = "",
  name,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  endIcon = null,
  startIcon = null,
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  onClick = null,
  onKeyPress = null,
  onKeyDown = null,
  customRef = null,
  onBlur = null,
  onFocus = null,
}) {
  const {
    inputChangeHandler,
    showPassword,
    getInputEndAdornment,
    borderErrorStyle,
    borderSuccessStyle,
  } = useCustomInput(onChange, type, endIcon);

  return (
    <div
      className={`${
        inlineLabel
          ? "grid w-full grid-cols-[130px_1fr] items-center capitalize"
          : "flex w-full flex-col gap-[6px] text-xs font-medium capitalize not-italic leading-6 text-text-black"
      }`}
    >
      {label && <FieldLabel label={label} isRequired={isRequired} className={labelClassName} />}

      <div className={`relative w-full ${disabled ? "bg-[#BBBBBB26]" : ""}`}>
        <Input
          {...(register && register(`${name}`))}
          {...(onClick && { onClick })}
          {...(onKeyPress && { onKeyPress })}
          {...(onKeyDown && { onKeyDown })}
          name={name}
          onFocus={onFocus}
          autoFocus="true"
          type={showPassword ? "text" : type}
          placeholder={placeholder}
          className={`text-sm font-normal not-italic leading-[18px] text-text-ultra-light-gray 
            ${type === "number" ? "numArrowNotShow" : ""} 
            ${type === "date" ? "bg-red-300" : ""} 
            input-field default-input hover:border-text-dark-gray 
            ${errors && errors[name] ? "error-field" : ""} 
            ${className} ${!disabled ? "" : "disabled-input"} px-[16px] 
            ${type === "date" && !disabled ? "!pr-0" : "!pr-2"}`}
          {...(defaultValue !== null &&
            defaultValue !== undefined && {
              defaultValue,
            })}
          {...(value !== null && value !== undefined && { value })}
          {...(customRef && { inputRef: customRef })}
          disabled={disabled}
          variant="outlined"
          startAdornment={
            startIcon ? <InputAdornment position="start">{startIcon}</InputAdornment> : null
          }
          endAdornment={
            getInputEndAdornment() ? (
              <InputAdornment position="end">{getInputEndAdornment()}</InputAdornment>
            ) : null
          }
          {...(onChange && { onChange: inputChangeHandler })}
          readOnly={readOnly}
          {...(onBlur && { onBlur })}
          style={errors && errors[name] ? borderErrorStyle : borderSuccessStyle}
        />

        {errors && errors[name] && (
          <FieldError className="mt-1 normal-case" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

CustomInput.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  onKeyPress: PropTypes.func,
  onKeyDown: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  endIcon: PropTypes.element,
  startIcon: PropTypes.element,
  disabled: PropTypes.bool,
  regex: PropTypes.instanceOf(RegExp),
  matchRegex: PropTypes.bool,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  register: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
  customRef: PropTypes.object,
};

CustomInput.defaultProps = {
  type: "text",
};
