import CustomButton from "@/common/components/custom-button/custom-button.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import { ArrowLeft, Calendar, CheckCircle, Globe, Hash, MapPin, UserCheck, X } from "lucide-react";
import SetupProgress from "../../components/setup-progress/setup-progress.component";
import useIdealCreator from "./use-ideal-creator.hook";

const IdealCreator = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    isLoading,
    minFollowers,
    selectedGender,
    selectedCountries,
    selectedCities,
    selectedAgeRanges,
    selectedPlatforms,
    countrySelectValue,
    citySelectValue,
    selectedCountryDetails,
    allowedCountryCodes,
    primaryCountryCode,
    handleCountrySelect,
    handleCountryRemove,
    handleCitySelect,
    handleCityRemove,
    toggleSelection,
    genderOptions,
    ageRanges,
    platforms,
    followerRanges,
  } = useIdealCreator({ onNext });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-5 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">
            Who Are You Looking to Work With?
          </h1>
          <p className="text-sm lg:text-md text-white">
            Help us find the perfect creators for your campaigns
          </p>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>Step 6 of 6</span>
            <span>100% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-full transition-all duration-500"></div>
          </div>
        </div>

        <form>
          <div className="space-y-4">
            {/* Follower Count & Gender */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Minimum Followers */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Hash className="h-5 w-5 text-indigo-600 mr-2" />
                  Minimum Followers <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {followerRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() =>
                        setValue("min_followers", range.value, { shouldValidate: true })
                      }
                      className={`
                        p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                        ${
                          minFollowers === range.value
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-700 hover:border-indigo-200"
                        }
                      `}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {errors.min_followers && (
                  <p className="text-xs text-red-600 mt-2">{errors.min_followers.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-5 w-5 text-indigo-600 mr-2" />
                  Gender
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {genderOptions.map((gender) => {
                    const isSelected = selectedGender?.includes(gender.id);
                    return (
                      <button
                        key={gender.id}
                        type="button"
                        onClick={() => toggleSelection(gender.id, "gender")}
                        className={`
                          flex items-center p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-200"
                          }
                        `}
                      >
                        {gender.label}
                        {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
                {errors.gender && (
                  <p className="text-xs text-red-600 mt-2">{errors.gender.message}</p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                Location
              </h3>

              {/* Countries */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Select Countries</h4>
                <CountrySelect
                  label="Add country"
                  name="countries_selector"
                  value={countrySelectValue}
                  onChange={handleCountrySelect}
                  isRequired={false}
                  errors={errors}
                />
                {selectedCountryDetails.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCountryDetails.map((country) => (
                      <span
                        key={country.code}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        {country.name}
                        <button
                          type="button"
                          onClick={() => handleCountryRemove(country.code)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {errors.countries && (
                  <p className="text-xs text-red-600 mt-2">{errors.countries.message}</p>
                )}
              </div>

              {/* City Search */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Specific City (Optional)</h4>
                <CitySelect
                  label="Search for cities"
                  name="city_selector"
                  countryCode={citySelectValue?.countryCode || primaryCountryCode}
                  countryCodes={allowedCountryCodes}
                  value={citySelectValue}
                  onChange={handleCitySelect}
                  isRequired={false}
                  errors={errors}
                />
                {selectedCities.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCities.map((city) => (
                      <span
                        key={`${city.name}-${city.countryCode || ""}`}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        {city.name}
                        <button
                          type="button"
                          onClick={() => handleCityRemove(city)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Age Range & Platforms */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Age Range */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  Age Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ageRanges.map((age) => {
                    const isSelected = selectedAgeRanges?.includes(age.id);
                    return (
                      <button
                        key={age.id}
                        type="button"
                        onClick={() => toggleSelection(age.id, "age_ranges")}
                        className={`
                          p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200 text-center
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-200"
                          }
                        `}
                      >
                        <div className="font-bold">{age.label}</div>
                        <div className="text-xs text-gray-600">{age.desc}</div>
                      </button>
                    );
                  })}
                </div>
                {errors.age_ranges && (
                  <p className="text-xs text-red-600 mt-2">{errors.age_ranges.message}</p>
                )}
              </div>

              {/* Platforms */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 text-indigo-600 mr-2" />
                  Primary Platforms
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms?.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() => toggleSelection(platform.id, "platforms")}
                        className={`
                          flex items-center p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-200"
                          }
                        `}
                      >
                        <span className="text-lg mr-3">
                          {platform.id === "instagram" && <InstagramIcon />}
                          {platform.id === "tiktok" && <TikTokIcon />}
                          {platform.id === "youtube" && <YoutubeIcon />}
                        </span>
                        <span className="text-xs">{platform.label}</span>
                        {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
                {errors.platforms && (
                  <p className="text-xs text-red-600 mt-2">{errors.platforms.message}</p>
                )}
              </div>
            </div>

            {/* Completion Section */}
            <SetupProgress
              percent={
                (minFollowers ? 20 : 0) +
                (selectedGender?.length > 0 ? 20 : 0) +
                (selectedCountries?.length > 0 ? 20 : 0) +
                (selectedAgeRanges?.length > 0 ? 20 : 0) +
                (selectedPlatforms?.length > 0 ? 20 : 0)
              }
              steps={[
                {
                  label: "Minimum Followers",
                  status: minFollowers ? "complete" : "pending",
                },
                {
                  label: "Gender",
                  status: selectedGender?.length > 0 ? "count" : "pending",
                  count: selectedGender?.length,
                },
                {
                  label: "Countries",
                  status: selectedCountries?.length > 0 ? "count" : "pending",
                  count: selectedCountries?.length,
                },
                {
                  label: "Age Ranges",
                  status: selectedAgeRanges?.length > 0 ? "count" : "pending",
                  count: selectedAgeRanges?.length,
                },
                {
                  label: "Platforms",
                  status: selectedPlatforms?.length > 0 ? "count" : "pending",
                  count: selectedPlatforms?.length,
                },
              ]}
            />
          </div>
        </form>
        <div className="flex justify-end mt-10">
          <CustomButton
            text="Complete Setup"
            className="btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default IdealCreator;
