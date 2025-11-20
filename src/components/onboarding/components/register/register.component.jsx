import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import { ArrowLeft, Calendar, Lock, Mail, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import useRegister from "./use-register.hook";
import api from "@/common/utils/api";

const Register = ({ onNext, onBack }) => {
  const { register, handleSubmit, errors, onSubmit, watch, setValue, isLoading } = useRegister({
    onNext,
  });
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [hasManualLocationOverride, setHasManualLocationOverride] = useState(false);
  const hasAutoDetectedLocation = useRef(false);

  const password = watch("password");

  useEffect(() => {
    if (password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      setPasswordStrength(strength);
    }
  }, [password]);

  useEffect(() => {
    if (selectedAccountType) {
      setValue("account_type", selectedAccountType);
    }
  }, [selectedAccountType, setValue]);

  const handleCountrySelect = useCallback(
    (country) => {
      setHasManualLocationOverride(true);

      if (!country) {
        setSelectedCountry(null);
        setValue("country", "", { shouldValidate: true });
        setValue("country_code", "", { shouldValidate: true });
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        setValue("city_country_code", "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        return;
      }

      const normalizedCountry = {
        name: country.countryName || country.label || country.name || "",
        code: country.countryCode || country.value || country.code || "",
        countryCode: country.countryCode || country.value || country.code || "",
        dialCode: country.phoneCode || country.phone || "",
      };

      setSelectedCountry(normalizedCountry);
      setValue("country", normalizedCountry.name, { shouldValidate: true });
      setValue("country_code", normalizedCountry.code, { shouldValidate: true });

      setSelectedCity(null);
      setValue("city", "", { shouldValidate: true });
      setValue("city_country_code", normalizedCountry.code || "", { shouldValidate: true });
      setValue("latitude", "", { shouldValidate: false });
      setValue("longitude", "", { shouldValidate: false });
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (city) => {
      setHasManualLocationOverride(true);

      if (!city) {
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        setValue("city_country_code", selectedCountry?.code || "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        return;
      }

      const normalizedCity = {
        name: city.cityName || city.label || city.name || "",
        cityName: city.cityName || city.label || city.name || "",
        countryCode: city.countryCode || selectedCountry?.code || "",
        region: city.region || "",
        geonameId: city.geonameId || null,
        latitude: city.latitude ?? null,
        longitude: city.longitude ?? null,
      };

      setSelectedCity(normalizedCity);
      setValue("city", normalizedCity.name, { shouldValidate: true });
      setValue("city_country_code", normalizedCity.countryCode, { shouldValidate: true });
      setValue("latitude", normalizedCity.latitude ?? "", { shouldValidate: false });
      setValue("longitude", normalizedCity.longitude ?? "", { shouldValidate: false });
    },
    [selectedCountry?.code, setValue]
  );

  useEffect(() => {
    let isMounted = true;

    if (
      hasManualLocationOverride ||
      hasAutoDetectedLocation.current ||
      selectedCountry ||
      selectedCity
    ) {
      return () => {
        isMounted = false;
      };
    }

    const autoDetectLocation = async () => {
      try {
        const client = api({ "x-skip-toast": "true" });
        const response = await client.get("/auth/location/auto-detect");
        const data = response.data?.data;
        if (!isMounted || !data) return;

        hasAutoDetectedLocation.current = true;

        if (data.countryName && data.countryCode && !selectedCountry) {
          const normalizedCountry = {
            name: data.countryName,
            code: data.countryCode,
            countryCode: data.countryCode,
            dialCode: data.dialCode || "",
          };
          setSelectedCountry(normalizedCountry);
          setValue("country", normalizedCountry.name, { shouldValidate: true });
          setValue("country_code", normalizedCountry.code, { shouldValidate: true });
          setValue("city_country_code", normalizedCountry.code, { shouldValidate: true });
        }

        if (data.city && !selectedCity) {
          const normalizedCity = {
            name: data.city,
            cityName: data.city,
            countryCode: data.cityCountryCode || data.countryCode || "",
            latitude: typeof data.latitude === "number" ? data.latitude : null,
            longitude: typeof data.longitude === "number" ? data.longitude : null,
          };
          setSelectedCity(normalizedCity);
          setValue("city", normalizedCity.name, { shouldValidate: true });
          setValue("city_country_code", normalizedCity.countryCode, { shouldValidate: true });
          if (normalizedCity.latitude !== null) {
            setValue("latitude", normalizedCity.latitude, { shouldValidate: false });
          }
          if (normalizedCity.longitude !== null) {
            setValue("longitude", normalizedCity.longitude, { shouldValidate: false });
          }
        } else {
          if (typeof data.latitude === "number") {
            setValue("latitude", data.latitude, { shouldValidate: false });
          }
          if (typeof data.longitude === "number") {
            setValue("longitude", data.longitude, { shouldValidate: false });
          }
        }
      } catch (error) {
        // Silent failover
      }
    };

    autoDetectLocation();

    return () => {
      isMounted = false;
    };
  }, [hasManualLocationOverride, selectedCountry, selectedCity, setValue]);

  return (
    <div className="py-8 px-4 bg-gray-100">
      <div className="max-w-xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <button
              onClick={onBack}
              className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </button>
            <span>Step 2 of 5</span>
            <span>40% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full w-2/5 transition-all duration-500"></div>
          </div>
        </div>

        <div className="text-center mb-5">
          <h1 className="text-xl lg:text-3xl font-bold text-gray-900 mb-1">Create Your Account</h1>
          <p className="text-sm lg:text-lg text-gray-600">
            Let's set up your profile to start connecting with brands
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            {!isCreatorMode && (
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
            )}

            <div className="space-y-4 bg-gray-100 p-4 rounded-xl">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("marketing_emails")}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  Send me campaign suggestions and brand matches
                </span>
              </label>

              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  {...register("agree_terms")}
                  className="mt-1 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to CleerCut's{" "}
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
