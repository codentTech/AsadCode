import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import LanguageSelect from "@/common/components/dropdowns/language-select/language-select.component";
import FieldLabel from "@/common/components/field-label/field-label.component";
import RequirementToggle from "@/common/components/requirement-toggle/requirement-toggle.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { REQUIREMENT_LEVEL } from "@/common/constants/campaign.constant";
import { Check, MapPin, Monitor, User, UserRound, X } from "lucide-react";
import { PREFERRED_MANDATORY_TOGGLE_OPTIONS } from "../../requirement-toggle.options";
import useEligibility from "./use-eligibility.hook";

const LOCATION_CARDS = [
  {
    value: "remote",
    label: "Remote",
    description: "Work from anywhere",
    icon: Monitor,
  },
  {
    value: "on-location",
    label: "On Location",
    description: "In-person filming",
    icon: MapPin,
  },
];

const GENDER_CARDS = [
  {
    value: "male",
    label: "Male",
    description: "Male creators",
    icon: User,
  },
  {
    value: "female",
    label: "Female",
    description: "Female creators",
    icon: UserRound,
  },
];

function FieldBlock({
  label,
  isRequired = false,
  requirement,
  onRequirementChange,
  children,
  afterRequirement = null,
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5">
        <FieldLabel label={label} isRequired={isRequired} />
      </div>
      {children}
      {onRequirementChange ? (
        <div className="mt-1.5 flex justify-end">
          <RequirementToggle
            prefix=""
            className="!mt-0"
            value={requirement ?? REQUIREMENT_LEVEL.PREFERRED}
            options={PREFERRED_MANDATORY_TOGGLE_OPTIONS}
            onChange={onRequirementChange}
          />
        </div>
      ) : null}
      {afterRequirement}
    </div>
  );
}

function OptionCard({ selected, onClick, icon: Icon, label, description }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={description}
      className={`flex h-9 w-full items-center gap-2 rounded-[5px] border px-2.5 text-left sm:h-[40px] ${
        selected
          ? "border-primary bg-primary/5"
          : "border-gray-200 bg-gray-100 hover:border-gray-300"
      }`}
    >
      <span className="rounded bg-white p-1 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1 truncate text-xs font-semibold text-black">{label}</span>
      {selected ? <Check className="h-3.5 w-3.5 shrink-0 text-primary" /> : null}
    </button>
  );
}

