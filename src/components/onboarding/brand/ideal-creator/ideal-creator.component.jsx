import CustomButton from "@/common/components/custom-button/custom-button.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
import {
  Calendar,
  Check,
  Globe,
  Hash,
  MapPin,
  Target,
  Trash2,
  UserCheck,
} from "lucide-react";
import OnboardingStepLayout from "../../components/onboarding-step-layout/onboarding-step-layout.component";
import useIdealCreator from "./use-ideal-creator.hook";

const selectTileClass = (isSelected) =>
  `flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-xs font-medium transition ${
    isSelected
      ? "border-primary bg-indigo-50 text-gray-900"
      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
  }`;

const IdealCreator = ({ onNext, isActive = true }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    isLoading,
    minFollowers,
    selectedGender,
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
  } = useIdealCreator({ onNext, isActive });

  return (
    <OnboardingStepLayout
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <CustomButton
          text="Complete Setup"
          className="btn-primary w-full sm:ml-auto sm:w-auto"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        />
      }
    >
      <div className="flex flex-col gap-3">
        <section className="flex items-start gap-3 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Target className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-gray-900">Define your ideal creator</h3>
            <p className="mt-0.5 text-[11px] leading-snug text-gray-600 sm:text-xs">
              Set reach, audience, and platform filters so the right creators find your campaigns.
            </p>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Hash className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">
                Minimum followers <span className="text-red-500">*</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {followerRanges.map((range) => {
                const isSelected = minFollowers === range.value;
                return (
                  <button
                    key={range.value}
                    type="button"
                    onClick={() =>
                      setValue("min_followers", range.value, { shouldValidate: true })
                    }
                    className={selectTileClass(isSelected)}
                  >
                    <span className="min-w-0 flex-1 truncate">{range.label}</span>
                    {isSelected ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {errors.min_followers ? (
              <p className="mt-2 text-xs text-red-600">{errors.min_followers.message}</p>
            ) : null}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <UserCheck className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Gender</h3>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-1">
              {genderOptions.map((gender) => {
                const isSelected = selectedGender?.includes(gender.id);
                return (
                  <button
                    key={gender.id}
                    type="button"
                    onClick={() => toggleSelection(gender.id, "gender")}
                    className={selectTileClass(isSelected)}
                  >
                    <span className="min-w-0 flex-1">{gender.label}</span>
                    {isSelected ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {errors.gender ? (
              <p className="mt-2 text-xs text-red-600">{errors.gender.message}</p>
            ) : null}
          </section>
        </div>

        <section className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="mb-3 flex items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
              <MapPin className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-sm font-semibold text-gray-900">Location</h3>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-md border border-gray-100 bg-gray-50/80 p-2.5">
              <p className="mb-2 text-xs font-semibold text-gray-900">
                Countries <span className="text-red-500">*</span>
              </p>
              <CountrySelect
                label=""
                name="countries_selector"
                value={countrySelectValue}
                onChange={handleCountrySelect}
                isRequired={false}
                errors={errors}
              />
              {selectedCountryDetails.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCountryDetails.map((country) => (
                    <span
                      key={country.code}
                      className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 sm:text-xs"
                    >
                      {country.name}
                      <Trash2
                        className="h-3 w-3 shrink-0 cursor-pointer text-gray-400 hover:text-red-600"
                        onClick={() => handleCountryRemove(country.code)}
                        aria-label={`Remove ${country.name}`}
                      />
                    </span>
                  ))}
                </div>
              ) : null}
              {errors.countries ? (
                <p className="mt-2 text-xs text-red-600">{errors.countries.message}</p>
              ) : null}
            </div>

            <div className="rounded-md border border-gray-100 bg-gray-50/80 p-2.5">
              <p className="mb-2 text-xs font-semibold text-gray-900">Cities (optional)</p>
              <CitySelect
                label=""
                name="city_selector"
                countryCode={citySelectValue?.countryCode || primaryCountryCode}
                countryCodes={allowedCountryCodes}
                value={citySelectValue}
                onChange={handleCitySelect}
                isRequired={false}
                errors={errors}
              />
              {selectedCities.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {selectedCities.map((city) => (
                    <span
                      key={`${city.name}-${city.countryCode || ""}`}
                      className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 sm:text-xs"
                    >
                      {city.name}
                      <Trash2
                        className="h-3 w-3 shrink-0 cursor-pointer text-gray-400 hover:text-red-600"
                        onClick={() => handleCityRemove(city)}
                        aria-label={`Remove ${city.name}`}
                      />
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <div className="grid gap-3 lg:grid-cols-2">
          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Calendar className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Age range</h3>
            </div>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {ageRanges.map((age) => {
                const isSelected = selectedAgeRanges?.includes(age.id);
                return (
                  <button
                    key={age.id}
                    type="button"
                    onClick={() => toggleSelection(age.id, "age_ranges")}
                    className={`flex w-full flex-col items-start gap-0.5 rounded-md border px-2.5 py-2 text-left text-xs transition ${
                      isSelected
                        ? "border-primary bg-indigo-50 text-gray-900"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex w-full items-center justify-between gap-1">
                      <span className="font-semibold">{age.label}</span>
                      {isSelected ? (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                      ) : null}
                    </span>
                    {age.desc ? (
                      <span className="text-[10px] font-normal leading-snug text-gray-500">
                        {age.desc}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {errors.age_ranges ? (
              <p className="mt-2 text-xs text-red-600">{errors.age_ranges.message}</p>
            ) : null}
          </section>

          <section className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-primary">
                <Globe className="h-3.5 w-3.5" />
              </span>
              <h3 className="text-sm font-semibold text-gray-900">Primary platforms</h3>
            </div>
            <div className="grid gap-1.5 sm:grid-cols-1">
              {platforms.map((platform) => {
                const isSelected = selectedPlatforms?.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => toggleSelection(platform.id, "platforms")}
                    className={selectTileClass(isSelected)}
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-base shadow-sm ring-1 ring-gray-200">
                      {platform.id === "instagram" ? <InstagramIcon /> : null}
                      {platform.id === "tiktok" ? <TikTokIcon /> : null}
                      {platform.id === "youtube" ? <YoutubeIcon /> : null}
                    </span>
                    <span className="min-w-0 flex-1">{platform.label}</span>
                    {isSelected ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
            {errors.platforms ? (
              <p className="mt-2 text-xs text-red-600">{errors.platforms.message}</p>
            ) : null}
          </section>
        </div>
      </div>
    </OnboardingStepLayout>
  );
};

export default IdealCreator;
