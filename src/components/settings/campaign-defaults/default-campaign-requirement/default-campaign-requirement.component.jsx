import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import FacebookIcon from "@/common/icons/facebook";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { getUser } from "@/common/utils/users.util";
import {
  setupBrandCampaignPreferences,
  setupBrandIdealCreator,
} from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Calendar,
  Camera,
  CheckCircle,
  DollarSign,
  Gift,
  Globe,
  Globe2,
  Hash,
  MapPin,
  Percent,
  Search,
  TrendingUp,
  UserCheck,
  Users,
  Video,
  Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

// Campaign Preferences Validation Schema
const campaignPreferencesSchema = Yup.object().shape({
  filming_preference: Yup.string().required("Filming preference is required"),
  campaign_types: Yup.array().min(1, "Select at least one campaign type"),
  target_niches: Yup.array().min(1, "Select at least one niche"),
  creator_sizes: Yup.array().min(1, "Select at least one creator size"),
  geographic_focus: Yup.array().min(1, "Select at least one geographic focus"),
});

// Ideal Creator Validation Schema
const idealCreatorSchema = Yup.object().shape({
  min_followers: Yup.string().required("Minimum followers is required"),
  gender: Yup.array().min(1, "Select at least one gender"),
  countries: Yup.array().min(1, "Select at least one country"),
  city: Yup.string(),
  age_ranges: Yup.array().min(1, "Select at least one age range"),
  platforms: Yup.array().min(1, "Select at least one platform"),
});

