import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { getUser } from "@/common/utils/users.util";
import { updateCampaignDefaults } from "@/provider/features/users/users.slice";
import { AddCircle } from "@mui/icons-material";
import { DollarSign, Link, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SavedDefaultFilters = () => {
  const dispatch = useDispatch();
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformUsernames, setPlatformUsernames] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        if (user) {
          // Set initial values from user data
          if (user.creator_profile?.social_platforms) {
            const platforms = user.creator_profile.social_platforms.map((p) => p.platform);
            const usernames = {};
            user.creator_profile.social_platforms.forEach((p) => {
              usernames[p.platform] = p.username;
            });
            setSelectedPlatforms(platforms);
            setPlatformUsernames(usernames);
          }
          if (user.creator_profile?.categories) {
            setSelectedCategories(user.creator_profile.categories);
          }
          if (user.creator_profile?.keyword_tags) {
            setKeywordTags(user.creator_profile.keyword_tags);
          }
          if (user.creator_profile?.content_rates) {
            const rates = {};
            user.creator_profile.content_rates.forEach((rate, index) => {
              rates[index] = rate.price;
            });
            setContentRates(rates);
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

  const platforms = ["Instagram", "TikTok", "YouTube", "Twitter", "Facebook"];
  const categories = [
    "Fashion",
    "Fitness",
    "Food",
    "Travel",
    "Tech",
    "Beauty",
    "Lifestyle",
    "Gaming",
  ];

  const standardContentTypes = [
    "1 sponsored Instagram post (photos)",
    "1 Sponsored Instagram Reel",
    "1 Sponsored TikTok Post",
    "1 Sponsored YouTube Short",
    "1 Instagram story (3 Frames)",
    "1 UGC video",
    "1 feature in a longform YouTube Video",
  ];

  const togglePlatform = (platform) => {
    const newSelectedPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(newSelectedPlatforms);
  };

  const handleUsernameChange = (platform, username) => {
    const newUsernames = { ...platformUsernames, [platform]: username };
    setPlatformUsernames(newUsernames);
  };

  const toggleCategory = (category) => {
    let newSelectedCategories;
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter((c) => c !== category);
    } else if (selectedCategories.length < 5) {
      newSelectedCategories = [...selectedCategories, category];
    } else {
      return; // Don't allow more than 5
    }

    setSelectedCategories(newSelectedCategories);
  };

  const addKeywordTag = (tag) => {
    if (tag.trim() && !keywordTags.includes(tag.trim())) {
      const newTags = [...keywordTags, tag.trim()];
      setKeywordTags(newTags);
    }
  };

  const removeKeywordTag = (index) => {
    const newTags = keywordTags.filter((_, i) => i !== index);
    setKeywordTags(newTags);
  };

  const handleRateChange = (index, value) => {
    const newRates = { ...contentRates, [index]: value };
    setContentRates(newRates);
  };

  // Custom Rates Handlers
  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx][field] = value;
    setCustomRates(updated);
  };

  const addCustomRateRow = () => {
    setCustomRates([...customRates, { contentType: "", price: "" }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    setCustomRates(updated.length ? updated : [{ contentType: "", price: "" }]);
  };

  const handleSaveSettings = async () => {
    try {
      const defaults = {
        socialPlatforms: selectedPlatforms.map((platform) => ({
          platform,
          username: platformUsernames[platform] || "",
        })),
        categories: selectedCategories,
        keywordTags: keywordTags,
        contentRates: [
          ...standardContentTypes.map((type, index) => ({
            contentType: type,
            price: parseFloat(contentRates[index] || 0),
          })),
          ...customRates.filter((rate) => rate.contentType && rate.price),
        ],
      };

      console.log("Sending defaults:", defaults);

      const result = await dispatch(updateCampaignDefaults(defaults)).unwrap();

      if (result.success) {
        // Refresh user data from localStorage after successful update
        getUser(result?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      // Show user-friendly error message
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Header - Keep the primary banner */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Saved Default Filters</h1>
        <p className="text-sm mt-1">
          Set your default filters to automatically see the most relevant campaigns. Save time and
          focus on opportunities that match your preferences.
        </p>
      </div>

      <div className="max-w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Social Platforms */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Link Other Platforms <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-3">
                {platforms.map((platform) => (
                  <div key={platform} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <Link className="h-4 w-4 text-gray-400" />
                    <CustomInput
                      placeholder={`Your ${platform} username`}
                      disabled={!selectedPlatforms.includes(platform)}
                      value={platformUsernames[platform] || ""}
                      onChange={(e) => handleUsernameChange(platform, e.target.value)}
                    />
                  </div>
                ))}
              </div>
              <p className="flex justify-end text-xs text-gray-600 mt-2">
                At least 1 platform required
              </p>
            </div>
            {/* Categories */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Creator Categories <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => toggleCategory(category)}
                    disabled={
                      !selectedCategories.includes(category) && selectedCategories.length >= 5
                    }
                    className={`
                          p-2 rounded-lg border-2 text-xs font-medium transition-all duration-200
                          ${
                            selectedCategories.includes(category)
                              ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                              : "border-gray-200 text-gray-700 hover:border-indigo-200 disabled:opacity-50"
                          }
                        `}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Select up to 5 categories ({selectedCategories.length}/5)
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Keywords */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Tags (Optional)</h3>

              <div className="flex gap-2">
                <CustomInput
                  type="text"
                  placeholder="e.g. Luxury Hotels"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      e.preventDefault();
                      addKeywordTag(e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {keywordTags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeKeywordTag(index)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Rates */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Rates (Optional)</h3>
              <div className="space-y-3 text-sm">
                {standardContentTypes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                  >
                    <span className="text-xs text-gray-600">{item}</span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <CustomInput
                        type="number"
                        placeholder="0"
                        className="!w-20 !border !h-7 !border-gray-600"
                        value={contentRates[index] || ""}
                        onChange={(e) => handleRateChange(index, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom Rates Section */}
              <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
                {customRates.map((rate, idx) => (
                  <div key={idx} className="flex justify-between mb-2">
                    <div className="flex gap-2">
                      <CustomInput
                        placeholder="Custom package"
                        className="!border !border-gray-300"
                        value={rate.contentType}
                        onChange={(e) => handleCustomRateChange(idx, "contentType", e.target.value)}
                      />
                      <CustomInput
                        type="number"
                        placeholder="Price"
                        className="!border !border-gray-300"
                        value={rate.price}
                        onChange={(e) => handleCustomRateChange(idx, "price", e.target.value)}
                      />
                      <button
                        type="button"
                        className="bg-red-200 p-1 rounded-full m-2.5"
                        onClick={() => removeCustomRate(idx)}
                        disabled={customRates.length === 1}
                      >
                        <X className="text-red-600 w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="bg-gray-200 p-2 rounded-full"
                      onClick={addCustomRateRow}
                    >
                      <AddCircle className="text-primary" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end text-center mt-10">
          <CustomButton
            text={"Save Settings"}
            className="btn-primary"
            loading={isLoading}
            onClick={handleSaveSettings}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SavedDefaultFilters;
