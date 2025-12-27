"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { isCreatorMode } from "@/common/utils/users.util";
import { Building2, Mail, MapPin, User } from "lucide-react";
import usePersonalInformation from "./use-personal-information.hook";

export default function PersonalInformationPage() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    selectedCountry,
    selectedCity,
    selectedAccountType,
    setSelectedAccountType,
    handleCountryChange,
    handleCityChange,
    handleReset,
    onSubmit,
  } = usePersonalInformation();

  return (
    <DashboardLayout>
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Personal Information</h1>
        <p className="text-sm mt-1">
          Manage your personal details, contact information, and account preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-2 sm:p-4 lg:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Personal Details
                </h2>
              </div>

              <div className="space-y-4">
                <CustomInput
                  label="Account Name"
                  name="account_name"
                  register={register}
                  errors={errors}
                  placeholder="Enter account name"
                  isRequired={true}
                  startIcon={<User className="h-4 w-4" />}
                />

                <CustomInput
                  label="Admin Contact Name"
                  name="admin_contact_name"
                  register={register}
                  errors={errors}
                  placeholder="Enter admin contact name"
                  isRequired={true}
                  startIcon={<User className="h-4 w-4" />}
                />

                {/* Hidden fields for API */}
                <input type="hidden" {...register("first_name")} />
                <input type="hidden" {...register("last_name")} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <Mail className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <CustomInput
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  errors={errors}
                  placeholder="Enter your email address"
                  isRequired={true}
                  startIcon={<Mail className="h-4 w-4" />}
                  disabled={true}
                />
              </div>
            </div>
          </div>

          <div className="mb-8 pt-6 border-t border-gray-200">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Location Information
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CountrySelect
                label="Country"
                name="country"
                value={selectedCountry}
                onChange={handleCountryChange}
                isRequired={true}
                errors={errors}
              />

              <CitySelect
                label="City"
                name="city"
                countryCode={selectedCountry?.countryCode}
                value={selectedCity}
                onChange={handleCityChange}
                isRequired={true}
                errors={errors}
              />
            </div>
          </div>

          {!isCreatorMode() && (
            <div className="mb-8 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Account Preferences
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "brand", label: "This is a brand account" },
                    { value: "agency", label: "This is an agency account" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedAccountType(type.value)}
                      className={`
                      px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200 hover:scale-105
                      ${
                        selectedAccountType === type.value
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                          : "border-gray-200 text-gray-700 hover:border-indigo-200"
                      }
                    `}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
                {errors.account_type && (
                  <p className="text-xs text-red-600 mt-2">{errors.account_type.message}</p>
                )}
                <input type="hidden" {...register("account_type")} />
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
            <CustomButton
              text="Reset"
              className="btn-secondary w-full sm:w-auto"
              onClick={handleReset}
            />

            <CustomButton
              text="Save Changes"
              type="submit"
              className="btn-primary w-full sm:w-auto"
              loading={isLoading}
            />
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
