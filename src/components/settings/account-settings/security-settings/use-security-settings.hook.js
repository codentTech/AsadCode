"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { changePassword } from "@/provider/features/auth/auth.slice";

const passwordSchema = yup.object().shape({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain an uppercase letter")
    .matches(/[a-z]/, "Password must contain a lowercase letter")
    .matches(/[0-9]/, "Password must contain a number")
    .matches(/[^A-Za-z0-9]/, "Password must contain a special character")
    .required("New password is required")
    .test(
      "different-from-current",
      "New password must be different from current password",
      function (value) {
        return !value || value !== this.parent.currentPassword;
      }
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function useSecuritySettings() {
  const dispatch = useDispatch();
  const changePasswordState = useSelector((state) => state.auth?.changePassword);
  const isSubmitting = Boolean(changePasswordState?.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    (data) => {
      dispatch(
        changePassword({
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        })
      ).then((action) => {
        if (action.meta?.requestStatus === "fulfilled") {
          resetForm();
        }
      });
    },
    [dispatch, resetForm]
  );

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
  };
}
