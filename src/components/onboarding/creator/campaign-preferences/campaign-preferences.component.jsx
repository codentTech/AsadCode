// CampaignPreferences.jsx
"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import LanguageSelect from "@/common/components/dropdowns/language-select/language-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import { ArrowLeft, CheckCircle, MapPin } from "lucide-react";
import useCampaignPreferences from "./use-campaign-preferences.hook";

const CampaignPreferences = ({ onNext, onBack }) => {
  const {
    // form
    handleSubmit,
    errors,
    onSubmit,
    isLoading,

    // ui data
    campaignTypes,
    ethnicityOptions,

    // watched values
    selectedCampaignTypes,
    selectedLanguages,
    selectedEthnicity,
    inPersonOpportunities,
    shippingAddress,

    // derived state for selects
    countrySelection,
    citySelection,
    countryCode,

    // handlers
    toggleCampaignType,
    handleLanguagesChange,
    handleEthnicityChange,
    handleCountrySelect,
    handleCitySelect,
    handleInPersonChange,
    handleShippingChange,
    refreshCountryCityFromForm, // optional, but kept for safety if needed
  } = useCampaignPreferences({ onNext });

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-5 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">
            Tell Us the Campaigns You're Open To
          </h1>
          <p className="text-sm lg:text-lg text-white">
            Help brands find you for the right opportunities
          </p>
        </div>
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>Step 4 of 5</span>
            <span>80% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-4/5 transition-all duration-500" />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Campaign Types */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Campaign Types</h3>

              <div className="grid md:grid-cols-2 gap-4">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  const selected = selectedCampaignTypes?.includes(type.id);

                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleCampaignType(type.id)}
                      className={
                        `p-2 text-xs rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ` +
                        (selected
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200")
                      }
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={
                            `p-2 rounded-lg flex-shrink-0 ` +
                            (selected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-600")
                          }
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{type.label}</h4>
                            {selected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                          </div>
                          <p className="text-xs text-gray-600">{type.desc}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {errors.campaignTypes && (
                <p className="text-xs text-red-600 mt-2">{errors.campaignTypes.message}</p>
              )}
            </div>

            {/* Language & Location */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Languages + Ethnicity */}
              <div className="bg-white rounded-lg shadow-lg p-4 space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Languages</h3>
                <div>
                  <LanguageSelect
                    name="languages"
                    value={selectedLanguages || []}
                    onChange={handleLanguagesChange}
                    errors={errors}
                    maxSelections={8}
                  />
                </div>

                {/* In-Person Opportunities */}
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1 border-t pt-4">
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

                  {errors.inPersonOpportunities && (
                    <p className="text-xs text-red-600 mt-2">
                      {errors.inPersonOpportunities.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Ethnicity */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Ethnicity (Optional)</h3>
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

                {errors.ethnicity && (
                  <p className="text-xs text-red-600 mt-2">{errors.ethnicity.message}</p>
                )}
              </div>
            </div>

            {/* Shipping Address (MANDATORY) */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Shipping Address <span className="text-red-500">*</span>
              </h3>

              <p className="text-xs text-gray-600 mb-4">
                Your shipping address is kept private and is never publicly visible. It will only be
                shared with a brand after you are hired for a campaign that requires product
                delivery.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <CustomInput
                  label="Address line 1"
                  name="street"
                  placeholder="Enter your address"
                  icon={MapPin}
                  value={shippingAddress?.street || ""}
                  onChange={(e) => handleShippingChange("street", e.target.value)}
                  errors={errors?.shippingAddress || {}}
                  required
                />

                <CustomInput
                  label="Address line 2 (Optional)"
                  name="line2"
                  placeholder="Apartment, suite, unit, etc."
                  value={shippingAddress?.line2 || ""}
                  onChange={(e) => handleShippingChange("line2", e.target.value)}
                  errors={errors?.shippingAddress || {}}
                />

                <CustomInput
                  label="Address line 3 (Optional)"
                  name="line3"
                  placeholder="Building, floor, landmark"
                  value={shippingAddress?.line3 || ""}
                  onChange={(e) => handleShippingChange("line3", e.target.value)}
                  errors={errors?.shippingAddress || {}}
                />

                <CustomInput
                  label="State or Province"
                  name="state"
                  placeholder="Enter state/province"
                  value={shippingAddress?.state || ""}
                  onChange={(e) => handleShippingChange("state", e.target.value)}
                  errors={errors?.shippingAddress || {}}
                  required
                />

                <CustomInput
                  label="Postal code"
                  name="zipCode"
                  placeholder="Enter postal code"
                  value={shippingAddress?.zipCode || ""}
                  onChange={(e) => handleShippingChange("zipCode", e.target.value)}
                  errors={errors?.shippingAddress || {}}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <CountrySelect
                  label="Country"
                  name="country"
                  value={countrySelection}
                  onChange={handleCountrySelect}
                  isRequired={true}
                  errors={errors?.shippingAddress || {}}
                />

                <CitySelect
                  label="City"
                  name="city"
                  countryCode={countryCode}
                  countryCodes={countryCode ? [countryCode] : []}
                  value={citySelection}
                  onChange={handleCitySelect}
                  isRequired={true}
                  errors={errors?.shippingAddress || {}}
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="text-center">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Done!</h3>
                  <p className="text-gray-600">
                    Save your preferences and start receiving campaign opportunities
                  </p>
                </div>

                <div className="flex justify-end">
                  <CustomButton
                    text="Save Preferences"
                    className="btn-primary"
                    type="submit"
                    disabled={isLoading}
                    loading={isLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          Used for gifting campaigns and product based collaborations
        </div>
      </div>
    </div>
  );
};

export default CampaignPreferences;
