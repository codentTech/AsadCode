import Modal from "@/common/components/modal/modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import {
  PLATFORM_OPTIONS,
  FOLLOWER_OPTIONS,
  GENDER_OPTIONS,
  AGE_OPTIONS,
  NICHE_OPTIONS,
  LANGUAGE_OPTIONS,
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
            {/* Niche Categories */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Niche Categories</h4>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {NICHE_OPTIONS.map((niche) => (
                  <FilterButton
                    key={niche.value}
                    active={filters.niches.includes(niche.value)}
                    onClick={() => onNicheToggle(niche.value)}
                  >
                    {niche.label}
                  </FilterButton>
                ))}
              </div>
            </div>

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

            {/* Demographics */}
            <div className="grid grid-cols-1 gap-4">
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Gender</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {GENDER_OPTIONS.map((option) => (
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

              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Language</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <FilterButton
                      key={option.value}
                      active={filters.languages?.includes(option.value)}
                      onClick={() => onLanguageToggle(option.value)}
                    >
                      {option.label}
                    </FilterButton>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="grid grid-cols-2 gap-4">
              <CustomInput
                label="Country"
                placeholder="Enter country"
                value={filters.country}
                onChange={(e) => onFiltersChange({ ...filters, country: e.target.value })}
              />
              <CustomInput
                label="City"
                placeholder="Enter city"
                value={filters.city}
                onChange={(e) => onFiltersChange({ ...filters, city: e.target.value })}
              />
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

            {/* Top Audience Country */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience Country</h4>
              <p className="text-xs text-gray-600 mb-3">
                Select countries where the creator's audience is located
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {COUNTRY_OPTIONS.map((option) => (
                  <FilterButton
                    key={option.value}
                    active={audienceFilters.audienceCountries.includes(option.value)}
                    onClick={() => onAudienceCountryToggle(option.value)}
                  >
                    {option.label}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* Top Audience City */}
            <div>
              <h4 className="text-sm font-bold text-gray-900 mb-2">Top Audience City</h4>
              <p className="text-xs text-gray-600 mb-3">
                Useful for location-specific businesses like restaurants or hotels
              </p>
              <CustomInput
                placeholder="Enter city (e.g., New York, Los Angeles)"
                value={audienceFilters.audienceCity}
                onChange={(e) =>
                  onAudienceFiltersChange({ ...audienceFilters, audienceCity: e.target.value })
                }
              />
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
