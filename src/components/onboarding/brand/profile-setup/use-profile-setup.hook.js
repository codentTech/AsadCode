import { getOnboardingEmail } from "@/common/utils/users.util";
import { setupBrandProfile } from "@/provider/features/brand-profile/brand-profile.slice";
import { uploadSingleFile } from "@/provider/features/upload-file/upload-file.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { useSnackbar } from "notistack";
import COUNTRIES from "@/common/constants/countries.constant";

const validationSchema = Yup.object().shape({
  brandName: Yup.string().required("Brand name is required"),
  websiteUrl: Yup.string().url("Enter a valid URL").required("Website URL is required"),
  brandLogoUrl: Yup.string().nullable(),
  city: Yup.string().required("City is required"),
  country: Yup.string().required("Country is required"),
  companyDescription: Yup.string().required("Description is required").max(300),
});

export default function useBrandProfileSetup({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();
  const { enqueueSnackbar } = useSnackbar();
  const { isLoading } = useSelector((state) => state.brandProfile || {});
  const { uploadSingleFile: uploadState } = useSelector((state) => state.uploadFile);

  const [brandLogoPreview, setBrandLogoPreview] = useState(null);
  const [brandLogoUrl, setBrandLogoUrl] = useState(null);
  const [countrySelection, setCountrySelection] = useState(null);
  const [citySelection, setCitySelection] = useState(null);

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
      brandName: "",
      websiteUrl: "",
      brandLogoUrl: "",
      city: "",
      country: "",
      companyDescription: "",
    },
  });

  const brandLogo = watch("brandLogoUrl");
  const description = watch("companyDescription");
  const countryName = watch("country");
  const cityName = watch("city");

  useEffect(() => {
    if (countryName) {
      const match = COUNTRIES.find(
        (country) => country.label.toLowerCase() === countryName.toLowerCase()
      );

      setCountrySelection({
        name: countryName,
        countryCode: match?.code || "",
      });
    } else {
      setCountrySelection(null);
    }
  }, [countryName]);

  useEffect(() => {
    if (cityName && !citySelection?.cityName) {
      setCitySelection({
        cityName: cityName,
        name: cityName,
        countryCode: countrySelection?.countryCode || "",
      });
    } else if (!cityName) {
      setCitySelection(null);
    }
  }, [cityName, countrySelection?.countryCode]);

  const handleCountrySelect = useCallback(
    (country) => {
      if (!country) {
        setCountrySelection(null);
        setValue("country", "", { shouldValidate: true });
        setCitySelection(null);
        setValue("city", "", { shouldValidate: true });
        return;
      }

      const normalizedCountry = {
        name: country.countryName || country.label || country.name || "",
        countryCode: country.countryCode || country.value || country.code || "",
      };

      setCountrySelection(normalizedCountry);
      setValue("country", normalizedCountry.name, { shouldValidate: true });

      setCitySelection(null);
      setValue("city", "", { shouldValidate: true });
    },
    [setValue]
  );

  const handleCitySelect = useCallback(
    (city) => {
      if (!city) {
        setCitySelection(null);
        setValue("city", "", { shouldValidate: true });
        return;
      }

      const cityName = city.cityName || city.label || city.name || "";

      const normalizedCity = {
        cityName: cityName,
        name: cityName,
        countryCode: countrySelection?.countryCode,
      };

      setCitySelection(normalizedCity);
      setValue("city", cityName, { shouldValidate: true });
    },
    [countrySelection?.countryCode, setValue]
  );

  const previewCountryName = useMemo(
    () => countrySelection?.name || countryName || "Country",
    [countrySelection?.name, countryName]
  );

  const previewCityName = useMemo(
    () => citySelection?.cityName || citySelection?.name || cityName || "City",
    [citySelection?.cityName, citySelection?.name, cityName]
  );

  const handleLogoUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png";
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    input.click();
  };

  const handleRemoveLogo = () => {
    setValue("brandLogoUrl", "");
    setBrandLogoPreview(null);
    setBrandLogoUrl(null);
  };

  const handleFileUpload = async (file) => {
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      if (file.size <= 5 * 1024 * 1024) {
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setBrandLogoPreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Upload logo immediately
        const uploadedUrl = await uploadBrandLogo(file);
        if (uploadedUrl) {
          setBrandLogoUrl(uploadedUrl);
          setValue("brandLogoUrl", uploadedUrl);
        }
      } else {
        enqueueSnackbar("File size too large. Maximum 5MB allowed.", { variant: "error" });
      }
    } else {
      enqueueSnackbar("Invalid file type. Only JPG and PNG are allowed.", { variant: "error" });
    }
  };

  const uploadBrandLogo = async (file) => {
    const response = await dispatch(
      uploadSingleFile({
        file,
        folder: "brand",
      })
    );

    if (response.payload?.url) {
      return response.payload.url;
    }
    return null;
  };

  const onSubmit = async (values) => {
    const payload = {
      brandName: values.brandName,
      websiteUrl: values.websiteUrl,
      brandLogoUrl: brandLogoUrl || values.brandLogoUrl,
      city: values.city,
      country: values.country,
      companyDescription: values.companyDescription,
    };

    const response = await dispatch(setupBrandProfile({ payload, email }));
    if (response.payload && response.payload.success) {
      onNext && onNext();
      resetForm();
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    getValues,
    isLoading: isLoading || isSubmitting || uploadState.isLoading,
    isError: uploadState.isError,
    errorMessage: uploadState.message,
    // File upload
    handleLogoUpload,
    handleRemoveLogo,
    brandLogoPreview,
    brandLogo,
    // Location
    countrySelection,
    citySelection,
    handleCountrySelect,
    handleCitySelect,
    previewCountryName,
    previewCityName,
    // Form values
    description,
  };
}
