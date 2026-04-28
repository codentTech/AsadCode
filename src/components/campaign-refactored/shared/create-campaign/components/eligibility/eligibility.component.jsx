import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import LanguageSelect from "@/common/components/dropdowns/language-select/language-select.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import RequirementToggle from "@/common/components/requirement-toggle/requirement-toggle.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { REQUIREMENT_LEVEL } from "@/common/constants/campaign.constant";
import { GENDER_OPTIONS, LOCATION_OPTIONS } from "@/common/constants/options.constant";
import { X } from "lucide-react";
import useEligibility from "./use-eligibility.hook";

/**
 * Eligibility Component
 *
 * Handles creator eligibility criteria including location requirements,
 * demographics, and platform requirements.
 */
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
    handleCountriesChange,
    handleCountryRemove,
    handleRequirementChange,
    countrySelectValueForMulti,
    handleCountrySelectForMulti,
  } = useEligibility({ campaignData, setValue });

  const requirementOptions = [
    {
      value: REQUIREMENT_LEVEL.PREFERRED,
      label: "Preferred",
      activeClasses: "bg-blue-100 text-blue-700",
    },
    {
      value: REQUIREMENT_LEVEL.MANDATORY,
      label: "Mandatory",
      activeClasses: "bg-orange-100 text-orange-700",
    },
  ];

  const renderRequirementToggle = (field) => (
    <RequirementToggle
      prefix="Requirement:"
      value={campaignData?.[`${field}Requirement`] ?? REQUIREMENT_LEVEL.PREFERRED}
      options={requirementOptions}
      onChange={(status) => handleRequirementToggle(field, status)}
      helperContent={(currentValue) =>
        currentValue === REQUIREMENT_LEVEL.MANDATORY ? (
          <span className="text-xs text-orange-600 ml-2">
            ⚠️ Ineligible creators will be unable to apply.
          </span>
        ) : null
      }
    />
  );

  return (
    <div className="flex flex-col gap-6">
      {/* In-Person Filming Required */}
      <div className="border rounded-lg p-4">
        <CustomCheckboxGroup
          label="Location Requirements"
          name="locationOptions"
          options={LOCATION_OPTIONS}
          values={getWatchedValue("locationOptions") || []}
          setValue={setValue}
          watch={getWatchedValue}
          onChange={(selectedValues) => {
            const isRemote = selectedValues.includes("isRemote");
            const inPersonRequired = selectedValues.includes("inPersonRequired");

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
          }}
        />

        {campaignData.inPersonRequired && (
          <>
            <TextArea
              label="Location Details"
              name="location_details"
              placeholder="Provide specific location details (essential for restaurants, hotels, etc.)"
              className="mt-3"
              errors={errors}
              register={register}
              isRequired={true}
            />
            <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
              ⚠️ In-person filming requirement will prevent remote creators from applying
            </div>
          </>
        )}
      </div>

      {/* Country Selection - Multi-Select */}
      <div className="border rounded-lg p-4">
        <CountrySelect
          label="Creator Country (Optional)"
          name="countries_selector"
          value={countrySelectValueForMulti}
          onChange={handleCountrySelectForMulti}
          isRequired={false}
          errors={errors}
        />
        {selectedCountries.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {selectedCountries.map((country) => (
              <span
                key={country.countryCode}
                className="flex w-full min-w-0 flex-col gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-2 text-xs text-gray-700 sm:inline-flex sm:w-auto sm:flex-row sm:items-center sm:py-1"
              >
                <div className="font-medium text-gray-800">{country.country}</div>
                <RequirementToggle
                  prefix=""
                  value={country.requirement}
                  options={requirementOptions}
                  onChange={(status) => handleRequirementChange(country.countryCode, status)}
                  disabled={
                    selectedCountries.length > 1 &&
                    country.requirement === REQUIREMENT_LEVEL.MANDATORY
                  }
                  helperContent={(currentValue) =>
                    currentValue === REQUIREMENT_LEVEL.MANDATORY && selectedCountries.length > 1 ? (
                      <span className="text-xs text-orange-600 ml-2">
                        ⚠️ Mandatory is only available for single country selection
                      </span>
                    ) : currentValue === REQUIREMENT_LEVEL.MANDATORY ? (
                      <span className="text-xs text-orange-600 ml-2">
                        ⚠️ Ineligible creators will be unable to apply.
                      </span>
                    ) : null
                  }
                />
                <button
                  type="button"
                  onClick={() => handleCountryRemove(country.countryCode)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={`Remove ${country.country}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
        {selectedCountries.length > 1 && (
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 p-2 rounded">
            ℹ️ With multiple countries selected, all are treated as Preferred. Mandatory option is
            only available for single country selection.
          </div>
        )}
      </div>

      {/* City Selection */}
      {selectedCountries.length > 0 && (
        <div className="border rounded-lg p-4">
          <CitySelect
            label="Creator City (Optional)"
            name="creator_city"
            countryCode={countrySelectValue?.countryCode || selectedCountries[0]?.countryCode}
            value={citySelectValue}
            onChange={handleCitySelect}
            isRequired={campaignData.cityRequirement === REQUIREMENT_LEVEL.MANDATORY}
            errors={errors}
            disabled={isCityDisabled || selectedCountries.length === 0}
          />

          {renderRequirementToggle("city")}
        </div>
      )}

      {/* Age Range */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creator Age Range (Optional)
        </label>
        <div className="grid grid-cols-1 gap-4 xs:grid-cols-2">
          <CustomInput
            label="Minimum Age"
            type="number"
            name="min_age"
            placeholder="18"
            min="13"
            max="100"
            errors={errors}
            register={register}
          />
          <CustomInput
            label="Maximum Age"
            type="number"
            name="max_age"
            placeholder="65"
            min="13"
            max="100"
            errors={errors}
            register={register}
          />
        </div>

        {renderRequirementToggle("age")}
      </div>

      {/* Gender Selection */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SimpleSelect
              label="Creator Gender (Optional)"
              name="creator_gender"
              placeHolder="Select gender preference"
              options={GENDER_OPTIONS}
              value={campaignData.creatorGender}
              onChange={(selectedOption) =>
                handleChange({
                  target: {
                    name: "creator_gender",
                    value: selectedOption?.value || "",
                  },
                })
              }
              errors={errors}
            />
          </div>
        </div>

        {renderRequirementToggle("gender")}
      </div>

      <div className="border rounded-lg p-4">
        <LanguageSelect
          label="Creator Language (Optional)"
          name="creator_language"
          value={selectedLanguages}
          onChange={handleLanguageChange}
          maxSelections={1}
          errors={errors}
        />

        {renderRequirementToggle("language")}
      </div>

      {/* Application Deadline */}
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <CustomInput
            label="Application Deadline"
            type="date"
            name="application_deadline"
            errors={errors}
            register={register}
            isRequired={true}
          />
        </div>
      </div>
    </div>
  );
}

export default Eligibility;
