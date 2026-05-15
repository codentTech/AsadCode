"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";

const schema = yup.object().shape({
  account_name: yup.string().required("Account name is required"),
  admin_contact_name: yup.string().required("Admin contact name is required"),
  first_name: yup.string(), // Hidden field for API
  last_name: yup.string(), // Hidden field for API
  email: yup.string().email("Invalid email format").required("Email is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  country_code: yup.string(),
  city_country_code: yup.string(),
  account_type: yup.string().when("$isCreatorMode", {
    is: false,
    then: (schema) => schema.required("Account type is required"),
    otherwise: (schema) => schema,
  }),
  date_of_birth: yup
    .string()
    .optional()
    .test("dob-format", "Use a valid date (YYYY-MM-DD)", (value) => {
      if (value == null || value === "") return true;
      return /^\d{4}-\d{2}-\d{2}$/.test(value);
    }),
});

export default function usePersonalInformation() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    context: { isCreatorMode: isCreatorMode() },
    defaultValues: {
      account_name: "",
      admin_contact_name: "",
      first_name: "",
      last_name: "",
      email: "",
      city: "",
      country: "",
      country_code: "",
      city_country_code: "",
      account_type: "",
      date_of_birth: "",
    },
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      // Merge first_name and last_name into account_name for display
      const accountName = [user.first_name || "", user.last_name || ""]
        .filter(Boolean)
        .join(" ")
        .trim();
      setValue("account_name", accountName);

      // Admin Contact Name: This was the original first_name + last_name from signup
      // For now, we'll use the same merged value, but this might need to come from a different source
      const adminContactName = [user.first_name || "", user.last_name || ""]
        .filter(Boolean)
        .join(" ")
        .trim();
      setValue("admin_contact_name", adminContactName);

      // Keep hidden fields for API
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");

      if (user.date_of_birth) {
        const raw = String(user.date_of_birth);
        setValue("date_of_birth", raw.length >= 10 ? raw.slice(0, 10) : raw);
      } else {
        setValue("date_of_birth", "");
      }

      if (user.country) {
        const countryValue = {
          countryName: user.country,
          countryCode: user.country_code || user.country,
          phoneCode: user.phone_code || "",
        };
        setSelectedCountry(countryValue);
        setValue("country", user.country);
        setValue("country_code", user.country_code || user.country);
      }

      if (user.city) {
        const cityValue = {
          cityName: user.city,
          countryCode: user.city_country_code || user.country_code || user.country || "",
          region: user.city_region || "",
        };
        setSelectedCity(cityValue);
        setValue("city", user.city);
        setValue("city_country_code", user.city_country_code || user.country_code || "");
      }

      if (user.account_type) {
        setSelectedAccountType(user.account_type);
        setValue("account_type", user.account_type);
      }
    }
    setIsLoading(false);
  }, [setValue]);

  useEffect(() => {
    if (selectedAccountType) {
      setValue("account_type", selectedAccountType);
    }
  }, [selectedAccountType, setValue]);

  const displayEmail = watch("email");

  const onEmailUpdated = useCallback(
    (email) => {
      setValue("email", email);
    },
    [setValue],
  );

  const handleCountryChange = (country) => {
    if (!country) {
      setSelectedCountry(null);
      setValue("country", "");
      setValue("country_code", "");
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
      return;
    }
    setSelectedCountry(country);
    setValue("country", country.countryName || country.country || "");
    setValue("country_code", country.countryCode || "");
    if (selectedCity && selectedCity.countryCode !== country.countryCode) {
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
    }
  };

  const handleCityChange = (city) => {
    if (!city) {
      setSelectedCity(null);
      setValue("city", "");
      setValue("city_country_code", "");
      return;
    }
    setSelectedCity(city);
    setValue("city", city.cityName || city.city || "");
    setValue("city_country_code", city.countryCode || "");
  };

  const handleReset = () => {
    const user = getUser();
    if (user) {
      // Merge first_name and last_name into account_name for display
      const accountName = [user.first_name || "", user.last_name || ""]
        .filter(Boolean)
        .join(" ")
        .trim();
      setValue("account_name", accountName);

      // Admin Contact Name: This was the original first_name + last_name from signup
      const adminContactName = [user.first_name || "", user.last_name || ""]
        .filter(Boolean)
        .join(" ")
        .trim();
      setValue("admin_contact_name", adminContactName);

      // Keep hidden fields for API
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");

      if (user.date_of_birth) {
        const raw = String(user.date_of_birth);
        setValue("date_of_birth", raw.length >= 10 ? raw.slice(0, 10) : raw);
      } else {
        setValue("date_of_birth", "");
      }

      if (user.country) {
        const countryValue = {
          countryName: user.country,
          countryCode: user.country_code || user.country,
          phoneCode: user.phone_code || "",
        };
        setSelectedCountry(countryValue);
        setValue("country", user.country);
        setValue("country_code", user.country_code || user.country);
      }

      if (user.city) {
        const cityValue = {
          cityName: user.city,
          countryCode: user.city_country_code || user.country_code || user.country || "",
          region: user.city_region || "",
        };
        setSelectedCity(cityValue);
        setValue("city", user.city);
        setValue("city_country_code", user.city_country_code || user.country_code || "");
      }

      if (user.account_type) {
        setSelectedAccountType(user.account_type);
        setValue("account_type", user.account_type);
      }
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    // Split account_name into first_name and last_name for API
    const accountNameParts = (data.account_name || "").trim().split(/\s+/);
    const first_name = accountNameParts[0] || "";
    const last_name = accountNameParts.slice(1).join(" ") || "";

    // Prepare update data - exclude frontend-only fields and include split names
    const {
      email,
      country_code,
      city_country_code,
      account_name,
      admin_contact_name,
      ...restData
    } = data;
    const updateData = {
      ...restData,
      first_name,
      last_name,
    };
    if (!updateData.date_of_birth || String(updateData.date_of_birth).trim() === "") {
      delete updateData.date_of_birth;
    }

    const resultAction = await dispatch(updateUser(updateData));
    if (updateUser.fulfilled.match(resultAction)) {
      const payload = resultAction.payload;
      const userEntity = payload?.data;
      if (userEntity) {
        getUser(userEntity);
      }
    }
    setIsLoading(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
    displayEmail,
    showEmailModal,
    setShowEmailModal,
    onEmailUpdated,
    selectedCountry,
    selectedCity,
    selectedAccountType,
    setSelectedAccountType,
    handleCountryChange,
    handleCityChange,
    handleReset,
    onSubmit,
  };
}
