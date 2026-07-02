"use client";

import { requestPasswordReset } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
});

export default function useForgotPassword() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading, isSuccess, isError, message } = useSelector((state) => {
    const slice = state.auth?.passwordResetRequest;
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

  const email = watch("email");

  const onSubmit = useCallback(
    (values) => {
      dispatch(requestPasswordReset(values.email));
    },
    [dispatch]
  );

  const goToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return {
    register,
    handleSubmit,
    errors,
    email,
    onSubmit,
    isLoading,
    isSuccess,
    isError,
    message,
    goToLogin,
  };
}
