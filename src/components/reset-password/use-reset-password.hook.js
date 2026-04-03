"use client";

import { resetPasswordWithToken } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[^A-Za-z0-9]/, "Password requires a special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm your password"),
});

export default function useResetPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState(null);

  const { isLoading, isSuccess, isError, message } = useSelector((state) => {
    const slice = state.auth?.passwordResetSubmit;
    return (
      slice ?? {
        isLoading: false,
        isSuccess: false,
        isError: false,
        message: "",
      }
    );
  });

  const schema = useMemo(() => validationSchema, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  useEffect(() => {
    const t = searchParams?.get("token");
    setToken(t ? String(t).trim() : null);
  }, [searchParams]);

  const onSubmit = useCallback(
    (values) => {
      if (!token) {
        return;
      }
      dispatch(
        resetPasswordWithToken({
          token,
          newPassword: values.newPassword,
        })
      );
    },
    [dispatch, token]
  );

  const goToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (isSuccess) {
      const t = setTimeout(() => {
        router.push("/login");
      }, 2000);
      return () => clearTimeout(t);
    }
  }, [isSuccess, router]);

  return {
    register,
    handleSubmit,
    errors,
    newPassword,
    confirmPassword,
    onSubmit,
    isLoading,
    isSuccess,
    isError,
    message,
    token,
    goToLogin,
  };
}
