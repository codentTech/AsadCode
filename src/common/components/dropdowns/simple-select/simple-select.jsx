import PropTypes from "prop-types";
import useSimpleSelect from "./use-simple-select";
import CustomInput from "../../custom-input/custom-input.component";
import FieldLabel from "../../field-label/field-label.component";
import FieldError from "../../field-error/field-error.component";

function Icon({ isOpen }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
      className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
    >
      <path
        d="M0.77 0.75a1.03 1.03 0 0 0 0 1.12l5.22 5.4c.14.15.33.23.53.23s.39-.08.53-.23l5.22-5.4a1.02 1.02 0 0 0 0-1.12 1 1 0 0 0-1.5 0L6.53 5.58 2.01 0.75a1 1 0 0 0-1.24 0Z"
        fill="#7E7D7D"
      />
    </svg>
  );
}

export default function SimpleSelect({
  label,
  placeHolder = "Select an option",
  options,
  isMulti,
  isSearchable,
  onChange,
  defaultValue,
  value,
  className = "",
  name,
  errors = null,
  register = null,
  isRequired = false,
  isDisabled = false,
}) {
  const {
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
  } = useSimpleSelect({
    placeHolder,
    options,
    isMulti,
    isSearchable,
    onChange,
    defaultValue,
    value,
  });

  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    handleInputClick(event);
  };

  return (
    <div
      className={`flex w-full flex-col gap-[6px] ${className} text-xs font-medium capitalize not-italic leading-6 text-text-black`}
    >
      {label && <FieldLabel label={label} isRequired={isRequired} />}

      <div className="relative w-full">
        <div
          ref={inputRef}
          onClick={handleClick}
          className={`flex justify-between items-center px-3 py-[9px] rounded-md border ${
            errors && errors[name] ? "border-red-500" : "border-[#7e7d7d]"
          } ${isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 cursor-pointer"} shadow-sm text-sm transition-colors`}
        >
          <div className="truncate">{getDisplay()}</div>
          <Icon isOpen={showMenu && !isDisabled} />
        </div>

        {showMenu && !isDisabled && (
          <div
            className={`absolute z-50 mt-1 ${
              isSearchable && isMulti
                ? "top-10"
                : isSearchable
                  ? "top-10"
                  : label
                    ? "top-10"
                    : "top-10"
            } w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg`}
          >
            {isSearchable && (
              <div className="p-2 border-b border-gray-100">
                <CustomInput
                  ref={searchRef}
                  onChange={onSearch}
                  value={searchValue}
                  defaultValue={defaultValue}
                  placeholder="Type to search"
                  className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none"
                />
              </div>
            )}

            {getOptions()?.length > 0 ? (
              getOptions().map((option) => (
                <div
                  key={option.value}
                  onClick={() => onItemClick(option)}
                  className={`cursor-pointer px-3 py-2 text-sm hover:bg-secondary-light-blue ${
                    isSelected(option) ? "bg-secondary-light-blue font-medium" : ""
                  }`}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">No options found</div>
            )}
          </div>
        )}

        {errors && errors[name] && (
          <FieldError className="mt-1 normal-case" error={errors[name].message} />
        )}
      </div>
    </div>
  );
}

SimpleSelect.propTypes = {
  placeHolder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ]),
  // New prop types for validation
  name: PropTypes.string,
  errors: PropTypes.object,
  register: PropTypes.func,
  label: PropTypes.string,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
