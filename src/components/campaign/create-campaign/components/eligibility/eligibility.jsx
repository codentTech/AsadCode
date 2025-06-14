import { useState } from "react";
import CustomCheckboxGroup from "@/common/components/custom-checkbox/custom-checkbox.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";

function Eligibility({ campaignData, handleChange, handleCheckboxToggle }) {
  const [countrySearch, setCountrySearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [languageSearch, setLanguageSearch] = useState("");

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

  const handleRequirementToggle = (field, value) => {
    const requirementField = `${field}Requirement`;
    const newValue = campaignData[requirementField] === value ? "none" : value;
    handleChange({ target: { name: requirementField, value: newValue } });
  };

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
    <div className="h-full max-h-[550px] overflow-y-scroll flex flex-col gap-6">
      {/* In-Person Filming Required */}
      <div className="border rounded-lg p-4">
        <CustomCheckboxGroup
          label="Location Requirements"
          name="locationOptions"
          options={locationOptions}
          checkedValues={{
            isRemote: campaignData.isRemote,
            inPersonRequired: campaignData.inPersonRequired,
          }}
          onChange={handleChange}
        />

        {campaignData.inPersonRequired && (
          <>
            <TextArea
              label="Location Details"
              name="locationDetails"
              value={campaignData.locationDetails}
              onChange={handleChange}
              placeholder="Provide specific location details (essential for restaurants, hotels, etc.)"
              className="mt-3"
            />
            <div className="mt-2 p-2 bg-orange-50 rounded text-sm text-orange-700">
              ⚠️ In-person filming requirement will prevent remote creators from applying
            </div>
          </>
        )}
      </div>

      {/* Country Selection */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Creator Country</label>
        <div className="relative">
          <CustomInput
            placeholder="Type to search countries..."
            value={countrySearch}
            onChange={(e) => setCountrySearch(e.target.value)}
            className="mb-2"
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
        <RequirementToggle field="country" label="Country" />
      </div>

      {/* City Selection */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creator City (Optional)
        </label>
        <div className="relative">
          <CustomInput
            placeholder="Type to search cities..."
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="mb-2"
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
            name="minAge"
            value={campaignData.minAge}
            onChange={handleChange}
            placeholder="18"
            min="13"
            max="100"
          />
          <CustomInput
            label="Maximum Age"
            type="number"
            name="maxAge"
            value={campaignData.maxAge}
            onChange={handleChange}
            placeholder="65"
            min="13"
            max="100"
          />
        </div>
        <RequirementToggle field="age" label="Age Range" />
      </div>

      {/* Gender Selection */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creator Gender (Optional)
        </label>
        <select
          name="creatorGender"
          value={campaignData.creatorGender || ""}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select gender preference...</option>
          {genderOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <RequirementToggle field="gender" label="Gender" />
      </div>

      {/* Language Selection */}
      <div className="border rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Creator Language (Optional)
        </label>
        <div className="relative">
          <CustomInput
            placeholder="Type to search languages..."
            value={languageSearch}
            onChange={(e) => setLanguageSearch(e.target.value)}
            className="mb-2"
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
        <RequirementToggle field="language" label="Language" />
      </div>

      {/* Required Platforms */}
      <div className="border rounded-lg p-4">
        <CustomCheckboxGroup
          label="Required Platforms"
          name="requiredPlatforms"
          options={platformOptions}
          checkedValues={campaignData.requiredPlatforms || {}}
          onChange={(value) => handleCheckboxToggle("requiredPlatforms", value)}
        />
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

      {/* Summary of Mandatory Requirements */}
      <div className="border rounded-lg p-4 bg-red-50">
        <h3 className="text-sm font-medium text-red-800 mb-2">Mandatory Requirements Summary</h3>
        <p className="text-xs text-red-600 mb-2">
          The following requirements will prevent ineligible creators from applying:
        </p>
        <ul className="text-sm text-red-700 space-y-1">
          {campaignData.inPersonRequired && <li>• In-person filming required</li>}
          {campaignData.countryRequirement === "mandatory" && campaignData.creatorCountry && (
            <li>• Must be from {campaignData.creatorCountry}</li>
          )}
          {campaignData.cityRequirement === "mandatory" && campaignData.creatorCity && (
            <li>• Must be from {campaignData.creatorCity}</li>
          )}
          {campaignData.ageRequirement === "mandatory" &&
            (campaignData.minAge || campaignData.maxAge) && (
              <li>
                • Age must be between {campaignData.minAge || "any"} and{" "}
                {campaignData.maxAge || "any"}
              </li>
            )}
          {campaignData.genderRequirement === "mandatory" && campaignData.creatorGender && (
            <li>• Must identify as {campaignData.creatorGender}</li>
          )}
          {campaignData.languageRequirement === "mandatory" && campaignData.creatorLanguage && (
            <li>• Must speak {campaignData.creatorLanguage}</li>
          )}
        </ul>
        {!campaignData.inPersonRequired &&
          campaignData.countryRequirement !== "mandatory" &&
          campaignData.cityRequirement !== "mandatory" &&
          campaignData.ageRequirement !== "mandatory" &&
          campaignData.genderRequirement !== "mandatory" &&
          campaignData.languageRequirement !== "mandatory" && (
            <p className="text-sm text-gray-600 italic">No mandatory requirements set</p>
          )}
      </div>
    </div>
  );
}

export default Eligibility;
