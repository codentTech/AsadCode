import PropTypes from "prop-types";
import { MenuItem, Select, NativeSelect } from "@mui/material";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function SimpleSelect({
  options,
  placeholder,
  name = null,
  onChange = null,
  defaultValue = null,
  value = null,
  className = "",
  disabled = false,
  errors = null,
  register = null,
  label = null,
  isRequired = false,
  inlineLabel = false,
  labelClassName = "",
  readOnly = false,
}) {
  return (
    <div
      className={`${inlineLabel ? "flex w-full flex-row items-center" : ""}`}
    >
      {label && (
        <FieldLabel
          label={label}
          isRequired={isRequired}
          className={labelClassName}
        />
      )}

      <div className="w-full">
        <NativeSelect
          {...(register && register(`${name}`))}
          name={name}
          {...(defaultValue && { defaultValue })}
          {...(value && { value })}
          {...(onChange && { onChange })}
          className={`default-input input-field w-full ${className}`}
          readOnly={readOnly}
          defaultValue={defaultValue}
          placeholder={placeholder}
          // defaultValue={options[0]}
          // {...(placeholder && {defaultValue: "null"})}
        >
          {/* {placeholder && (
            <MenuItem {...(register && { register })} disabled value={null}>
              {placeholder}
            </MenuItem>
          )} */}
          {options?.map((option) => (
            <option
              // {...(register && { register })}
              // name={name}
              key={option.value}
              value={option.value}
              disabled={option.value === null}
              className="px-2 py-3"
            >
              {option.label}
            </option>
          ))}
        </NativeSelect>
        {errors && errors[name] && (
          <FieldError className="mt-1" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

SimpleSelect.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // label should be unique because by default mui use label as key
      value: PropTypes.string,
      //   Besides label we can send anything in the object, onChange value will give us the whole object
    })
  ).isRequired,
  placeholder: PropTypes.string.isRequired,
  name: PropTypes.string,
  onChange: PropTypes.func,
  defaultValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
  }),
  value: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  register: PropTypes.func,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
  readOnly: PropTypes.bool,
};
