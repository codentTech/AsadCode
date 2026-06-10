import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import {
  CAMPAIGN_TYPE_OPTIONS,
  COMPENSATION_TYPE_OPTIONS,
  LOCATION_OPTIONS,
} from "@/common/constants/options.constant";
import { ChevronDown, ChevronUp } from "lucide-react";

const PLATFORM_OPTIONS = [
  { label: "TikTok", value: "TikTok" },
  { label: "Instagram", value: "Instagram" },
  { label: "YouTube", value: "YouTube" },
];

function CampaignFiltersForm({ filters, setFilters, expandedFilters, toggleFilter }) {
  return (
    <div className="p-3 sm:p-4">
      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("type")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Campaign Type
          {expandedFilters.type ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
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

      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("platform")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Platform
          {filters.platforms?.length > 0 && (
            <span className="mr-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
              {filters.platforms.length}
            </span>
          )}
          {expandedFilters.platform ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedFilters.platform && (
          <div className="mt-2 space-y-2">
            {PLATFORM_OPTIONS.map((option) => (
              <label key={option.value} className="flex items-center gap-2 text-xs">
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
                  className="h-3.5 w-3.5 cursor-pointer accent-primary"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("compensation")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Compensation Type
          {expandedFilters.compensation ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
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

      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("eligibility")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Eligibility
          {expandedFilters.eligibility ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
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
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-[10px] font-medium transition-all duration-200 ${
                  filters.eligibleOnly
                    ? "bg-primary text-white shadow-sm hover:bg-primary/90"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span>Only Display campaigns I am eligible for</span>
                <span
                  className={`ml-2 rounded px-2 py-0.5 text-[9px] font-semibold ${
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

      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("location")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Location
          {expandedFilters.location ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
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

      <div className="mb-4">
        <button
          type="button"
          onClick={() => toggleFilter("payment")}
          className="flex w-full items-center justify-between py-2 text-xs font-medium text-gray-900 transition-colors hover:text-gray-700 sm:text-sm"
        >
          Minimum Payment
          {filters.minPayment > 0 && (
            <span className="mr-2 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800">
              ${filters.minPayment}
            </span>
          )}
          {expandedFilters.payment ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
        {expandedFilters.payment && (
          <div className="mt-2">
            <CustomInput
              type="number"
              placeholder="Enter minimum amount"
              value={filters.minPayment || ""}
              onChange={(e) =>
                setFilters({ ...filters, minPayment: parseInt(e.target.value, 10) || 0 })
              }
              min="0"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignFiltersForm;
