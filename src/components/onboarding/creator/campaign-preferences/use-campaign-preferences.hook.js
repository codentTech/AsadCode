// use-campaign-preferences.hook.js
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setupCreatorCampaignPreferences } from "@/provider/features/creator-profile/creator-profile.slice";
import { getOnboardingEmail } from "@/common/utils/users.util";
import { useRouter } from "next/navigation";
import { Camera, DollarSign, Gift, Percent } from "lucide-react";

const ETHNICITY_OPTIONS = [
  "Asian",
  "Black or African descent",
  "Hispanic or Latino",
  "Middle Eastern or North African",
  "Native American or Indigenous",
  "Pacific Islander",
  "White",
  "Mixed",
  "Other",
  "Prefer not to say",
];

const validationSchema = Yup.object().shape({
  campaignTypes: Yup.array().min(1, "Select at least one campaign type").required(),
  languages: Yup.array().min(1, "Select at least one language").required(),

  ethnicity: Yup.mixed().test(
    "ethnicity",
    "Select a valid ethnicity option",
    (val) => val == null || val === "" || ETHNICITY_OPTIONS.includes(val)
  ),

  // require explicit selection
  inPersonOpportunities: Yup.boolean()
    .nullable()
    .required("Select an option")
    .typeError("Select an option"),

  // Shipping Address mandatory
  shippingAddress: Yup.object()
    .shape({
      street: Yup.string().trim().required("Address line 1 is required"),
      line2: Yup.string().trim(),
      line3: Yup.string().trim(),
      city: Yup.string().trim().required("City is required"),
      city_country_code: Yup.string().trim(),
      state: Yup.string().trim().required("State or Province is required"),
      zipCode: Yup.string().trim().required("Postal code is required"),
      country: Yup.string().trim().required("Country is required"),
      country_code: Yup.string().trim().required("Country is required"),
    })
    .required("Shipping address is required"),
});

