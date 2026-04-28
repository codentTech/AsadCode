import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import {
  CAMPAIGN_TYPE_OPTIONS,
  COMPENSATION_TYPE_OPTIONS,
  LOCATION_OPTIONS,
} from "@/common/constants/options.constant";
import { ChevronDown, ChevronUp, Filter, RotateCcw } from "lucide-react";
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
  } = useCampaignFilter();

  const platformOptions = [
    { label: "TikTok", value: "TikTok" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "YouTube" },
  ];

  return (
    <div className="w-full bg-white border-x flex flex-col min-h-0 max-h-[min(75dvh,640px)] lg:max-h-none">
      {/* Header Section */}
      <div className="p-3 sm:p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 shrink-0 text-gray-600 sm:h-5 sm:w-5" />
            <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
              Campaign Filters
            </h2>
          </div>
          <button
            onClick={resetFilters}
            disabled={!hasActiveFilters()}
            className="inline-flex items-center gap-1 text-[10px] font-medium text-gray-500 transition-colors hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 sm:text-xs"
          >
            <RotateCcw size={12} />
            Clear all
          </button>
        </div>
      </div>

      {/* Filters Content */}
      <div className="p-3 sm:p-4 flex-1 overflow-y-auto min-h-0 lg:max-h-[calc(100dvh-14rem)]">
        {/* Campaign Type Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("type")}
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
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
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
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
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
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

        {/* Eligibility Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("eligibility")}
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Eligibility
            {expandedFilters.eligibility ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.eligibility && (
            <div className="mt-2">
              <div
                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2"
                title="Filters campaigns to only show those you qualify for based on your country, city, follower count, connected platforms, and gender."
              >
                <button
                  type="button"
                  onClick={() => setFilters({ ...filters, eligibleOnly: !filters.eligibleOnly })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-medium transition-all duration-200 ${
                    filters.eligibleOnly
                      ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <span>Only Display campaigns I am eligible for</span>
                  <span
                    className={`ml-2 px-2 py-0.5 rounded text-[9px] font-semibold ${
                      filters.eligibleOnly ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {filters.eligibleOnly ? "ON" : "OFF"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Location Filter */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("location")}
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
          >
            Location
            {expandedFilters.location ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedFilters.location && (
            <div className="mt-2 space-y-3">
              <SimpleSelect
                placeHolder="Select location"
                options={LOCATION_OPTIONS}
                value={filters.location}
                onChange={(value) => setFilters({ ...filters, location: value })}
              />

              <CountrySelect
                label="Country (of brand)"
                value={filters.brandCountry}
                onChange={(selection) =>
                  setFilters({ ...filters, brandCountry: selection, brandCity: null })
                }
                autoDetect={false}
                isRequired={false}
              />

              <CitySelect
                label="City (optional)"
                countryCode={filters.brandCountry?.countryCode}
                value={filters.brandCity}
                onChange={(selection) => setFilters({ ...filters, brandCity: selection })}
                isRequired={false}
              />
            </div>
          )}
        </div>

        {/* Minimum Payment */}
        <div className="mb-4">
          <button
            onClick={() => toggleFilter("payment")}
            className="flex items-center justify-between w-full py-2 text-xs sm:text-sm font-medium text-gray-900 hover:text-gray-700 transition-colors"
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
      <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50 space-y-3">
        <CustomButton
          text="Apply Filters"
          className="btn-primary w-full"
          onClick={applyFilters}
          loading={isLoading}
          loadingText="Applying"
          disabled={!hasActiveFilters() || isLoading}
        />
      </div>
    </div>
  );
}

export default CampaignFilters;
