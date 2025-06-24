import React, { useState } from "react";
import { Building2, Upload, Camera, Globe, MapPin, ArrowLeft, Eye } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";

const BrandProfile = ({ onNext, onBack }) => {
  const [brandLogo, setBrandLogo] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleLogoUpload = () => {
    // Simulate file upload
    setBrandLogo(
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center"
    );
  };

  const countries = [
    { value: "us", label: "🇺🇸 United States" },
    { value: "uk", label: "🇬🇧 United Kingdom" },
    { value: "ca", label: "🇨🇦 Canada" },
    { value: "au", label: "🇦🇺 Australia" },
    { value: "de", label: "🇩🇪 Germany" },
    { value: "fr", label: "🇫🇷 France" },
    { value: "jp", label: "🇯🇵 Japan" },
    { value: "sg", label: "🇸🇬 Singapore" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-2/3 transition-all duration-500"></div>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Build Your Brand Profile</h1>
          <p className="text-gray-600">Set up your public profile that creators will see</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Brand Information */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Information <span className="text-red-500">*</span>
              </h3>

              <div className="space-y-4">
                <CustomInput
                  label="Brand Name"
                  name="brandName"
                  placeholder="Enter your brand or agency name"
                  icon={Building2}
                />

                <CustomInput
                  label="Website URL"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://www.yourbrand.com"
                  icon={Globe}
                />
              </div>
            </div>

            {/* Brand Logo */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Logo <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt="Brand Logo"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {brandLogo && (
                    <button
                      onClick={() => setBrandLogo(null)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div>
                  <CustomButton
                    text="Upload Logo"
                    className="btn-secondary"
                    icon={Upload}
                    onClick={handleLogoUpload}
                  />
                  <p className="text-xs text-gray-600 mt-2">PNG or JPG, max 5MB</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                HQ Location <span className="text-red-500">*</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput label="City" name="city" placeholder="Enter your city" icon={MapPin} />
                <SimpleSelect
                  label="Country"
                  placeHolder="Select an option"
                  options={countries}
                  onChange={(value) => setSelectedCountry(value)}
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Live Preview */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Eye className="h-3 w-3 mr-1" />
                  Public view
                </div>
              </div>

              {/* Brand Profile Card Preview */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 text-center">
                <div className="relative inline-block mb-4">
                  {brandLogo ? (
                    <img
                      src={brandLogo}
                      alt="Brand Logo"
                      className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center shadow-md">
                      <Building2 className="h-8 w-8 text-white" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-500 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">B</span>
                  </div>
                </div>

                <h4 className="font-semibold text-gray-900 mb-1">Your Brand Name</h4>
                <p className="text-xs text-gray-600 mb-3">example.com</p>

                {description && (
                  <p className="text-xs text-gray-600 bg-white/70 p-3 rounded-lg mb-3 text-left">
                    {description}
                  </p>
                )}

                <div className="flex items-center justify-center text-xs text-gray-500">
                  <MapPin className="h-3 w-3 mr-1" />
                  San Francisco, US
                </div>
              </div>
            </div>

            {/* Company Description */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
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
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 resize-none"
                />
                <p className="text-xs text-gray-600 mt-2">{description.length}/300 characters</p>
              </div>
            </div>

            {/* Profile Completion Status */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3">Profile Setup Progress</h4>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${brandLogo && description.length > 50 ? "100%" : "50%"}` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600">
                {brandLogo && description.length > 50
                  ? "✅ Your brand profile looks great!"
                  : "Add logo and description to complete"}
              </p>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-end mt-10">
          <CustomButton text="Continue Account Setup" className="btn-primary" onClick={onNext} />
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;
