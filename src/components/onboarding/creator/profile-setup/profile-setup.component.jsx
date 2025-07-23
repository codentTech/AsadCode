import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { AddCircle } from "@mui/icons-material";
import { ArrowLeft, Camera, DollarSign, Link, Upload, X } from "lucide-react";
import { useState, useRef } from "react";
import useProfileSetup from "./use-profile-setup.hook";

const ProfileSetup = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    handleFileUpload,
    profilePhotoPreview,
    updateSocialPlatforms,
    updateCategories,
    updateKeywordTags,
    updateContentRates,
    getStandardContentTypes,
    isLoading,
  } = useProfileSetup({ onNext });

  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [platformUsernames, setPlatformUsernames] = useState({});
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [bio, setBio] = useState("");
  const [contentRates, setContentRates] = useState({});
  const [customRates, setCustomRates] = useState([{ contentType: "", price: "" }]);

  const fileInputRef = useRef(null);

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

  const standardContentTypes = getStandardContentTypes();

  const handlePhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const togglePlatform = (platform) => {
    const newSelectedPlatforms = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];

    setSelectedPlatforms(newSelectedPlatforms);
    updateSocialPlatforms(newSelectedPlatforms, platformUsernames);
  };

  const handleUsernameChange = (platform, username) => {
    const newUsernames = { ...platformUsernames, [platform]: username };
    setPlatformUsernames(newUsernames);
    updateSocialPlatforms(selectedPlatforms, newUsernames);
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
    updateCategories(newSelectedCategories);
  };

  const addKeywordTag = (tag) => {
    if (tag.trim() && !keywordTags.includes(tag.trim())) {
      const newTags = [...keywordTags, tag.trim()];
      setKeywordTags(newTags);
      updateKeywordTags(newTags);
    }
  };

  const removeKeywordTag = (index) => {
    const newTags = keywordTags.filter((_, i) => i !== index);
    setKeywordTags(newTags);
    updateKeywordTags(newTags);
  };

  const handleBioChange = (e) => {
    setBio(e.target.value);
  };

  const handleRateChange = (index, value) => {
    const newRates = { ...contentRates, [index]: value };
    setContentRates(newRates);
    updateContentRates(Object.values(newRates), customRates);
  };

  const addCustomRate = (description, price) => {
    if (description.trim() && price > 0) {
      const newCustomRate = {
        contentType: description.trim(),
        price: parseFloat(price),
      };
      const newCustomRates = [...customRates, newCustomRate];
      setCustomRates(newCustomRates);
      updateContentRates(Object.values(contentRates), newCustomRates);
    }
  };

  // Custom Rates Handlers
  const handleCustomRateChange = (idx, field, value) => {
    const updated = [...customRates];
    updated[idx][field] = value;
    setCustomRates(updated);
    updateContentRates(Object.values(contentRates), updated);
  };

  const addCustomRateRow = () => {
    setCustomRates([...customRates, { contentType: "", price: "" }]);
  };

  const removeCustomRate = (idx) => {
    const updated = customRates.filter((_, i) => i !== idx);
    setCustomRates(updated.length ? updated : [{ contentType: "", price: "" }]);
    updateContentRates(
      Object.values(contentRates),
      updated.length ? updated : [{ contentType: "", price: "" }]
    );
  };

  const handleFormSubmit = async (data) => {
    // Update bio in the form data
    data.bio = bio;
    await onSubmit(data);
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
            <span>Step 4 of 5</span>
            <span>80% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-4/5 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1">
            Build Your Public Profile
          </h1>
          <p className="text-sm lg:text-lg text-gray-600">
            Showcase your content style and set your rates
          </p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Profile Photo */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Profile Photo <span className="text-red-500">*</span>
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      accept="image/jpeg,image/png"
                      className="hidden"
                    />
                    <CustomButton
                      text="Upload Photo"
                      className="btn-secondary"
                      icon={Upload}
                      type="button"
                      onClick={handlePhotoUpload}
                    />
                    <p className="text-xs text-gray-600 mt-2">JPG or PNG, max 5MB</p>
                  </div>
                </div>
                {errors.profilePhoto && (
                  <p className="text-xs text-red-600 mt-2">{errors.profilePhoto.message}</p>
                )}
              </div>

              {/* Bio */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <TextArea
                  label="Bio (Optional)"
                  placeholder="Tell brands about yourself and your content style..."
                  maxLength={200}
                  value={bio}
                  onChange={handleBioChange}
                />
                <p className="text-xs text-gray-600 mt-2">{bio.length}/200 characters</p>
              </div>

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
                {errors.socialPlatforms && (
                  <p className="text-xs text-red-600 mt-2">{errors.socialPlatforms.message}</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Live Preview */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Camera className="h-3 w-3 mr-1" />
                    Public view
                  </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                  <div className="relative inline-block mb-4">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                        <Camera className="h-8 w-8 text-white" />
                      </div>
                    )}
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">@username</h4>
                  <p className="text-xs text-gray-600 mb-3">
                    {bio || "Your bio will appear here."}
                  </p>
                  {selectedCategories.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-3">
                      {selectedCategories.map((cat, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs"
                        >
                          {cat}
                        </span>
                      ))}
                    </div>
                  )}
                  {selectedPlatforms.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {selectedPlatforms.map((platform, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          <Link className="h-3 w-3 text-indigo-400" />
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
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
                {errors.categories && (
                  <p className="text-xs text-red-600 mt-2">{errors.categories.message}</p>
                )}
              </div>

              {/* Keywords */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Keyword Tags (Optional)
                </h3>

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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Content Rates (Optional)
                </h3>
                <div className="space-y-3 text-sm">
                  {[
                    "1 sponsored Instagram post (photos)",
                    "1 Sponsored Instagram Reel",
                    "1 Sponsored TikTok Post",
                    "1 Sponsored YouTube Short",
                    "1 Instagram story (3 Frames)",
                    "1 UGC video",
                    "1 feature in a longform YouTube Video",
                  ].map((item, index) => (
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
                          onChange={(e) =>
                            handleCustomRateChange(idx, "contentType", e.target.value)
                          }
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

          {/* Continue Button */}
          <div className="flex justify-end text-center mt-10">
            <CustomButton
              text="Continue Profile Setup"
              className="btn-primary"
              type="submit"
              disabled={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
