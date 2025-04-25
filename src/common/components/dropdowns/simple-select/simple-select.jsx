import PropTypes from "prop-types";
import useSimpleSelect from "./use-simple-select";
import CustomInput from "../../custom-input/custom-input.component";

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
  placeHolder,
  options,
  isMulti,
  isSearchable,
  onChange,
  defaultValue,
  className = "",
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
  });

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className="flex justify-between items-center px-3 py-2 rounded-md border border-gray-300 bg-white shadow-sm text-sm text-gray-700 cursor-pointer transition-colors"
      >
        <div className="truncate">{getDisplay()}</div>
        <Icon isOpen={showMenu} />
      </div>

      {showMenu && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {isSearchable && (
            <div className="p-2 border-b border-gray-100">
              <CustomInput
                ref={searchRef}
                onChange={onSearch}
                value={searchValue}
                defaultValue={defaultValue}
                placeholder="Search..."
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
                  isSelected(option)
                    ? "bg-secondary-light-blue font-medium"
                    : ""
                }`}
              >
                {option.label}
              </div>
            ))
          ) : (
            <div className="px-3 py-2 text-sm text-gray-400">
              No options found
            </div>
          )}
        </div>
      )}
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
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
