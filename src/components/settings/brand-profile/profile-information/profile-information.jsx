import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { getUser } from "@/common/utils/users.util";
import { setupBrandProfile } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Camera, MapPin, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  websiteUrl: Yup.string().url("Enter a valid URL").required("Website URL is required"),
  brandLogoUrl: Yup.string().url("Enter a valid logo URL").nullable(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  companyDescription: Yup.string().required("Description is required").max(300),
});

const countries = [
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "de", label: "Germany" },
  { value: "fr", label: "France" },
  { value: "jp", label: "Japan" },
  { value: "sg", label: "Singapore" },
];

const ProfileInformation = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

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
      companyDescription: "",
    },
  });

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = () => {
      const user = getUser();
      if (user) {
        setCurrentUser(user);
        // Populate form with user data
        setValue("brandName", user.brand_profile?.brand_name || "");
        setValue("websiteUrl", user.brand_profile?.website_url || "");
        setValue("brandLogoUrl", user.brand_profile?.brand_logo_url || "");
        setValue("city", user.brand_profile?.city || "");
        setValue("country", user.brand_profile?.country || "");
        setValue("companyDescription", user.brand_profile?.company_description || "");
      }
    };

    loadUserData();
  }, [setValue]);

  const brandLogo = watch("brandLogoUrl");
  const description = watch("companyDescription");
  const selectedCountry = watch("country");

  const handleLogoUpload = () => {
    // Simulate file upload (replace with real upload logic if needed)
    setValue(
      "brandLogoUrl",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=150&h=150&fit=crop&crop=center",
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      if (!currentUser?.email) {
        console.error("No user email found");
        return;
      }

      const result = await dispatch(
        setupBrandProfile({ payload: data, email: currentUser.email })
      ).unwrap();

      if (result.success) {
        // Refresh user data from localStorage after successful update
        getUser(result?.data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error updating brand profile:", error);
      // Show user-friendly error message
      if (error.response?.data?.message) {
        console.error("API Error:", error.response.data.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
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
                  placeholder="Enter your brand or agency name"
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
                      onClick={() => setValue("brandLogoUrl", "")}
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
                  />
                  <p className="text-xs text-gray-600 mt-2">PNG or JPG, max 5MB</p>
                </div>
              </div>
              {errors.brandLogoUrl && (
                <p className="text-xs text-red-600 mt-2">{errors.brandLogoUrl.message}</p>
              )}
            </div>
            {/* Location */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                HQ Location <span className="text-red-500">*</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomInput
                  label="City"
                  name="city"
                  placeholder="Enter your city"
                  icon={MapPin}
                  register={register}
                  errors={errors}
                />
                <SimpleSelect
                  label="Country"
                  placeHolder="Select an option"
                  options={countries}
                  value={selectedCountry}
                  onChange={({ value }) => setValue("country", value, { shouldValidate: true })}
                  error={errors.country?.message}
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
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex justify-end mt-10">
          <CustomButton
            text={isSubmitting || isLoading ? "Saving..." : "Save"}
            className="btn-primary"
            type="submit"
            disabled={isSubmitting || isLoading}
          />
        </div>
      </form>
    </DashboardLayout>
  );
};

export default ProfileInformation;
