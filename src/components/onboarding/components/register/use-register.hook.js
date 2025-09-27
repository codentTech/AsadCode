"use client";

import { reset, signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// Dynamic validation schema based on creator mode
const createValidationSchema = (isCreatorMode) => {
  const baseSchema = {
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter")
      .matches(/[^\w]/, "Use Special Character like @ # etc"),
    date_of_birth: Yup.date()
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    agree_terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    marketing_emails: Yup.boolean().default(false),
  };

  // Add conditional fields based on mode
  if (!isCreatorMode) {
    baseSchema.creator_type = Yup.string().required("Please select a creator type");
    baseSchema.account_type = Yup.string().required("Please select an account type");
  }

  return Yup.object().shape(baseSchema);
};

export default function useRegister({ onNext }) {
  const dispatch = useDispatch();
  const { isCreatorMode, isLoading } = useSelector((state) => state.auth);

  const validationSchema = createValidationSchema(isCreatorMode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      marketing_emails: false,
      agree_terms: false,
    },
  });

  const email = watch("email");

  const onSubmit = async (values) => {
    try {
      const payload = {
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        date_of_birth: values.date_of_birth,
        city: values.city.trim(),
        country: values.country,
        role: isCreatorMode ? "CREATOR" : "BRAND",
        marketing_emails: values.marketing_emails || false,
        agree_terms: values.agree_terms,
      };

      // Add type-specific fields
      if (isCreatorMode) {
        payload.creator_type = values.creator_type;
        payload.account_type = values.account_type;
      }
      const response = await dispatch(signUp(payload));
      if (response.payload.success) {
        onNext();
        dispatch(reset());
        localStorage.setItem("email", email);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    watch,
    setValue,
    isLoading: isLoading || isSubmitting,
    resetForm,
  };
}
