"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomSelect from "@/common/components/custom-select/custom-select.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Calendar, Mail, MapPin, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
    is: !isCreatorMode,
    then: (schema) => schema.required("Creator type is required"),
    otherwise: (schema) => schema.optional(),
  }),
});

export default function PersonalInformationPage() {
  const dispatch = useDispatch();
  const { updateUser: updateUserState } = useSelector((state) => state.users);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("");

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
    },
  });

  const accountType = watch("account_type");

  // Load user data on component mount
  useEffect(() => {
    const user = getUser();
    if (user) {
      setCurrentUser(user);
      // Populate form with user data
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");
      // Handle date format - split by T if it's a full datetime string
      const dateValue = user.date_of_birth
        ? user.date_of_birth.includes("T")
          ? user.date_of_birth.split("T")[0]
          : user.date_of_birth
        : "";
      setValue("date_of_birth", dateValue);
      setValue("city", user.city || "");
      setValue("country", user.country || "");
      setSelectedCountry(user.country || "");
      setValue("account_type", user.account_type || "");
      setValue("creator_type", user.creator_type || "");
    }
    setIsLoading(false);
  }, [setValue]);

  const accountTypeOptions = [
    { value: "creator", label: "Creator" },
    { value: "brand", label: "Brand" },
  ];

  const creatorTypeOptions = [
    { value: "Solo Creator", label: "Solo Creator" },
    { value: "Couple", label: "Couple" },
    { value: "Family", label: "Family" },
    { value: "Pet", label: "Pet" },
  ];

  const countryOptions = [
    { value: "US", label: "United States" },
    { value: "UK", label: "United Kingdom" },
    { value: "CA", label: "Canada" },
    { value: "AU", label: "Australia" },
    { value: "DE", label: "Germany" },
    { value: "FR", label: "France" },
    { value: "IN", label: "India" },
    { value: "BR", label: "Brazil" },
    { value: "JP", label: "Japan" },
    { value: "KR", label: "South Korea" },
  ];

  const handleCountryChange = (selectedOption) => {
    const countryValue = selectedOption?.value || "";
    setSelectedCountry(countryValue);
    setValue("country", countryValue);
  };

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      // Remove email from data as it shouldn't be updated
      const { email, ...updateData } = data;

      const result = await dispatch(updateUser(updateData)).unwrap();

      if (result.success) {
        setIsLoading(false);
        // Refresh user data from localStorage
        getUser(result?.data);
      }
    } catch (error) {
      console.error("Error updating information:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Personal Information</h1>
          <p className="text-sm mt-1">
            Manage your personal details, contact information, and account preferences
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  </div>

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
                    disabled={true}
                  />
                </div>
              </div>
            </div>

            {/* Location Information Section */}
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
                <CustomInput
                  label="City"
                  name="city"
                  register={register}
                  errors={errors}
                  placeholder="Enter your city"
                  isRequired={true}
                  startIcon={<MapPin className="h-4 w-4" />}
                />

                <SimpleSelect
                  label="Country"
                  name="country"
                  options={countryOptions}
                  placeholder="Select your country"
                  errors={errors}
                  isRequired={true}
                  onChange={handleCountryChange}
                  defaultValue={selectedCountry}
                />
              </div>
            </div>

            {!isCreatorMode() && (
              <>
                {/* Account Preferences Section */}
                <div className="mb-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                      <Building2 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                      Account Preferences
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SimpleSelect
                      label="Account Type"
                      name="account_type"
                      register={register}
                      errors={errors}
                      options={accountTypeOptions}
                      placeholder="Select your account type"
                      isRequired={true}
                    />

                    <SimpleSelect
                      label="Creator Type"
                      name="creator_type"
                      register={register}
                      errors={errors}
                      options={creatorTypeOptions}
                      placeholder="Select your creator type"
                      isRequired={true}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              <CustomButton
                text="Reset"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => {
                  const user = getUser();
                  if (user) {
                    setValue("first_name", user.first_name || "");
                    setValue("last_name", user.last_name || "");
                    setValue("email", user.email || "");
                    const dateValue = user.date_of_birth
                      ? user.date_of_birth.includes("T")
                        ? user.date_of_birth.split("T")[0]
                        : user.date_of_birth
                      : "";
                    setValue("date_of_birth", dateValue);
                    setValue("city", user.city || "");
                    setValue("country", user.country || "");
                    setSelectedCountry(user.country || "");
                    setValue("account_type", user.account_type || "");
                    setValue("creator_type", user.creator_type || "");
                  }
                }}
              />

              <CustomButton
                text={"Save Changes"}
                type="submit"
                className="btn-primary w-full sm:w-auto"
                loading={isLoading}
              />
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
