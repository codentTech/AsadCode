"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
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
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Security Settings</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Manage your password and account security
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100 sm:mr-4 sm:h-10 sm:w-10">
              <Shield className="h-4 w-4 text-indigo-600 sm:h-5 sm:w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">Change Password</h2>
              <p className="mt-1 text-[10px] text-gray-600 sm:text-xs md:text-sm">
                Update your password to keep your account secure
              </p>
            </div>
          </div>

          <div className="my-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:p-4">
            <h3 className="mb-2 text-xs font-medium text-blue-900 sm:mb-3 sm:text-sm">
              Password Requirements:
            </h3>
            <ul className="space-y-1 text-[10px] text-blue-800 sm:text-xs md:text-sm">
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

            <div className="grid max-w-4xl grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
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

      <div className="mt-4 rounded-lg bg-gray-100 p-3 sm:mt-6 sm:p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:mb-4 sm:text-lg">Security Tips</h3>
        <ul className="space-y-2 text-xs text-gray-600 sm:text-sm">
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
    </>
  );
}
