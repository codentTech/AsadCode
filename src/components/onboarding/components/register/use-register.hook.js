"use client";

import { reset, signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useSearchParams } from "next/navigation";
import api from "@/common/utils/api";
import ROLES from "@/common/constants/role.constant";
import { BRAND_ACCOUNT_TYPE_OPTIONS } from "@/common/constants/options.constant";

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
      .matches(/[^A-Za-z0-9]/, "Use Special Character like @ # etc"),
    confirm_password: Yup.string()
      .required("Please confirm your password")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
    date_of_birth: Yup.date()
      .transform((value, originalValue) => {
        if (originalValue === "" || originalValue == null) {
          return undefined;
        }
        return value;
      })
      .required("Date of birth is required")
      .max(new Date(), "Date of birth cannot be in the future"),
    city: Yup.string().required("City is required"),
    country: Yup.string().required("Country is required"),
    country_code: Yup.string().required("Country is required"),
    city_country_code: Yup.string().required("City is required"),
    agree_terms: Yup.boolean().oneOf([true], "You must accept the terms and conditions"),
    marketing_emails: Yup.boolean().default(false),
    latitude: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    longitude: Yup.number()
      .nullable()
      .transform((value, originalValue) => (originalValue === "" ? null : value)),
    referred_by: Yup.string().optional(),
  };

  if (!isCreatorMode) {
    baseSchema.account_type = Yup.string().required("Please select an account type");
  }

  return Yup.object().shape(baseSchema);
};

