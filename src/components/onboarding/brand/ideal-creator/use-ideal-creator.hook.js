import { getOnboardingEmail } from "@/common/utils/users.util";
import {
  FOLLOWER_OPTIONS,
  IDEAL_CREATOR_AGE_RANGES,
  IDEAL_CREATOR_GENDER_OPTIONS,
  PLATFORM_OPTIONS,
} from "@/common/constants/options.constant";
import COUNTRIES from "@/common/constants/countries.constant";
import { setupBrandIdealCreator } from "@/provider/features/brand-profile/brand-profile.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  min_followers: Yup.string().required("Minimum followers is required"),
  gender: Yup.array().min(1, "Select at least one gender"),
  countries: Yup.array().min(1, "Select at least one country"),
  cities: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required(),
        countryCode: Yup.string().required(),
      })
    )
    .optional(),
  age_ranges: Yup.array().min(1, "Select at least one age range"),
  platforms: Yup.array().min(1, "Select at least one platform"),
});

export default function useIdealCreator({ onNext }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const { isLoading } = useSelector((state) => state.brandProfile || {});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
    watch,
    reset: resetForm,
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      min_followers: "",
      gender: [],
      countries: [],
      cities: [],
      age_ranges: [],
      platforms: [],
    },
  });

  const minFollowers = watch("min_followers");
  const selectedGender = watch("gender");
  const selectedCountries = watch("countries");
  const selectedCities = watch("cities") || [];
  const selectedAgeRanges = watch("age_ranges");
  const selectedPlatforms = watch("platforms");

  const [countrySelectValue, setCountrySelectValue] = useState(null);
  const [citySelectValue, setCitySelectValue] = useState(null);

  const selectedCountryDetails = useMemo(() => {
    if (!Array.isArray(selectedCountries)) return [];
    return selectedCountries
      .map((code) => {
        const countryMeta = COUNTRIES.find(
          (country) => country.code.toUpperCase() === String(code).toUpperCase(),
        );
        return {
          code,
          name: countryMeta?.label || code,
        };
      })
      .filter((country) => Boolean(country.code));
  }, [selectedCountries]);

  const allowedCountryCodes = useMemo(
    () => selectedCountryDetails.map((country) => String(country.code).toUpperCase()),
    [selectedCountryDetails],
  );

  const primaryCountryCode = selectedCountryDetails[0]?.code || null;

  const handleCountrySelect = useCallback(
    (country) => {
      if (!country) {
        setCountrySelectValue(null);
        return;
      }

      const code = country.countryCode || country.value || country.code || "";
      if (!code) return;

      const normalizedCode = String(code).toUpperCase();
      const existing = selectedCountries || [];

      if (existing.includes(normalizedCode)) {
        setCountrySelectValue(null);
        return;
      }

      const updated = [...existing, normalizedCode];
      setValue("countries", updated, { shouldValidate: true });
      setCountrySelectValue(null);
    },
    [selectedCountries, setValue],
  );

  const handleCountryRemove = useCallback(
    (code) => {
      const updated = (selectedCountries || []).filter(
        (existingCode) => existingCode.toUpperCase() !== String(code).toUpperCase(),
      );
      setValue("countries", updated, { shouldValidate: true });

      if (
        citySelectValue?.countryCode &&
        citySelectValue.countryCode.toUpperCase() === String(code).toUpperCase()
      ) {
        setCitySelectValue(null);
      }

      if (Array.isArray(selectedCities) && selectedCities.length) {
        const filteredCities = selectedCities.filter(
          (city) => city.countryCode?.toUpperCase() !== String(code).toUpperCase(),
        );
        if (filteredCities.length !== selectedCities.length) {
          setValue("cities", filteredCities, { shouldValidate: true });
        }
      }
    },
    [citySelectValue?.countryCode, selectedCities, selectedCountries, setValue],
  );

  const handleCitySelect = useCallback(
    (city) => {
      if (!city) {
        setCitySelectValue(null);
        return;
      }

      const name = city.cityName || city.label || city.name || "";
      const resolvedCountryCode =
        city.countryCode || city.country || citySelectValue?.countryCode || primaryCountryCode || "";
      const normalizedCountryCode = resolvedCountryCode
        ? String(resolvedCountryCode).toUpperCase()
        : "";
      const normalizedCity = {
        name,
        cityName: name,
        countryCode: normalizedCountryCode,
      };

      const existingCities = Array.isArray(selectedCities) ? [...selectedCities] : [];
      const alreadyExists = existingCities.some(
        (existingCity) =>
          existingCity.name.toLowerCase() === normalizedCity.name.toLowerCase() &&
          (existingCity.countryCode || "") === normalizedCountryCode,
      );

      if (!alreadyExists) {
        setValue("cities", [...existingCities, normalizedCity], { shouldValidate: true });
      }

      setCitySelectValue(null);
    },
    [citySelectValue?.countryCode, primaryCountryCode, selectedCities, setValue],
  );

  useEffect(() => {
    if (!allowedCountryCodes.length) {
      if (citySelectValue) {
        setCitySelectValue(null);
      }
      if (Array.isArray(selectedCities) && selectedCities.length) {
        setValue("cities", [], { shouldValidate: true });
      }
      return;
    }

    if (
      citySelectValue?.countryCode &&
      !allowedCountryCodes.includes(citySelectValue.countryCode.toUpperCase())
    ) {
      setCitySelectValue(null);
    }

    if (Array.isArray(selectedCities) && selectedCities.length) {
      const filtered = selectedCities.filter((city) =>
        city.countryCode ? allowedCountryCodes.includes(city.countryCode.toUpperCase()) : true,
      );
      if (filtered.length !== selectedCities.length) {
        setValue("cities", filtered, { shouldValidate: true });
      }
    }
  }, [allowedCountryCodes, citySelectValue, selectedCities, setValue]);

  const handleCityRemove = useCallback(
    (cityToRemove) => {
      const filtered = selectedCities.filter(
        (city) =>
          !(
            city.name === cityToRemove.name &&
            (city.countryCode || "") === (cityToRemove.countryCode || "")
          ),
      );
      setValue("cities", filtered, { shouldValidate: true });
      if (
        citySelectValue?.name === cityToRemove.name &&
        citySelectValue?.countryCode === cityToRemove.countryCode
      ) {
        setCitySelectValue(null);
      }
    },
    [citySelectValue?.countryCode, citySelectValue?.name, selectedCities, setValue],
  );

  const toggleSelection = useCallback(
    (item, field) => {
      const prev = getValues(field) || [];
      if (prev.includes(item)) {
        setValue(
          field,
          prev.filter((i) => i !== item),
          { shouldValidate: true },
        );
      } else {
        setValue(field, [...prev, item], { shouldValidate: true });
      }
    },
    [getValues, setValue],
  );

  const onSubmit = async (values) => {
    try {
      const normalizedCities = Array.isArray(values.cities)
        ? values.cities.map((city) => ({
            name: city.name,
            countryCode: city.countryCode,
          }))
        : [];

      const payload = {
        min_followers: values.min_followers,
        gender: values.gender,
        countries: values.countries,
        cities: normalizedCities,
        city: normalizedCities[0]?.name || undefined,
        age_ranges: values.age_ranges,
        platforms: values.platforms,
      };
      const response = await dispatch(setupBrandIdealCreator({ payload, email }));
      if (response.payload && response.payload.success) {
        onNext && onNext();
        resetForm();
        localStorage.removeItem("email");
        router.push("/login");
      }
    } catch (error) {
      console.error("Form submission error:", error.message);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    setValue,
    isLoading: isLoading || isSubmitting,
    minFollowers,
    selectedGender,
    selectedCountries,
    selectedCities,
    selectedAgeRanges,
    selectedPlatforms,
    countrySelectValue,
    citySelectValue,
    selectedCountryDetails,
    allowedCountryCodes,
    primaryCountryCode,
    handleCountrySelect,
    handleCountryRemove,
    handleCitySelect,
    handleCityRemove,
    toggleSelection,
    genderOptions: IDEAL_CREATOR_GENDER_OPTIONS,
    ageRanges: IDEAL_CREATOR_AGE_RANGES,
    platforms: PLATFORM_OPTIONS.map((platform) => ({
      id: platform.value,
      label: platform.label,
    })),
    followerRanges: FOLLOWER_OPTIONS,
  };
}
