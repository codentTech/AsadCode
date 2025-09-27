import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import TextArea from "@/common/components/text-area/text-area.component";
import { useState } from "react";

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
}) {
  // Local state for search inputs
  const [countrySearch, setCountrySearch] = useState(campaignData.creatorCountry || "");
  const [citySearch, setCitySearch] = useState(campaignData.creatorCity || "");
  const [languageSearch, setLanguageSearch] = useState(campaignData.creatorLanguage || "");

  console.log(errors);

  const platformOptions = [
    { label: "Instagram", value: "Instagram" },
    { label: "TikTok", value: "TikTok" },
    { label: "YouTube", value: "YouTube" },
    { label: "Facebook", value: "Facebook" },
    { label: "Pinterest", value: "Pinterest" },
    { label: "Other", value: "Other" },
  ];

  const locationOptions = [
    { label: "Remote (Default)", value: "isRemote" },
    { label: "In-Person Required", value: "inPersonRequired" },
  ];

  const genderOptions = [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Non-binary", value: "non-binary" },
    { label: "Other", value: "other" },
    { label: "Prefer not to say", value: "prefer-not-to-say" },
  ];

  // Sample countries - in real app, you'd have a comprehensive list
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Italy",
    "Spain",
    "Netherlands",
    "Sweden",
    "Japan",
    "South Korea",
    "India",
    "Brazil",
    "Mexico",
    "Argentina",
    "Pakistan",
    "Nigeria",
    "Egypt",
  ];

  // Sample cities - in real app, you'd filter based on selected country
  const cities = [
    "New York",
    "Los Angeles",
    "London",
    "Paris",
    "Tokyo",
    "Toronto",
    "Sydney",
    "Berlin",
    "Madrid",
    "Amsterdam",
    "Stockholm",
    "Seoul",
    "Mumbai",
    "São Paulo",
    "Mexico City",
    "Buenos Aires",
    "Lahore",
    "Lagos",
  ];

  // Sample languages
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Japanese",
    "Korean",
    "Mandarin",
    "Hindi",
    "Arabic",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Russian",
    "Polish",
    "Turkish",
    "Urdu",
  ];

  const filteredCountries = countries.filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(citySearch.toLowerCase())
  );

  const filteredLanguages = languages.filter((language) =>
    language.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const RequirementToggle = ({ field, label }) => (
    <div className="flex items-center gap-2 mt-2">
      <span className="text-sm text-gray-600">Requirement:</span>
      <button
        type="button"
        onClick={() => handleRequirementToggle(field, "preferred")}
        className={`px-3 py-1 text-xs rounded ${
          campaignData[`${field}Requirement`] === "preferred"
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        Preferred
      </button>
      <button
        type="button"
        onClick={() => handleRequirementToggle(field, "mandatory")}
        className={`px-3 py-1 text-xs rounded ${
          campaignData[`${field}Requirement`] === "mandatory"
            ? "bg-red-100 text-red-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        Mandatory
      </button>
      {campaignData[`${field}Requirement`] === "mandatory" && (
        <span className="text-xs text-red-600 ml-2">
          ⚠️ Will prevent ineligible creators from applying
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* In-Person Filming Required */}
      <div className="border rounded-lg p-4">
        <CustomCheckboxGroup
          label="Location Requirements"
          name="locationOptions"
          options={locationOptions}
          values={[
            ...(campaignData.isRemote ? ["isRemote"] : []),
            ...(campaignData.inPersonRequired ? ["inPersonRequired"] : []),
          ]}
          onChange={(selectedValues) => {
            // Handle location option changes
            const isRemote = selectedValues.includes("isRemote");
            const inPersonRequired = selectedValues.includes("inPersonRequired");

            // Update both fields
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
        <div className="relative">
          <CustomInput
            label="Creator Country"
            name="creator_country"
            placeholder="Type to search countries"
            value={countrySearch}
            onChange={(e) => {
              setCountrySearch(e.target.value);
              // Also update the campaign data as user types
              handleChange({ target: { name: "creatorCountry", value: e.target.value } });
            }}
            className="mb-2"
            errors={errors}
          />
          {countrySearch && (
            <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredCountries.map((country) => (
                <button
                  key={country}
                  type="button"
                  onClick={() => {
                    handleChange({ target: { name: "creatorCountry", value: country } });
                    setCountrySearch(country);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {country}
                </button>
              ))}
            </div>
          )}
        </div>
        {campaignData.creatorCountry && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            Selected: <strong>{campaignData.creatorCountry}</strong>
          </div>
        )}
        {errors.creator_country && (
          <div className="text-sm text-red-600 mt-2">{errors.creator_country.message}</div>
        )}
        <RequirementToggle field="country" label="Country" />
      </div>

      {/* City Selection */}
      <div className="border rounded-lg p-4">
        <div className="relative">
          <CustomInput
            label="Creator City (Optional)"
            name="creator_city"
            placeholder="Type to search cities"
            value={citySearch}
            onChange={(e) => {
              setCitySearch(e.target.value);
              // Also update the campaign data as user types
              handleChange({ target: { name: "creatorCity", value: e.target.value } });
            }}
            className="mb-2"
            errors={errors}
          />
          {citySearch && (
            <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  type="button"
                  onClick={() => {
                    handleChange({ target: { name: "creatorCity", value: city } });
                    setCitySearch(city);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>
        {campaignData.creatorCity && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            Selected: <strong>{campaignData.creatorCity}</strong>
          </div>
        )}
        {errors.creator_city && (
          <div className="text-sm text-red-600 mt-2">{errors.creator_city.message}</div>
        )}
        <RequirementToggle field="city" label="City" />
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

        <RequirementToggle field="age" label="Age Range" />
      </div>

      {/* Gender Selection */}
      <div className="border rounded-lg p-4">
        <SimpleSelect
          label="Creator Gender (Optional)"
          name="creator_gender"
          placeHolder="Select gender preference"
          options={genderOptions}
          value={campaignData.creatorGender}
          onChange={(selectedOption) =>
            handleChange({
              target: { name: "creatorGender", value: selectedOption.value },
            })
          }
          errors={errors}
        />
        {errors.creator_gender && (
          <div className="text-sm text-red-600 mt-2">{errors.creator_gender.message}</div>
        )}
        <RequirementToggle field="gender" label="Gender" />
      </div>

      {/* Language Selection */}
      <div className="border rounded-lg p-4">
        <div className="relative">
          <CustomInput
            label="Creator Language (Optional)"
            name="creator_language"
            placeholder="Type to search languages"
            value={languageSearch}
            onChange={(e) => {
              setLanguageSearch(e.target.value);
              // Also update the campaign data as user types
              handleChange({ target: { name: "creatorLanguage", value: e.target.value } });
            }}
            className="mb-2"
            errors={errors}
          />
          {languageSearch && (
            <div className="absolute z-10 w-full max-h-40 overflow-y-auto bg-white border rounded-md shadow-lg">
              {filteredLanguages.map((language) => (
                <button
                  key={language}
                  type="button"
                  onClick={() => {
                    handleChange({ target: { name: "creatorLanguage", value: language } });
                    setLanguageSearch(language);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm"
                >
                  {language}
                </button>
              ))}
            </div>
          )}
        </div>
        {campaignData.creatorLanguage && (
          <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
            Selected: <strong>{campaignData.creatorLanguage}</strong>
          </div>
        )}
        {errors.creator_language && (
          <div className="text-sm text-red-600 mt-2">{errors.creator_language.message}</div>
        )}
        <RequirementToggle field="language" label="Language" />
      </div>

      {/* Application Deadline */}
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3">
          <CustomInput
            label="Application Deadline"
            type="date"
            name="applicationDeadline"
            value={campaignData.applicationDeadline}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}

export default Eligibility;
