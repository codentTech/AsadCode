import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { ArrowLeft, Camera, CheckCircle, DollarSign, Gift, MapPin, Percent, X } from "lucide-react";
import useCampaignPreferences from "./use-campaign-preferences.hook";

const CampaignPreferences = ({ onNext, onBack }) => {
  const { register, handleSubmit, errors, onSubmit, setValue, getValues, watch, isLoading } =
    useCampaignPreferences({ onNext });

  const campaignTypes = [
    {
      id: "sponsored",
      label: "Sponsored Post",
      desc: "Get paid to post on your own platform",
      icon: DollarSign,
    },
    {
      id: "ugc",
      label: "UGC",
      desc: "Create content for brands to post on their platforms or in ads",
      icon: Camera,
    },
    {
      id: "gifted",
      label: "Gifted",
      desc: "Receive free products in exchange for content",
      icon: Gift,
    },
    {
      id: "affiliate",
      label: "Affiliate",
      desc: "Earn commission for driving sales",
      icon: Percent,
    },
  ];

  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
  ];

  // Use hook state for controlled fields
  const selectedCampaignTypes = watch("campaignTypes");
  const selectedLanguages = watch("languages");
  const inPersonOpportunities = watch("inPersonOpportunities");
  const shippingAddress = watch("shippingAddress");

  const toggleCampaignType = (type) => {
    const prev = getValues("campaignTypes") || [];
    if (prev.includes(type)) {
      setValue(
        "campaignTypes",
        prev.filter((t) => t !== type),
        { shouldValidate: true }
      );
    } else {
      setValue("campaignTypes", [...prev, type], { shouldValidate: true });
    }
  };

  const toggleLanguage = (language) => {
    const prev = getValues("languages") || [];
    if (prev.includes(language)) {
      setValue(
        "languages",
        prev.filter((l) => l !== language),
        { shouldValidate: true }
      );
    } else {
      setValue("languages", [...prev, language], { shouldValidate: true });
    }
  };

  const handleInPersonChange = (value) => {
    setValue("inPersonOpportunities", value === "yes", { shouldValidate: true });
  };

  const handleShippingChange = (field, value) => {
    setValue(`shippingAddress.${field}`, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
            <span>Step 5 of 5</span>
            <span>100% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tell Us the Campaigns You're Open To
          </h1>
          <p className="text-gray-600">Help brands find you for the right opportunities</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-8">
            {/* Campaign Types */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Campaign Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <div
                      key={type.id}
                      onClick={() => toggleCampaignType(type.id)}
                      className={
                        `p-2 text-xs rounded-lg border-2 cursor-pointer transition-all duration-300 hover:shadow-md ` +
                        (selectedCampaignTypes?.includes(type.id)
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200")
                      }
                    >
                      <div className="flex items-start space-x-4">
                        <div
                          className={
                            `p-2 rounded-lg flex-shrink-0 ` +
                            (selectedCampaignTypes?.includes(type.id)
                              ? "bg-indigo-500 text-white"
                              : "bg-gray-100 text-gray-600")
                          }
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm font-bold text-gray-900">{type.label}</h4>
                            {selectedCampaignTypes?.includes(type.id) && (
                              <CheckCircle className="h-5 w-5 text-indigo-500" />
                            )}
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
              {/* Languages */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Languages</h3>
                <div className="grid grid-cols-2 gap-3">
                  {languages.map((language) => (
                    <button
                      key={language}
                      type="button"
                      onClick={() => toggleLanguage(language)}
                      className={
                        `p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200 ` +
                        (selectedLanguages?.includes(language)
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-600 hover:border-indigo-200")
                      }
                    >
                      {language}
                    </button>
                  ))}
                </div>
                {errors.languages && (
                  <p className="text-xs text-red-600 mt-2">{errors.languages.message}</p>
                )}
              </div>

              {/* In-Person Opportunities */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  In-Person Opportunities
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

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                Shipping Address (Optional)
              </h3>
              <p className="text-xs text-gray-600 mb-4">
                Only visible when a brand is sending you a product
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <CustomInput
                  label="Street Address"
                  name="address"
                  placeholder="Enter your address"
                  icon={MapPin}
                  value={shippingAddress?.street || ""}
                  onChange={(e) => handleShippingChange("street", e.target.value)}
                />
                <CustomInput
                  label="City"
                  name="city"
                  placeholder="Enter city"
                  value={shippingAddress?.city || ""}
                  onChange={(e) => handleShippingChange("city", e.target.value)}
                />
                <CustomInput
                  label="State/Province"
                  name="state"
                  placeholder="Enter state"
                  value={shippingAddress?.state || ""}
                  onChange={(e) => handleShippingChange("state", e.target.value)}
                />
                <CustomInput
                  label="ZIP/Postal Code"
                  name="zipCode"
                  placeholder="Enter ZIP code"
                  value={shippingAddress?.zipCode || ""}
                  onChange={(e) => handleShippingChange("zipCode", e.target.value)}
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
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CampaignPreferences;
