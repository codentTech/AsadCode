import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import {
  campaignTypeOptions,
  compensationTypeOptions,
  locationOptions,
} from "@/common/constants/options.constant";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
import useCampaignFilter from "./use-campaign-filter.hook";
import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";

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
  } = useCampaignFilter();

  const platformOptions = [
    { label: "TikTok", value: "TikTok" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "YouTube" },
  ];

  const recentOptions = [{ label: "Recently Posted", value: "Recently Posted" }];

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
            <span className="text-xs text-gray-500 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
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
      </div>

      {/* Filters Content */}
      <div className="p-4 flex-1 overflow-y-auto max-h-[calc(100vh-200px)]">
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
                options={campaignTypeOptions}
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
              <CustomCheckboxGroup
                name="platformOptions"
                options={platformOptions}
                value={filters.platforms || []}
                onChange={(values) => setFilters({ ...filters, platforms: values })}
              />
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
                options={compensationTypeOptions}
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
                options={locationOptions}
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

        {/* Recently Posted Toggle */}
        <div className="mb-6">
          <button
            onClick={() => toggleFilter("recent")}
            className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Recently Posted
            {filters.recentlyPosted && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full mr-2">
                Active
              </span>
            )}
            {expandedFilters.recent ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.recent && (
            <div className="mt-2">
              <CustomCheckboxGroup
                name="recentOptions"
                options={recentOptions}
                value={filters.recentlyPosted ? [recentOptions[0].value] : []}
                onChange={(values) => setFilters({ ...filters, recentlyPosted: values.length > 0 })}
              />
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        <CustomButton
          text="Apply Filters"
          className="w-full btn-primary"
          onClick={applyFilters}
          disabled={!hasActiveFilters()}
        />
      </div>
    </div>
  );
}

export default CampaignFilters;
