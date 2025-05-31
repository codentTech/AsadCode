"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { AES, enc } from "crypto-js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { generalSettingCurrentBusiness } from "@/provider/features/setting/setting.slice";
import { login, loginAndSignUpWithOAuth } from "@/provider/features/auth/auth.slice";
import {
  getEmailForURL,
  is2FAEnabled,
  isEmailVerified,
  isPhoneVerified,
  isProfileCreated,
  isSuperAdmin,
} from "@/common/utils/users.util";
import { isLoginVerified } from "@/common/utils/access-token.util";

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
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

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
    if (isLoginVerified()) {
      handleRedirection();
    }
  }, [router]);

  useEffect(() => {
    handleLogin();
  }, []);

  const handleRedirection = (data, _email) => {
    // if (isSuperAdmin(data)) {
    //   router.push("/super-admin/dashboard");
    // } else if (!isEmailVerified(data)) {
    //   router.push(`/verify-email?type=email-verification&email=${_email}`);
    // } else if (!isProfileCreated(data)) {
    //   router.push(`/profile?email=${_email}&userId=${data.id}`);
    // } else if (is2FAEnabled(data) && isPhoneVerified(data) && data) {
    //   router.push(`/two-factor-auth?userId=${data.id}&phone=${data.phone}`);
    // } else {
    //   router.push("/dashboard");
    // }
  };

  // functions
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const borderStyle = {
    border: "1px solid red",
  };

  const borderSuc = {
    border: "1px solid #7E7D7D",
  };

  const moveRouter = (data) => {
    router.push("/");

    // const _email = getEmailForURL(data?.email);
    // handleRedirection(data, _email);
  };

  const handleLogin = () => {
    if (typeof window === "object") {
      // Check if the browser supports localStorage
      if (
        localStorage &&
        localStorage.getItem("rememberedUsername") &&
        localStorage.getItem("rememberedPassword")
      ) {
        const storedUsername = localStorage.getItem("rememberedUsername");
        const storedEncryptedPassword = localStorage.getItem("rememberedPassword");
        // Compare the entered password with the stored encrypted password
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

  const onSubmit = async (values) => {
    setLoading(true);
    const response = await dispatch(
      login({ payload: { ...values }, successCallBack: moveRouter, setLoading })
    );
    response && setLoading(false);
    if (typeof window === "object" && isChecked) {
      // Check if the browser supports localStorage
      if (localStorage) {
        // Encrypt the password
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

  const loginWithOAuth = (loginType, email, accessToken) => {
    dispatch(
      loginAndSignUpWithOAuth({
        loginType,
        email,
        accessToken,
        successCallBack: moveRouter,
      })
    );
  };

  return {
    onSubmit,
    borderStyle,
    borderSuc,
    showPassword,
    isChecked,
    setIsChecked,
    toggleShowPassword,
    router,
    loading,
    loginWithOAuth,
    register,
    handleSubmit,
    errors,
    password,
    email,
  };
}
