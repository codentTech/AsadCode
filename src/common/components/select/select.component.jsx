import { Autocomplete, TextField } from "@mui/material";
import PropTypes from "prop-types";
import FieldError from "@/common/components/field-error/field-error.component";
import FieldLabel from "../field-label/field-label.component";

export default function Select({
  options,
  placeholder,
  name = null,
  onChange = null,
  onClick = null,
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
      className={`${
        inlineLabel
          ? " grid w-full grid-cols-[130px_1fr] items-center"
          : "flex w-full flex-col gap-2 text-xs font-medium capitalize not-italic leading-6 text-text-black"
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
        <Autocomplete
          {...(register && register(`${name}`))}
          name={name}
          disablePortal
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingLeft: "0px!important",
            },
          }}
          // disableClearable
          options={options ?? []}
          renderOption={(props, option) => (
            <li {...props} key={option?.label}>
              {option?.label}
            </li>
          )}
          className={`select !p-0 ${className} ${disabled ? "disabled-input" : ""}  `}
          disabled={disabled}
          readOnly={readOnly}
          {...(value && { value })}
          {...(onChange && { onChange })}
          defaultValue={defaultValue}
          isOptionEqualToValue={(option, value) =>
            option && option.label === value && value.label
          }
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                style: {
                  fontSize: 14,
                  borderColor: errors && errors[name] ? "red" : "",
                },
              }}
              {...(register && register(name))}
              {...(onClick && { onClick })}
              className={`default-input input-field !p-0 !text-[14px] ${className} `}
              placeholder={placeholder}
            />
          )}
        />

        {errors && errors[name] && (
          <FieldError className="mt-1" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired, // label should be unique because by default mui use label as key
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      //   Besides label we can send anything in the object, onChange value will give us the whole object
    })
  ).isRequired,
  placeholder: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  onClick: PropTypes.func,
  defaultValue: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
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
