import CustomButton from "@/common/components/custom-button/custom-button.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import StateSelect from "@/common/components/dropdowns/state-select/state-select.component";
import LanguageSelect from "@/common/components/dropdowns/language-select/language-select.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import {
  AGE_OPTIONS,
  AUDIENCE_AGE_OPTIONS,
  AUDIENCE_GENDER_OPTIONS,
  FOLLOWER_OPTIONS,
  GENDER_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/common/constants/options.constant";
import COUNTRIES from "@/common/constants/countries.constant";
import SearchableNicheInput from "@/components/campaign-refactored/shared/create-campaign/components/searchable-niche-input/searchable-niche-input.component";
import { X } from "lucide-react";
import { useMemo, useState } from "react";

const FilterModal = ({
  show,
  onClose,
  filterType,
  setFilterType,
  filters,
  audienceFilters,
  onNicheToggle,
  onPlatformToggle,
  onFollowerRangeChange,
  onGenderSelect,
  onAgeSelect,
  onLanguageToggle,
  onAudienceGenderSelect,
  onAudienceAgeToggle,
  onAudienceCountryToggle,
  onFiltersChange,
  onAudienceFiltersChange,
  onClearAllFilters,
  onApplyFilters,
}) => {
  const [countrySelectValue, setCountrySelectValue] = useState(null);

  const selectedCountries = Array.isArray(filters.countries)
    ? filters.countries
    : filters.country
      ? [filters.country]
      : [];
  const followerFromOptions = useMemo(
    () => [{ value: "", label: "No minimum" }, ...FOLLOWER_OPTIONS],
    []
  );
  const followerToOptions = useMemo(
    () => [{ value: "", label: "No maximum" }, ...FOLLOWER_OPTIONS],
    []
  );

  const selectedCountryDetails = useMemo(() => {
    return selectedCountries
      .map((countryName) => {
        const countryMeta = COUNTRIES.find(
          (country) => country.label === countryName || country.code === countryName
        );
        return {
          code: countryMeta?.code || countryName,
          name: countryMeta?.label || countryName,
        };
      })
      .filter((country) => Boolean(country.code));
  }, [selectedCountries]);

  const allowedCountryCodes = useMemo(
    () =>
      selectedCountryDetails.length > 0
        ? selectedCountryDetails.map((country) => String(country.code).toUpperCase())
        : [],
    [selectedCountryDetails]
  );

  const primaryCountryCode = selectedCountryDetails[0]?.code || null;

  const handleCountrySelect = (country) => {
    if (!country) {
      setCountrySelectValue(null);
      return;
    }

    const countryName = country.countryName || country.label || "";
    if (!countryName) return;

    const existing = selectedCountries || [];
    if (existing.includes(countryName)) {
      setCountrySelectValue(null);
      return;
    }

    const updated = [...existing, countryName];
    onFiltersChange({
      ...filters,
      countries: updated,
      country_code: country.countryCode || "",
      city: "",
      city_country_code: "",
      state: "",
      state_short: "",
    });
    setCountrySelectValue(null);
  };

  const handleCountryRemove = (countryName) => {
    const updated = selectedCountries.filter((c) => c !== countryName);
    const nextCountryCode =
      updated.length === 0
        ? ""
        : (() => {
            const firstName = updated[0];
            const meta = COUNTRIES.find((c) => c.label === firstName || c.code === firstName);
            return meta?.code ? String(meta.code).toUpperCase() : "";
          })();
    onFiltersChange({
      ...filters,
      countries: updated,
      country_code: nextCountryCode,
      city: "",
      city_country_code: "",
      state: "",
      state_short: "",
    });
  };

  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`rounded-lg px-2 py-1.5 text-[10px] font-medium transition-colors sm:px-3 sm:py-2 sm:text-xs ${
        active ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <Modal title="Filter Creators" show={show} onClose={onClose} size="lg">
      <div className="space-y-4 sm:space-y-6">
        {/* Filter Type Toggle */}
        <div className="flex items-center justify-center">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => setFilterType("creator")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                filterType === "creator"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Creator Filters
            </button>
            <button
              onClick={() => setFilterType("audience")}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
                filterType === "audience"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Audience Filters
            </button>
          </div>
        </div>

        {/* Creator Filters */}
        {filterType === "creator" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Platforms */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Platforms</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                  {PLATFORM_OPTIONS.map((platform) => (
                    <FilterButton
                      key={platform.value}
                      active={filters.platforms.includes(platform.value)}
                      onClick={() => onPlatformToggle(platform.value)}
                    >
                      {platform.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Gender</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GENDER_OPTIONS?.filter((option) => option.value !== "").map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters.gender === option.value}
                      onClick={() => onGenderSelect(option.value)}
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Follower Range */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
                Follower Range
              </h4>
              <p className="mb-3 text-[10px] text-gray-600 sm:text-xs">
                Applies per selected platform. Creators match if any selected platform falls in
                range.
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SimpleSelect
                  label="From"
                  placeHolder="No minimum"
                  options={followerFromOptions}
                  value={filters.minFollowers}
                  onChange={(opt) =>
                    onFollowerRangeChange(
                      "minFollowers",
                      opt && typeof opt === "object" ? String(opt.value ?? "") : ""
                    )
                  }
                  className="normal-case"
                />
                <SimpleSelect
                  label="To"
                  placeHolder="No maximum"
                  options={followerToOptions}
                  value={filters.minFollowersTo}
                  onChange={(opt) =>
                    onFollowerRangeChange(
                      "minFollowersTo",
                      opt && typeof opt === "object" ? String(opt.value ?? "") : ""
                    )
                  }
                  className="normal-case"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Age Range</h4>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                  {AGE_OPTIONS.map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters.ageRange === option.value}
                      onClick={() => onAgeSelect(option.value)}
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">Country</h4>
                <CountrySelect
                  label="Add country"
                  value={countrySelectValue}
                  onChange={handleCountrySelect}
                />
                {selectedCountryDetails.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCountryDetails.map((country) => (
                      <span
                        key={country.code}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-2 py-1 text-[10px] text-gray-700 sm:px-3 sm:text-xs"
                      >
                        {country.name}
                        <button
                          type="button"
                          onClick={() => handleCountryRemove(country.name)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {selectedCountryDetails.length > 0 && (
                <div>
                  <StateSelect
                    label="State or Province (Optional)"
                    countryCode={primaryCountryCode || filters.country_code || ""}
                    countryCodes={allowedCountryCodes}
                    value={
                      filters.state
                        ? {
                            stateName: filters.state,
                            stateShort: filters.state_short || "",
                          }
                        : null
                    }
                    onChange={(option) => {
                      if (!option) {
                        onFiltersChange({
                          ...filters,
                          state: "",
                          state_short: "",
                        });
                        return;
                      }
                      onFiltersChange({
                        ...filters,
                        state: option.stateName || "",
                        state_short: option.stateShort || "",
                        city: "",
                        city_country_code: "",
                      });
                    }}
                  />
                </div>
              )}
              <div>
                <CitySelect
                  label="City"
                  countryCode={primaryCountryCode || filters.country_code || ""}
                  countryCodes={allowedCountryCodes}
                  stateName={filters.state || ""}
                  stateShort={filters.state_short || ""}
                  value={
                    filters.city
                      ? {
                          cityName: filters.city,
                          countryCode:
                            filters.city_country_code ||
                            primaryCountryCode ||
                            filters.country_code ||
                            "",
                        }
                      : null
                  }
                  onChange={(option) =>
                    onFiltersChange({
                      ...filters,
                      city: option?.cityName || "",
                      city_country_code: option?.countryCode || "",
                    })
                  }
                />
              </div>
            </div>

            {/* Niche Categories and Language */}
            <div className="grid grid-cols-1 gap-4">
              {/* Niche Categories */}
              <div>
                <SearchableNicheInput
                  selectedNiches={filters.niches || []}
                  onNichesChange={(niches) => {
                    onFiltersChange({ ...filters, niches });
                  }}
                  placeholder="Type to search niches"
                  handleNicheRemove={(niche) => {
                    const updatedNiches = (filters.niches || []).filter((n) => n !== niche);
                    onFiltersChange({ ...filters, niches: updatedNiches });
                  }}
                />
              </div>

              {/* Language */}
              <div>
                <LanguageSelect
                  label="Language"
                  name="languages"
                  value={Array.isArray(filters.languages) ? filters.languages : []}
                  onChange={(languages) => {
                    onFiltersChange({ ...filters, languages });
                  }}
                  maxSelections={1}
                />
              </div>
            </div>
          </div>
        )}

        {/* Audience Filters */}
        {filterType === "audience" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Audience Gender */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
                Audience Gender
              </h4>
              <p className="mb-3 text-[10px] text-gray-600 sm:text-xs">
                Select the primary gender of the creator's audience
              </p>
              <div className="grid grid-cols-2 gap-2">
                {AUDIENCE_GENDER_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={audienceFilters.audienceGender === option.value}
                    onClick={() => onAudienceGenderSelect(option.value)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Top Audience Age Ranges */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
                Top Audience Age Ranges
              </h4>
              <p className="mb-3 text-[10px] text-gray-600 sm:text-xs">
                Select multiple age ranges that make up the creator's primary audience
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {AUDIENCE_AGE_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={audienceFilters.audienceAgeRanges.includes(option.value)}
                    onClick={() => onAudienceAgeToggle(option.value)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Top Audience Location */}
            <div>
              <h4 className="mb-2 text-xs font-semibold text-gray-900 sm:text-sm">
                Top Audience Location
              </h4>
              <p className="mb-3 text-[10px] text-gray-600 sm:text-xs">
                Select the country and city where the creator's audience is primarily located
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <CountrySelect
                  label="Country"
                  value={
                    audienceFilters.audienceCountries &&
                    audienceFilters.audienceCountries.length > 0
                      ? {
                          countryName:
                            COUNTRIES.find(
                              (country) =>
                                country.code ===
                                String(audienceFilters.audienceCountries[0] || "").toUpperCase()
                            )?.label || "",
                          countryCode: audienceFilters.audienceCountryCode || "",
                        }
                      : null
                  }
                  onChange={(option) =>
                    onAudienceFiltersChange({
                      ...audienceFilters,
                      audienceCountries: option
                        ? [String(option.countryCode || "").toUpperCase()]
                        : [],
                      audienceCountryCode: option?.countryCode
                        ? String(option.countryCode).toUpperCase()
                        : "",
                      audienceCity: "",
                      audienceCityCountryCode: "",
                    })
                  }
                />
                <CitySelect
                  label="City"
                  countryCode={audienceFilters.audienceCountryCode || ""}
                  countryCodes={
                    audienceFilters.audienceCountries &&
                    audienceFilters.audienceCountries.length > 0
                      ? audienceFilters.audienceCountries.map((country) =>
                          String(country).toUpperCase()
                        )
                      : []
                  }
                  value={
                    audienceFilters.audienceCity
                      ? {
                          cityName: audienceFilters.audienceCity,
                          countryCode:
                            audienceFilters.audienceCityCountryCode ||
                            audienceFilters.audienceCountryCode ||
                            "",
                        }
                      : null
                  }
                  onChange={(option) =>
                    onAudienceFiltersChange({
                      ...audienceFilters,
                      audienceCity: option?.cityName || "",
                      audienceCityCountryCode: option?.countryCode || "",
                    })
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="mt-4 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:items-center sm:justify-between">
        <CustomButton
          onClick={onClearAllFilters}
          text="Clear All"
          className="btn-cancel w-full sm:w-auto"
        />
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:gap-3">
          <CustomButton onClick={onClose} text="Cancel" className="btn-cancel" />
          <CustomButton onClick={onApplyFilters} text="Apply Filters" className="btn-primary" />
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
