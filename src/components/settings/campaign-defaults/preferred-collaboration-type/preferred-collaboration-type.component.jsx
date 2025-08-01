import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { getUser } from "@/common/utils/users.util";
import { updateCreatorPreferences } from "@/provider/features/users/users.slice";
import { CheckCircle, DollarSign, Gift, MapPin, Percent } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const PreferredCollaborationType = () => {
  const dispatch = useDispatch();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [inPersonOpportunities, setInPersonOpportunities] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        if (user) {
          // Set initial values from user data
          if (user.creator_profile?.campaign_types) {
            setSelectedTypes(user.creator_profile.campaign_types);
          }
          if (user.creator_profile?.languages) {
            setSelectedLanguages(user.creator_profile.languages);
          }
          if (user.creator_profile?.in_person_opportunities !== undefined) {
            setInPersonOpportunities(user.creator_profile.in_person_opportunities);
          }
          if (user.creator_profile?.shipping_address) {
            setShippingAddress(user.creator_profile.shipping_address);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

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
      icon: Gift,
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

  const toggleCampaignType = (typeId) => {
    setSelectedTypes((prev) =>
      prev.includes(typeId) ? prev.filter((id) => id !== typeId) : [...prev, typeId]
    );
  };

  const toggleLanguage = (language) => {
    setSelectedLanguages((prev) =>
      prev.includes(language) ? prev.filter((l) => l !== language) : [...prev, language]
    );
  };

  const handleInPersonChange = (value) => {
    setInPersonOpportunities(value === "yes");
  };

  const handleShippingChange = (field, value) => {
    setShippingAddress((prev) => ({ ...prev, [field]: value }));
  };

  const handleSavePreferences = async () => {
    try {
      setIsLoading(true);

      const preferences = {
        campaignTypes: selectedTypes,
        languages: selectedLanguages,
        inPersonOpportunities: inPersonOpportunities,
        shippingAddress: shippingAddress,
      };

      const result = await dispatch(updateCreatorPreferences(preferences)).unwrap();

      if (result.success) {
        // Refresh user data from localStorage after successful update
        getUser(result?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };

  // Use local loading state as fallback if Redux state is not available

  return (
    <DashboardLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header - Keep the primary banner */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Preferred Collaboration Type</h1>
          <p className="text-sm mt-1">
            Choose your default collaboration preferences. This helps brands understand how you
            prefer to work together.
          </p>
        </div>

        <div className="max-w-full mx-auto">
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
                            {selectedTypes?.includes(type.id) && (
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
                <div className="flex justify-end">
                  <CustomButton
                    text={"Save Preferences"}
                    className="btn-primary"
                    loading={isLoading}
                    onClick={handleSavePreferences}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PreferredCollaborationType;
