"use client";

import { reset, signUp } from "@/provider/features/auth/auth.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import api from "@/common/utils/api";
import ROLES from "@/common/constants/role.constant";
import { BRAND_ACCOUNT_TYPE_OPTIONS } from "@/common/constants/options.constant";
import useLegalLinks from "@/common/hooks/use-legal-links.hook";
import {
  createRegisterValidationSchema,
  DEFAULT_FORM_VALUES,
  normalizeAutoDetectedCity,
  normalizeAutoDetectedCountry,
  normalizeCountry,
  normalizeSelectedCity,
  toNullableNumber,
} from "@/common/utils/register-form.util";
import { readRegisterDraft, writeRegisterDraft } from "@/common/utils/onboarding-flow.util";

export default function useRegister({ onNext, inviteToken }) {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { isCreatorMode, isLoading } = useSelector((state) => state.auth);
  const { termsHref, privacyHref } = useLegalLinks();

  const token = inviteToken || searchParams?.get("token");
  const showBrandRegisterExtras = !isCreatorMode && !token;
  const validationSchema = createRegisterValidationSchema(isCreatorMode);

  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [hasManualLocationOverride, setHasManualLocationOverride] =
    useState(false);
  const hasAutoDetectedLocation = useRef(false);
  const hasHydratedRegisterRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
    getValues,
    watch,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const watchedRegister = watch();

  useEffect(() => {
    if (hasHydratedRegisterRef.current) return;
    const draft = readRegisterDraft();
    if (!draft?.formValues) return;
    hasHydratedRegisterRef.current = true;
    resetForm({ ...DEFAULT_FORM_VALUES, ...draft.formValues });
    if (draft.selectedAccountType) setSelectedAccountType(draft.selectedAccountType);
    if (draft.selectedCountry) {
      setSelectedCountry(draft.selectedCountry);
      setHasManualLocationOverride(true);
    }
    if (draft.selectedState) setSelectedState(draft.selectedState);
    if (draft.selectedCity) {
      setSelectedCity(draft.selectedCity);
      setHasManualLocationOverride(true);
    }
  }, [resetForm]);

  useEffect(() => {
    if (!hasHydratedRegisterRef.current && !isDirty) return;
    const { password, confirm_password, ...safeValues } = watchedRegister || {};
    writeRegisterDraft({
      formValues: safeValues,
      selectedAccountType,
      selectedCountry,
      selectedState,
      selectedCity,
    });
  }, [
    isDirty,
    watchedRegister,
    selectedAccountType,
    selectedCountry,
    selectedState,
    selectedCity,
  ]);

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
      const client = api({ "x-skip-toast": "true" });
      const response = await client.get("/auth/location/auto-detect");
      const data = response.data?.data;
      if (!isMounted || !data) return;

      hasAutoDetectedLocation.current = true;

      if (data.countryName && data.countryCode && !selectedCountry) {
        const normalizedCountry = normalizeAutoDetectedCountry(data);
        setSelectedCountry(normalizedCountry);
        setValue("country", normalizedCountry.name, { shouldValidate: true });
        setValue("country_code", normalizedCountry.code, { shouldValidate: true });
        setValue("city_country_code", normalizedCountry.code, {
          shouldValidate: true,
        });
      }

      if (data.city && !selectedCity) {
        const normalizedCity = normalizeAutoDetectedCity(data);
        setSelectedCity(normalizedCity);
        setValue("city", normalizedCity.name, { shouldValidate: true });
        setValue("city_country_code", normalizedCity.countryCode, {
          shouldValidate: true,
        });
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
    };

    autoDetectLocation().catch(() => {});

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
        setSelectedState(null);
        setValue("state", "", { shouldValidate: true });
        setValue("state_short", "", { shouldValidate: true });
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        setValue("city_country_code", "", { shouldValidate: true });
        setValue("latitude", "", { shouldValidate: false });
        setValue("longitude", "", { shouldValidate: false });
        return;
      }

      const normalizedCountry = normalizeCountry(country);

      setSelectedCountry(normalizedCountry);
      setValue("country", normalizedCountry.name, { shouldValidate: true });
      setValue("country_code", normalizedCountry.code, { shouldValidate: true });

      setSelectedState(null);
      setValue("state", "", { shouldValidate: true });
      setValue("state_short", "", { shouldValidate: true });
      setSelectedCity(null);
      setValue("city", "", { shouldValidate: true });
      setValue("city_country_code", normalizedCountry.code || "", { shouldValidate: true });
      setValue("latitude", "", { shouldValidate: false });
      setValue("longitude", "", { shouldValidate: false });
    },
    [setValue]
  );

  const handleStateSelect = useCallback(
    (state) => {
      setHasManualLocationOverride(true);

      if (!state) {
        setSelectedState(null);
        setValue("state", "", { shouldValidate: true });
        setValue("state_short", "", { shouldValidate: true });
        setSelectedCity(null);
        setValue("city", "", { shouldValidate: true });
        return;
      }

      const normalized = {
        stateName: state.stateName || state.label || "",
        stateShort: state.stateShort || "",
      };

      setSelectedState(normalized);
      setValue("state", normalized.stateName, { shouldValidate: true });
      setValue("state_short", normalized.stateShort, { shouldValidate: true });

      setSelectedCity(null);
      setValue("city", "", { shouldValidate: true });
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

      const normalizedCity = normalizeSelectedCity(city, selectedCountry?.code);

      setSelectedCity(normalizedCity);
      setValue("city", normalizedCity.name, { shouldValidate: true });
      setValue("city_country_code", normalizedCity.countryCode, { shouldValidate: true });
      setValue("latitude", normalizedCity.latitude ?? "", { shouldValidate: false });
      setValue("longitude", normalizedCity.longitude ?? "", { shouldValidate: false });

      const currentState = getValues("state");
      if (!currentState?.trim() && normalizedCity.region) {
        const regionState = {
          stateName: normalizedCity.region,
          stateShort: "",
        };
        setSelectedState(regionState);
        setValue("state", regionState.stateName, { shouldValidate: true });
      }
    },
    [getValues, selectedCountry?.code, setValue]
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
      latitude: toNullableNumber(values.latitude),
      longitude: toNullableNumber(values.longitude),
      state: (values.state || "").trim() || undefined,
      state_short: (values.state_short || "").trim() || undefined,
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
      localStorage.setItem("email", values.email.toLowerCase().trim());
      localStorage.setItem("name", `${values.first_name} ${values.last_name}`);
      onNext();
      dispatch(reset());
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
    selectedState,
    selectedCity,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    termsHref,
    privacyHref,
  };
}
