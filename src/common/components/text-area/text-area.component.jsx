import { TextareaAutosize } from "@mui/material";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function TextArea({
  placeholder = "",
  name,
  register = null,
  label = null,
  className = "",
  minRows = 2,
  maxRows = 10,
  value = null,
  disabled = false,
  defaultValue = null,
  onChange = null,
  onKeyDown = null, // Add onSubmit prop
  errors = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
  ref = null,
  onBlur = null,
  customRef = null,
}) {
  return (
    <div
      className={`${
        inlineLabel
          ? "flex w-full flex-row items-center"
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
        <TextareaAutosize
          {...(register && register(`${name}`))}
          name={name}
          {...(customRef && { ref: customRef })}
          minRows={minRows}
          maxRows={maxRows}
          placeholder={placeholder}
          className={`input-field default-input min hover:border-text-dark-gray focus:border-[1px] focus:border-text-dark-gray ${
            errors && errors[name] && "error-field"
          } ${className} ${!disabled || "disabled-input"} `}
          {...(defaultValue && { defaultValue })}
          {...(value && { value })}
          onChange={onChange}
          onKeyDown={onKeyDown} // Add this line to handle key events
          readOnly={readOnly}
          disabled={disabled}
          {...(onBlur && { onBlur })}
        />
        {errors && errors[name] && (
          <FieldError
            className="mt-1 normal-case"
            error={errors[name].message}
          />
        )}
      </div>
    </div>
  );
}

TextArea.propTypes = {
  placeholder: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  minRows: PropTypes.number,
  maxRows: PropTypes.number,
  value: PropTypes.string,
  disabled: PropTypes.bool,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  ref: PropTypes.func,
  onKeyDown: PropTypes.func, // Add onSubmit prop type
  customRef: PropTypes.func, // Add onSubmit prop type
  onBlur: PropTypes.func, // Add onSubmit prop type
  register: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
};
