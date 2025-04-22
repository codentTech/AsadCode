import { Checkbox } from "@mui/material";
import PropTypes from "prop-types";
import FieldError from "../field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function CustomCheckbox({
  label = null,
  defaultChecked = false,
  checked = null,
  onChange = null,
  className = "",
  size = null,
  disabled = false,
  errors = null,
  register = null,
  name = null,
  isRequired = false,
  inlineLabel = true,
  labelClassName = "",
}) {
  return (
    <div className="">
      <div
        className={`${inlineLabel ? "flex w-full flex-row items-center" : ""}`}
      >
        <Checkbox
          {...(register && register(`${name}`))}
          name={name}
          defaultChecked={defaultChecked}
          {...(checked && { checked })}
          {...(onChange && { onChange })}
          className={`${className}`}
          disabled={disabled}
          {...(size && { size })}
        />
        {label && (
          <FieldLabel
            label={label}
            isRequired={isRequired}
            className={labelClassName}
          />
        )}
      </div>
      {errors && errors[name] && (
        <FieldError className="mt-1" error={errors[name].message} />
      )}
    </div>
  );
}

CustomCheckbox.propTypes = {
  label: PropTypes.string,
  defaultChecked: PropTypes.bool,
  // value: PropTypes.string.isRequried,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  errors: PropTypes.object,
  register: PropTypes.func,
  name: PropTypes.string,
  isRequired: PropTypes.bool,
  inlineLabel: PropTypes.bool,
  labelClassName: PropTypes.string,
};
