import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import {
  CAMPAIGN_TYPE_OPTIONS,
  COMPENSATION_TYPE_OPTIONS,
  LOCATION_OPTIONS,
} from "@/common/constants/options.constant";
import { ChevronDown, ChevronUp, Filter, Loader2, RotateCcw } from "lucide-react";
import useCampaignFilter from "./use-campaign-filter.hook";

function CampaignFilters() {
  const {
    filters,
    setFilters,
    expandedFilters,
    toggleFilter,
    resetFilters,
    handlePlatformChange,
    applyFilters,
    hasActiveFilters,
    isLoading,
    isError,
    message,
  } = useCampaignFilter();

  const platformOptions = [
    { label: "TikTok", value: "TikTok" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "YouTube" },
  ];

  return (
    <div className="w-1/4 bg-white col-span-3 border-x">
      {/* Header Section */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Campaign Filters</h2>
        </div>
        {hasActiveFilters() && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 bg-blue-100 px-2 py-1 rounded-full">
              {/* Count active filters */}
              {
                Object.values(filters).filter((value) =>
                  Array.isArray(value)
                    ? value.length > 0
                    : typeof value === "string"
                      ? value.trim() !== ""
                      : typeof value === "number"
                        ? value > 0
                        : Boolean(value)
                ).length
              }{" "}
              active
            </span>
            <button
              onClick={resetFilters}
              className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={12} />
              Clear all
            </button>
          </div>
        )}
        {/* Error Message */}
        {isError && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
            {message || "Error applying filters"}
          </div>
        )}
      </div>

      {/* Filters Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[70vh]">
        {/* Campaign Type Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("type")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Campaign Type
            {expandedFilters.type ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.type && (
            <div className="mt-2">
              <SimpleSelect
                placeHolder="Select campaign type"
                options={CAMPAIGN_TYPE_OPTIONS}
                value={filters.campaignType}
                onChange={(value) => setFilters({ ...filters, campaignType: value })}
              />
            </div>
          )}
        </div>

        {/* Platform Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("platform")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Platform
            {filters.platforms?.length > 0 && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full mr-2">
                {filters.platforms.length}
              </span>
            )}
            {expandedFilters.platform ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.platform && (
            <div className="mt-2 space-y-2">
              <div className="space-y-2">
                {platformOptions.map((option) => (
                  <label key={option.value} className="flex items-center text-xs gap-2">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={filters.platforms?.includes(option.value) || false}
                      onChange={(e) => {
                        const newPlatforms = e.target.checked
                          ? [...(filters.platforms || []), option.value]
                          : (filters.platforms || []).filter((p) => p !== option.value);
                        setFilters({ ...filters, platforms: newPlatforms });
                      }}
                      className="h-3.5 w-3.5 accent-primary cursor-pointer"
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Compensation Type Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("compensation")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Compensation Type
            {expandedFilters.compensation ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.compensation && (
            <div className="mt-2">
              <SimpleSelect
                placeHolder="Select compensation type"
                options={COMPENSATION_TYPE_OPTIONS}
                value={filters.compensationType}
                onChange={(value) => setFilters({ ...filters, compensationType: value })}
              />
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("location")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Location
            {expandedFilters.location ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.location && (
            <div className="mt-2">
              <SimpleSelect
                placeHolder="Select location"
                options={LOCATION_OPTIONS}
                value={filters.location}
                onChange={(value) => setFilters({ ...filters, location: value })}
              />
            </div>
          )}
        </div>

        {/* Minimum Payment */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("payment")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Minimum Payment
            {filters.minPayment > 0 && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full mr-2">
                ${filters.minPayment}
              </span>
            )}
            {expandedFilters.payment ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.payment && (
            <div className="mt-2">
              <CustomInput
                type="number"
                placeholder="Enter minimum amount"
                value={filters.minPayment || ""}
                onChange={(e) =>
                  setFilters({ ...filters, minPayment: parseInt(e.target.value) || 0 })
                }
                min="0"
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        <CustomButton
          text={isLoading ? "Applying..." : "Apply Filters"}
          className="w-full btn-primary"
          onClick={applyFilters}
          disabled={!hasActiveFilters() || isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
        </CustomButton>
      </div>
    </div>
  );
}

export default CampaignFilters;
