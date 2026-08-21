import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import StateSelect from "@/common/components/dropdowns/state-select/state-select.component";
import { Calendar, Lock, Mail, User, UserPlus } from "lucide-react";
import OnboardingStepLayout from "../onboarding-step-layout/onboarding-step-layout.component";
import useRegister from "./use-register.hook";

const Register = ({ onNext, inviteToken }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    showBrandRegisterExtras,
    brandAccountTypeOptions,
    selectedAccountType,
    setSelectedAccountType,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    termsHref,
    privacyHref,
  } = useRegister({ onNext, inviteToken });

  return (
    <OnboardingStepLayout
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      footer={
        <CustomButton
          text="Create My Account"
          className="btn-primary w-full sm:ml-auto sm:w-auto"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        />
      }
    >
      <section className="rounded-lg border border-gray-200 p-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <CustomInput
            label="First Name"
            name="first_name"
            register={register}
            errors={errors}
            placeholder="Enter your first name"
            isRequired={true}
            icon={User}
          />

          <CustomInput
            label="Last Name"
            name="last_name"
            register={register}
            errors={errors}
            placeholder="Enter your last name"
            isRequired={true}
          />

          <CustomInput
            label="Email Address"
            name="email"
            type="email"
            register={register}
            errors={errors}
            placeholder="Enter your email address"
            isRequired={true}
            icon={Mail}
          />

          <CustomInput
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            register={register}
            errors={errors}
            isRequired={true}
            icon={Calendar}
          />

          <CustomInput
            label="Password"
            name="password"
            type="password"
            register={register}
            errors={errors}
            placeholder="Create a secure password"
            isRequired={true}
            icon={Lock}
          />

          <CustomInput
            label="Confirm Password"
            name="confirm_password"
            type="password"
            register={register}
            errors={errors}
            placeholder="Re-enter your password"
            isRequired={true}
          />

          <CountrySelect
            label="Select country"
            value={selectedCountry}
            onChange={handleCountrySelect}
            errors={errors}
            isRequired
            name="country"
            autoDetect
          />

          <StateSelect
            label="State or Province (Optional)"
            name="state"
            countryCode={selectedCountry?.code || ""}
            countryCodes={selectedCountry?.code ? [selectedCountry.code] : []}
            value={selectedState}
            onChange={handleStateSelect}
            errors={errors}
          />

          <CitySelect
            label="City"
            countryCode={selectedCountry?.code || ""}
            countryCodes={selectedCountry?.code ? [selectedCountry.code] : []}
            stateName={selectedState?.stateName || ""}
            stateShort={selectedState?.stateShort || ""}
            value={selectedCity}
            onChange={handleCitySelect}
            errors={errors}
            isRequired
            name="city"
          />

          <input type="hidden" {...register("country")} />
          <input type="hidden" {...register("country_code")} />
          <input type="hidden" {...register("state")} />
          <input type="hidden" {...register("state_short")} />
          <input type="hidden" {...register("city")} />
          <input type="hidden" {...register("city_country_code")} />
          <input type="hidden" {...register("latitude")} />
          <input type="hidden" {...register("longitude")} />

          {showBrandRegisterExtras ? (
            <div className="sm:col-span-2 xl:col-span-3">
              <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">
                Account Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 xl:max-w-xl">
                {brandAccountTypeOptions.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setSelectedAccountType(type.value)}
                    className={`rounded-lg border-2 px-3 py-1.5 text-xs font-medium transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm ${
                      selectedAccountType === type.value
                        ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-700 hover:border-indigo-200"
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
              {errors.account_type ? (
                <p className="mt-2 text-xs text-red-600">{errors.account_type.message}</p>
              ) : null}
              <input type="hidden" {...register("account_type")} />
            </div>
          ) : null}

          {showBrandRegisterExtras ? (
            <div className="sm:col-span-2">
              <CustomInput
                label="Referred by (optional)"
                name="referred_by"
                register={register}
                errors={errors}
                placeholder="Full name, @handle, or email"
                isRequired={false}
                icon={UserPlus}
              />
              <p className="mt-1 text-xs leading-relaxed text-gray-600">
                If someone referred you, enter their email, full name, brand name as on CleerCut, or
                @handle from a linked social account. It must match an existing CleerCut user.
              </p>
            </div>
          ) : null}

          <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:col-span-2 xl:col-span-3">
            <label className="flex cursor-pointer items-start space-x-3">
              <input
                type="checkbox"
                {...register("marketing_emails")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-gray-700 sm:text-sm">
                Send me campaign suggestions and brand matches
              </span>
            </label>

            <label className="flex cursor-pointer items-start space-x-3">
              <input
                type="checkbox"
                {...register("agree_terms")}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-xs text-gray-700 sm:text-sm">
                I agree to CleerCut&apos;s{" "}
                <Link href={termsHref} className="text-indigo-600 underline hover:text-indigo-700">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href={privacyHref} className="text-indigo-600 underline hover:text-indigo-700">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agree_terms ? (
              <p className="text-xs text-red-600">{errors.agree_terms.message}</p>
            ) : null}
          </div>
        </div>
      </section>
    </OnboardingStepLayout>
  );
};

export default Register;
