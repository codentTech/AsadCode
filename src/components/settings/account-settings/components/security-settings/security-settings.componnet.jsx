"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { CheckCircle, Lock, Shield } from "lucide-react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

// Validation schema for password change
const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function SecuritySettings() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log("Password change data:", data);
      alert("Password updated successfully!");
      reset();
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Please try again.");
    }
  };

  return (
    <SidebarLayout>
      {/* Header */}
      <div className="bg-primary p-6 rounded-lg text-white mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Security Settings</h1>
        <p className="text-sm sm:text-base">Manage your password and account security</p>
      </div>

      {/* Password Change Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-2 sm:p-4">
          {/* Section Header */}
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-lg mr-4 flex-shrink-0">
              <Shield className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Change Password</h2>
              <p className="text-sm text-gray-600 mt-1">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          {/* Password Strength Guidelines */}
          <div className="my-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Password Requirements:</h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                At least 8 characters long
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                Contains uppercase and lowercase letters
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                Contains at least one number
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-3 w-3 text-blue-600 mr-2 flex-shrink-0" />
                Contains at least one special character (@$!%*?&)
              </li>
            </ul>
          </div>

          {/* Password Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-w-md">
              <CustomInput
                label="Current Password"
                name="currentPassword"
                register={register}
                errors={errors}
                placeholder="Enter your current password"
                isRequired={true}
                icon={Lock}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
              <CustomInput
                label="New Password"
                name="newPassword"
                register={register}
                errors={errors}
                placeholder="Enter your new password"
                isRequired={true}
                icon={Lock}
              />

              <CustomInput
                label="Confirm New Password"
                name="confirmPassword"
                register={register}
                errors={errors}
                placeholder="Confirm your new password"
                isRequired={true}
                icon={Lock}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
              <CustomButton
                text="Cancel"
                className="btn-secondary w-full sm:w-auto"
                onClick={() => reset()}
              />

              <CustomButton
                text={isSubmitting ? "Updating..." : "Update Password"}
                className="btn-primary w-full sm:w-auto"
                disabled={isSubmitting}
                type="submit"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Security Tips Section */}
      <div className="mt-6 bg-gray-100 rounded-lg p-2 sm:p-4">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Security Tips</h3>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Use a unique password that you don't use for other accounts
          </li>
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Consider using a password manager to generate and store secure passwords
          </li>
          <li className="flex items-start">
            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
            Change your password regularly and immediately if you suspect it's compromised
          </li>
        </ul>
      </div>
    </SidebarLayout>
  );
}
