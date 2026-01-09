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
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Email Address</h1>
        <p className="text-sm mt-1">Manage your email address</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Email Address</h2>
            </div>

            {!isEditing && (
              <CustomButton text="Edit" className="btn-primary" icon={Edit2} onClick={handleEdit} />
            )}
          </div>

          {!isEditing ? (
            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <p className="text-sm font-medium text-gray-900">{currentEmail || "No email set"}</p>
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

              <div className="flex space-x-3">
                <CustomButton
                  text="Save Changes"
                  className="btn-primary"
                  type="submit"
                  loading={isLoading}
                  disabled={isLoading}
                />
                <CustomButton
                  text="Cancel"
                  className="btn-secondary"
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
