import { X } from "lucide-react";
import {
  NICHE_OPTIONS,
  PLATFORM_OPTIONS,
  FOLLOWER_OPTIONS,
  GENDER_OPTIONS,
  LANGUAGE_OPTIONS,
  AUDIENCE_GENDER_OPTIONS,
  AUDIENCE_AGE_OPTIONS,
  COUNTRY_OPTIONS,
} from "@/common/constants/options.constant";
import COUNTRIES from "@/common/constants/countries.constant";

const FilterTag = ({ children, onRemove, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200",
    purple: "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${colorClasses[color]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${color === "blue" ? "bg-blue-600" : "bg-purple-600"}`}
      ></span>
      {children}
      <button
        onClick={onRemove}
        className={`ml-1 rounded-full p-0.5 transition-colors ${
          color === "blue"
            ? "hover:text-blue-900 hover:bg-blue-300"
            : "hover:text-purple-900 hover:bg-purple-300"
        }`}
        title="Remove filter"
      >
        <X size={12} />
      </button>
    </span>
  );
};

const ActiveFilters = ({
  filters,
  audienceFilters,
  onNicheToggle,
  onPlatformToggle,
  onFollowerSelect,
  onGenderSelect,
  onAgeSelect,
  onLanguageToggle,
  onAudienceGenderSelect,
  onAudienceAgeToggle,
  onAudienceCountryToggle,
  onFiltersChange,
  onAudienceFiltersChange,
  onClearAllFilters,
}) => {
  const countActiveFilters = () => {
    const countriesCount = Array.isArray(filters.countries) ? filters.countries.length : 0;
    return (
      filters.niches.length +
      filters.platforms.length +
      (filters.minFollowers ? 1 : 0) +
      (filters.gender ? 1 : 0) +
      (filters.ageRange ? 1 : 0) +
      countriesCount +
      (filters.city ? 1 : 0) +
      (filters.languages?.length || 0) +
      (audienceFilters.audienceGender ? 1 : 0) +
      audienceFilters.audienceAgeRanges.length +
      audienceFilters.audienceCountries.length +
      (audienceFilters.audienceCity ? 1 : 0)
    );
  };

  const hasCreatorFilters = () => {
    const hasCountries = Array.isArray(filters.countries) && filters.countries.length > 0;
    return (
      filters.niches.length > 0 ||
      filters.platforms.length > 0 ||
      filters.minFollowers ||
      filters.gender ||
      filters.ageRange ||
      hasCountries ||
      filters.city ||
      (filters.languages && filters.languages.length > 0)
    );
  };

  const hasAudienceFilters = () => {
    return (
      audienceFilters.audienceGender ||
      audienceFilters.audienceAgeRanges.length > 0 ||
      audienceFilters.audienceCountries.length > 0 ||
      audienceFilters.audienceCity
    );
  };

  return (
    <div className="mb-6">
      <div className="border rounded-xl p-4 bg-white shadow-sm">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-700">Active Filters</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {countActiveFilters()}
            </span>
          </div>
          <button
            onClick={onClearAllFilters}
            className="text-xs text-gray-500 hover:text-red-600 font-medium transition-colors"
          >
            Clear all filters
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex gap-5">
          {/* Creator Filters Section */}
          {hasCreatorFilters() && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                  Creator Filters
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Niche Filters */}
                {filters.niches.map((niche) => (
                  <FilterTag key={niche} onRemove={() => onNicheToggle(niche)} color="blue">
                    {NICHE_OPTIONS.find((n) => n.value === niche)?.label}
                  </FilterTag>
                ))}

                {/* Platform Filters */}
                {filters.platforms.map((platform) => (
                  <FilterTag
                    key={platform}
                    onRemove={() => onPlatformToggle(platform)}
                    color="blue"
                  >
                    {PLATFORM_OPTIONS.find((p) => p.value === platform)?.label}
                  </FilterTag>
                ))}

                {/* Min Followers Filter */}
                {filters.minFollowers && (
                  <FilterTag onRemove={() => onFollowerSelect(filters.minFollowers)} color="blue">
                    {FOLLOWER_OPTIONS.find((f) => f.value === filters.minFollowers)?.label}+
                    followers
                  </FilterTag>
                )}

                {/* Gender Filter */}
                {filters.gender && (
                  <FilterTag onRemove={() => onGenderSelect(filters.gender)} color="blue">
                    {GENDER_OPTIONS.find((g) => g.value === filters.gender)?.label}
                  </FilterTag>
                )}

                {/* Age Range Filter */}
                {filters.ageRange && (
                  <FilterTag onRemove={() => onAgeSelect(filters.ageRange)} color="blue">
                    Age {filters.ageRange}
                  </FilterTag>
                )}

                {/* Language Filters */}
                {filters.languages &&
                  filters.languages.length > 0 &&
                  filters.languages.map((language) => (
                    <FilterTag
                      key={language}
                      onRemove={() => onLanguageToggle(language)}
                      color="blue"
                    >
                      {LANGUAGE_OPTIONS.find((l) => l.value === language)?.label || language}
                    </FilterTag>
                  ))}

                {/* Country Filters */}
                {Array.isArray(filters.countries) &&
                  filters.countries.length > 0 &&
                  filters.countries.map((countryName) => {
                    const countryLabel =
                      COUNTRIES.find((c) => c.label === countryName || c.code === countryName)
                        ?.label || countryName;
                    return (
                      <FilterTag
                        key={countryName}
                        onRemove={() => {
                          const updatedCountries = filters.countries.filter(
                            (c) => c !== countryName
                          );
                          onFiltersChange({
                            ...filters,
                            countries: updatedCountries,
                          });
                        }}
                        color="blue"
                      >
                        Country: {countryLabel}
                      </FilterTag>
                    );
                  })}

                {/* City Filter */}
                {filters.city && (
                  <FilterTag
                    onRemove={() => onFiltersChange({ ...filters, city: "" })}
                    color="blue"
                  >
                    City: {filters.city}
                  </FilterTag>
                )}
              </div>
            </div>
          )}

          {/* Audience Filters Section */}
          {hasAudienceFilters() && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-100">
                  Audience Filters
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Audience Gender Filter */}
                {audienceFilters.audienceGender && (
                  <FilterTag
                    onRemove={() => onAudienceGenderSelect(audienceFilters.audienceGender)}
                    color="purple"
                  >
                    {
                      AUDIENCE_GENDER_OPTIONS.find(
                        (g) => g.value === audienceFilters.audienceGender
                      )?.label
                    }
                  </FilterTag>
                )}

                {/* Audience Age Range Filters */}
                {audienceFilters.audienceAgeRanges.map((age) => (
                  <FilterTag key={age} onRemove={() => onAudienceAgeToggle(age)} color="purple">
                    Age {AUDIENCE_AGE_OPTIONS.find((a) => a.value === age)?.label}
                  </FilterTag>
                ))}

                {/* Audience Country Filters */}
                {audienceFilters.audienceCountries &&
                  audienceFilters.audienceCountries.length > 0 &&
                  audienceFilters.audienceCountries.map((countryName) => {
                    const countryLabel =
                      COUNTRIES.find((c) => c.label === countryName || c.code === countryName)
                        ?.label || countryName;
                    return (
                      <FilterTag
                        key={countryName}
                        onRemove={() => onAudienceCountryToggle(countryName)}
                        color="purple"
                      >
                        Audience Country: {countryLabel}
                      </FilterTag>
                    );
                  })}

                {/* Audience City Filter */}
                {audienceFilters.audienceCity && (
                  <FilterTag
                    onRemove={() =>
                      onAudienceFiltersChange({ ...audienceFilters, audienceCity: "" })
                    }
                    color="purple"
                  >
                    Audience City: {audienceFilters.audienceCity}
                  </FilterTag>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;
