import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import {
  campaignTypeOptions,
  compensationTypeOptions,
  locationOptions,
} from "@/common/constants/options.constant";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import useCampaignFilter from "./use-campaign-filter.hook";
import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";

function CampaignFilters() {
  const { filters, setFilters, expandedFilters, toggleFilter, resetFilters, handlePlatformChange } =
    useCampaignFilter();

  const platformOptions = [
    { label: "TikTok", value: "TikTok" },
    { label: "Instagram", value: "Instagram" },
    { label: "YouTube", value: "YouTube" },
  ];

  const recentOptions = [{ label: "Recently Posted", value: "Recently Posted" }];

  return (
    <div className="w-1/4 bg-white col-span-3 border-r p-6">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Campaign Filters</h2>
      </div>

      {/* Campaign Type Filter */}
      <div className="mb-4">
        <div
          onClick={() => toggleFilter("type")}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
        >
          Campaign Type
          {expandedFilters.type ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
        {expandedFilters.type && (
          <SimpleSelect placeHolder="Select campaign type" options={campaignTypeOptions} />
        )}
      </div>

      {/* Platform Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter("platform")}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
        >
          Platform
          {expandedFilters.platform ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedFilters.platform && (
          <div className="space-y-2">
            <CustomCheckboxGroup name="platformOptions" options={platformOptions} />
          </div>
        )}
      </div>

      {/* Compensation Type Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter("compensation")}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
        >
          Compensation Type
          {expandedFilters.compensation ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedFilters.compensation && (
          <SimpleSelect placeHolder="Select compensation type" options={compensationTypeOptions} />
        )}
      </div>

      {/* Location Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleFilter("location")}
          className="flex items-center justify-between w-full py-2 text-sm font-medium text-gray-900"
        >
          Location
          {expandedFilters.location ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        {expandedFilters.location && (
          <SimpleSelect placeHolder="Select location" options={locationOptions} />
        )}
      </div>

      {/* Minimum Payment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-900 mb-2">Minimum Payment ($)</label>
        <CustomInput
          type="number"
          value={filters.minPayment}
          onChange={(e) => setFilters({ ...filters, minPayment: parseInt(e.target.value) || 0 })}
          min="0"
        />
      </div>

      {/* Recently Posted Toggle */}
      <div className="mb-6">
        <CustomCheckboxGroup name="recentOptions" options={recentOptions} />
      </div>

      <CustomButton
        text="Reset Filters"
        className="w-full"
        variant="secondary"
        onClick={resetFilters}
      />
    </div>
  );
}

export default CampaignFilters;
