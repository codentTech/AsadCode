"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import LanguageSelect from "@/common/components/dropdowns/language-select/language-select.component";
import { CheckCircle, MapPin } from "lucide-react";
import usePreferredCollaborationType from "./use-preferred-collaboration-type.hook";

const PreferredCollaborationType = () => {
  const {
    campaignTypes,
    ethnicityOptions,
    selectedTypes,
    selectedLanguages,
    selectedEthnicity,
    inPersonOpportunities,
    shippingAddress,
    countrySelection,
    citySelection,
    countryCode,
    isLoading,
    toggleCampaignType,
    handleLanguagesChange,
    handleEthnicityChange,
    handleInPersonChange,
    handleShippingChange,
    handleCountrySelect,
    handleCitySelect,
    handleSavePreferences,
  } = usePreferredCollaborationType();

  const shippingErrors = {};

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Preferred Collaboration Type
        </h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Choose your default collaboration preferences. This helps brands understand how you prefer
          to work together.
        </p>
      </div>

      <div className="max-w-full mx-auto">
        <div className="space-y-4 sm:space-y-8">
          <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900 sm:text-xl">Campaign Types</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {campaignTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => toggleCampaignType(type.id)}
                    className={
                      `p-2 text-xs rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ` +
                      (selectedTypes?.includes(type.id)
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-indigo-200")
                    }
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={
                          `p-2 rounded-lg flex-shrink-0 ` +
                          (selectedTypes?.includes(type.id)
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-100 text-gray-600")
                        }
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-bold text-gray-900">{type.label}</h4>
                          {selectedTypes?.includes(type.id) ? (
                            <CheckCircle className="h-5 w-5 text-indigo-500" />
                          ) : null}
                        </div>
                        <p className="text-xs text-gray-600">{type.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
            <div className="space-y-4 rounded-lg bg-white p-3 shadow-lg sm:space-y-6 sm:p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-xl">Languages</h3>
              <div>
                <LanguageSelect
                  name="languages"
                  value={selectedLanguages || []}
                  onChange={handleLanguagesChange}
                  errors={{}}
                  maxSelections={8}
                />
              </div>

              <div>
                <h3 className="mb-1 border-t pt-4 text-sm font-semibold text-gray-900 sm:text-xl">
                  In-Person Opportunities <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-600 mb-4">
                  Are you open to in-person opportunities in your city?
                </p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="inPerson"
                      value="yes"
                      checked={inPersonOpportunities === true}
                      onChange={() => handleInPersonChange("yes")}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 font-medium">Yes, I'm interested</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="inPerson"
                      value="no"
                      checked={inPersonOpportunities === false}
                      onChange={() => handleInPersonChange("no")}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="text-gray-600 font-medium">No, I'm not interested</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
              <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:text-xl">Ethnicity (Optional)</h3>
              <p className="text-xs text-gray-600 mb-3">
                This information is used only for brand filtering and is never shown publicly.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ethnicityOptions.map((opt) => {
                  const active = selectedEthnicity === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleEthnicityChange(opt)}
                      className={`text-left rounded-lg border p-2 text-xs transition-colors ${
                        active
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-gray-800">{opt}</span>
                        {active ? <CheckCircle className="h-4 w-4 text-indigo-500" /> : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
            <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:text-xl">
              Shipping Address <span className="text-red-500">*</span>
            </h3>

            <p className="text-xs text-gray-600 mb-4">
              Your shipping address is kept private and is never publicly visible. It will only be
              shared with a brand after you are hired for a campaign that requires product delivery.
            </p>

            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <CustomInput
                label="Address line 1"
                name="street"
                placeholder="Enter your address"
                icon={MapPin}
                value={shippingAddress?.street || ""}
                onChange={(e) => handleShippingChange("street", e.target.value)}
                errors={shippingErrors}
                required
              />

              <CustomInput
                label="Address line 2 (Optional)"
                name="line2"
                placeholder="Apartment, suite, unit, etc."
                value={shippingAddress?.line2 || ""}
                onChange={(e) => handleShippingChange("line2", e.target.value)}
                errors={shippingErrors}
              />

              <CustomInput
                label="Address line 3 (Optional)"
                name="line3"
                placeholder="Building, floor, landmark"
                value={shippingAddress?.line3 || ""}
                onChange={(e) => handleShippingChange("line3", e.target.value)}
                errors={shippingErrors}
              />

              <CustomInput
                label="State or Province"
                name="state"
                placeholder="Enter state/province"
                value={shippingAddress?.state || ""}
                onChange={(e) => handleShippingChange("state", e.target.value)}
                errors={shippingErrors}
                required
              />

              <CustomInput
                label="Postal code"
                name="zipCode"
                placeholder="Enter postal code"
                value={shippingAddress?.zipCode || ""}
                onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                errors={shippingErrors}
                required
              />
            </div>

            <div className="mt-4 grid gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2">
              <CountrySelect
                label="Country"
                name="country"
                value={countrySelection}
                onChange={handleCountrySelect}
                isRequired={true}
                errors={shippingErrors}
              />

              <CitySelect
                label="City"
                name="city"
                countryCode={countryCode}
                countryCodes={countryCode ? [countryCode] : []}
                value={citySelection}
                onChange={handleCitySelect}
                isRequired={true}
                errors={shippingErrors}
              />
            </div>
          </div>

          <div className="text-center">
            <div className="rounded-lg bg-white p-3 shadow-lg sm:p-8">
              <div className="flex justify-end">
                <CustomButton
                  text="Save Preferences"
                  className="btn-primary w-full sm:w-auto"
                  loading={isLoading}
                  onClick={handleSavePreferences}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PreferredCollaborationType;
