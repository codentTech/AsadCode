import PropTypes from "prop-types";
import useSimpleSelect from "./use-simple-select";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="8"
      viewBox="0 0 13 8"
      fill="none"
    >
      <path
        d="M0.765588 0.745658C0.694086 0.819407 0.637362 0.906987 0.598661 1.00339C0.559959 1.09979 0.540039 1.20312 0.540039 1.30748C0.540039 1.41183 0.559959 1.51516 0.598661 1.61156C0.637362 1.70796 0.694086 1.79554 0.765588 1.86929L5.98929 7.2671C6.06072 7.34094 6.14553 7.39951 6.23889 7.43947C6.33225 7.47943 6.43233 7.5 6.53339 7.5C6.63445 7.5 6.73453 7.47943 6.82789 7.43947C6.92125 7.39951 7.00606 7.34094 7.07749 7.2671L12.3012 1.86929C12.3755 1.79622 12.435 1.70852 12.476 1.61135C12.517 1.51419 12.5388 1.40953 12.54 1.30355C12.5412 1.19756 12.5219 1.0924 12.4831 0.994253C12.4444 0.896107 12.387 0.806968 12.3143 0.732087C12.2417 0.657206 12.1552 0.5981 12.0601 0.558253C11.965 0.518406 11.8631 0.498624 11.7605 0.500074C11.6578 0.501524 11.5565 0.524176 11.4625 0.566694C11.3685 0.609213 11.2836 0.670739 11.213 0.747644L6.53339 5.58364L1.85378 0.747644C1.78248 0.673682 1.69777 0.614955 1.60448 0.574823C1.51118 0.53469 1.41115 0.513939 1.31008 0.513754C1.20902 0.51357 1.10891 0.533957 1.01548 0.573749C0.922054 0.613541 0.837138 0.671957 0.765588 0.745658Z"
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
  className,
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
    <div className={`relative rounded-[5px] text-left ${className}`}>
      <div
        ref={inputRef}
        onClick={handleInputClick}
        className="flex select-none items-center gap-2 whitespace-nowrap"
      >
        <div className="dropdown-selected-value !text-sm !leading-[18px] !text-[#46474f]">
          {getDisplay()}
        </div>
        <div className="dropdown-tools">
          <div className="dropdown-tool">
            <Icon />
          </div>
        </div>
      </div>
      {showMenu && (
        <div className="absolute z-[99] max-h-[150px] w-full translate-y-1 overflow-auto rounded-[5px] border border-solid border-[#ccc] bg-white">
          {isSearchable && (
            <div className="bg-[#eee] p-[5px] ">
              <input
                className="box-border w-full rounded-[5px] border border-solid border-[#ccc] p-[5px] outline-none"
                onChange={onSearch}
                value={searchValue}
                ref={searchRef}
                defaultValue={defaultValue}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Prevent form submission
                  }
                }}
              />
            </div>
          )}
          {getOptions() &&
            getOptions()?.map((option) => (
              <div
                onClick={() => onItemClick(option)}
                key={option.value}
                className={`cursor-pointer whitespace-nowrap p-[5px] text-black selection:bg-[#0d6efd] hover:bg-[#9fc3f870] ${
                  isSelected(option) && "selected"
                }`}
              >
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

SimpleSelect.propTypes = {
  placeHolder: PropTypes.string,
  className: PropTypes.string,
  options: PropTypes.string,
  isMulti: PropTypes.bool,
  isSearchable: PropTypes.bool,
  onChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
