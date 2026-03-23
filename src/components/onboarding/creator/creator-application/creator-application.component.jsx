"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import { ArrowLeft, ExternalLink, Globe, Mail, Plus, Trash2, User, X } from "lucide-react";
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
    setSocialLinkInputs,
    setAdditionalLinkInput,
    handleCountrySelect,
    handleSocialLinkChange,
    handleAddAdditionalLink,
    socialPlatforms,
    getPlatformIcon,
  } = useCreatorApplication({ onSuccess });

  return (
    <div className="py-8 px-4 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-5 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">Apply to Join CleerCut</h1>
          <p className="text-sm lg:text-md text-white">
            Share your details and we'll review your application
          </p>
        </div>
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">
              <CustomInput
                label="Full Name"
                name="full_name"
                register={register}
                errors={errors}
                placeholder="Enter your full name"
                isRequired={true}
                startIcon={<User className="h-4 w-4" />}
              />

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                register={register}
                errors={errors}
                placeholder="Enter your email address"
                isRequired={true}
                startIcon={<Mail className="h-4 w-4" />}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
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

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Primary Social Media Links <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 font-normal ml-2">
                    At least one required - Instagram, TikTok, or YouTube
                  </span>
                </label>
                <div className="space-y-4">
                  {socialPlatforms.map((platform) => {
                    const Icon = getPlatformIcon(platform.key);
                    const existingLink = primarySocialLinks.find(
                      (link) => link.platform === platform.key
                    );

                    return (
                      <div key={platform.key}>
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
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
                              startIcon={<div className="w-4 h-4">{Icon}</div>}
                            />
                          </div>
                          {existingLink && (
                            <button
                              type="button"
                              onClick={() => {
                                setSocialLinkInputs((prev) => ({ ...prev, [platform.key]: "" }));
                                removePrimarySocialLink(platform.key);
                              }}
                              className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-900 mb-3">
                  Additional Links{" "}
                  <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                </label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <CustomInput
                        type="url"
                        name="additional_link_input"
                        placeholder="Portfolio, website, or other social handles"
                        value={additionalLinkInput}
                        onChange={(e) => setAdditionalLinkInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddAdditionalLink();
                          }
                        }}
                        startIcon={<Globe className="h-4 w-4" />}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddAdditionalLink}
                      className="flex-shrink-0 px-2 py-1 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                  {additionalLinks.length > 0 && (
                    <div className="space-y-2">
                      {additionalLinks.map((link, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-2 flex-1 min-w-0">
                            <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-indigo-600 hover:text-indigo-700 truncate"
                            >
                              {link.url}
                            </a>
                            <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAdditionalLink(index)}
                            className="flex-shrink-0 p-1 text-red-600 hover:bg-red-50 rounded ml-2"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2">
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
