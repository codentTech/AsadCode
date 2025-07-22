import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import FacebookIcon from "@/common/icons/facebook";
import InstagramIcon from "@/common/icons/instagram";
import TikTokIcon from "@/common/icons/tiktok";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
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
import useIdealCreator from "./use-ideal-creator.hook";
import SetupProgress from "../../components/setup-progress/setup-progress.component";

const IdealCreator = ({ onNext, onBack }) => {
  const { register, handleSubmit, errors, onSubmit, setValue, getValues, watch, isLoading } =
    useIdealCreator({ onNext });

  const minFollowers = watch("min_followers");
  const selectedGender = watch("gender");
  const selectedCountries = watch("countries");
  const selectedAgeRanges = watch("age_ranges");
  const selectedPlatforms = watch("platforms");
  const citySearch = watch("city");

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
    { id: "twitter", label: "Twitter", icon: TwitterIcon },
    { id: "facebook", label: "Facebook", icon: FacebookIcon },
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

  const toggleSelection = (item, selectedArray, field) => {
    const prev = getValues(field) || [];
    if (prev.includes(item)) {
      setValue(
        field,
        prev.filter((i) => i !== item),
        { shouldValidate: true }
      );
    } else {
      setValue(field, [...prev, item], { shouldValidate: true });
    }
  };

  const getSelectionSummary = () => {
    const totalSelections =
      (selectedGender?.length || 0) +
      (selectedCountries?.length || 0) +
      (selectedAgeRanges?.length || 0) +
      (selectedPlatforms?.length || 0) +
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

        <form>
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
                        setValue("min_followers", range.value, { shouldValidate: true })
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
                {errors.min_followers && (
                  <p className="text-xs text-red-600 mt-2">{errors.min_followers.message}</p>
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
                        onClick={() => toggleSelection(gender.id, selectedGender, "gender")}
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
                {errors.gender && (
                  <p className="text-xs text-red-600 mt-2">{errors.gender.message}</p>
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
                        onClick={() => toggleSelection(country.id, selectedCountries, "countries")}
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
                {errors.countries && (
                  <p className="text-xs text-red-600 mt-2">{errors.countries.message}</p>
                )}
              </div>

              {/* City Search */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Specific City (Optional)</h4>
                <CustomInput
                  placeholder="Search for specific cities..."
                  value={citySearch}
                  onChange={(e) => setValue("city", e.target.value, { shouldValidate: true })}
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
                        onClick={() => toggleSelection(age.id, selectedAgeRanges, "age_ranges")}
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
                {errors.age_ranges && (
                  <p className="text-xs text-red-600 mt-2">{errors.age_ranges.message}</p>
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
                        onClick={() => toggleSelection(platform.id, selectedPlatforms, "platforms")}
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
                {errors.platforms && (
                  <p className="text-xs text-red-600 mt-2">{errors.platforms.message}</p>
                )}
              </div>
            </div>

            {/* Completion Section */}
            <SetupProgress
              percent={
                (minFollowers ? 20 : 0) +
                (selectedGender?.length > 0 ? 20 : 0) +
                (selectedCountries?.length > 0 ? 20 : 0) +
                (selectedAgeRanges?.length > 0 ? 20 : 0) +
                (selectedPlatforms?.length > 0 ? 20 : 0)
              }
              steps={[
                {
                  label: "Minimum Followers",
                  status: minFollowers ? "complete" : "pending",
                },
                {
                  label: "Gender",
                  status: selectedGender?.length > 0 ? "count" : "pending",
                  count: selectedGender?.length,
                },
                {
                  label: "Countries",
                  status: selectedCountries?.length > 0 ? "count" : "pending",
                  count: selectedCountries?.length,
                },
                {
                  label: "Age Ranges",
                  status: selectedAgeRanges?.length > 0 ? "count" : "pending",
                  count: selectedAgeRanges?.length,
                },
                {
                  label: "Platforms",
                  status: selectedPlatforms?.length > 0 ? "count" : "pending",
                  count: selectedPlatforms?.length,
                },
              ]}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default IdealCreator;
