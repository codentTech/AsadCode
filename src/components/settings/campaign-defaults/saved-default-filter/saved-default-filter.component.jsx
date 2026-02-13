import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { AddCircle } from "@mui/icons-material";
import { AlertCircle, CheckCircle, DollarSign, ExternalLink, RefreshCw, X } from "lucide-react";
import useSavedDefaultFilter from "./use-saved-default-filter.hook";

const SavedDefaultFilters = () => {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();
  const {
    platforms,
    categories,
    standardContentTypes,
    selectedCategories,
    keywordTags,
    contentRates,
    customRates,
    isLoading,
    connectedAccounts,
    isConnecting,
    isDisconnecting,
    loadConnectedAccounts,
    handleConnectSocialMedia,
    handleDisconnectSocialMedia,
    isPlatformConnected,
    getConnectedAccountData,
    toggleCategory,
    addKeywordTag,
    removeKeywordTag,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    handleSaveSettings,
  } = useSavedDefaultFilter();

  return (
    <>
      {/* Header - Keep the primary banner */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Saved Default Filters</h1>
        <p className="text-sm mt-1">
          Set your default filters to automatically see the most relevant campaigns. Save time and
          focus on opportunities that match your preferences.
        </p>
      </div>

      <div className="max-w-full mx-auto">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-3">
            {/* Social Platforms */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  Connect Social Media Platforms <span className="text-red-500">*</span>
                </h3>
                <CustomButton
                  text="Refresh"
                  onClick={loadConnectedAccounts}
                  className="btn-outline text-xs px-3 py-1.5"
                  startIcon={<RefreshCw className="w-3 h-3" />}
                />
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {platforms.map((platform) => {
                  const isConnected = isPlatformConnected(platform);
                  const connectedData = getConnectedAccountData(platform);
                  const platformColor = getPlatformColor(platform);

                  return (
                    <div
                      key={platform}
                      className={`
                        relative p-3 rounded-xl border transition-all duration-200 hover:shadow-md
                        ${
                          isConnected
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }
                      `}
                    >
                      <div className="flex items-center justify-between">
                        {/* Left side - Platform info */}
                        <div className="flex items-center space-x-3">
                          {/* Platform Icon with background */}
                          <div
                            className={`
                            w-9 h-9 rounded-full flex items-center justify-center
                            ${isConnected ? platformColor : "bg-gray-100"}
                          `}
                          >
                            {getPlatformIcon(platform)}
                          </div>

                          {/* Platform details */}
                          <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm">{platform}</span>
                            {isConnected ? (
                              <div className="flex items-center space-x-2">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span className="text-xs text-green-600 font-medium">
                                  Connected
                                </span>
                                {connectedData?.profile_data?.username && (
                                  <span className="text-xs text-gray-500">
                                    @{connectedData.profile_data.username}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-gray-500">Click to connect</span>
                            )}
                          </div>
                        </div>

                        {/* Right side - Action buttons */}
                        <div className="flex items-center space-x-2">
                          {isConnected ? (
                            <>
                              <CustomButton
                                text="Profile"
                                onClick={() =>
                                  window.open(connectedData?.profile_data?.profile_url, "_blank")
                                }
                                className="btn-outline text-xs px-3 py-1 h-7"
                                startIcon={<ExternalLink className="w-3 h-3" />}
                              />
                              <CustomButton
                                text="Disconnect"
                                onClick={() => handleDisconnectSocialMedia(platform)}
                                className="btn-danger text-xs px-3 py-1 h-7"
                                disabled={isDisconnecting}
                              />
                            </>
                          ) : (
                            <CustomButton
                              text="Connect"
                              onClick={() => handleConnectSocialMedia(platform)}
                              className="btn-primary text-xs px-4 py-1 h-7"
                              disabled={isConnecting}
                            />
                          )}
                        </div>
                      </div>

                      {/* Connection status indicator */}
                      {isConnected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-800">
                    <span className="font-medium">Note:</span> Connect at least 1 platform to
                    continue. Connected accounts will be used for campaign matching and analytics.
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Creator Categories <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
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
          <div className="space-y-3">
            {/* Keywords */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Keyword Tags (Optional)</h3>

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
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Rates (Optional)</h3>
              <div className="space-y-2.5 text-sm">
                {standardContentTypes.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2.5 bg-gray-100 rounded-lg"
                  >
                    <span className="text-xs text-gray-600">{item}</span>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 text-gray-400" />
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
        <div className="flex justify-end text-center mt-8">
          <CustomButton
            text={"Save Settings"}
            className="btn-primary"
            loading={isLoading}
            onClick={handleSaveSettings}
          />
        </div>
      </div>
    </>
  );
};

export default SavedDefaultFilters;
