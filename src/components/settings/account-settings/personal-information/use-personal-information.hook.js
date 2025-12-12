"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { updateUser } from "@/provider/features/users/users.slice";

const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),
  last_name: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  date_of_birth: yup
    .date()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue == null) {
        return undefined;
      }
      return value;
    })
    .required("Date of birth is required")
    .max(new Date(), "Date of birth cannot be in the future"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  country_code: yup.string(),
  city_country_code: yup.string(),
  account_type: yup.string().when("$isCreatorMode", {
    is: false,
    then: (schema) => schema.required("Account type is required"),
    otherwise: (schema) => schema,
  }),
});

export default function usePersonalInformation() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    context: { isCreatorMode: isCreatorMode() },
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      date_of_birth: "",
      city: "",
      country: "",
      country_code: "",
      city_country_code: "",
      account_type: "",
    },
  });

  useEffect(() => {
    const user = getUser();
    if (user) {
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");
      const dateValue = user.date_of_birth
        ? user.date_of_birth.includes("T")
          ? user.date_of_birth.split("T")[0]
          : user.date_of_birth
        : "";
      setValue("date_of_birth", dateValue);

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
      setValue("first_name", user.first_name || "");
      setValue("last_name", user.last_name || "");
      setValue("email", user.email || "");
      const dateValue = user.date_of_birth
        ? user.date_of_birth.includes("T")
          ? user.date_of_birth.split("T")[0]
          : user.date_of_birth
        : "";
      setValue("date_of_birth", dateValue);

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
    const { email, country_code, city_country_code, ...updateData } = data;
    const result = await dispatch(updateUser(updateData)).unwrap();
    if (result.success) {
      setIsLoading(false);
      getUser(result?.data);
    }
    setIsLoading(false);
  };

  return {
    register,
    handleSubmit,
    errors,
    isLoading,
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
