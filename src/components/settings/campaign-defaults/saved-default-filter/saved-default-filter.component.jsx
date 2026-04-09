import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import SearchableNicheInput from "@/components/campaign/create-campaign/components/searchable-niche-input/searchable-niche-input.component";
import CreatorCard from "@/components/campaign/campaigns/components/creator-card/creator-card.component";
import { CONTENT_CHARACTERISTIC_GROUPS } from "@/common/constants/profile-setup.constant";
import { AddCircle } from "@mui/icons-material";
import {
  AlertCircle,
  CheckCircle,
  DollarSign,
  ExternalLink,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import useSavedDefaultFilter from "./use-saved-default-filter.hook";

const SavedDefaultFilters = () => {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();
  const {
    standardContentTypes,
    selectedCategories,
    subNichesForm,
    contentCharacteristics,
    keywordTags,
    contentRates,
    customRates,
    isLoading,
    loadConnectedAccounts,
    handleConnectSocialAccounts,
    disconnectModalOpen,
    disconnectPlatformLabel,
    openDisconnectSocialModal,
    closeDisconnectSocialModal,
    confirmDisconnectSocialAccount,
    isPlatformConnected,
    getConnectedAccountData,
    handleCategoryChange,
    handleCategoryRemove,
    addSubNicheTag,
    removeSubNicheTag,
    handleContentCharacteristicChange,
    addKeywordTag,
    removeKeywordTag,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,
    handleSaveSettings,
    platforms,
    creatorType,
    creatorTagMeta,
    creatorCardPreviewData,
    socialConnectLoadingMap,
  } = useSavedDefaultFilter();

  return (
    <>
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Connected Accounts & Preferences</h1>
        <p className="text-sm mt-1">
          Connect your social media accounts and set your default filters to automatically see the
          most relevant campaigns. Save time and focus on opportunities that match your preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Your creator tag</h3>
            <p className="text-xs text-gray-600 mb-3">
              This controls which platforms you can connect and how you appear in discovery. Tags
              are assigned at signup; contact support to request a change.
            </p>
            <span
              className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${creatorTagMeta.pillClass}`}
            >
              {creatorTagMeta.label}
            </span>
            <p className="text-xs text-gray-600 mt-3">{creatorTagMeta.tooltip}</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Connect Social Media Platforms
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
                const isPlatformLoading = Boolean(socialConnectLoadingMap?.[platform]);
                const username =
                  connectedData?.profile_data?.username ||
                  connectedData?.profile_data?.handle ||
                  connectedData?.profile_data?.name ||
                  "";

                return (
                  <div
                    key={platform}
                    className={`relative p-3 rounded-xl border transition-all duration-200 hover:shadow-md ${
                      isConnected
                        ? "border-indigo-200 bg-indigo-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                            isConnected ? platformColor : "bg-gray-100"
                          }`}
                        >
                          {getPlatformIcon(platform)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-gray-900 text-sm">{platform}</span>
                          {isConnected ? (
                            <div className="flex items-center space-x-2 flex-wrap">
                              <CheckCircle className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span className="text-xs text-indigo-600 font-medium">Connected</span>
                              {username ? (
                                <span className="text-xs text-gray-500 truncate">@{username}</span>
                              ) : null}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">Click to connect</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center flex-wrap justify-end gap-2 shrink-0">
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
                              type="button"
                              onClick={() => openDisconnectSocialModal(platform)}
                              className="btn-outline text-xs px-3 py-1 h-7 border-red-200 text-red-700 hover:bg-red-50"
                              startIcon={<Trash2 className="w-3 h-3" />}
                            />
                          </>
                        ) : (
                          <CustomButton
                            text="Connect"
                            type="button"
                            onClick={() => handleConnectSocialAccounts(platform)}
                            className="btn-primary text-xs px-4 py-1 h-7"
                            disabled={isPlatformLoading}
                            loading={isPlatformLoading}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-xs text-blue-800">
                  {creatorType === CAMPAIGN_TYPE.UGC ? (
                    <span>
                      <span className="font-medium">UGC Specialist:</span> Instagram only. TikTok
                      and YouTube are not shown because they are not available for this creator
                      type.
                    </span>
                  ) : (
                    <span>
                      <span className="font-medium">Note:</span> Connect or disconnect platforms as
                      needed. Connected accounts power campaign matching and analytics.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creator Categories</h3>

            <SearchableNicheInput
              selectedNiches={selectedCategories}
              onNichesChange={handleCategoryChange}
              handleNicheRemove={handleCategoryRemove}
              placeholder="Search and add categories"
            />
          </div>

          {selectedCategories.length > 0 ? (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Sub Niches (Optional)</h3>
              <p className="text-xs text-gray-600 mb-3">
                This helps understand exactly what you specialize in and improves how you are
                matched to campaigns. For example, if your niche is Skincare, sub niches may
                include: &quot;Acne prone skin&quot;, &quot;Dry Skin&quot;, &quot;Esthetician&quot;,
                &quot;Dermatologist&quot;.
              </p>
              {selectedCategories.map((niche) => {
                const row = subNichesForm.find((r) => r.niche === niche) || {
                  niche,
                  tags: [],
                };
                return (
                  <div key={niche} className="mb-4 last:mb-0">
                    <p className="text-sm font-medium text-gray-800 mb-2">{niche}</p>
                    <CustomInput
                      type="text"
                      placeholder="Add a sub-niche tag, press Enter"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value.trim()) {
                          e.preventDefault();
                          addSubNicheTag(niche, e.target.value);
                          e.target.value = "";
                        }
                      }}
                    />
                    <div className="flex flex-wrap gap-2 mt-2">
                      {row.tags.map((tag, idx) => (
                        <span
                          key={`${niche}-${tag}-${idx}`}
                          className="inline-flex items-center gap-2 rounded-lg border border-indigo-200 bg-gray-50 px-3 py-1 text-xs text-gray-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeSubNicheTag(niche, idx)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : null}

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyword Tags (Optional)</h3>

            <p className="text-xs text-gray-600 my-2">
              Add up to <b>15</b> tags (optional). Each tag must be <b>2–30</b> characters.
            </p>

            <div className="flex gap-2">
              <CustomInput
                type="text"
                placeholder="e.g. Luxury Hotels"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    addKeywordTag(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-600 mt-2">Type and press enter to add a keyword</p>
              <p className="text-xs text-gray-600 mt-2 text-right">{keywordTags.length}/15 tags</p>
            </div>

            <p className="text-xs text-white mt-2 bg-indigo-600 p-2 rounded-lg">
              <b>Examples:</b> Couple Comedy, Dog Creator, Luxury hotels, Budget travel, Couples
              content, Clean beauty, Street interviews
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {keywordTags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
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
        </div>

        <div className="space-y-4">
          <div className="flex justify-center items-center">
            <CreatorCard
              creator={creatorCardPreviewData}
              creatorType={creatorType}
              hideActions
              isShortlist
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Content Characteristics (Optional)
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Describe how your content is typically presented.
            </p>
            {CONTENT_CHARACTERISTIC_GROUPS.map((group) => (
              <div key={group.key} className="mb-4 last:mb-0">
                <p className="text-sm bg-indigo-200 py-1 px-2 font-medium text-gray-800 rounded-sm mb-2">
                  {group.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((opt) => {
                    const selected = contentCharacteristics[group.key] === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleContentCharacteristicChange(group.key, opt)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                          selected
                            ? "border-indigo-600 bg-indigo-50 text-indigo-900"
                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Content Rates (Optional)</h3>
            <div className="space-y-2.5 text-sm">
              {standardContentTypes.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-2.5 bg-gray-100 rounded-lg"
                >
                  <span className="text-xs text-gray-600">{item}</span>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 text-gray-400" />
                    <CustomInput
                      type="number"
                      placeholder="0"
                      className="!w-20 !border !h-7 !border-gray-600"
                      value={contentRates[index] ?? ""}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="flex justify-between pt-1 bg-gray-200 p-2 rounded-lg items-center mb-2">
                <h3 className="text-xs font-semibold text-gray-900">Add custom rate</h3>
                <button
                  type="button"
                  className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
                  onClick={addCustomRateRow}
                >
                  <AddCircle className="text-primary" />
                </button>
              </div>
              {customRates.map((rate, idx) => (
                <div key={idx} className="flex gap-2 mb-2 items-center">
                  <CustomInput
                    placeholder="Custom package"
                    className="!border !border-gray-300 flex-1 min-w-0"
                    value={rate.contentType}
                    onChange={(e) => handleCustomRateChange(idx, "contentType", e.target.value)}
                  />
                  <CustomInput
                    type="number"
                    placeholder="Price"
                    className="!border !border-gray-300 !w-28 shrink-0"
                    value={rate.price}
                    onChange={(e) => handleCustomRateChange(idx, "price", e.target.value)}
                  />
                  <button
                    type="button"
                    className="bg-red-200 p-1 rounded-full shrink-0 mr-4"
                    onClick={() => removeCustomRate(idx)}
                    disabled={customRates.length === 1}
                  >
                    <X className="text-red-600 w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end text-center mt-10">
        <CustomButton
          text="Save Settings"
          className="btn-primary"
          loading={isLoading}
          onClick={handleSaveSettings}
        />
      </div>

      <DeleteConfirmationModal
        id={0}
        openConfirmationPopup={disconnectModalOpen}
        setOpenConfirmationPopup={(open) => {
          if (!open) closeDisconnectSocialModal();
        }}
        mainText={`Disconnect ${disconnectPlatformLabel || "this platform"}?`}
        subText="This unlinks the account from your Cleercut profile. You can connect it again anytime."
        confirmText="Disconnect"
        closeText="Cancel"
        action={confirmDisconnectSocialAccount}
        type="disconnect-social"
      />
    </>
  );
};

export default SavedDefaultFilters;
