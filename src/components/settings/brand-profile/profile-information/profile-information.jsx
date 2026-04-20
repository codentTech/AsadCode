import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CitySelect from "@/common/components/dropdowns/city-select/city-select.component";
import CountrySelect from "@/common/components/dropdowns/country-select/country-select.component";
import { getUser } from "@/common/utils/users.util";
import { setupBrandProfile } from "@/provider/features/brand-profile/brand-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { getUserById } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, Instagram, Upload, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  websiteUrl: Yup.string().url("Enter a valid URL").required("Website URL is required"),
  brandLogoUrl: Yup.string().nullable(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  country_code: Yup.string(),
  city_country_code: Yup.string(),
  companyDescription: Yup.string().required("Description is required").max(300),
  instagramUrl: Yup.string().url("Enter a valid URL").nullable(),
  tiktokUrl: Yup.string().url("Enter a valid URL").nullable(),
  youtubeUrl: Yup.string().url("Enter a valid URL").nullable(),
});

const ProfileInformation = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [brandLogoFile, setBrandLogoFile] = useState(null);
  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      brandName: "",
      websiteUrl: "",
      brandLogoUrl: "",
      city: "",
      country: "",
      country_code: "",
      city_country_code: "",
      companyDescription: "",
      instagramUrl: "",
      tiktokUrl: "",
      youtubeUrl: "",
    },
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      const user = getUser();
      if (!user?.email) {
        setIsLoading(false);
        return;
      }

      setCurrentUser(user);

      // Fetch fresh user data from API using user ID
      let updatedUser = user;
      if (user.id) {
        const result = await dispatch(getUserById(user.id)).unwrap();
        if (result?.success && result?.data) {
          updatedUser = result.data;
          setCurrentUser(updatedUser);
          getUser(updatedUser);
        } else if (result?.data && !result.success) {
          updatedUser = result.data;
          setCurrentUser(updatedUser);
          getUser(updatedUser);
        }
      }

      const brandProfile = updatedUser.brand_profile || {};

      // Populate form with brand profile data
      reset({
        brandName: brandProfile.brand_name || "",
        websiteUrl: brandProfile.website_url || "",
        brandLogoUrl: brandProfile.brand_logo_url || "",
        companyDescription: brandProfile.company_description || "",
        instagramUrl: brandProfile.instagram_url || "",
        tiktokUrl: brandProfile.tiktok_url || "",
        youtubeUrl: brandProfile.youtube_url || "",
        city: brandProfile.city || "",
        country: brandProfile.country || "",
        country_code: brandProfile.country_code || "",
        city_country_code: brandProfile.city_country_code || "",
      });

      // Set logo preview if exists
      if (brandProfile.brand_logo_url) {
        setBrandLogoPreview(brandProfile.brand_logo_url);
      }

      // Location - set selects after reset
      if (brandProfile.country) {
        const countryValue = {
          countryName: brandProfile.country,
          countryCode: brandProfile.country_code || brandProfile.country,
          phoneCode: "",
        };
        setSelectedCountry(countryValue);
      }

      if (brandProfile.city) {
        const cityValue = {
          cityName: brandProfile.city,
          countryCode: brandProfile.city_country_code || brandProfile.country_code || "",
          region: "",
        };
        setSelectedCity(cityValue);
      }

      setIsLoading(false);
    };

    loadUserData();
  }, [dispatch, setValue]);

  const brandLogo = watch("brandLogoUrl");
  const description = watch("companyDescription");

  const handleCountryChange = (country) => {
    if (!country) {
      setSelectedCountry(null);
      setValue("country", "");
      setValue("country_code", "");
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
      return;
    }
    setSelectedCountry(country);
    setValue("country", country.countryName || country.country || "");
    setValue("country_code", country.countryCode || "");
    if (selectedCity && selectedCity.countryCode !== country.countryCode) {
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
    }
  };

  const handleCityChange = (city) => {
    if (!city) {
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
      return;
    }
    setSelectedCity(city);
    setValue("city", city.cityName || city.city || "");
    setValue("city_country_code", city.countryCode || "");
  };

  const handleFileUpload = (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 5 * 1024 * 1024) {
        // 5MB limit
        setBrandLogoFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setBrandLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        setValue("brandLogoUrl", reader.result);
      }
    }
  };

  const uploadBrandLogo = async (file) => {
    const response = await dispatch(
      uploadSingleFile({
        file,
        folder: "brand",
      })
    );

    if (response.payload?.url) {
      return response.payload.url;
    }
    return null;
  };

  const handleLogoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (!currentUser?.email) {
      setIsLoading(false);
      return;
    }

    let brandLogoUrl = data.brandLogoUrl;

    if (brandLogoFile) {
      brandLogoUrl = await uploadBrandLogo(brandLogoFile);
    }

    const payload = {
      brandName: data.brandName,
      websiteUrl: data.websiteUrl,
      brandLogoUrl: brandLogoUrl || data.brandLogoUrl || null,
      city: data.city,
      country: data.country,
      companyDescription: data.companyDescription,
    };

    const result = await dispatch(setupBrandProfile({ payload, email: currentUser.email }));

    if (result.payload?.success) {
      // Refresh user data from localStorage after successful update
      getUser(result.payload?.data);
    }

    setIsLoading(false);
  };

  return (
    <>
      {/* Header (from settings) */}
      <div className="bg-primary p-4 rounded-lg text-white mb-8">
        <h1 className="text-xl font-bold text-white">Profile Information</h1>
        <p className="text-sm mt-1">
          Create an impressive brand profile that attracts the right creators
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Brand Information */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Information <span className="text-red-500">*</span>
              </h3>
              <div className="space-y-4">
                <CustomInput
                  label="Brand Name"
                  name="brandName"
                  placeholder="Enter your client name"
                  register={register}
                  errors={errors}
                />
                <CustomInput
                  label="Website URL"
                  name="websiteUrl"
                  type="url"
                  placeholder="https://www.yourbrand.com"
                  register={register}
                  errors={errors}
                />
              </div>
            </div>
            {/* Brand Logo */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Brand Logo <span className="text-red-500">*</span>
              </h3>
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {brandLogoPreview || brandLogo ? (
                    <img
                      src={brandLogoPreview || brandLogo}
                      alt="Brand Logo"
                      className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  {(brandLogoPreview || brandLogo) && (
                    <button
                      onClick={() => {
                        setValue("brandLogoUrl", "");
                        setBrandLogoFile(null);
                        setBrandLogoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 text-xs"
                      type="button"
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
                    type="button"
                    disabled={isSubmitting || isLoading || uploadState.isLoading}
                  />
                  <p className="text-xs text-gray-600 mt-2">PNG or JPG, max 5MB</p>
                  {uploadState.isError && (
                    <p className="text-xs text-red-600 mt-2">{uploadState.message}</p>
                  )}
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
          </div>
          {/* Right Column */}
          <div className="space-y-4">
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

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Media Links</h3>
              <div className="space-y-4">
                <CustomInput
                  label="Instagram"
                  name="instagramUrl"
                  type="url"
                  placeholder="https://www.instagram.com/yourbrand"
                  register={register}
                  errors={errors}
                  startIcon={<Instagram className="h-4 w-4 text-pink-600" />}
                />
                <CustomInput
                  label="TikTok"
                  name="tiktokUrl"
                  type="url"
                  placeholder="https://www.tiktok.com/@yourbrand"
                  register={register}
                  errors={errors}
                  startIcon={
                    <div className="bg-black p-1 rounded">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                      </svg>
                    </div>
                  }
                />
                <CustomInput
                  label="YouTube"
                  name="youtubeUrl"
                  type="url"
                  placeholder="https://www.youtube.com/@yourbrand"
                  register={register}
                  errors={errors}
                  startIcon={<Youtube className="h-4 w-4 text-red-600" />}
                />
              </div>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end mt-10">
          <CustomButton
            text={isSubmitting || isLoading || uploadState.isLoading ? "Saving..." : "Save"}
            className="btn-primary"
            type="submit"
            disabled={isSubmitting || isLoading || uploadState.isLoading}
          />
        </div>
      </form>
    </>
  );
};

export default ProfileInformation;
