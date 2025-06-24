import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  Globe,
  Hash,
  MapPin,
  Search,
  UserCheck,
} from "lucide-react";
import { useState } from "react";

const IdealCreator = ({ onNext, onBack }) => {
  const [minFollowers, setMinFollowers] = useState("");
  const [selectedGender, setSelectedGender] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedAgeRanges, setSelectedAgeRanges] = useState([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [citySearch, setCitySearch] = useState("");

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
    { id: "instagram", label: "Instagram", icon: "📸" },
    { id: "tiktok", label: "TikTok", icon: "🎵" },
    { id: "youtube", label: "YouTube", icon: "📹" },
    { id: "twitter", label: "Twitter", icon: "🐦" },
    { id: "facebook", label: "Facebook", icon: "📘" },
    { id: "linkedin", label: "LinkedIn", icon: "💼" },
    { id: "snapchat", label: "Snapchat", icon: "👻" },
    { id: "pinterest", label: "Pinterest", icon: "📌" },
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

  const toggleSelection = (item, selectedArray, setSelectedArray) => {
    setSelectedArray((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const getSelectionSummary = () => {
    const totalSelections =
      selectedGender.length +
      selectedCountries.length +
      selectedAgeRanges.length +
      selectedPlatforms.length +
      (minFollowers ? 1 : 0);
    return totalSelections;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
            <span>Step 6 of 6</span>
            <span>100% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-full transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Who Are You Looking to Work With?
          </h1>
          <p className="text-gray-600">Help us find the perfect creators for your campaigns</p>
        </div>

        <div className="space-y-8">
          {/* Follower Count & Gender */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Minimum Followers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Hash className="h-5 w-5 text-indigo-600 mr-2" />
                Minimum Followers <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {followerRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setMinFollowers(range.value)}
                    className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
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
            </div>

            {/* Gender */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <UserCheck className="h-5 w-5 text-indigo-600 mr-2" />
                Gender
              </h3>
              <div className="grid grid-cols-1 gap-3">
                {genderOptions.map((gender) => {
                  const isSelected = selectedGender.includes(gender.id);
                  return (
                    <button
                      key={gender.id}
                      onClick={() => toggleSelection(gender.id, selectedGender, setSelectedGender)}
                      className={`
                        flex items-center p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
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
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
              Location
            </h3>

            {/* Countries */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Select Countries</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {countries.map((country) => {
                  const isSelected = selectedCountries.includes(country.id);
                  return (
                    <button
                      key={country.id}
                      onClick={() =>
                        toggleSelection(country.id, selectedCountries, setSelectedCountries)
                      }
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-center
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
            </div>

            {/* City Search */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Specific City (Optional)</h4>
              <CustomInput
                placeholder="Search for specific cities..."
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                icon={Search}
              />
            </div>
          </div>

          {/* Age Range & Platforms */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Age Range */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                Age Range
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ageRanges.map((age) => {
                  const isSelected = selectedAgeRanges.includes(age.id);
                  return (
                    <button
                      key={age.id}
                      onClick={() =>
                        toggleSelection(age.id, selectedAgeRanges, setSelectedAgeRanges)
                      }
                      className={`
                        p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 text-center
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
            </div>

            {/* Platforms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Globe className="h-5 w-5 text-indigo-600 mr-2" />
                Primary Platforms
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {platforms.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <button
                      key={platform.id}
                      onClick={() =>
                        toggleSelection(platform.id, selectedPlatforms, setSelectedPlatforms)
                      }
                      className={`
                        flex items-center p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                        ${
                          isSelected
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                            : "border-gray-200 text-gray-700 hover:border-indigo-200"
                        }
                      `}
                    >
                      <span className="text-lg mr-3">{platform.icon}</span>
                      <span className="text-xs">{platform.label}</span>
                      {isSelected && <CheckCircle className="h-4 w-4 ml-auto text-indigo-500" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Completion Section */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Setup Complete!</h3>
              <p className="text-gray-600 mb-6">
                You've configured {getSelectionSummary()} filters to find the perfect creators
              </p>

              {/* Summary Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-indigo-600">{getSelectionSummary()}</div>
                  <div className="text-xs text-gray-600">Filters Set</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-indigo-600">
                    {selectedPlatforms.length}
                  </div>
                  <div className="text-xs text-gray-600">Platforms</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-indigo-600">
                    {selectedCountries.length}
                  </div>
                  <div className="text-xs text-gray-600">Countries</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-lg font-bold text-indigo-600">100%</div>
                  <div className="text-xs text-gray-600">Complete</div>
                </div>
              </div>

              <div className="flex justify-end">
                <CustomButton
                  text="Start Finding Creators"
                  className="btn-primary"
                  onClick={onNext}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdealCreator;
