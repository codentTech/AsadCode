import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { AddCircle } from "@mui/icons-material";
import { ArrowLeft, Camera, DollarSign, Link, Upload, X } from "lucide-react";
import { useState } from "react";

const ProfileSetup = ({ onNext, onBack }) => {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [keywordTags, setKeywordTags] = useState([]);
  const [bio, setBio] = useState("");

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

  const togglePlatform = (platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((c) => c !== category));
    } else if (selectedCategories.length < 5) {
      setSelectedCategories((prev) => [...prev, category]);
    }
  };

  const addKeywordTag = (tag) => {
    if (tag.trim() && !keywordTags.includes(tag.trim())) {
      setKeywordTags((prev) => [...prev, tag.trim()]);
    }
  };

  const removeKeywordTag = (index) => {
    setKeywordTags((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Public Profile</h1>
          <p className="text-gray-600">Showcase your content style and set your rates</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Profile Photo */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Photo <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                  <Camera className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <CustomButton text="Upload Photo" className="btn-secondary" icon={Upload} />
                  <p className="text-xs text-gray-600 mt-2">JPG or PNG, max 5MB</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <TextArea
                label="Bio (Optional)"
                placeholder="Tell brands about yourself and your content style..."
                maxLength={200}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-2">{bio.length}/200 characters</p>
            </div>

            {/* Social Platforms */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
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
                    />
                  </div>
                ))}
              </div>
              <p className="flex justify-end text-xs text-gray-600 mt-2">
                At least 1 platform required
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Creator Categories <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    disabled={
                      !selectedCategories.includes(category) && selectedCategories.length >= 5
                    }
                    className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200
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

            {/* Keywords */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Tags (Optional)</h3>

              <div className="flex gap-2">
                <CustomInput
                  type="text"
                  placeholder="e.g. Luxury Hotels"
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
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
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
                  >
                    {tag}
                    <button
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
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Rates (Optional)</h3>
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
                    className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
                  >
                    <span className="text-gray-600">{item}</span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <CustomInput
                        type="number"
                        placeholder="0"
                        className="!w-20 !border !border-gray-600"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
                <div className="w-full flex gap-2">
                  <CustomInput
                    placeholder="Custom package description"
                    className="!flex-1 !border !border-gray-300"
                  />
                  <CustomInput
                    type="number"
                    placeholder="Price"
                    className="!w-20 !border !border-gray-300"
                  />
                  <button className="bg-gray-200 p-2 rounded-full">
                    <AddCircle className="text-primary" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end text-center mt-10">
          <CustomButton text="Continue Profile Setup" className="btn-primary" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
