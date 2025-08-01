"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSelect from "@/common/components/custom-select/custom-select.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { getUser } from "@/common/utils/users.util";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Mail, MapPin, Phone, User, Calendar, Globe } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema based on RegisterDto
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  date_of_birth: yup.string().required("Date of birth is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  account_type: yup.string().required("Account type is required"),
  creator_type: yup.string().when("account_type", {
    is: "creator",
    then: (schema) => schema.required("Creator type is required"),
    otherwise: (schema) => schema.optional(),
  }),
  role: yup.string().required("Role is required"),
});

// Account type options
const accountTypeOptions = [
  { value: "creator", label: "Creator" },
  { value: "brand", label: "Brand" },
];

// Creator type options
const creatorTypeOptions = [
  { value: "Solo Creator", label: "Solo Creator" },
  { value: "Couple", label: "Couple" },
  { value: "Family", label: "Family" },
  { value: "Pet", label: "Pet" },
];

// Role options
const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "CREATOR", label: "Creator" },
  { value: "BRAND", label: "Brand" },
];

export default function PersonalInformationPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      city: "",
      country: "",
      account_type: "",
      creator_type: "",
      role: "",
    },
  });

  // Watch account type to conditionally show creator type
  const watchedAccountType = watch("account_type");

  useEffect(() => {
    const loadUserData = () => {
      try {
        const user = getUser();
        if (user) {
          setCurrentUser(user);
          // Populate form with user data
          setValue("first_name", user.first_name || "");
          setValue("last_name", user.last_name || "");
          setValue("email", user.email || "");
          setValue("date_of_birth", user.date_of_birth || "");
          setValue("city", user.city || "");
          setValue("country", user.country || "");
          setValue("account_type", user.account_type || "");
          setValue("creator_type", user.creator_type || "");
          setValue("role", user.role || "");
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      // TODO: Implement API call to update user information
      console.log("Form data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update local storage with new data
      const updatedUser = { ...currentUser, ...data };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Personal information updated successfully!");
    } catch (error) {
      console.error("Error updating information:", error);
      alert("Failed to update information. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Personal Information</h1>
          <p className="text-sm mt-1">
            Manage your personal details, account type, and contact information
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-2 sm:p-4 lg:p-6">
            {/* Personal Details Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
              {/* Personal Details */}
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
                    label="First Name"
                    name="first_name"
                    register={register}
                    errors={errors}
                    placeholder="Enter your first name"
                    isRequired={true}
                    startIcon={<User className="h-4 w-4" />}
                  />

                  <CustomInput
                    label="Last Name"
                    name="last_name"
                    register={register}
                    errors={errors}
                    placeholder="Enter your last name"
                    isRequired={true}
                    startIcon={<User className="h-4 w-4" />}
                  />

                  <CustomInput
                    label="Date of Birth"
                    name="date_of_birth"
                    type="date"
                    register={register}
                    errors={errors}
                    placeholder="Select your date of birth"
                    isRequired={true}
                    startIcon={<Calendar className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Contact Information */}
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
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Location Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CustomInput
                  label="City"
                  name="city"
                  register={register}
                  errors={errors}
                  placeholder="Enter your city"
                  isRequired={true}
                  startIcon={<MapPin className="h-4 w-4" />}
                />

                <CustomInput
                  label="Country"
                  name="country"
                  register={register}
                  errors={errors}
                  placeholder="Enter your country"
                  isRequired={true}
                  startIcon={<Globe className="h-4 w-4" />}
                />
              </div>
            </div>

            {/* Account Information Section */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <Building2 className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Account Information
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("account_type")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.account_type ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select account type</option>
                    {accountTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.account_type && (
                    <p className="text-red-500 text-sm mt-1">{errors.account_type.message}</p>
                  )}
                </div>

                {watchedAccountType === "creator" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Creator Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("creator_type")}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.creator_type ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select creator type</option>
                      {creatorTypeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.creator_type && (
                      <p className="text-red-500 text-sm mt-1">{errors.creator_type.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("role")}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      errors.role ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select role</option>
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end pt-6 border-t border-gray-200">
              <CustomButton
                text="Reset"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => reset()}
              />

              <CustomButton
                text={isSubmitting ? "Saving..." : "Save Changes"}
                type="submit"
                className="btn-primary w-full sm:w-auto"
                disabled={isSubmitting}
              />
            </div>
          </form>
        </div>
      </div>
    </SidebarLayout>
  );
}
