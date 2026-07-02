"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import { isCreatorMode } from "@/common/utils/users.util";
import { Building2, Calendar, Mail, MapPin, User } from "lucide-react";
import ChangeEmailModal from "./change-email-modal/change-email-modal.component";
import usePersonalInformation from "./use-personal-information.hook";

export default function PersonalInformationPage() {
  const {
    register,
    handleSubmit,
    errors,
    isLoading,
    displayEmail,
    showEmailModal,
    setShowEmailModal,
    onEmailUpdated,
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
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Personal Information
        </h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Manage your personal details, contact information, and account preferences
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-3 sm:p-4 lg:p-6">
          <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-5 lg:mb-8 lg:grid-cols-2 lg:gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <User className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg">
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
                  label="Date of Birth"
                  name="date_of_birth"
                  type="date"
                  register={register}
                  errors={errors}
                  isRequired={false}
                  startIcon={<Calendar className="h-4 w-4" />}
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
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg">
                  Contact Information
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
                  <div className="min-w-0 flex-1">
                    <CustomInput
                      label="Email Address"
                      name="email"
                      type="email"
                      register={register}
                      errors={errors}
                      placeholder="Enter your email address"
                      isRequired={true}
                      startIcon={<Mail className="h-3 w-3 sm:h-4 sm:w-4" />}
                      disabled={true}
                    />
                  </div>
                  <CustomButton
                    text="Change email"
                    type="button"
                    className="btn-outline h-8 min-h-8 shrink-0 px-3 text-xs"
                    onClick={() => setShowEmailModal(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 border-t border-gray-200 pt-5 sm:mb-8 sm:pt-6">
            <div className="mb-4 flex items-center sm:mb-6">
              <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                <MapPin className="h-4 w-4 text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg">
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
            <div className="mb-6 border-t border-gray-200 pt-5 sm:mb-8 sm:pt-6">
              <div className="mb-4 flex items-center sm:mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg">
                  Account Preferences
                </h2>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {[
                    { value: "brand", label: "This is a brand account" },
                    { value: "agency", label: "This is an agency account" },
                  ].map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setSelectedAccountType(type.value)}
                      className={`
                      rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm
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

          <div className="mt-6 flex flex-col gap-2 border-t border-gray-200 pt-5 sm:mt-8 sm:flex-row sm:gap-4 sm:pt-6 sm:justify-end">
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

      <ChangeEmailModal
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        currentEmail={displayEmail}
        onEmailUpdated={onEmailUpdated}
      />
    </>
  );
}
