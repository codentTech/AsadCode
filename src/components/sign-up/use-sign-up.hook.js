"use client";

import { getEmailForURL } from "@/common/utils/users.util";
import { signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  terms: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions."
  ),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Use Special Character like @ # etc"),
});

export default function useSignUp() {
  const dispatch = useDispatch();
  const router = useRouter(null);
  const [isChecked, setIsChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const { firstName, lastName, email, password } = watch();

  useEffect(() => {
    setIsChecked(false);
  }, [router]);

  const moveRouter = (data) => {
    router.push(
      `/verify-email?type=email-verification&email=${getEmailForURL(data.email)}`
    );
  };

  const onSubmit = async (values) => {
    setLoading(true);
    const response = await dispatch(
      signUp({
        payload: { ...values, role: "BUSINESS_OWNER" },
        successCallBack: moveRouter,
      })
    );
    response && setLoading(false);
  };

  const moveRouterSignup = (data) => {
    const _email = getEmailForURL(data.email);
    if (data.isPhoneVerified && data.isProfileCompleted) {
      router.push(`/two-factor-auth?userId=${data.id}&phone=${data.phone}`);
    } else {
      router.push(`/profile?email=${_email}&userId=${data.id}`);
    }
  };

  return {
    firstName,
    lastName,
    handleSubmit,
    onSubmit,
    register,
    errors,
    isChecked,
    loading,
    setIsChecked,
    email,
    password,
  };
}
