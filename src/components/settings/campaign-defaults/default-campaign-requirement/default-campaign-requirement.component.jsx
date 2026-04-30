import CustomButton from "@/common/components/custom-button/custom-button.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import COUNTRIES from "@/common/constants/countries.constant";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import YoutubeIcon from "@/common/icons/youtube";
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
  TrendingUp,
  UserCheck,
  Users,
  Video,
  Wifi,
  X,
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
  const [countrySelectValue, setCountrySelectValue] = useState(null);
  const [citySelectValue, setCitySelectValue] = useState(null);

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

            // Initialize city state if city exists
            if (profile.city) {
              setCitySelectValue({
                cityName: profile.city,
                countryCode: profile.city_country_code || profile.countries?.[0] || "",
              });
            }
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

  // Get country details for display
  const selectedCountryDetails = selectedCountries
    ? selectedCountries.map((code) => {
        const countryMeta = COUNTRIES.find(
          (country) => country.code.toUpperCase() === String(code).toUpperCase()
        );
        return {
          code,
          name: countryMeta?.label || code,
        };
      })
    : [];

  const allowedCountryCodes = selectedCountryDetails.map((country) =>
    String(country.code).toUpperCase()
  );
  const primaryCountryCode = selectedCountryDetails[0]?.code || null;

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

  const handleCountrySelect = (country) => {
    if (!country) {
      setCountrySelectValue(null);
      return;
    }

    const code = country.countryCode || country.value || country.code || "";
    if (!code) return;

    const normalizedCode = String(code).toUpperCase();
    const existing = selectedCountries || [];

    if (existing.includes(normalizedCode)) {
      setCountrySelectValue(null);
      return;
    }

    const updated = [...existing, normalizedCode];
    idealCreatorForm.setValue("countries", updated, { shouldValidate: true });
    setCountrySelectValue(null);
  };

  const handleCountryRemove = (code) => {
    const updated = (selectedCountries || []).filter(
      (existingCode) => existingCode.toUpperCase() !== String(code).toUpperCase()
    );
    idealCreatorForm.setValue("countries", updated, { shouldValidate: true });

    if (
      citySelectValue?.countryCode &&
      citySelectValue.countryCode.toUpperCase() === String(code).toUpperCase()
    ) {
      setCitySelectValue(null);
      idealCreatorForm.setValue("city", "", { shouldValidate: true });
    }
  };

  const handleCitySelect = (city) => {
    if (!city) {
      setCitySelectValue(null);
      idealCreatorForm.setValue("city", "", { shouldValidate: true });
      return;
    }

    setCitySelectValue(city);
    const cityName = city.cityName || city.label || "";
    idealCreatorForm.setValue("city", cityName, { shouldValidate: true });
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
    <>
      {/* Header */}
      <div className="mb-4 rounded-lg bg-primary p-3 text-white sm:mb-8 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Default Campaign Requirements
        </h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Set your campaign preferences and ideal creator requirements for consistent standards
        </p>
      </div>

      {/* Section Tabs */}
      <div className="mb-4 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:space-x-4 sm:gap-0">
        <button
          onClick={() => setActiveSection("preferences")}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-6 sm:py-3 sm:text-sm ${
            activeSection === "preferences"
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          Campaign Preferences
        </button>
        <button
          onClick={() => setActiveSection("ideal")}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-200 sm:px-6 sm:py-3 sm:text-sm ${
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
          <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Filming Preference */}
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">Geographic Focus</h3>
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">Target Niches</h3>
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 text-sm font-semibold text-gray-900 sm:text-lg">Preferred Creator Size</h3>
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
          <div className="mt-6 flex justify-end sm:mt-10">
            <CustomButton
              text={isLoading ? "Saving..." : "Save Campaign Preferences"}
              className="btn-primary w-full sm:w-auto"
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
            <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
              {/* Minimum Followers */}
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-900 sm:text-lg">
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-900 sm:text-lg">
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
            <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
              <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-900 sm:text-lg">
                <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                Location
              </h3>

              {/* Countries */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Select Countries</h4>
                <CountrySelect
                  label="Add country"
                  name="countries_selector"
                  value={countrySelectValue}
                  onChange={handleCountrySelect}
                  isRequired={false}
                  errors={idealCreatorForm.formState.errors}
                />
                {selectedCountryDetails.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {selectedCountryDetails.map((country) => (
                      <span
                        key={country.code}
                        className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                      >
                        {country.name}
                        <button
                          type="button"
                          onClick={() => handleCountryRemove(country.code)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {idealCreatorForm.formState.errors.countries && (
                  <p className="text-xs text-red-600 mt-2">
                    {idealCreatorForm.formState.errors.countries.message}
                  </p>
                )}
              </div>

              {/* City Search */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Specific City (Optional)</h4>
                <CitySelect
                  label="Search for cities"
                  name="city_selector"
                  countryCode={citySelectValue?.countryCode || primaryCountryCode}
                  countryCodes={allowedCountryCodes}
                  value={citySelectValue}
                  onChange={handleCitySelect}
                  isRequired={false}
                  errors={idealCreatorForm.formState.errors}
                />
              </div>
            </div>

            {/* Age Range & Platforms */}
            <div className="grid gap-4 sm:gap-8 lg:grid-cols-2">
              {/* Age Range */}
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-900 sm:text-lg">
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
              <div className="rounded-lg bg-white p-3 shadow-lg sm:p-4">
                <h3 className="mb-4 flex items-center text-sm font-semibold text-gray-900 sm:text-lg">
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
          <div className="mt-6 flex justify-end sm:mt-10">
            <CustomButton
              text={isLoading ? "Saving..." : "Save Ideal Creator"}
              className="btn-primary w-full sm:w-auto"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DefaultCampaignRequirements;
