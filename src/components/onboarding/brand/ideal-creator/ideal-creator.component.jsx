import CustomButton from "@/common/components/custom-button/custom-button.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import COUNTRIES from "@/common/constants/countries.constant";
import FacebookIcon from "@/common/icons/facebook";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import { ArrowLeft, Calendar, CheckCircle, Globe, Hash, MapPin, UserCheck, X } from "lucide-react";
import useIdealCreator from "./use-ideal-creator.hook";
import SetupProgress from "../../components/setup-progress/setup-progress.component";
import { useEffect, useMemo, useState } from "react";

const IdealCreator = ({ onNext, onBack }) => {
  const { register, handleSubmit, errors, onSubmit, setValue, getValues, watch, isLoading } =
    useIdealCreator({ onNext });

  const minFollowers = watch("min_followers");
  const selectedGender = watch("gender");
  const selectedCountries = watch("countries");
  const selectedCities = watch("cities") || [];
  const selectedAgeRanges = watch("age_ranges");
  const selectedPlatforms = watch("platforms");

  const [countrySelectValue, setCountrySelectValue] = useState(null);
  const [citySelectValue, setCitySelectValue] = useState(null);

  const selectedCountryDetails = useMemo(() => {
    if (!Array.isArray(selectedCountries)) return [];
    return selectedCountries
      .map((code) => {
        const countryMeta = COUNTRIES.find(
          (country) => country.code.toUpperCase() === String(code).toUpperCase()
        );
        return {
          code,
          name: countryMeta?.label || code,
        };
      })
      .filter((country) => Boolean(country.code));
  }, [selectedCountries]);

  const allowedCountryCodes = useMemo(
    () => selectedCountryDetails.map((country) => String(country.code).toUpperCase()),
    [selectedCountryDetails]
  );

  const primaryCountryCode = selectedCountryDetails[0]?.code || null;

  const handleCountrySelect = (country) => {
    if (!country) {
      setCountrySelectValue(null);
      return;
    }

    const code = country.countryCode || country.value || country.code || "";
    if (!code) return;

    const normalizedCode = String(code).toUpperCase();
    const existing = selectedCountries || [];

    if (existing.includes(normalizedCode)) {
      setCountrySelectValue(null);
      return;
    }

    const updated = [...existing, normalizedCode];
    setValue("countries", updated, { shouldValidate: true });
    setCountrySelectValue(null);
  };

  const handleCountryRemove = (code) => {
    const updated = (selectedCountries || []).filter(
      (existingCode) => existingCode.toUpperCase() !== String(code).toUpperCase()
    );
    setValue("countries", updated, { shouldValidate: true });

    if (
      citySelectValue?.countryCode &&
      citySelectValue.countryCode.toUpperCase() === String(code).toUpperCase()
    ) {
      setCitySelectValue(null);
    }

    if (Array.isArray(selectedCities) && selectedCities.length) {
      const filteredCities = selectedCities.filter(
        (city) => city.countryCode?.toUpperCase() !== String(code).toUpperCase()
      );
      if (filteredCities.length !== selectedCities.length) {
        setValue("cities", filteredCities, { shouldValidate: true });
      }
    }
  };

  const handleCitySelect = (city) => {
    if (!city) {
      setCitySelectValue(null);
      return;
    }

    const name = city.cityName || city.label || city.name || "";
    const resolvedCountryCode =
      city.countryCode || city.country || citySelectValue?.countryCode || primaryCountryCode || "";
    const normalizedCountryCode = resolvedCountryCode
      ? String(resolvedCountryCode).toUpperCase()
      : "";
    const normalizedCity = {
      name,
      cityName: name,
      countryCode: normalizedCountryCode,
    };

    const existingCities = Array.isArray(selectedCities) ? [...selectedCities] : [];
    const alreadyExists = existingCities.some(
      (existingCity) =>
        existingCity.name.toLowerCase() === normalizedCity.name.toLowerCase() &&
        (existingCity.countryCode || "") === normalizedCountryCode
    );

    if (!alreadyExists) {
      setValue("cities", [...existingCities, normalizedCity], { shouldValidate: true });
    }

    setCitySelectValue(null);
  };

  useEffect(() => {
    if (!allowedCountryCodes.length) {
      if (citySelectValue) {
        setCitySelectValue(null);
      }
      if (Array.isArray(selectedCities) && selectedCities.length) {
        setValue("cities", [], { shouldValidate: true });
      }
      return;
    }

    if (
      citySelectValue?.countryCode &&
      !allowedCountryCodes.includes(citySelectValue.countryCode.toUpperCase())
    ) {
      setCitySelectValue(null);
    }

    if (Array.isArray(selectedCities) && selectedCities.length) {
      const filtered = selectedCities.filter((city) =>
        city.countryCode ? allowedCountryCodes.includes(city.countryCode.toUpperCase()) : true
      );
      if (filtered.length !== selectedCities.length) {
        setValue("cities", filtered, { shouldValidate: true });
      }
    }
  }, [allowedCountryCodes, citySelectValue, selectedCities, setValue]);

  const handleCityRemove = (cityToRemove) => {
    const filtered = selectedCities.filter(
      (city) =>
        !(
          city.name === cityToRemove.name &&
          (city.countryCode || "") === (cityToRemove.countryCode || "")
        )
    );
    setValue("cities", filtered, { shouldValidate: true });
    if (
      citySelectValue?.name === cityToRemove.name &&
      citySelectValue?.countryCode === cityToRemove.countryCode
    ) {
      setCitySelectValue(null);
    }
  };

  const genderOptions = [
    { id: "male", label: "Male", icon: "👨" },
    { id: "female", label: "Female", icon: "👩" },
    { id: "mixed", label: "Mixed/Any", icon: "👥" },
  ];

  const ageRanges = [
    { id: "13-17", label: "13-17", desc: "Gen Z Early" },
    { id: "18-25", label: "18-25", desc: "Gen Z Core" },
    { id: "26-32", label: "26-32", desc: "Millennials" },
    { id: "33-40", label: "33-40", desc: "Elder Millennials" },
    { id: "41-50", label: "41-50", desc: "Gen X" },
    { id: "50+", label: "50+", desc: "Boomers+" },
  ];

  const platforms = [
    { id: "instagram", label: "Instagram", icon: InstagramIcon },
    { id: "tiktok", label: "TikTok", icon: TikTokIcon },
    { id: "youtube", label: "YouTube", icon: YoutubeIcon },
  ];

  const followerRanges = [
    { value: "1000", label: "1K+" },
    { value: "5000", label: "5K+" },
    { value: "10000", label: "10K+" },
    { value: "25000", label: "25K+" },
    { value: "50000", label: "50K+" },
    { value: "100000", label: "100K+" },
    { value: "500000", label: "500K+" },
    { value: "1000000", label: "1M+" },
  ];

  const toggleSelection = (item, selectedArray, field) => {
    const prev = getValues(field) || [];
    if (prev.includes(item)) {
      setValue(
        field,
        prev.filter((i) => i !== item),
        { shouldValidate: true }
      );
    } else {
      setValue(field, [...prev, item], { shouldValidate: true });
    }
  };

  const getSelectionSummary = () => {
    const totalSelections =
      (selectedGender?.length || 0) +
      (selectedCountries?.length || 0) +
      (selectedAgeRanges?.length || 0) +
      (selectedPlatforms?.length || 0) +
      (minFollowers ? 1 : 0);
    return totalSelections;
  };

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
                        onClick={() => toggleSelection(gender.id, selectedGender, "gender")}
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
                        onClick={() => toggleSelection(age.id, selectedAgeRanges, "age_ranges")}
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
                        onClick={() => toggleSelection(platform.id, selectedPlatforms, "platforms")}
                        className={`
                          flex items-center p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                          ${
                            isSelected
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-200"
                          }
                        `}
                      >
                        <span className="text-lg mr-3">{<platform.icon />}</span>
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
