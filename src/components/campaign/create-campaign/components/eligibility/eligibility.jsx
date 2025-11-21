import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import TextArea from "@/common/components/text-area/text-area.component";
import RequirementToggle from "@/common/components/requirement-toggle/requirement-toggle.component";
import { LOCATION_OPTIONS, GENDER_OPTIONS } from "@/common/constants/options.constant";
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
    languageSearch,
    filteredLanguages,
    handleLanguageInputChange,
    handleLanguageSelect,
    showLanguageOptions,
    countrySelectValue,
    handleCountrySelect,
    citySelectValue,
    handleCitySelect,
    isCityDisabled,
  } = useEligibility({ campaignData, handleChange, setValue });

  const requirementOptions = [
    { value: "preferred", label: "Preferred", activeClasses: "bg-blue-100 text-blue-700" },
    { value: "mandatory", label: "Mandatory", activeClasses: "bg-orange-100 text-orange-700" },
  ];

  const renderRequirementToggle = (field) => (
    <RequirementToggle
      prefix="Requirement:"
      value={campaignData?.[`${field}Requirement`] ?? "preferred"}
      options={requirementOptions}
      onChange={(status) => handleRequirementToggle(field, status)}
      helperContent={(currentValue) =>
        currentValue === "mandatory" ? (
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

      {/* Country Selection */}
      <div className="border rounded-lg p-4">
        <CountrySelect
          label="Creator Country"
          name="creator_country"
          value={countrySelectValue}
          onChange={handleCountrySelect}
          autoDetect={!countrySelectValue}
          isRequired={campaignData.countryRequirement === "mandatory"}
          errors={errors}
          disabled={false}
        />

        {renderRequirementToggle("country")}
      </div>

      {/* City Selection */}
      <div className="border rounded-lg p-4">
        <CitySelect
          label="Creator City (Optional)"
          name="creator_city"
          countryCode={countrySelectValue?.countryCode}
          value={citySelectValue}
          onChange={handleCitySelect}
          isRequired={campaignData.cityRequirement === "mandatory"}
          errors={errors}
          disabled={isCityDisabled}
        />

        {renderRequirementToggle("city")}
      </div>

      {/* Age Range */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creator Age Range (Optional)
        </label>
        <div className="grid grid-cols-2 gap-4">
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
        <SimpleSelect
          label="Creator Gender (Optional)"
          name="creator_gender"
          placeHolder="Select gender preference"
          options={GENDER_OPTIONS}
          value={campaignData.creatorGender}
          onChange={(selectedOption) =>
            handleChange({
              target: { name: "creator_gender", value: selectedOption.value },
            })
          }
          errors={errors}
        />

        {renderRequirementToggle("gender")}
      </div>

      {/* Language Selection */}
      <div className="border rounded-lg p-4">
        <div className="relative">
          <CustomInput
            label="Creator Language (Optional)"
            name="creator_language"
            placeholder="Type to search languages"
            value={languageSearch}
            onChange={(e) => handleLanguageInputChange(e.target.value)}
            className="mb-2"
            errors={errors}
          />
          {showLanguageOptions && (
            <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => handleLanguageSelect(language)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>

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
