"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { getUser } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { Edit2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as yup from "yup";

// Validation schema
const emailSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
});

export default function ContactMethodsPage() {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");

  // Email form
  const emailForm = useForm({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: "" },
  });

  // Load current email on mount
  useEffect(() => {
    const user = getUser();
    if (user?.email) {
      setCurrentEmail(user.email);
      emailForm.setValue("email", user.email);
    }
  }, [emailForm]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    emailForm.setValue("email", currentEmail);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const result = await dispatch(updateUser({ email: data.email })).unwrap();
    if (result.success) {
      setCurrentEmail(data.email);
      setIsEditing(false);
      getUser(result?.data);
    }
    setIsLoading(false);
  };

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Email Address</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">Manage your email address</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-3 sm:p-4">
          <div className="mb-4 flex items-center justify-between sm:mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900 sm:text-base md:text-lg">Email Address</h2>
            </div>

            {!isEditing && (
              <CustomButton text="Edit" className="btn-primary" icon={Edit2} onClick={handleEdit} />
            )}
          </div>

          {!isEditing ? (
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 sm:p-4">
              <p className="text-xs font-medium text-gray-900 sm:text-sm">{currentEmail || "No email set"}</p>
            </div>
          ) : (
            <form onSubmit={emailForm.handleSubmit(onSubmit)} className="space-y-4">
              <div className="max-w-md">
                <CustomInput
                  label="Email Address"
                  name="email"
                  type="email"
                  register={emailForm.register}
                  errors={emailForm.formState.errors}
                  placeholder="Enter email address"
                  isRequired={true}
                  startIcon={<Mail className="h-4 w-4" />}
                />
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <CustomButton
                  text="Save Changes"
                  className="btn-primary w-full sm:w-auto"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                />
                <CustomButton
                  text="Cancel"
                  className="btn-secondary w-full sm:w-auto"
                  onClick={handleCancel}
                  disabled={isLoading}
                />
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
