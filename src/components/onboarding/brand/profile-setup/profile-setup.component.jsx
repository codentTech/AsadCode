import { Building2, Upload, Camera, MapPin, ArrowLeft, Eye } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import useBrandProfileSetup from "./use-profile-setup.hook";
import SetupProgress from "../../components/setup-progress/setup-progress.component";

const BrandProfile = ({ onNext, onBack }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    getValues,
    isLoading,
    logoLoading,
    isError,
    errorMessage,
    handleLogoUpload,
    handleRemoveLogo,
    brandLogoPreview,
    brandLogo,
    countrySelection,
    citySelection,
    handleCountrySelect,
    handleCitySelect,
    previewCountryName,
    previewCityName,
    description,
  } = useBrandProfileSetup({ onNext });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-5 bg-primary p-4 rounded-lg">
          <h1 className="text-xl lg:text-3xl font-bold text-white mb-1">
            Build Your Client Profile
          </h1>
          <p className="text-sm lg:text-md text-white">
            Set up your public profile that creators will see
          </p>
        </div>
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
            <span>Step 4 of 6</span>
            <span>66% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-2/3 transition-all duration-500"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-4">
              {/* Brand Information */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Client Information <span className="text-red-500">*</span>
                </h3>

                <div className="space-y-4">
                  <CustomInput
                    label="Client Name"
                    name="brandName"
                    placeholder="Enter your client name"
                    register={register}
                    errors={errors}
                  />

                  <CustomInput
                    label="Website URL"
                    name="websiteUrl"
                    type="url"
                    placeholder="https://www.yourclient.com"
                    register={register}
                    errors={errors}
                  />
                </div>
              </div>

              {/* Brand Logo */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Brand Logo <span className="text-red-500">*</span>
                </h3>

                <div className="grid grid-cols-3 gap-3 items-start">
                  <div className="col-span-3 md:col-span-1 space-y-2">
                    <div className="relative aspect-[3/4] rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                      {brandLogoPreview || brandLogo ? (
                        <img
                          src={brandLogoPreview || brandLogo}
                          alt="Brand Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Camera className="h-5 w-5 text-gray-400" />
                      )}

                      {!!logoLoading && (
                        <div className="absolute inset-0 bg-white/75 flex items-center justify-center">
                          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="flex-1 px-2 py-1.5 text-xs rounded-md bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                        onClick={handleLogoUpload}
                        disabled={logoLoading}
                      >
                        {brandLogoPreview || brandLogo ? "Change" : "Upload"}
                      </button>

                      {(brandLogoPreview || brandLogo) && (
                        <button
                          type="button"
                          className="px-2 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                          onClick={handleRemoveLogo}
                          disabled={logoLoading}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="col-span-3 md:col-span-2 rounded-lg bg-gray-50 border border-gray-200 p-3">
                    <p className="text-sm text-gray-700 font-medium">Upload guidelines</p>
                    <p className="text-xs text-gray-600 mt-1">
                      JPG or PNG, max 5MB. Use a clear square logo so it looks good in previews.
                    </p>
                    {isError && <p className="text-xs text-red-600 mt-2">{errorMessage}</p>}
                  </div>
                </div>
                {errors.brandLogoUrl && (
                  <p className="text-xs text-red-600 mt-2">{errors.brandLogoUrl.message}</p>
                )}
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Location <span className="text-red-500">*</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CountrySelect
                    label="Country"
                    name="country"
                    value={countrySelection}
                    onChange={handleCountrySelect}
                    isRequired
                    errors={errors}
                    autoDetect
                  />
                  <CitySelect
                    label="City"
                    name="city"
                    countryCode={countrySelection?.countryCode}
                    value={citySelection}
                    onChange={handleCitySelect}
                    isRequired
                    errors={errors}
                  />
                </div>
                <input type="hidden" {...register("country")} />
                <input type="hidden" {...register("city")} />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Live Preview */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <div className="flex items-center text-xs text-gray-500">
                    <Eye className="h-3 w-3 mr-1" />
                    Public view
                  </div>
                </div>

                {/* Brand Profile Card Preview */}
                <div className="bg-primary rounded-lg p-6 text-center">
                  <div className="relative inline-block mb-4">
                    {brandLogoPreview || brandLogo ? (
                      <img
                        src={brandLogoPreview || brandLogo}
                        alt="Brand Logo"
                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-16 border-2 border-white bg-primary rounded-full flex items-center justify-center shadow-md">
                        <Building2 className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 border-2 border-white rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">B</span>
                    </div>
                  </div>

                  <h4 className="font-semibold text-white mb-1">
                    {getValues("brandName") || "Your Brand Name"}
                  </h4>
                  <p className="text-xs text-white mb-3">
                    {getValues("websiteUrl") || "example.com"}
                  </p>

                  {description && (
                    <p className="text-xs text-black bg-gray-100 p-3 rounded-lg mb-3 text-left">
                      {description}
                    </p>
                  )}

                  <div className="flex items-center justify-center text-xs text-white">
                    <MapPin className="h-3 w-3 mr-1" />
                    {previewCityName}, {previewCountryName}
                  </div>
                </div>
              </div>

              {/* Company Description */}
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Company Description <span className="text-red-500">*</span>
                </h3>
                <p className="text-xs text-gray-600 mb-2">
                  Tell creators about your brand and what makes you unique
                </p>

                <div>
                  <textarea
                    placeholder="Tell creators about your brand, mission, and what makes you unique..."
                    rows={5}
                    maxLength={300}
                    {...register("companyDescription")}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    {(description || "").length}/300 characters
                  </p>
                  {errors.companyDescription && (
                    <p className="text-xs text-red-600 mt-2">{errors.companyDescription.message}</p>
                  )}
                </div>
              </div>

              {/* Profile Completion Status */}
              <SetupProgress
                percent={brandLogo && (description || "").length > 50 ? 100 : 50}
                steps={[
                  {
                    label: "Brand Logo",
                    status: brandLogo ? "complete" : "pending",
                  },
                  {
                    label: "Brand Name",
                    status: getValues("brandName") ? "complete" : "pending",
                  },
                  {
                    label: "Website URL",
                    status: getValues("websiteUrl") ? "complete" : "pending",
                  },
                  {
                    label: "Description",
                    status: description ? "complete" : "pending",
                  },
                  {
                    label: "Location",
                    status:
                      (getValues("city") || citySelection?.name) && countrySelection
                        ? "complete"
                        : "pending",
                  },
                ]}
              />
            </div>
          </div>
        </form>
        {/* Continue Button */}
        <div className="flex justify-end mt-10">
          <CustomButton
            text="Continue Account Setup"
            className="btn-primary"
            onClick={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
