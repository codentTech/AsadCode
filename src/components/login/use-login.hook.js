"use client";

import ROLES from "@/common/constants/role.constant";
import { login } from "@/provider/features/auth/auth.slice";
import { getEmailPreferences } from "@/provider/features/email-preferences/email-preferences.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { AES, enc } from "crypto-js";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function useLogin() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [showReengagementModal, setShowReengagementModal] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
  });

  const { email, password } = watch();

  useEffect(() => {
    handleLogin();
  }, []);

  const handleLogin = () => {
    if (typeof window === "object") {
      if (
        localStorage &&
        localStorage.getItem("rememberedUsername") &&
        localStorage.getItem("rememberedPassword")
      ) {
        const storedUsername = localStorage.getItem("rememberedUsername");
        const storedEncryptedPassword = localStorage.getItem("rememberedPassword");
        const bytes = AES.decrypt(
          storedEncryptedPassword,
          process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY
        );
        const decryptedPassword = bytes.toString(enc.Utf8);
        setValue("email", storedUsername);
        setValue("password", decryptedPassword);
      }
    }
  };

  const navigateAfterLogin = useCallback(
    (role) => {
      if (role === ROLES.ADMIN) {
        router.push("/admin/dashboard");
        return;
      }
      router.push("/campaign");
    },
    [router]
  );

  const handleReengagementComplete = useCallback(() => {
    setShowReengagementModal(false);
    router.push("/campaign");
  }, [router]);

  const onSubmit = async (values) => {
    setLoading(true);
    const response = await dispatch(login({ ...values, email: email.toLowerCase() }));
    if (response.payload && response.payload.success) {
      const role = response.payload?.data?.user?.role;

      if (role === ROLES.CREATOR) {
        const prefsResponse = await dispatch(getEmailPreferences());

        if (
          getEmailPreferences.fulfilled.match(prefsResponse) &&
          prefsResponse.payload?.should_show_reengagement_popup
        ) {
          setShowReengagementModal(true);
        } else {
          navigateAfterLogin(role);
        }
      } else {
        navigateAfterLogin(role);
      }
    }
    setLoading(false);
    if (typeof window === "object" && isChecked) {
      if (localStorage) {
        const encryptedPassword = AES.encrypt(
          values.password,
          process.env.NEXT_PUBLIC_MAIN_URL_SECRET_KEY
        ).toString();
        localStorage.setItem("rememberedUsername", values.email);
        localStorage.setItem("rememberedPassword", encryptedPassword);
      }
    }
    if (isChecked === false) {
      localStorage.removeItem("rememberedUsername");
      localStorage.removeItem("rememberedPassword");
    }
  };

  return {
    onSubmit,
    isChecked,
    setIsChecked,
    router,
    loading,
    register,
    handleSubmit,
    errors,
    email,
    password,
    showReengagementModal,
    handleReengagementComplete,
  };
}
