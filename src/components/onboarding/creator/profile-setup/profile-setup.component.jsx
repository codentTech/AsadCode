import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchableNicheInput from "@/components/campaign/create-campaign/components/searchable-niche-input/searchable-niche-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { AddCircle } from "@mui/icons-material";
import {
  ArrowLeft,
  Camera,
  DollarSign,
  Link,
  Upload,
  X,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import useProfileSetup from "./use-profile-setup.hook";

const ProfileSetup = ({ onNext, onBack }) => {
  const {
    handleSubmit,
    errors,
    handleFormSubmit,
    isLoading,
    handleFileUpload,
    onFileChange,
    handlePhotoUpload,
    fileInputRef,
    profilePhotoPreview,
    platforms,
    connectedAccounts,
    isPlatformConnected,
    getConnectedAccountData,
    handleConnectSocialAccounts,
    loadConnectedAccounts,
    selectedCategories,
    handleCategoryChange,
    handleCategoryRemove,
    keywordTags,
    addKeywordTag,
    removeKeywordTag,
    bio,
    handleBioChange,
    contentRates,
    customRates,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    name,
  } = useProfileSetup({ onNext });

  const { getPlatformIcon, getPlatformColor } = useGetplatform();

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
                  maxLength={100}
                  value={bio}
                  onChange={handleBioChange}
                />
                <p className="text-xs text-gray-600 mt-2">{bio.length}/100 characters</p>
              </div>

              {/* Social Platforms */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connect <span className="text-red-500">*</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <CustomButton
                      text="Refresh"
                      type="button"
                      onClick={loadConnectedAccounts}
                      className="btn-outline text-xs px-3 py-1.5"
                      startIcon={<RefreshCw className="w-3 h-3" />}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {platforms.map((platform) => {
                    const isConnected = isPlatformConnected(platform);
                    const platformColor = getPlatformColor(platform);
                    const connectedData = getConnectedAccountData(platform);
                    const username =
                      connectedData?.profile_data?.username ||
                      connectedData?.profile_data?.handle ||
                      connectedData?.profile_data?.name ||
                      "";

                    return (
                      <div
                        key={platform}
                        className={`
                          relative p-3 rounded-xl border transition-all duration-200 hover:shadow-md
                          ${
                            isConnected
                              ? "border-indigo-200 bg-indigo-50"
                              : "border-gray-200 bg-white hover:border-gray-300"
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div
                              className={`
                                w-9 h-9 rounded-full flex items-center justify-center
                                ${isConnected ? platformColor : "bg-gray-100"}
                              `}
                            >
                              {getPlatformIcon(platform)}
                            </div>

                            <div className="flex flex-col flex-1">
                              <span className="font-semibold text-gray-900 text-sm">
                                {platform}
                              </span>
                              {isConnected ? (
                                <div className="flex items-center space-x-2">
                                  <CheckCircle className="w-3 h-3 text-indigo-500" />
                                  <span className="text-xs text-indigo-600 font-medium">
                                    Connected
                                  </span>
                                  {username ? (
                                    <span className="text-xs text-gray-500">@{username}</span>
                                  ) : null}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-500">Click to connect</span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {!isConnected ? (
                              <CustomButton
                                text="Connect"
                                type="button"
                                onClick={handleConnectSocialAccounts}
                                className="btn-primary text-xs px-4 py-1 h-7"
                              />
                            ) : null}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <p className="flex justify-end text-xs text-gray-600 mt-3">
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
                  <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
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
                  {connectedAccounts.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center">
                      {connectedAccounts.map((account, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          <Link className="h-3 w-3 text-indigo-400" />
                          {account?.platform}
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
                <SearchableNicheInput
                  selectedNiches={selectedCategories}
                  onNichesChange={handleCategoryChange}
                  handleNicheRemove={handleCategoryRemove}
                  placeholder="Search and add categories"
                />
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
                <p className="text-xs text-gray-600 mt-2">Type and press enter to add a keyword</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {keywordTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeKeywordTag(index)}
                        className="text-gray-500 hover:text-gray-700"
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
              loading={isLoading}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;
