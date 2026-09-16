import React from "react";

const RequirementToggle = ({
  prefix = "Requirement:",
  value,
  options = [],
  onChange,
  helperContent,
  className = "",
}) => {
  if (!options.length) return null;

  const renderHelper = () => {
    if (typeof helperContent === "function") {
      return helperContent(value);
    }
    return helperContent || null;
  };

  return (
    <div className={`mt-2 flex flex-wrap items-center gap-2 ${className}`}>
      {prefix ? <span className="text-xs text-gray-600 sm:text-sm">{prefix}</span> : null}
      {options.map((option) => {
        const isActive = value === option.value;
        const activeClasses = option.activeClasses || "bg-primary/10 text-primary";
        const inactiveClasses = option.inactiveClasses || "bg-gray-100 text-gray-600";
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange && onChange(option.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              isActive ? activeClasses : inactiveClasses
            }`}
          >
            {option.label}
          </button>
        );
      })}
      {renderHelper()}
    </div>
  );
};

export default RequirementToggle;
