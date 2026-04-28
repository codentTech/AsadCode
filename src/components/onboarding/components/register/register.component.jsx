import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import { Calendar, Lock, Mail, User, UserPlus } from "lucide-react";
import useRegister from "./use-register.hook";

const Register = ({ onNext, inviteToken }) => {
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    isCreatorMode,
    showBrandRegisterExtras,
    brandAccountTypeOptions,
    selectedAccountType,
    setSelectedAccountType,
    selectedCountry,
    selectedCity,
    handleCountrySelect,
    handleCitySelect,
  } = useRegister({ onNext, inviteToken });

  return (
    <div className="bg-gray-100 px-2.5 py-4 sm:px-4 sm:py-8">
      <div className="max-w-xl mx-auto">
        <div className="mb-4 rounded-lg bg-primary p-3 text-center sm:mb-5 sm:p-4">
          <h1 className="mb-1 text-sm font-semibold text-white sm:text-lg md:text-xl lg:text-3xl">
            Account Owner Information
          </h1>
          <p className="text-[10px] text-white sm:text-xs md:text-sm lg:text-lg">
            Let&apos;s set up your profile to start connecting with creators
          </p>
        </div>
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between text-xs text-gray-500 sm:text-sm">
            <span className="text-[10px] sm:text-sm">Step 2 of 5</span>
            <span className="text-[10px] sm:text-sm">40% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full w-2/5 transition-all duration-500"></div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-3 shadow-2xl sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
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
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
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
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
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
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-6">
              <CountrySelect
                label="Select country"
                value={selectedCountry}
                onChange={handleCountrySelect}
                errors={errors}
                isRequired
                name="country"
                autoDetect
              />

              <CitySelect
                label="City"
                countryName={selectedCountry?.name}
                countryCode={selectedCountry?.code}
                value={selectedCity}
                onChange={handleCitySelect}
                errors={errors}
                isRequired
                name="city"
              />
            </div>

            <input type="hidden" {...register("country")} />
            <input type="hidden" {...register("country_code")} />
            <input type="hidden" {...register("city")} />
            <input type="hidden" {...register("city_country_code")} />
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />

            {showBrandRegisterExtras && (
              <div>
                <label className="mb-2 block text-xs font-medium text-gray-900 sm:text-sm">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                  {brandAccountTypeOptions.map((type) => (
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
            )}

            {showBrandRegisterExtras && (
              <div className="space-y-2">
                <CustomInput
                  label="Referred by (optional)"
                  name="referred_by"
                  register={register}
                  errors={errors}
                  placeholder="Full name, @handle, or email"
                  isRequired={false}
                  icon={UserPlus}
                />
                <p className="text-xs text-gray-600 leading-relaxed">
                  If someone referred you, enter their email, full name, brand name as on CleerCut,
                  or @handle from a linked social account. It must match an existing CleerCut user.
                </p>
              </div>
            )}

            <div className="space-y-3 rounded-xl bg-gray-100 p-3 sm:space-y-4 sm:p-4">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("marketing_emails")}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-700 sm:text-sm">
                  Send me campaign suggestions and brand matches
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agree_terms")}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-xs text-gray-700 sm:text-sm">
                  I agree to CleerCut&apos;s{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-indigo-600 hover:text-indigo-700 underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.agree_terms && (
                <p className="text-xs text-red-600">{errors.agree_terms.message}</p>
              )}
            </div>

            <CustomButton
              text="Create My Account"
              className="btn-primary w-full"
              type="submit"
              disabled={isLoading}
              loading={isLoading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
