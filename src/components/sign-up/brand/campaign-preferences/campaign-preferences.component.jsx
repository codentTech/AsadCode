import React, { useState } from "react";
import {
  Video,
  Wifi,
  Globe2,
  DollarSign,
  Camera,
  Gift,
  Percent,
  CheckCircle,
  ArrowLeft,
  Users,
  TrendingUp,
  MapPin,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const BrandCampaignPreferences = ({ onNext, onBack }) => {
  const [filmingPreference, setFilmingPreference] = useState("");
  const [selectedCampaignTypes, setSelectedCampaignTypes] = useState([]);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedCreatorSizes, setSelectedCreatorSizes] = useState([]);
  const [selectedGeographicFocus, setSelectedGeographicFocus] = useState([]);

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

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
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
            <span>Step 5 of 6</span>
            <span>83% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-5/6 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Preferences</h1>
          <p className="text-gray-600">Set your campaign needs and find the right creators</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Filming Preference */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
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
                      onClick={() => setFilmingPreference(option.id)}
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
            </div>

            {/* Campaign Types */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Campaign Types <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {campaignTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedCampaignTypes.includes(type.id);
                  return (
                    <div
                      key={type.id}
                      onClick={() =>
                        toggleSelection(type.id, selectedCampaignTypes, setSelectedCampaignTypes)
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
            </div>

            {/* Geographic Focus */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Focus</h3>
              <div className="grid grid-cols-1 gap-3">
                {geographicFocus.map((geo) => {
                  const Icon = geo.icon;
                  const isSelected = selectedGeographicFocus.includes(geo.id);
                  return (
                    <div
                      key={geo.id}
                      onClick={() =>
                        toggleSelection(geo.id, selectedGeographicFocus, setSelectedGeographicFocus)
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
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Target Niches */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Target Niches</h3>
              <div className="grid grid-cols-2 gap-3">
                {niches.map((niche) => {
                  const isSelected = selectedNiches.includes(niche.name);
                  return (
                    <button
                      key={niche.name}
                      onClick={() => toggleSelection(niche.name, selectedNiches, setSelectedNiches)}
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
                Selected: {selectedNiches.length} niche{selectedNiches.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Creator Sizes */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferred Creator Size</h3>
              <div className="space-y-4">
                {creatorSizes.map((size) => {
                  const Icon = size.icon;
                  const isSelected = selectedCreatorSizes.includes(size.id);
                  return (
                    <div
                      key={size.id}
                      onClick={() =>
                        toggleSelection(size.id, selectedCreatorSizes, setSelectedCreatorSizes)
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
            </div>

            {/* Progress Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Setup Progress</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Filming Requirements</span>
                  <span className={filmingPreference ? "text-green-600" : "text-gray-400"}>
                    {filmingPreference ? "✓ Complete" : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Campaign Types</span>
                  <span
                    className={
                      selectedCampaignTypes.length > 0 ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {selectedCampaignTypes.length > 0
                      ? `✓ ${selectedCampaignTypes.length} selected`
                      : "Pending"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Target Niches</span>
                  <span className={selectedNiches.length > 0 ? "text-green-600" : "text-gray-400"}>
                    {selectedNiches.length > 0 ? `✓ ${selectedNiches.length} selected` : "Optional"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Creator Sizes</span>
                  <span
                    className={selectedCreatorSizes.length > 0 ? "text-green-600" : "text-gray-400"}
                  >
                    {selectedCreatorSizes.length > 0
                      ? `✓ ${selectedCreatorSizes.length} selected`
                      : "Optional"}
                  </span>
                </div>
              </div>

              {filmingPreference && selectedCampaignTypes.length > 0 && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">
                    Ready to find creators that match your preferences!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end text-center mt-10">
          <CustomButton
            text="Continue Setup"
            className="btn-primary"
            onClick={onNext}
            disabled={!filmingPreference || selectedCampaignTypes.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandCampaignPreferences;
