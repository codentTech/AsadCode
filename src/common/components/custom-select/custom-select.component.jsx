/* eslint-disable react/forbid-prop-types */

"use client";

import { MenuItem, Select } from "@mui/material";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function CustomSelect({
  options,
  placeholder = "",
  className = "",
  value = null,
  onChange = null,
  defaultValue = "",
  register = null,
  name,
  errors = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  control = null,
  disabled = false,
  readOnly = false,
}) {
  return (
    <div
      className={`${
        inlineLabel
          ? "grid w-full  grid-cols-[130px_1fr] items-center"
          : "flex flex-col gap-[8px] text-xs font-medium capitalize not-italic leading-6 text-text-black"
      }`}
    >
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      )}

      <div className="w-full">
        {control && (
          <Controller
            name={name}
            {...(control && { control })}
            disabled={disabled}
            readOnly={readOnly}
            defaultValue={defaultValue !== "" ? defaultValue : placeholder}
            className="w-fit"
            render={({ field }) => (
              <Select
                {...field}
                {...(onChange && { onChange })}
                {...(value && { value })}
                {...(register && register(`${name}`))}
                className={`h-[40px] w-full !py-0 px-[18px] font-dm text-text-dark-gray placeholder:text-text-ultra-light-gray ${
                  errors && errors[name] && "error-field"
                } ${className} ${!disabled || "disabled-input"} `}
                disabled={disabled}
                readOnly={readOnly}
              >
                <MenuItem
                  className=""
                  value={defaultValue !== "" ? defaultValue : placeholder}
                  selected
                  disabled
                >
                  <p className="pt-[4px] text-sm font-normal not-italic leading-[17.5px] text-text-ultra-light-gray">
                    {defaultValue !== "" ? defaultValue : placeholder}
                  </p>
                </MenuItem>
                {options?.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
        )}

        {!control && (
          <Select
            name={name}
            defaultValue={defaultValue}
            {...(onChange && { onChange })}
            {...(value && { value })}
            className={`h-[40px] w-full !py-0 px-[18px] font-dm text-text-dark-gray placeholder:text-text-ultra-light-gray disabled:selection:text-text-ultra-light-gray ${
              errors && errors[name] && "error-field"
            } ${className} ${!disabled || "disabled-input"} `}
            disabled={disabled}
            readOnly={readOnly}
          >
            {/* <MenuItem
              className="text-disabled-input"
              value={defaultValue}
              selected
              disabled
            >
              {defaultValue}
            </MenuItem> */}
            {options?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        )}

        {errors && errors[name] && (
          <FieldError className="mt-1" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

CustomSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.any,
    })
  ).isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.string,
  name: PropTypes.string,
  label: PropTypes.string,
  errors: PropTypes.any,
  isRequired: PropTypes.bool,
  register: PropTypes.func,
  inlineLabel: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  labelClassName: PropTypes.string,
  control: PropTypes.any,
};
