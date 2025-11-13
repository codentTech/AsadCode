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
    <div className={`flex items-center gap-2 mt-2 ${className}`}>
      {prefix ? <span className="text-sm text-gray-600">{prefix}</span> : null}
      {options.map((option) => {
        const isActive = value === option.value;
        const activeClasses = option.activeClasses || "bg-blue-100 text-blue-700";
        const inactiveClasses = option.inactiveClasses || "bg-gray-100 text-gray-600";
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange && onChange(option.value)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
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
