import React, { useState } from "react";
import {
  Filter,
  Save,
  DollarSign,
  MapPin,
  Calendar,
  Users,
  Tag,
  Globe,
  ArrowLeft,
  CheckCircle,
  Settings,
  Zap,
  Eye,
  Star,
  TrendingUp,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";

const SavedDefaultFilters = ({ onNext, onBack }) => {
  // Filter States
  const [budgetRange, setBudgetRange] = useState({ min: "", max: "" });
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [projectDuration, setProjectDuration] = useState("");
  const [campaignTypes, setCampaignTypes] = useState([]);
  const [brandCategories, setBrandCategories] = useState([]);
  const [companySize, setCompanySize] = useState([]);
  const [urgency, setUrgency] = useState("");

  // Filter Options
  const locations = [
    { id: "local", label: "Local (Same City)", icon: "📍", desc: "Brands in your area" },
    { id: "national", label: "National", icon: "🇺🇸", desc: "Country-wide brands" },
    { id: "global", label: "Global", icon: "🌍", desc: "International brands" },
  ];

  const durationOptions = [
    { id: "short", label: "1-3 days", desc: "Quick turnaround projects" },
    { id: "medium", label: "1-2 weeks", desc: "Standard project timeline" },
    { id: "long", label: "1+ months", desc: "Long-term partnerships" },
    { id: "ongoing", label: "Ongoing", desc: "Continuous collaboration" },
  ];

  const campaignTypeOptions = [
    {
      id: "sponsored",
      label: "Sponsored Posts",
      icon: DollarSign,
      color: "bg-green-100 text-green-700",
    },
    { id: "ugc", label: "UGC Content", icon: "🎬", color: "bg-purple-100 text-purple-700" },
    { id: "gifted", label: "Gifted Products", icon: "🎁", color: "bg-pink-100 text-pink-700" },
    {
      id: "affiliate",
      label: "Affiliate Marketing",
      icon: "💰",
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: "events",
      label: "Event Partnerships",
      icon: "🎪",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  const brandCategoryOptions = [
    { id: "fashion", label: "Fashion & Style", icon: "👗" },
    { id: "beauty", label: "Beauty & Skincare", icon: "💄" },
    { id: "food", label: "Food & Beverage", icon: "🍕" },
    { id: "tech", label: "Technology", icon: "💻" },
    { id: "fitness", label: "Fitness & Health", icon: "💪" },
    { id: "travel", label: "Travel & Tourism", icon: "✈️" },
    { id: "home", label: "Home & Lifestyle", icon: "🏠" },
    { id: "automotive", label: "Automotive", icon: "🚗" },
    { id: "finance", label: "Finance & Business", icon: "💼" },
    { id: "gaming", label: "Gaming & Entertainment", icon: "🎮" },
  ];

  const companySizeOptions = [
    { id: "startup", label: "Startup (1-50)", desc: "Young, agile companies" },
    { id: "medium", label: "Medium (51-500)", desc: "Growing businesses" },
    { id: "large", label: "Large (500+)", desc: "Established corporations" },
    { id: "enterprise", label: "Enterprise (1000+)", desc: "Major corporations" },
  ];

  const urgencyOptions = [
    {
      id: "flexible",
      label: "Flexible",
      desc: "No rush, quality first",
      icon: "🕐",
      color: "text-green-600",
    },
    {
      id: "standard",
      label: "Standard (1-2 weeks)",
      desc: "Normal timeline",
      icon: "⏰",
      color: "text-blue-600",
    },
    {
      id: "urgent",
      label: "Urgent (3-7 days)",
      desc: "Quick turnaround",
      icon: "⚡",
      color: "text-orange-600",
    },
    {
      id: "asap",
      label: "ASAP (1-3 days)",
      desc: "Immediate need",
      icon: "🔥",
      color: "text-red-600",
    },
  ];

  // Toggle functions
  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getFilterCount = () => {
    let count = 0;
    if (budgetRange.min || budgetRange.max) count++;
    if (selectedLocations.length > 0) count++;
    if (projectDuration) count++;
    if (campaignTypes.length > 0) count++;
    if (brandCategories.length > 0) count++;
    if (companySize.length > 0) count++;
    if (urgency) count++;
    return count;
  };

  const resetAllFilters = () => {
    setBudgetRange({ min: "", max: "" });
    setSelectedLocations([]);
    setProjectDuration("");
    setCampaignTypes([]);
    setBrandCategories([]);
    setCompanySize([]);
    setUrgency("");
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <div className="bg-primary p-4 sm:p-6 rounded-lg text-white mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Saved Default Filters</h1>
          <p className="text-sm sm:text-base mt-1">
            Set your default filters to automatically see the most relevant campaigns. Save time and
            focus on opportunities that match your preferences.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-4">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Budget Range */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mr-3">
                  <DollarSign className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Budget Range</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <CustomInput
                  label="Min Budget"
                  name="minBudget"
                  type="number"
                  placeholder="100"
                  value={budgetRange.min}
                  onChange={(e) => setBudgetRange((prev) => ({ ...prev, min: e.target.value }))}
                />
                <CustomInput
                  label="Max Budget"
                  name="maxBudget"
                  type="number"
                  placeholder="5000"
                  value={budgetRange.max}
                  onChange={(e) => setBudgetRange((prev) => ({ ...prev, max: e.target.value }))}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Filter campaigns within your preferred budget range
              </p>
            </div>

            {/* Location Preferences */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3">
                  <MapPin className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Location Preferences</h3>
              </div>

              <div className="space-y-2">
                {locations.map((location) => {
                  const isSelected = selectedLocations.includes(location.id);
                  return (
                    <button
                      key={location.id}
                      onClick={() =>
                        toggleSelection(location.id, selectedLocations, setSelectedLocations)
                      }
                      className={`
                        w-full flex items-center p-3 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <span className="text-lg mr-3">{location.icon}</span>
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{location.label}</div>
                        <div className="text-xs text-gray-500">{location.desc}</div>
                      </div>
                      {isSelected && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Project Duration */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 rounded-lg mr-3">
                  <Calendar className="h-4 w-4 text-purple-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Project Duration</h3>
              </div>

              <div className="space-y-2">
                {durationOptions.map((duration) => (
                  <label
                    key={duration.id}
                    className={`
                      flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${
                        projectDuration === duration.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="duration"
                      value={duration.id}
                      checked={projectDuration === duration.id}
                      onChange={(e) => setProjectDuration(e.target.value)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500 mr-3"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{duration.label}</div>
                      <div className="text-xs text-gray-500">{duration.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Urgency Preference */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-lg mr-3">
                  <Zap className="h-4 w-4 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Urgency Preference</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {urgencyOptions.map((option) => (
                  <label
                    key={option.id}
                    className={`
                      flex flex-col items-center p-3 rounded-lg border cursor-pointer transition-all duration-200
                      ${
                        urgency === option.id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-200"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name="urgency"
                      value={option.id}
                      checked={urgency === option.id}
                      onChange={(e) => setUrgency(e.target.value)}
                      className="hidden"
                    />
                    <div className="text-lg mb-1">{option.icon}</div>
                    <div className={`font-medium text-sm ${option.color}`}>{option.label}</div>
                    <div className="text-xs text-gray-500 text-center">{option.desc}</div>
                    {urgency === option.id && (
                      <CheckCircle className="h-3 w-3 text-indigo-500 mt-1" />
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Campaign Types */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mr-3">
                  <Star className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Campaign Types</h3>
              </div>

              <div className="space-y-2">
                {campaignTypeOptions.map((type) => {
                  const isSelected = campaignTypes.includes(type.id);
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => toggleSelection(type.id, campaignTypes, setCampaignTypes)}
                      className={`
                        w-full flex items-center p-3 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div
                        className={`
                          flex items-center justify-center w-8 h-8 rounded-lg mr-3
                          ${isSelected ? "bg-indigo-500 text-white" : type.color}
                        `}
                      >
                        {typeof Icon === "string" ? (
                          <span className="text-sm">{Icon}</span>
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span className="font-medium flex-1 text-left text-sm">{type.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand Categories */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-lg mr-3">
                  <Tag className="h-4 w-4 text-yellow-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Brand Categories</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {brandCategoryOptions.map((category) => {
                  const isSelected = brandCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() =>
                        toggleSelection(category.id, brandCategories, setBrandCategories)
                      }
                      className={`
                        flex items-center p-2 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <span className="text-sm mr-2">{category.icon}</span>
                      <span className="text-xs font-medium text-left flex-1">{category.label}</span>
                      {isSelected && <CheckCircle className="h-3 w-3 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Company Size */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-teal-100 rounded-lg mr-3">
                  <Users className="h-4 w-4 text-teal-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Company Size</h3>
              </div>

              <div className="space-y-2">
                {companySizeOptions.map((size) => {
                  const isSelected = companySize.includes(size.id);
                  return (
                    <button
                      key={size.id}
                      onClick={() => toggleSelection(size.id, companySize, setCompanySize)}
                      className={`
                        w-full flex items-center p-3 rounded-lg border transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-gray-200 hover:border-indigo-200"
                        }
                      `}
                    >
                      <div className="text-left flex-1">
                        <div className="font-medium text-sm">{size.label}</div>
                        <div className="text-xs text-gray-500">{size.desc}</div>
                      </div>
                      {isSelected && <CheckCircle className="h-4 w-4 text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 border">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                  <Eye className="h-4 w-4 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">Filter Preview</h3>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-gray-50 border rounded-lg p-2 text-center">
                  <div className="text-lg font-bold">{getFilterCount()}</div>
                  <div className="text-xs text-gray-500">Active Filters</div>
                </div>
                <div className="bg-gray-50 border rounded-lg p-2 text-center">
                  <div className="text-lg font-bold">
                    {campaignTypes.length === 0 ? "All" : campaignTypes.length}
                  </div>
                  <div className="text-xs text-gray-500">Campaign Types</div>
                </div>
                <div className="bg-gray-50 border rounded-lg p-2 text-center">
                  <div className="text-lg font-bold">
                    {brandCategories.length === 0 ? "All" : brandCategories.length}
                  </div>
                  <div className="text-xs text-gray-500">Brand Categories</div>
                </div>
              </div>

              <div className="bg-gray-50 border rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium">Est. Monthly Matches</h4>
                  <TrendingUp className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="text-xl font-bold">
                  {getFilterCount() === 0
                    ? "500+"
                    : getFilterCount() <= 2
                      ? "300+"
                      : getFilterCount() <= 4
                        ? "150+"
                        : "75+"}
                </div>
                <p className="text-xs text-gray-500">
                  {getFilterCount() === 0
                    ? "All campaigns visible"
                    : getFilterCount() <= 2
                      ? "Broad filtering"
                      : getFilterCount() <= 4
                        ? "Balanced filtering"
                        : "Highly targeted"}
                </p>
              </div>

              <div className="flex gap-2">
                <CustomButton
                  text="Save Settings"
                  className="btn-primary text-sm flex-1"
                  onClick={onNext}
                  icon={Save}
                />
                <CustomButton
                  onClick={resetAllFilters}
                  className="btn-secondary text-sm"
                  text="Reset"
                />
              </div>

              <p className="text-xs text-gray-400 text-center mt-2">
                You can change filters anytime in your dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default SavedDefaultFilters;