const DefaultCampaignRequirements = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeSection, setActiveSection] = useState("preferences"); // "preferences" or "ideal"

  // Campaign Preferences Form
  const campaignPreferencesForm = useForm({
    resolver: yupResolver(campaignPreferencesSchema),
    mode: "onChange",
    defaultValues: {
      filming_preference: "",
      campaign_types: [],
      target_niches: [],
      creator_sizes: [],
      geographic_focus: [],
    },
  });

  // Ideal Creator Form
  const idealCreatorForm = useForm({
    resolver: yupResolver(idealCreatorSchema),
    mode: "onChange",
    defaultValues: {
      min_followers: "",
      gender: [],
      countries: [],
      city: "",
      age_ranges: [],
      platforms: [],
    },
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        if (user) {
          setCurrentUser(user);

          // Populate campaign preferences form
          if (user.brand_profile) {
            const prefs = user.brand_profile;
            campaignPreferencesForm.setValue("filming_preference", prefs.filming_preference || "");
            campaignPreferencesForm.setValue("campaign_types", prefs.campaign_types || []);
            campaignPreferencesForm.setValue("target_niches", prefs.target_niches || []);
            campaignPreferencesForm.setValue("creator_sizes", prefs.creator_sizes || []);
            campaignPreferencesForm.setValue("geographic_focus", prefs.geographic_focus || []);
          }

          // Populate ideal creator form
          if (user.brand_profile) {
            const profile = user.brand_profile;
            idealCreatorForm.setValue("min_followers", profile.min_followers || "");
            idealCreatorForm.setValue("gender", profile.gender || []);
            idealCreatorForm.setValue("countries", profile.countries || []);
            idealCreatorForm.setValue("city", profile.city || "");
            idealCreatorForm.setValue("age_ranges", profile.age_ranges || []);
            idealCreatorForm.setValue("platforms", profile.platforms || []);
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [campaignPreferencesForm.setValue, idealCreatorForm.setValue]);

  // Campaign Preferences Data
  const filmingPreference = campaignPreferencesForm.watch("filming_preference");
  const selectedCampaignTypes = campaignPreferencesForm.watch("campaign_types");
  const selectedNiches = campaignPreferencesForm.watch("target_niches");
  const selectedCreatorSizes = campaignPreferencesForm.watch("creator_sizes");
  const selectedGeographicFocus = campaignPreferencesForm.watch("geographic_focus");

  const filmingOptions = [
    {
      id: "in-person",
      label: "In person filming",
      desc: "Creators visit your location",
      icon: Video,
      color: "text-purple-600",
    },
    {
      id: "remote",
      label: "Remote filming",
      desc: "Creators film from their location",
      icon: Wifi,
      color: "text-blue-600",
    },
    {
      id: "both",
      label: "Both options",
      desc: "Flexible filming approach",
      icon: Globe2,
      color: "text-green-600",
    },
  ];

  const campaignTypes = [
    {
      id: "sponsored",
      label: "Sponsored Post",
      desc: "Pay creators to post on their social media",
      icon: DollarSign,
      popularity: 95,
      avgCost: "$200-800",
    },
    {
      id: "ugc",
      label: "UGC Content",
      desc: "Creators make content for your brand to use",
      icon: Camera,
      popularity: 88,
      avgCost: "$300-1200",
    },
    {
      id: "gifted",
      label: "Gifted Campaign",
      desc: "Free products in exchange for posts",
      icon: Gift,
      popularity: 92,
      avgCost: "$50-500 value",
    },
    {
      id: "affiliate",
      label: "Affiliate Marketing",
      desc: "Commission-based partnerships",
      icon: Percent,
      popularity: 76,
      avgCost: "5-20% commission",
    },
  ];

  const niches = [
    { name: "Fashion", icon: "👗", color: "bg-pink-100 text-pink-700" },
    { name: "Food", icon: "🍕", color: "bg-orange-100 text-orange-700" },
    { name: "Beauty", icon: "💄", color: "bg-purple-100 text-purple-700" },
    { name: "Fitness", icon: "💪", color: "bg-green-100 text-green-700" },
    { name: "Travel", icon: "✈️", color: "bg-blue-100 text-blue-700" },
    { name: "Tech", icon: "💻", color: "bg-gray-100 text-gray-700" },
    { name: "Lifestyle", icon: "🌟", color: "bg-yellow-100 text-yellow-700" },
    { name: "Gaming", icon: "🎮", color: "bg-indigo-100 text-indigo-700" },
    { name: "Home & Decor", icon: "🏠", color: "bg-emerald-100 text-emerald-700" },
    { name: "Automotive", icon: "🚗", color: "bg-red-100 text-red-700" },
  ];

  const creatorSizes = [
    {
      id: "micro",
      label: "Micro (1k–10k)",
      desc: "High engagement, niche audiences",
      icon: Users,
      benefits: ["Higher engagement", "More affordable", "Authentic connections"],
    },
    {
      id: "mid",
      label: "Mid (10k–100k)",
      desc: "Balance of reach and engagement",
      icon: TrendingUp,
      benefits: ["Good reach", "Professional content", "Proven track record"],
    },
    {
      id: "macro",
      label: "Macro (100k+)",
      desc: "Maximum reach and brand awareness",
      icon: Globe2,
      benefits: ["Massive reach", "Brand recognition", "Viral potential"],
    },
  ];

  const geographicFocus = [
    { id: "local", label: "Local", desc: "Specific cities/regions", icon: MapPin },
    { id: "national", label: "National", desc: "Country-wide campaigns", icon: "🇺🇸" },
    { id: "global", label: "Global", desc: "International reach", icon: Globe2 },
  ];

  // Ideal Creator Data
  const minFollowers = idealCreatorForm.watch("min_followers");
  const selectedGender = idealCreatorForm.watch("gender");
  const selectedCountries = idealCreatorForm.watch("countries");
  const selectedAgeRanges = idealCreatorForm.watch("age_ranges");
  const selectedPlatforms = idealCreatorForm.watch("platforms");
  const citySearch = idealCreatorForm.watch("city");

  const genderOptions = [
    { id: "male", label: "Male", icon: "👨" },
    { id: "female", label: "Female", icon: "👩" },
    { id: "mixed", label: "Mixed/Any", icon: "👥" },
  ];

  const countries = [
    { id: "us", label: "United States", flag: "🇺🇸", creators: "2.1M" },
    { id: "uk", label: "United Kingdom", flag: "🇬🇧", creators: "450K" },
    { id: "ca", label: "Canada", flag: "🇨🇦", creators: "380K" },
    { id: "au", label: "Australia", flag: "🇦🇺", creators: "290K" },
    { id: "de", label: "Germany", flag: "🇩🇪", creators: "520K" },
    { id: "fr", label: "France", flag: "🇫🇷", creators: "410K" },
    { id: "br", label: "Brazil", flag: "🇧🇷", creators: "680K" },
    { id: "in", label: "India", flag: "🇮🇳", creators: "1.8M" },
  ];

  const ageRanges = [
    { id: "13-17", label: "13-17", desc: "Gen Z Early" },
    { id: "18-25", label: "18-25", desc: "Gen Z Core" },
    { id: "26-32", label: "26-32", desc: "Millennials" },
    { id: "33-40", label: "33-40", desc: "Elder Millennials" },
    { id: "41-50", label: "41-50", desc: "Gen X" },
    { id: "50+", label: "50+", desc: "Boomers+" },
  ];

  const platforms = [
    { id: "instagram", label: "Instagram", icon: InstagramIcon },
    { id: "tiktok", label: "TikTok", icon: TikTokIcon },
    { id: "youtube", label: "YouTube", icon: YoutubeIcon },
  ];

  const followerRanges = [
    { value: "1000", label: "1K+" },
    { value: "5000", label: "5K+" },
    { value: "10000", label: "10K+" },
    { value: "25000", label: "25K+" },
    { value: "50000", label: "50K+" },
    { value: "100000", label: "100K+" },
    { value: "500000", label: "500K+" },
    { value: "1000000", label: "1M+" },
  ];

  const toggleSelection = (item, selectedArray, field, form) => {
    const prev = form.getValues(field) || [];
    if (prev.includes(item)) {
      form.setValue(
        field,
        prev.filter((i) => i !== item),
        { shouldValidate: true }
      );
    } else {
      form.setValue(field, [...prev, item], { shouldValidate: true });
    }
  };

  // Campaign Preferences Submit
  const onSubmitCampaignPreferences = async (data) => {
    try {
      setIsLoading(true);

      if (!currentUser?.email) {
        console.error("No user email found");
        return;
      }

      const result = await dispatch(
        setupBrandCampaignPreferences({ payload: data, email: currentUser.email })
      ).unwrap();

      if (result.success) {
        // Refresh user data from localStorage after successful update
        getUser(result?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating campaign preferences:", error);
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Ideal Creator Submit
  const onSubmitIdealCreator = async (data) => {
    try {
      setIsLoading(true);

      if (!currentUser?.email) {
        console.error("No user email found");
        return;
      }

      const result = await dispatch(
        setupBrandIdealCreator({ payload: data, email: currentUser.email })
      ).unwrap();

      if (result.success) {
        // Refresh user data from localStorage after successful update
        getUser(result?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating ideal creator:", error);
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-8">
        <h1 className="text-xl font-bold text-white">Default Campaign Requirements</h1>
        <p className="text-sm mt-1">
          Set your campaign preferences and ideal creator requirements for consistent standards
        </p>
      </div>

      {/* Section Tabs */}
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveSection("preferences")}
          className={`px-6 py-3 rounded-lg font-medium border transition-all duration-200 ${
            activeSection === "preferences"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Campaign Preferences
        </button>
        <button
          onClick={() => setActiveSection("ideal")}
          className={`px-6 py-3 rounded-lg font-medium border transition-all duration-200 ${
            activeSection === "ideal"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Ideal Creator
        </button>
      </div>

      {/* Campaign Preferences Section */}
      {activeSection === "preferences" && (
        <form onSubmit={campaignPreferencesForm.handleSubmit(onSubmitCampaignPreferences)}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Filming Preference */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filming Requirements <span className="text-red-500">*</span>
                </h3>
                <div className="space-y-3">
                  {filmingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = filmingPreference === option.id;
                    return (
                      <div
                        key={option.id}
                        onClick={() =>
                          campaignPreferencesForm.setValue("filming_preference", option.id, {
                            shouldValidate: true,
                          })
                        }
                        className={`
                              p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-200 hover:border-indigo-200"
                              }
                            `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                                  p-2 rounded-lg flex-shrink-0
                                  ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                                `}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">{option.label}</h4>
                            <p className="text-xs text-gray-600">{option.desc}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {campaignPreferencesForm.formState.errors.filming_preference && (
                  <p className="text-xs text-red-600 mt-2">
                    {campaignPreferencesForm.formState.errors.filming_preference.message}
                  </p>
                )}
              </div>

              {/* Campaign Types */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Types <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {campaignTypes.map((type) => {
                    const Icon = type.icon;
                    const isSelected = selectedCampaignTypes?.includes(type.id);
                    return (
                      <div
                        key={type.id}
                        onClick={() =>
                          toggleSelection(
                            type.id,
                            selectedCampaignTypes,
                            "campaign_types",
                            campaignPreferencesForm
                          )
                        }
                        className={`
                              p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`
                                    p-2 rounded-lg flex-shrink-0
                                    ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                                  `}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-gray-900">{type.label}</h4>
                              <p className="text-xs text-gray-600">{type.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-medium text-primary">{type.avgCost}</div>
                            <div className="text-xs text-gray-600">{type.popularity}% use</div>
                            {isSelected && (
                              <CheckCircle className="h-4 w-4 text-indigo-500 ml-auto mt-1" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {campaignPreferencesForm.formState.errors.campaign_types && (
                  <p className="text-xs text-red-600 mt-2">
                    {campaignPreferencesForm.formState.errors.campaign_types.message}
                  </p>
                )}
              </div>

              {/* Geographic Focus */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Focus</h3>
                <div className="grid grid-cols-1 gap-3">
                  {geographicFocus.map((geo) => {
                    const Icon = geo.icon;
                    const isSelected = selectedGeographicFocus?.includes(geo.id);
                    return (
                      <div
                        key={geo.id}
                        onClick={() =>
                          toggleSelection(
                            geo.id,
                            selectedGeographicFocus,
                            "geographic_focus",
                            campaignPreferencesForm
                          )
                        }
                        className={`
                              p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-200 hover:border-indigo-200"
                              }
                            `}
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`
                                  p-2 rounded-lg flex-shrink-0
                                  ${isSelected ? "bg-indigo-500" : "bg-gray-100"}
                                `}
                          >
                            {typeof Icon === "string" ? (
                              <span className="text-lg">{Icon}</span>
                            ) : (
                              <Icon
                                className={`h-5 w-5 ${isSelected ? "text-white" : "text-gray-500"}`}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-gray-900">{geo.label}</h4>
                            <p className="text-xs text-gray-600">{geo.desc}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-indigo-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {campaignPreferencesForm.formState.errors.geographic_focus && (
                  <p className="text-xs text-red-600 mt-2">
                    {campaignPreferencesForm.formState.errors.geographic_focus.message}
                  </p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Target Niches */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Niches</h3>
                <div className="grid grid-cols-2 gap-3">
                  {niches.map((niche) => {
                    const isSelected = selectedNiches?.includes(niche.name);
                    return (
                      <button
                        key={niche.name}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            niche.name,
                            selectedNiches,
                            "target_niches",
                            campaignPreferencesForm
                          )
                        }
                        className={`
                              p-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
                              ${
                                isSelected
                                  ? `border-indigo-500 ${niche.color}`
                                  : "border-gray-200 text-gray-700 hover:border-indigo-200"
                              }
                            `}
                      >
                        <div className="flex items-center justify-center text-xs space-x-2">
                          <span>{niche.name}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs font-bold text-gray-600 mt-3">
                  Selected: {selectedNiches?.length || 0} niche
                  {selectedNiches?.length !== 1 ? "s" : ""}
                </p>
                {campaignPreferencesForm.formState.errors.target_niches && (
                  <p className="text-xs text-red-600 mt-2">
                    {campaignPreferencesForm.formState.errors.target_niches.message}
                  </p>
                )}
              </div>

              {/* Creator Sizes */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Creator Size</h3>
                <div className="space-y-4">
                  {creatorSizes.map((size) => {
                    const Icon = size.icon;
                    const isSelected = selectedCreatorSizes?.includes(size.id);
                    return (
                      <div
                        key={size.id}
                        onClick={() =>
                          toggleSelection(
                            size.id,
                            selectedCreatorSizes,
                            "creator_sizes",
                            campaignPreferencesForm
                          )
                        }
                        className={`
                              p-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            <div
                              className={`
                                    p-2 rounded-lg flex-shrink-0
                                    ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500"}
                                  `}
                            >
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bol text-gray-900">{size.label}</h4>
                              <p className="text-xs text-gray-600 mb-2">{size.desc}</p>
                              <div className="flex flex-wrap gap-1">
                                {size.benefits.map((benefit, index) => (
                                  <span
                                    key={index}
                                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg"
                                  >
                                    {benefit}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {campaignPreferencesForm.formState.errors.creator_sizes && (
                  <p className="text-xs text-red-600 mt-2">
                    {campaignPreferencesForm.formState.errors.creator_sizes.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-end mt-10">
            <CustomButton
              text={isLoading ? "Saving..." : "Save Campaign Preferences"}
              className="btn-primary"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      )}

      {/* Ideal Creator Section */}
      {activeSection === "ideal" && (
        <form onSubmit={idealCreatorForm.handleSubmit(onSubmitIdealCreator)}>
          <div className="space-y-4">
            {/* Follower Count & Gender */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Minimum Followers */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Hash className="h-5 w-5 text-indigo-600 mr-2" />
                  Minimum Followers <span className="text-red-500">*</span>
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {followerRanges.map((range) => (
                    <button
                      key={range.value}
                      type="button"
                      onClick={() =>
                        idealCreatorForm.setValue("min_followers", range.value, {
                          shouldValidate: true,
                        })
                      }
                      className={`
                            p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                            ${
                              minFollowers === range.value
                                ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                : "border-gray-200 text-gray-700 hover:border-indigo-200"
                            }
                          `}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                {idealCreatorForm.formState.errors.min_followers && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.min_followers.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <UserCheck className="h-5 w-5 text-indigo-600 mr-2" />
                  Gender
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {genderOptions.map((gender) => {
                    const isSelected = selectedGender?.includes(gender.id);
                    return (
                      <button
                        key={gender.id}
                        type="button"
                        onClick={() =>
                          toggleSelection(gender.id, selectedGender, "gender", idealCreatorForm)
                        }
                        className={`
                              flex items-center p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                  : "border-gray-200 text-gray-700 hover:border-indigo-200"
                              }
                            `}
                      >
                        {gender.label}
                        {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
                {idealCreatorForm.formState.errors.gender && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                Location
              </h3>

              {/* Countries */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Select Countries</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {countries.map((country) => {
                    const isSelected = selectedCountries?.includes(country.id);
                    return (
                      <button
                        key={country.id}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            country.id,
                            selectedCountries,
                            "countries",
                            idealCreatorForm
                          )
                        }
                        className={`
                            p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200 text-center
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                  : "border-gray-200 text-gray-700 hover:border-indigo-200"
                              }
                            `}
                      >
                        <div className="text-lg mb-1">{country.flag}</div>
                        <div className="text-xs">{country.label}</div>
                        <div className="text-xs text-gray-500">{country.creators}</div>
                      </button>
                    );
                  })}
                </div>
                {idealCreatorForm.formState.errors.countries && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.countries.message}
                  </p>
                )}
              </div>

              {/* City Search */}
              <div className="w-full max-w-md">
                <CustomInput
                  label="Specific City (Optional)"
                  placeholder="Search for specific cities"
                  value={citySearch}
                  onChange={(e) =>
                    idealCreatorForm.setValue("city", e.target.value, { shouldValidate: true })
                  }
                  icon={Search}
                />
              </div>
            </div>

            {/* Age Range & Platforms */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Age Range */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                  Age Range
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {ageRanges.map((age) => {
                    const isSelected = selectedAgeRanges?.includes(age.id);
                    return (
                      <button
                        key={age.id}
                        type="button"
                        onClick={() =>
                          toggleSelection(age.id, selectedAgeRanges, "age_ranges", idealCreatorForm)
                        }
                        className={`
                              p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200 text-center
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                  : "border-gray-200 text-gray-700 hover:border-indigo-200"
                              }
                            `}
                      >
                        <div className="font-bold">{age.label}</div>
                        <div className="text-xs text-gray-600">{age.desc}</div>
                      </button>
                    );
                  })}
                </div>
                {idealCreatorForm.formState.errors.age_ranges && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.age_ranges.message}
                  </p>
                )}
              </div>

              {/* Platforms */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Globe className="h-5 w-5 text-indigo-600 mr-2" />
                  Primary Platforms
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {platforms.map((platform) => {
                    const isSelected = selectedPlatforms?.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        type="button"
                        onClick={() =>
                          toggleSelection(
                            platform.id,
                            selectedPlatforms,
                            "platforms",
                            idealCreatorForm
                          )
                        }
                        className={`
                              flex items-center p-2 text-xs rounded-lg border-2 font-medium transition-all duration-200
                              ${
                                isSelected
                                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                                  : "border-gray-200 text-gray-700 hover:border-indigo-200"
                              }
                            `}
                      >
                        <span className="text-lg mr-3">{<platform.icon />}</span>
                        <span className="text-xs">{platform.label}</span>
                        {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-indigo-500" />}
                      </button>
                    );
                  })}
                </div>
                {idealCreatorForm.formState.errors.platforms && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.platforms.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Save Button */}
          <div className="flex justify-end mt-10">
            <CustomButton
              text={isLoading ? "Saving..." : "Save Ideal Creator"}
              className="btn-primary"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      )}
    </DashboardLayout>
  );
};

export default DefaultCampaignRequirements;