function Eligibility({
  campaignData,
  handleChange,
  handleRequirementToggle,
  errors = {},
  register,
  setValue,
  getWatchedValue,
}) {
  const {
    selectedLanguages,
    handleLanguageChange,
    countrySelectValue,
    citySelectValue,
    handleCitySelect,
    isCityDisabled,
    selectedCountries,
    handleCountryRemove,
    handleRequirementChange,
    countrySelectValueForMulti,
    handleCountrySelectForMulti,
  } = useEligibility({ campaignData, setValue });

  const locationOptions = getWatchedValue("locationOptions") || campaignData.locationOptions || [];
  const selectedGender = campaignData.creator_gender || campaignData.creatorGender || "";
  const isOnLocation =
    locationOptions.includes("on-location") ||
    locationOptions.includes("On Location") ||
    Boolean(campaignData.inPersonRequired);

  const getRequirement = (field) =>
    campaignData?.[`${field}Requirement`] ?? REQUIREMENT_LEVEL.PREFERRED;

  const handleLocationToggle = (value) => {
    const current = Array.isArray(locationOptions) ? [...locationOptions] : [];
    const normalizedCurrent = current.map((item) =>
      item === "Remote" ? "remote" : item === "On Location" ? "on-location" : item
    );
    const next = normalizedCurrent.includes(value)
      ? normalizedCurrent.filter((item) => item !== value)
      : [...normalizedCurrent.filter((item) => item === "remote" || item === "on-location"), value];

    const isRemote = next.includes("remote");
    const inPersonRequired = next.includes("on-location");

    setValue("locationOptions", next, { shouldDirty: true, shouldValidate: true });
    handleChange({
      target: { name: "isRemote", value: isRemote, type: "checkbox", checked: isRemote },
    });
    handleChange({
      target: {
        name: "inPersonRequired",
        value: inPersonRequired,
        type: "checkbox",
        checked: inPersonRequired,
      },
    });
  };

  const handleRemoveLanguage = (languageLabel) => {
    const next = (selectedLanguages || []).filter(
      (language) => language.toLowerCase() !== languageLabel.toLowerCase()
    );
    handleLanguageChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <section className="rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <FieldBlock
            label="Gender"
            requirement={getRequirement("gender")}
            onRequirementChange={(status) => handleRequirementToggle("gender", status)}
          >
            <div className="grid grid-cols-2 gap-2">
              {GENDER_CARDS.map((option) => (
                <OptionCard
                  key={option.value}
                  selected={selectedGender === option.value}
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "creator_gender",
                        value: selectedGender === option.value ? "" : option.value,
                      },
                    })
                  }
                  icon={option.icon}
                  label={option.label}
                  description={option.description}
                />
              ))}
            </div>
          </FieldBlock>

          <div className="min-w-0">
            <div className="mb-1.5">
              <FieldLabel label="Location Requirements" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {LOCATION_CARDS.map((option) => {
                const selected =
                  locationOptions.includes(option.value) ||
                  (option.value === "remote" && locationOptions.includes("Remote")) ||
                  (option.value === "on-location" &&
                    (locationOptions.includes("On Location") || campaignData.inPersonRequired));
                return (
                  <OptionCard
                    key={option.value}
                    selected={selected}
                    onClick={() => handleLocationToggle(option.value)}
                    icon={option.icon}
                    label={option.label}
                    description={option.description}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {isOnLocation ? (
          <div className="mt-3">
            <TextArea
              label="Location Details"
              name="location_details"
              placeholder="Specific location details for in-person filming"
              errors={errors}
              register={register}
              isRequired={true}
            />
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <FieldBlock
            label="Age range"
            requirement={getRequirement("age")}
            onRequirementChange={(status) => handleRequirementToggle("age", status)}
          >
            <div className="grid grid-cols-2 gap-2">
              <CustomInput
                type="number"
                name="min_age"
                placeholder="Min age"
                min="13"
                max="100"
                errors={errors}
                register={register}
              />
              <CustomInput
                type="number"
                name="max_age"
                placeholder="Max age"
                min="13"
                max="100"
                errors={errors}
                register={register}
              />
            </div>
          </FieldBlock>

          <FieldBlock label="Application Deadline" isRequired>
            <CustomInput
              type="date"
              name="application_deadline"
              errors={errors}
              register={register}
              isRequired={true}
            />
          </FieldBlock>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <div
          className={`grid grid-cols-1 gap-3 sm:gap-4 ${
            selectedCountries.length > 0 ? "sm:grid-cols-2" : ""
          }`}
        >
          <FieldBlock label="Creator Country">
            <CountrySelect
              label=""
              name="countries_selector"
              value={countrySelectValueForMulti}
              onChange={handleCountrySelectForMulti}
              isRequired={false}
              errors={errors}
            />
            {selectedCountries.length > 0 ? (
              <div className="mt-2 space-y-1">
                {selectedCountries.map((country) => (
                  <div
                    key={country.countryCode}
                    className="flex items-center justify-between gap-2 rounded-md border border-gray-200 bg-gray-50 px-2 py-1.5"
                  >
                    <span className="min-w-0 truncate text-xs font-medium text-black">
                      {country.country}
                    </span>
                    <div className="flex shrink-0 items-center justify-end gap-1.5">
                      <RequirementToggle
                        prefix=""
                        className="!mt-0"
                        value={country.requirement}
                        options={PREFERRED_MANDATORY_TOGGLE_OPTIONS}
                        onChange={(status) => handleRequirementChange(country.countryCode, status)}
                      />
                      <button
                        type="button"
                        onClick={() => handleCountryRemove(country.countryCode)}
                        className="rounded p-0.5 text-gray-500 hover:bg-white hover:text-black"
                        aria-label={`Remove ${country.country}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
                {selectedCountries.length > 1 ? (
                  <p className="text-[10px] text-gray-500">
                    Multiple countries stay Preferred. Mandatory works for one country only.
                  </p>
                ) : null}
              </div>
            ) : null}
          </FieldBlock>

          {selectedCountries.length > 0 ? (
            <FieldBlock
              label="Creator City"
              isRequired={getRequirement("city") === REQUIREMENT_LEVEL.MANDATORY}
              requirement={getRequirement("city")}
              onRequirementChange={(status) => handleRequirementToggle("city", status)}
            >
              <CitySelect
                label=""
                name="creator_city"
                countryCode={countrySelectValue?.countryCode || selectedCountries[0]?.countryCode}
                value={citySelectValue}
                onChange={handleCitySelect}
                isRequired={getRequirement("city") === REQUIREMENT_LEVEL.MANDATORY}
                errors={errors}
                disabled={isCityDisabled}
              />
            </FieldBlock>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 p-3">
        <FieldBlock
          label="Language"
          requirement={getRequirement("language")}
          onRequirementChange={(status) => handleRequirementToggle("language", status)}
          afterRequirement={
            selectedLanguages.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-2">
                {selectedLanguages.map((language) => (
                  <span
                    key={language}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(language)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label={`Remove ${language}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            ) : null
          }
        >
          <LanguageSelect
            name="creator_language"
            value={selectedLanguages}
            onChange={handleLanguageChange}
            maxSelections={1}
            errors={errors}
            hideSelectedTags
          />
        </FieldBlock>
      </section>
    </div>
  );
}

export default Eligibility;
