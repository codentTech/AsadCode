"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Mail, MapPin, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema
const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  businessName: yup.string().required("Business name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  phone: yup.string().required("Phone number is required"),
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zipCode: yup.string().required("ZIP code is required"),
  country: yup.string().required("Country is required"),
});

export default function PersonalInformationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      businessName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Form data:", data);
      alert("Personal information updated successfully!");
    } catch (error) {
      console.error("Error updating information:", error);
      alert("Failed to update information. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">Personal Information</h1>
          <p className="text-sm mt-1">
            {" "}
            Manage your name, business details, email, and contact information
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <form onSubmit={handleSubmit(onSubmit)} className="p-2 sm:p-4 lg:p-6">
            {/* Top Section - Grid Layout for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Personal Details Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Personal Details
                  </h2>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  <CustomInput
                    label="First Name"
                    name="firstName"
                    register={register}
                    errors={errors}
                    placeholder="Enter your first name"
                    isRequired={true}
                    startIcon={<User className="h-4 w-4" />}
                  />

                  <CustomInput
                    label="Last Name"
                    name="lastName"
                    register={register}
                    errors={errors}
                    placeholder="Enter your last name"
                    startIcon={<User className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Business Information
                  </h2>
                </div>

                <div className="space-y-2 sm:space-y-4">
                  <CustomInput
                    label="Business Name"
                    name="businessName"
                    register={register}
                    errors={errors}
                    placeholder="Enter your business name"
                    isRequired={true}
                    startIcon={<Building2 className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Contact Information Section */}
              <div className="space-y-4 lg:col-span-2 2xl:col-span-1">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                    <Mail className="h-4 w-4 text-indigo-600" />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Contact Information
                  </h2>
                </div>

                <div className="space-y-2 sm:space-y-4">
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

                  <CustomInput
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    register={register}
                    errors={errors}
                    placeholder="Enter your phone number"
                    isRequired={true}
                    startIcon={<Phone className="h-4 w-4" />}
                  />
                </div>
              </div>
            </div>

            {/* Address Information Section - Full Width */}
            <div className="mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="flex items-center mb-6">
                <div className="flex items-center justify-center w-8 h-8 bg-indigo-100 rounded-lg mr-3 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-indigo-600" />
                </div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Address Information
                </h2>
              </div>

              <div className="space-y-2 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <CustomInput
                    label="Street Address 1"
                    name="address1"
                    register={register}
                    errors={errors}
                    placeholder="Enter street address 1"
                    isRequired={true}
                    startIcon={<MapPin className="h-4 w-4" />}
                  />
                  <CustomInput
                    label="Street Address 2"
                    name="address2"
                    register={register}
                    errors={errors}
                    placeholder="Enter street address 2"
                    isRequired={false}
                    startIcon={<MapPin className="h-4 w-4" />}
                  />

                  <CustomInput
                    label="Country"
                    name="country"
                    register={register}
                    errors={errors}
                    placeholder="Enter country"
                    isRequired={true}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <CustomInput
                    label="City"
                    name="city"
                    register={register}
                    errors={errors}
                    placeholder="Enter city"
                    isRequired={true}
                  />

                  <CustomInput
                    label="State/Province"
                    name="state"
                    register={register}
                    errors={errors}
                    placeholder="Enter state"
                    isRequired={true}
                  />

                  <CustomInput
                    label="ZIP/Postal Code"
                    name="zipCode"
                    register={register}
                    errors={errors}
                    placeholder="Enter ZIP code"
                    isRequired={true}
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-6 sm:pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-end">
              <CustomButton
                text="Reset"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => reset()}
              />

              <CustomButton
                text="Save Changes"
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