export default function useCampaignPreferences({ onNext }) {
  const route = useRouter();
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const { isLoading: authLoading } = useSelector((state) => state.auth || {});

  /**
   * Campaign types list (logic side)
   */
  const campaignTypes = useMemo(
    () => [
      {
        id: "sponsored",
        label: "Sponsored Post",
        desc: "Get paid to post on your own platform",
        icon: DollarSign,
      },
      {
        id: "ugc",
        label: "UGC",
        desc: "Create content for brands to post on their platforms or in ads",
        icon: Camera,
      },
      {
        id: "gifted",
        label: "Gifted",
        desc: "Receive free products in exchange for content",
        icon: Gift,
      },
      {
        id: "affiliate",
        label: "Affiliate",
        desc: "Earn commission for driving sales",
        icon: Percent,
      },
    ],
    []
  );

  /**
   * Form
   */
  const {
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
      campaignTypes: [],
      languages: [],
      ethnicity: "",
      inPersonOpportunities: null,
      shippingAddress: {
        street: "",
        line2: "",
        line3: "",
        city: "",
        city_country_code: "",
        state: "",
        zipCode: "",
        country: "",
        country_code: "",
      },
    },
  });

  /**
   * Watched fields (hook exposes to UI)
   */
  const selectedCampaignTypes = watch("campaignTypes");
  const selectedLanguages = watch("languages");
  const selectedEthnicity = watch("ethnicity");
  const inPersonOpportunities = watch("inPersonOpportunities");
  const shippingAddress = watch("shippingAddress");

  /**
   * Country/City select UI state (logic)
   */
  const [countrySelection, setCountrySelection] = useState(null);
  const [citySelection, setCitySelection] = useState(null);

  const countryCode = countrySelection?.countryCode || shippingAddress?.country_code || "";

  /**
   * Sync local select objects from form values (for controlled selects)
   */
  useEffect(() => {
    if (shippingAddress?.country && shippingAddress?.country_code) {
      setCountrySelection((prev) =>
        prev?.countryCode === shippingAddress.country_code
          ? prev
          : {
              name: shippingAddress.country,
              countryCode: shippingAddress.country_code,
              code: shippingAddress.country_code,
            }
      );
    } else if (!shippingAddress?.country) {
      setCountrySelection(null);
    }
  }, [shippingAddress?.country, shippingAddress?.country_code]);

  useEffect(() => {
    if (shippingAddress?.city) {
      setCitySelection((prev) =>
        prev?.name === shippingAddress.city
          ? prev
          : {
              name: shippingAddress.city,
              cityName: shippingAddress.city,
              countryCode:
                shippingAddress?.city_country_code || shippingAddress?.country_code || "",
            }
      );
    } else {
      setCitySelection(null);
    }
  }, [shippingAddress?.city, shippingAddress?.city_country_code, shippingAddress?.country_code]);

  /**
   * Handlers
   */
  const toggleCampaignType = (type) => {
    const prev = getValues("campaignTypes") || [];
    const next = prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type];
    setValue("campaignTypes", next, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  const handleLanguagesChange = (languages) => {
    setValue("languages", languages, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleEthnicityChange = (ethnicity) => {
    const current = getValues("ethnicity");
    const next = current === ethnicity ? "" : ethnicity;
    setValue("ethnicity", next, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleInPersonChange = (value) => {
    setValue("inPersonOpportunities", value === "yes", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleShippingChange = (field, value) => {
    setValue(`shippingAddress.${field}`, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const handleCountrySelect = (country) => {
    if (!country) {
      setCountrySelection(null);

      setValue("shippingAddress.country", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.country_code", "", { shouldValidate: true, shouldDirty: true });

      setCitySelection(null);
      setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.city_country_code", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    const normalized = {
      name: country.countryName || country.label || country.name || "",
      countryCode: country.countryCode || country.value || country.code || "",
    };

    setCountrySelection(normalized);

    setValue("shippingAddress.country", normalized.name, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("shippingAddress.country_code", normalized.countryCode, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    // reset city when country changes
    setCitySelection(null);
    setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
    setValue("shippingAddress.city_country_code", normalized.countryCode, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleCitySelect = (city) => {
    if (!city) {
      setCitySelection(null);
      setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.city_country_code", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      return;
    }

    const normalized = {
      name: city.cityName || city.label || city.name || "",
      countryCode: city.countryCode || city.country || countryCode || "",
      cityName: city.cityName || city.label || city.name || "",
    };

    setCitySelection(normalized);

    setValue("shippingAddress.city", normalized.name, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("shippingAddress.city_country_code", normalized.countryCode, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Optional utility if you ever need to force re-sync from UI
  const refreshCountryCityFromForm = () => {
    const addr = getValues("shippingAddress") || {};
    if (addr.country && addr.country_code) {
      setCountrySelection({
        name: addr.country,
        countryCode: addr.country_code,
        code: addr.country_code,
      });
    }
    if (addr.city) {
      setCitySelection({
        name: addr.city,
        cityName: addr.city,
        countryCode: addr.city_country_code || addr.country_code || "",
      });
    }
  };

  /**
   * Submit
   */
  const onSubmit = async (values) => {
    const payload = {
      campaignTypes: values.campaignTypes,
      languages: values.languages,
      inPersonOpportunities: values.inPersonOpportunities,
      shippingAddress: values.shippingAddress,
    };
    if (values.ethnicity != null && String(values.ethnicity).trim() !== "") {
      payload.ethnicity = values.ethnicity;
    }

    const response = await dispatch(setupCreatorCampaignPreferences({ payload, email }));
    if (setupCreatorCampaignPreferences.fulfilled.match(response) && response.payload?.success) {
      onNext?.();
      resetForm();
      localStorage.removeItem("email");
      route.push("/login");
    }
  };

  return {
    // form
    handleSubmit,
    errors,
    onSubmit,
    isLoading: authLoading || isSubmitting,

    // ui data
    campaignTypes,
    ethnicityOptions: ETHNICITY_OPTIONS,

    // watched values
    selectedCampaignTypes,
    selectedLanguages,
    selectedEthnicity,
    inPersonOpportunities,
    shippingAddress,

    // select state
    countrySelection,
    citySelection,
    countryCode,

    // handlers
    toggleCampaignType,
    handleLanguagesChange,
    handleEthnicityChange,
    handleCountrySelect,
    handleCitySelect,
    handleInPersonChange,
    handleShippingChange,
    refreshCountryCityFromForm,
  };
}