export default function useRegister({ onNext, inviteToken }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isCreatorMode, isLoading } = useSelector((state) => state.auth);
  const token = inviteToken || searchParams?.get("token");
  const showBrandRegisterExtras = !isCreatorMode && !token;

  const validationSchema = createValidationSchema(isCreatorMode);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      marketing_emails: false,
      agree_terms: false,
      country: "",
      city: "",
      country_code: "",
      city_country_code: "",
      confirm_password: "",
      latitude: "",
      longitude: "",
      referred_by: "",
    },
  });

  const email = watch("email");

  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hasManualLocationOverride, setHasManualLocationOverride] = useState(false);
  const hasAutoDetectedLocation = useRef(false);

  useEffect(() => {
    if (selectedAccountType) {
      setValue("account_type", selectedAccountType);
    }
  }, [selectedAccountType, setValue]);

  useEffect(() => {
    let isMounted = true;

    if (
      hasManualLocationOverride ||
      hasAutoDetectedLocation.current ||
      selectedCountry ||
      selectedCity
    ) {
      return () => {
        isMounted = false;
      };
    }

    const autoDetectLocation = async () => {
      try {
        const client = api({ "x-skip-toast": "true" });
        const response = await client.get("/auth/location/auto-detect");
        const data = response.data?.data;
        if (!isMounted || !data) return;

        hasAutoDetectedLocation.current = true;

        if (data.countryName && data.countryCode && !selectedCountry) {
          const normalizedCountry = {
            name: data.countryName,
            code: data.countryCode,
            countryCode: data.countryCode,
            dialCode: data.dialCode || "",
          };
          setSelectedCountry(normalizedCountry);
          setValue("country", normalizedCountry.name, { shouldValidate: true });
          setValue("country_code", normalizedCountry.code, { shouldValidate: true });
          setValue("city_country_code", normalizedCountry.code, { shouldValidate: true });
        }

        if (data.city && !selectedCity) {
          const normalizedCity = {
            name: data.city,
            cityName: data.city,
            countryCode: data.cityCountryCode || data.countryCode || "",
            latitude: typeof data.latitude === "number" ? data.latitude : null,
            longitude: typeof data.longitude === "number" ? data.longitude : null,
          };
          setSelectedCity(normalizedCity);
          setValue("city", normalizedCity.name, { shouldValidate: true });
          setValue("city_country_code", normalizedCity.countryCode, { shouldValidate: true });
          if (normalizedCity.latitude !== null) {
            setValue("latitude", normalizedCity.latitude, { shouldValidate: false });
          }
          if (normalizedCity.longitude !== null) {
            setValue("longitude", normalizedCity.longitude, { shouldValidate: false });
          }
        } else {
          if (typeof data.latitude === "number") {
            setValue("latitude", data.latitude, { shouldValidate: false });
          }
          if (typeof data.longitude === "number") {
            setValue("longitude", data.longitude, { shouldValidate: false });
          }
        }
      } catch {}
    };

    autoDetectLocation();

    return () => {
      isMounted = false;
    };
  }, [hasManualLocationOverride, selectedCountry, selectedCity, setValue]);

  const handleCountrySelect = useCallback(
    (country) => {
      setHasManualLocationOverride(true);

      if (!country) {
        setSelectedCountry(null);
        setValue("country", "", { shouldValidate: true });
        setValue("country_code", "", { shouldValidate: true });
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        setValue("city_country_code", "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        return;
      }

      const normalizedCountry = {
        name: country.countryName || country.label || country.name || "",
        code: country.countryCode || country.value || country.code || "",
        countryCode: country.countryCode || country.value || country.code || "",
        dialCode: country.phoneCode || country.phone || "",
      };

      setSelectedCountry(normalizedCountry);
      setValue("country", normalizedCountry.name, { shouldValidate: true });
      setValue("country_code", normalizedCountry.code, { shouldValidate: true });

      setSelectedCity(null);
      setValue("city", "", { shouldValidate: true });
      setValue("city_country_code", normalizedCountry.code || "", { shouldValidate: true });
      setValue("latitude", "", { shouldValidate: false });
      setValue("longitude", "", { shouldValidate: false });
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (city) => {
      setHasManualLocationOverride(true);

      if (!city) {
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        setValue("city_country_code", selectedCountry?.code || "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        return;
      }

      const normalizedCity = {
        name: city.cityName || city.label || city.name || "",
        cityName: city.cityName || city.label || city.name || "",
        countryCode: city.countryCode || selectedCountry?.code || "",
        region: city.region || "",
        geonameId: city.geonameId || null,
        latitude: city.latitude ?? null,
        longitude: city.longitude ?? null,
      };

      setSelectedCity(normalizedCity);
      setValue("city", normalizedCity.name, { shouldValidate: true });
      setValue("city_country_code", normalizedCity.countryCode, { shouldValidate: true });
      setValue("latitude", normalizedCity.latitude ?? "", { shouldValidate: false });
      setValue("longitude", normalizedCity.longitude ?? "", { shouldValidate: false });
    },
    [selectedCountry?.code, setValue]
  );

  const onSubmit = async (values) => {
    const payload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      email: values.email.toLowerCase().trim(),
      password: values.password,
      date_of_birth: values.date_of_birth,
      city: values.city.trim(),
      country: values.country,
      country_code: values.country_code,
      city_country_code: values.city_country_code,
      latitude: values.latitude === "" || values.latitude === null ? null : Number(values.latitude),
      longitude:
        values.longitude === "" || values.longitude === null ? null : Number(values.longitude),
      role: isCreatorMode ? ROLES.CREATOR : ROLES.BRAND,
      marketing_emails: values.marketing_emails || false,
      agree_terms: values.agree_terms,
    };

    if (token) {
      payload.invite_token = token;
      payload.role = ROLES.CREATOR;
    }

    if (isCreatorMode && !token) {
      payload.account_type = values.account_type;
    }
    if (!isCreatorMode && !token) {
      const raw = (values.referred_by || "").trim();
      if (raw) {
        payload.referred_by = raw;
      }
    }
    const response = await dispatch(signUp(payload));
    if (response.payload.success) {
      onNext();
      dispatch(reset());
      localStorage.setItem("email", email);
      localStorage.setItem("name", `${values.first_name} ${values.last_name}`);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading: isLoading || isSubmitting,
    isCreatorMode,
    showBrandRegisterExtras,
    brandAccountTypeOptions: BRAND_ACCOUNT_TYPE_OPTIONS,
    selectedAccountType,
    setSelectedAccountType,
    selectedCountry,
    selectedCity,
    handleCountrySelect,
    handleCitySelect,
  };
}
