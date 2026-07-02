"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import { ArrowLeft, ExternalLink, Globe, Mail, Plus, Trash2, User } from "lucide-react";
import useCreatorApplication from "./use-creator-application.hook";

const CreatorApplication = ({ onBack, onSuccess }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    isError,
    message,
    primarySocialLinks,
    additionalLinks,
    removePrimarySocialLink,
    removeAdditionalLink,
    selectedCountry,
    socialLinkInputs,
    additionalLinkInput,
    additionalLinkInputError,
    setSocialLinkInputs,
    handleAdditionalLinkInputChange,
    handleCountrySelect,
    handleSocialLinkChange,
    handleAddAdditionalLink,
    socialPlatforms,
    getPlatformIcon,
  } = useCreatorApplication({ onSuccess });

  return (
    <div className="min-h-screen bg-gray-100 px-2.5 py-6 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:px-4 sm:py-8 md:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4 rounded-lg bg-primary px-3 py-3 text-left sm:mb-5 sm:p-4 md:rounded-xl">
          <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
            Apply to Join CleerCut
          </h1>
          <p className="mt-1 text-[10px] leading-snug text-white/90 sm:text-xs md:text-sm">
            Share your details and we&apos;ll review your application
          </p>
        </div>
        <div className="mb-4 sm:mb-6">
          <div className="mb-2 flex items-center justify-between text-[10px] text-gray-600 sm:mb-3 sm:text-xs md:text-sm">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 font-medium text-primary hover:text-indigo-700"
            >
              <ArrowLeft className="h-3 w-3 shrink-0 sm:h-4 sm:w-4" />
              Back
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4 md:p-6 md:shadow-md">
          {isError && message ? (
            <div
              className="mb-3 rounded-lg border border-red-200 bg-red-50 px-2.5 py-2 text-[10px] text-red-800 sm:mb-4 sm:px-3 sm:py-2.5 sm:text-xs"
              role="alert"
            >
              {message}
            </div>
          ) : null}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4 md:space-y-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 md:gap-6">
              <CustomInput
                label="Full Name"
                name="full_name"
                register={register}
                errors={errors}
                placeholder="Enter your full name"
                isRequired={true}
                startIcon={<User className="h-3 w-3 sm:h-4 sm:w-4" />}
              />

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                register={register}
                errors={errors}
                placeholder="Enter your email address"
                isRequired={true}
                startIcon={<Mail className="h-3 w-3 sm:h-4 sm:w-4" />}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
              <div className="sm:col-span-2">
                <CountrySelect
                  label="Country"
                  value={selectedCountry}
                  onChange={handleCountrySelect}
                  errors={errors}
                  isRequired
                  name="country"
                />
                <input type="hidden" {...register("country")} />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-medium text-gray-900 sm:mb-3 sm:text-sm">
                  Primary Social Media Links <span className="text-red-500">*</span>
                  <span className="mt-0.5 block text-[10px] font-normal leading-snug text-gray-500 sm:mt-0 sm:ml-2 sm:inline sm:text-xs">
                    At least one required — Instagram, TikTok, or YouTube
                  </span>
                </label>
                <div className="space-y-3 sm:space-y-4">
                  {socialPlatforms.map((platform) => {
                    const Icon = getPlatformIcon(platform.key);
                    const existingLink = primarySocialLinks.find(
                      (link) => link.platform === platform.key
                    );

                    return (
                      <div key={platform.key}>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="min-w-0 flex-1">
                            <CustomInput
                              type="url"
                              name={`social_${platform.key}`}
                              placeholder={platform.placeholder}
                              value={socialLinkInputs[platform.key]}
                              onChange={(e) => {
                                const value = e.target.value;
                                setSocialLinkInputs((prev) => ({
                                  ...prev,
                                  [platform.key]: value,
                                }));
                                handleSocialLinkChange(platform.key, value);
                              }}
                              startIcon={
                                <div className="flex h-3 w-3 shrink-0 items-center sm:h-4 sm:w-4">
                                  {Icon}
                                </div>
                              }
                            />
                          </div>
                          {existingLink && (
                            <button
                              type="button"
                              onClick={() => {
                                setSocialLinkInputs((prev) => ({ ...prev, [platform.key]: "" }));
                                removePrimarySocialLink(platform.key);
                              }}
                              className="shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-50"
                              aria-label={`Remove ${platform.key} link`}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-6">
              <div className="sm:col-span-2">
                <label className="mb-2 block text-xs font-medium text-gray-900 sm:mb-3 sm:text-sm">
                  Additional Links{" "}
                  <span className="text-[10px] font-normal text-gray-500 sm:text-xs">
                    (Optional)
                  </span>
                </label>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex flex-wrap items-stretch gap-2 sm:flex-nowrap">
                    <div className="min-w-0 flex-1 basis-full sm:basis-auto">
                      <CustomInput
                        type="url"
                        name="additional_link_input"
                        placeholder="Portfolio, website, or other social handles"
                        value={additionalLinkInput}
                        onChange={handleAdditionalLinkInputChange}
                        errors={
                          additionalLinkInputError
                            ? { additional_link_input: { message: additionalLinkInputError } }
                            : undefined
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAdditionalLink();
                          }
                        }}
                        startIcon={<Globe className="h-3 w-3 sm:h-4 sm:w-4" />}
                      />
                    </div>
                    <CustomButton
                      type="button"
                      text="Add"
                      startIcon={<Plus className="h-4 w-4" />}
                      onClick={handleAddAdditionalLink}
                      className="btn-primary h-8 min-h-8 w-full shrink-0 px-3 sm:w-auto"
                    />
                  </div>
                  {additionalLinks.length > 0 && (
                    <div className="space-y-2">
                      {additionalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between gap-2 rounded-lg bg-gray-50 px-2.5 py-2 sm:px-3 sm:py-2.5"
                        >
                          <div className="flex min-w-0 flex-1 items-center gap-2">
                            <Globe className="h-3 w-3 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="truncate text-xs text-primary hover:text-indigo-700 sm:text-sm"
                            >
                              {link.url}
                            </a>
                            <ExternalLink className="h-3 w-3 shrink-0 text-gray-400 sm:h-4 sm:w-4" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAdditionalLink(index)}
                            className="shrink-0 rounded-lg p-1.5 text-red-600 hover:bg-red-50 sm:p-2"
                            aria-label="Remove link"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1 sm:pt-2">
              <div className="sm:col-span-2">
                <CustomButton
                  text="Submit Application"
                  className="btn-primary w-full"
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatorApplication;
