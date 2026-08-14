"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import {
  CREATOR_TAG_OPTIONS,
  CREATOR_TYPE_QUESTION,
  CREATOR_TYPE_QUESTION_HELPER,
} from "@/common/constants/creator-tag.constant";
import { CONTENT_CHARACTERISTIC_GROUPS } from "@/common/constants/profile-setup.constant";
import CreatorCard from "@/components/campaign-refactored/creator-card/creator-card.component";
import SearchableNicheInput from "@/components/campaign-refactored/shared/searchable-niche-input/searchable-niche-input.component";
import { AddCircle } from "@mui/icons-material";
import { Camera, DollarSign, Info, Trash2, X } from "lucide-react";
import OnboardingStepLayout from "../../components/onboarding-step-layout/onboarding-step-layout.component";
import useProfileSetup from "./use-profile-setup.hook";

const ProfileSetup = ({ onNext, onCreatorTypeChange }) => {
  const {
    handleSubmit,
    errors,
    handleFormSubmit,
    isLoading,
    isAnyImageUploading,

    // Creator Type
    creatorType,
    handleCreatorTypeChange,

    // Profile photo
    onFileChange,
    handlePhotoUpload,
    fileInputRef,
    profilePhotoPreview,
    profilePhotoLoading,
    handleRemoveProfilePhoto,

    // Covers
    miniProfilePictures,
    miniProfilePicturesLoading,
    handleMiniProfilePictureUpload,
    removeMiniProfilePicture,

    // Categories
    selectedCategories,
    handleCategoryChange,
    handleCategoryRemove,

    // Keywords
    keywordTags,
    addKeywordTag,
    removeKeywordTag,

    subNichesForm,
    addSubNicheTag,
    removeSubNicheTag,

    contentCharacteristics,
    handleContentCharacteristicChange,

    // Bio
    bio,
    handleBioChange,
    longBio,
    handleLongBioChange,

    // Rates
    contentRates,
    customRates,
    handleRateChange,
    handleCustomRateChange,
    addCustomRateRow,
    removeCustomRate,

    // Onboarding name
    name,
  } = useProfileSetup({ onNext, onCreatorTypeChange });

  const creatorCardPreviewData = {
    id: "onboarding-preview",
    name: name?.trim() || "Your name",
    rating: 0,
    reviewCount: 0,
    age: "Creator",
    location: "Profile preview",
    profileImage: profilePhotoPreview,
    portfolioImages: (miniProfilePictures || []).filter(Boolean),
    niches: selectedCategories,
    bio: bio?.trim() || "Add your tagline to preview your public card.",
    longBio: longBio?.trim() || "Add your long bio to preview your public card.",
    followers: 0,
    platforms: [],
    platformStats: {},
  };

  return (
    <OnboardingStepLayout
      as="form"
      onSubmit={handleSubmit(handleFormSubmit)}
      footer={
        <CustomButton
          text="Continue Profile Setup"
          className="btn-primary w-full sm:ml-auto sm:w-auto"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        />
      }
    >
          <div className="grid gap-3 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Creator Type */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
                  {CREATOR_TYPE_QUESTION} <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-600 mb-3">{CREATOR_TYPE_QUESTION_HELPER}</p>

                <div className="space-y-2">
                  {CREATOR_TAG_OPTIONS.map((opt) => {
                    const active = creatorType === opt.value;

                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => handleCreatorTypeChange(opt.value)}
                        className={`w-full text-left rounded-lg border p-3 transition-all ${
                          active
                            ? `${opt.cardBorder} shadow-sm`
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex rounded-lg px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${opt.pillClass}`}
                              >
                                {opt.label}
                              </span>
                              <span
                                className="inline-flex text-gray-400"
                                title={opt.tooltip}
                                aria-label={opt.tooltip}
                              >
                                <Info className="h-3.5 w-3.5" />
                              </span>
                            </div>
                            <p className="w-full max-w-[350px] text-xs text-gray-600 mt-2">
                              {opt.helper}
                            </p>
                          </div>

                          <div
                            className={`mt-1 h-4 w-4 shrink-0 rounded-full border flex items-center justify-center ${
                              active ? "border-indigo-600" : "border-gray-300"
                            }`}
                          >
                            {active ? (
                              <span className="h-2 w-2 rounded-full bg-indigo-600" />
                            ) : null}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {errors.creatorType ? (
                  <p className="text-xs text-red-600 mt-2">{errors.creatorType.message}</p>
                ) : null}
              </div>

              {/* Profile Photo */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Profile Photo <span className="text-red-500">*</span>
                </h3>

                <div className="grid grid-cols-3 gap-3 items-start">
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <div className="relative aspect-[3/4] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {profilePhotoPreview ? (
                        <img
                          src={profilePhotoPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-5 w-5 text-gray-400" />
                      )}

                      {!!profilePhotoLoading && (
                        <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="flex-1 px-2 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                        onClick={handlePhotoUpload}
                        disabled={isAnyImageUploading}
                      >
                        {profilePhotoPreview ? "Change" : "Upload"}
                      </button>

                      {profilePhotoPreview && (
                        <button
                          type="button"
                          className="px-2 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                          onClick={handleRemoveProfilePhoto}
                          disabled={isAnyImageUploading}
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      accept="image/jpeg,image/png"
                      className="hidden"
                    />
                  </div>

                  <div className="col-span-3 md:col-span-2 rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <p className="text-sm text-gray-700 font-medium">Upload guidelines</p>
                    <p className="text-xs text-gray-600 mt-1">
                      JPG or PNG, max 5MB. Choose a clear face shot — this will be your main profile
                      image.
                    </p>
                  </div>
                </div>
                {errors.profilePhoto && (
                  <p className="text-xs text-red-600 mt-2">{errors.profilePhoto.message}</p>
                )}
              </div>

              {/* Cover Images */}
              <div className="rounded-lg border border-gray-200 bg-white p-3 sm:p-4">
                <h3 className="mb-1 text-sm font-semibold text-gray-900 sm:text-lg">
                  Cover Images <span className="text-red-500">*</span>
                </h3>
                <p className="mb-3 text-[10px] leading-snug text-gray-600 sm:text-xs md:text-sm">
                  Choose 3 images that show you in action creating content, whether that is a
                  lifestyle shot, a product review or anything that gives brands a clear feel for
                  your style and niche.
                </p>

                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[0, 1, 2].map((index) => {
                    const image = miniProfilePictures?.[index];
                    const loading = miniProfilePicturesLoading?.[index];

                    return (
                      <div key={index} className="flex min-w-0 flex-col gap-1 sm:gap-2">
                        <div className="relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                          {image ? (
                            <img
                              src={image}
                              alt={`Cover image ${index + 1}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Camera className="h-4 w-4 text-gray-400 sm:h-5 sm:w-5" />
                          )}

                          {loading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/75">
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent sm:h-5 sm:w-5" />
                            </div>
                          )}
                        </div>

                        <div className="flex w-full min-w-0 flex-col gap-1 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            className="w-full min-w-0 rounded-md bg-indigo-50 px-1.5 py-1.5 text-[10px] leading-tight text-indigo-700 transition-colors hover:bg-indigo-100 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 sm:px-2 sm:text-xs"
                            onClick={() => handleMiniProfilePictureUpload(index)}
                            disabled={isAnyImageUploading}
                          >
                            {image ? "Change" : "Upload"}
                          </button>

                          {image ? (
                            <button
                              type="button"
                              className="w-full min-w-0 rounded-md bg-red-50 px-1.5 py-1.5 text-[10px] leading-tight text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto sm:px-2 sm:text-xs"
                              onClick={() => removeMiniProfilePicture(index)}
                              disabled={isAnyImageUploading}
                            >
                              Remove
                            </button>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {errors.miniProfilePictures ? (
                  <p className="mt-3 text-xs text-red-600">{errors.miniProfilePictures.message}</p>
                ) : null}
              </div>

              {/* Bio */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Tagline <span className="text-red-500">*</span>
                </h3>

                <CustomInput
                  placeholder="This will appear on your creator card in Discover."
                  value={bio}
                  onChange={handleBioChange}
                  errors={errors}
                  name="bio"
                />
                <p className="text-xs text-gray-600 mt-2 text-right">{bio.length}/75 characters</p>
              </div>

              {/* Long Bio */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Long Bio <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                </h3>

                <TextArea
                  placeholder="This will appear on your full profile only."
                  value={longBio}
                  onChange={handleLongBioChange}
                  errors={errors}
                />
                <p className="text-xs text-gray-600 mt-2 text-right">
                  {longBio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Creator Card Preview */}
              <div className="flex justify-center items-center">
                <CreatorCard
                  creator={creatorCardPreviewData}
                  creatorType={creatorType}
                  hideActions
                  isShortlist
                />
              </div>

              {/* Categories */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
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

              {selectedCategories.length > 0 ? (
                <div className="rounded-lg border border-gray-200 bg-white p-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Sub Niches (Optional)
                  </h3>
                  <p className="text-xs text-gray-600 mb-3">
                    This helps understand exactly what you specialize in and improves how you are
                    matched to campaigns. For example, if your niche is Skincare, sub niches may
                    include: &quot;Acne prone skin&quot;, &quot;Dry Skin&quot;,
                    &quot;Esthetician&quot;, &quot;Dermatologist&quot;.
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

              {/* Keywords */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
                  Keyword Tags <span className="text-gray-500 font-normal text-sm">(Optional)</span>
                </h3>

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
                  <p className="text-xs text-gray-600 mt-2">
                    Type and press enter to add a keyword
                  </p>
                  <p className="text-xs text-gray-600 mt-2 text-right">
                    {keywordTags.length}/15 tags
                  </p>
                </div>

                <p className="text-xs text-white mt-2 bg-indigo-600 p-2 rounded-lg">
                  <b>Examples:</b> Couple Comedy, Dog Creator, Luxury hotels, Budget travel, Couples
                  content, Clean beauty, Street interviews
                </p>

                {errors.keywordTags && (
                  <p className="text-xs text-red-600 mt-2">{errors.keywordTags.message}</p>
                )}

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

              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">
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

              {/* Rates */}
              <div className="rounded-lg border border-gray-200 bg-white p-3">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">
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
                      key={item}
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

                {/* Custom Rates */}
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
    </OnboardingStepLayout>
  );
};

export default ProfileSetup;
