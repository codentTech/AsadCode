import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import SearchableNicheInput from "@/components/campaign/create-campaign/components/searchable-niche-input/searchable-niche-input.component";
import LanguageSelect from "@/components/campaign/create-campaign/components/language-select/language-select.component";
import { X } from "lucide-react";
import {
  PLATFORM_OPTIONS,
  FOLLOWER_OPTIONS,
  GENDER_OPTIONS,
  AGE_OPTIONS,
  AUDIENCE_GENDER_OPTIONS,
  AUDIENCE_AGE_OPTIONS,
  COUNTRY_OPTIONS,
} from "@/common/constants/options.constant";

const FilterModal = ({
  show,
  onClose,
  filterType,
  setFilterType,
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
  onApplyFilters,
}) => {
  const FilterButton = ({ active, onClick, children }) => (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
        active ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );

  return (
    <Modal title="Filter Creators" show={show} onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Filter Type Toggle */}
        <div className="flex items-center justify-center">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button
              onClick={() => setFilterType("creator")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filterType === "creator"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Creator Filters
            </button>
            <button
              onClick={() => setFilterType("audience")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
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
          <div className="space-y-6">
            {/* Platforms */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Platforms</h4>
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

            {/* Minimum Followers */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Minimum Followers</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {FOLLOWER_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={filters.minFollowers === option.value}
                    onClick={() => onFollowerSelect(option.value)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Gender</h4>
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

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Age Range</h4>
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
            <div className="grid grid-cols-2 gap-4">
              <CountrySelect
                label="Country"
                value={
                  filters.country
                    ? {
                        countryName: filters.country,
                        countryCode: filters.country_code || "",
                      }
                    : null
                }
                onChange={(option) =>
                  onFiltersChange({
                    ...filters,
                    country: option?.countryName || "",
                    country_code: option?.countryCode || "",
                    city: "",
                    city_country_code: "",
                  })
                }
              />
              <CitySelect
                label="City"
                countryCode={filters.country_code || ""}
                value={
                  filters.city
                    ? {
                        cityName: filters.city,
                        countryCode: filters.city_country_code || filters.country_code || "",
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
                disabled={!filters.country}
              />
            </div>

            {/* Niche Categories and Language */}
            <div className="grid grid-cols-2 gap-4">
              {/* Niche Categories */}
              <div>
                <SearchableNicheInput
                  selectedNiches={filters.niches || []}
                  onNichesChange={(niches) => {
                    onFiltersChange({ ...filters, niches });
                  }}
                  placeholder="Type to search niches..."
                  handleNicheRemove={(niche) => {
                    const updatedNiches = (filters.niches || []).filter((n) => n !== niche);
                    onFiltersChange({ ...filters, niches: updatedNiches });
                  }}
                />

                {filters.niches && filters.niches.length > 0 && (
                  <div className="space-y-1 mt-2">
                    <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
                    <div className="flex flex-wrap gap-1">
                      {filters.niches?.map((niche) => (
                        <span
                          key={niche}
                          className="inline-flex items-center gap-1 px-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary"
                        >
                          {niche}
                          <CustomButton
                            text=""
                            onClick={() => {
                              const updatedNiches = filters.niches.filter((n) => n !== niche);
                              onFiltersChange({ ...filters, niches: updatedNiches });
                            }}
                            className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                            startIcon={<X className="text-black w-3 h-3 ml-4" />}
                          />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Language */}
              <div>
                <h4 className=" text-xs font-bold leading-[17.5px] text-gray-700 mb-[6px]">
                  Language
                </h4>
                <LanguageSelect
                  selectedLanguage={
                    filters.languages && filters.languages.length > 0 ? filters.languages[0] : null
                  }
                  onLanguageChange={(language) => {
                    onFiltersChange({ ...filters, languages: language ? [language] : [] });
                  }}
                  placeholder="Type to search languages"
                  handleLanguageRemove={() => {
                    onFiltersChange({ ...filters, languages: [] });
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Audience Filters */}
        {filterType === "audience" && (
          <div className="space-y-6">
            {/* Audience Gender */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Audience Gender</h4>
              <p className="text-xs text-gray-600 mb-3">
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
              <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Age Ranges</h4>
              <p className="text-xs text-gray-600 mb-3">
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
              <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Location</h4>
              <p className="text-xs text-gray-600 mb-3">
                Select the country and city where the creator's audience is primarily located
              </p>
              <div className="grid grid-cols-2 gap-4">
                <CountrySelect
                  label="Country"
                  value={
                    audienceFilters.audienceCountries &&
                    audienceFilters.audienceCountries.length > 0
                      ? {
                          countryName: audienceFilters.audienceCountries[0],
                          countryCode: audienceFilters.audienceCountryCode || "",
                        }
                      : null
                  }
                  onChange={(option) =>
                    onAudienceFiltersChange({
                      ...audienceFilters,
                      audienceCountries: option ? [option.countryName] : [],
                      audienceCountryCode: option?.countryCode || "",
                      audienceCity: "",
                      audienceCityCountryCode: "",
                    })
                  }
                />
                <CitySelect
                  label="City"
                  countryCode={audienceFilters.audienceCountryCode || ""}
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
                  disabled={
                    !audienceFilters.audienceCountries ||
                    audienceFilters.audienceCountries.length === 0
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Actions */}
      <div className="flex justify-between items-center mt-6">
        <CustomButton onClick={onClearAllFilters} text="Clear All" className="btn-cancel" />
        <div className="flex gap-3">
          <CustomButton onClick={onClose} text="Cancel" className="btn-cancel" />
          <CustomButton onClick={onApplyFilters} text="Apply Filters" className="btn-primary" />
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;
