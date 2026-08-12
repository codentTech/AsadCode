// use-campaign-preferences.hook.js
"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { setupCreatorCampaignPreferences } from "@/provider/features/creator-profile/creator-profile.slice";
import { getOnboardingEmail, getUser } from "@/common/utils/users.util";
import {
  clearCampaignPrefsDraft,
  mapCreatorProfileToCampaignPrefsForm,
  readCampaignPrefsDraft,
  writeCampaignPrefsDraft,
} from "@/common/utils/onboarding-flow.util";
import { useRouter } from "next/navigation";
import { Camera, DollarSign, Gift, Percent } from "lucide-react";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { CLEERCUT_USER_STORAGE_UPDATED } from "@/common/utils/creator-showcase.util";

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
      state: Yup.string().trim(),
      state_short: Yup.string().trim(),
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
  const hasHydratedRef = useRef(false);

  const { isLoading: authLoading } = useSelector((state) => state.auth || {});
  const creatorProfile = useSelector(
    (state) => state.onboarding?.onboardingStatus?.creatorProfile
  );

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
    formState: { errors, isSubmitting, isDirty },
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
        state_short: "",
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
  const watchedAll = watch();

  /**
   * Country/City select UI state (logic)
   */
  const [countrySelection, setCountrySelection] = useState(null);
  const [stateSelection, setStateSelection] = useState(null);
  const [citySelection, setCitySelection] = useState(null);

  const countryCode = countrySelection?.countryCode || shippingAddress?.country_code || "";

  useEffect(() => {
    if (hasHydratedRef.current) return;
    const draft = readCampaignPrefsDraft(email);
    const mapped = draft || mapCreatorProfileToCampaignPrefsForm(creatorProfile);
    if (!mapped) return;
    hasHydratedRef.current = true;
    resetForm(mapped);
  }, [email, creatorProfile, resetForm]);

  useEffect(() => {
    if (!email || !isDirty) return;
    writeCampaignPrefsDraft(email, {
      campaignTypes: watchedAll?.campaignTypes || [],
      languages: watchedAll?.languages || [],
      ethnicity: watchedAll?.ethnicity || "",
      inPersonOpportunities:
        typeof watchedAll?.inPersonOpportunities === "boolean"
          ? watchedAll.inPersonOpportunities
          : null,
      shippingAddress: watchedAll?.shippingAddress || {},
    });
  }, [email, isDirty, watchedAll]);

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
    if (shippingAddress?.state) {
      setStateSelection((prev) =>
        prev?.stateName === shippingAddress.state
          ? prev
          : {
              stateName: shippingAddress.state,
              stateShort: shippingAddress.state_short || "",
            }
      );
    } else {
      setStateSelection(null);
    }
  }, [shippingAddress?.state, shippingAddress?.state_short]);

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

      setStateSelection(null);
      setCitySelection(null);
      setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.city_country_code", "", {
        shouldValidate: true,
        shouldDirty: true,
      });
      setValue("shippingAddress.state", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.state_short", "", { shouldValidate: true, shouldDirty: true });
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

    setStateSelection(null);
    setValue("shippingAddress.state", "", { shouldValidate: true, shouldDirty: true });
    setValue("shippingAddress.state_short", "", { shouldValidate: true, shouldDirty: true });
    setCitySelection(null);
    setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
    setValue("shippingAddress.city_country_code", normalized.countryCode, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleStateSelect = (state) => {
    if (!state) {
      setStateSelection(null);
      setValue("shippingAddress.state", "", { shouldValidate: true, shouldDirty: true });
      setValue("shippingAddress.state_short", "", { shouldValidate: true, shouldDirty: true });
      setCitySelection(null);
      setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
      return;
    }

    const normalized = {
      stateName: state.stateName || state.label || "",
      stateShort: state.stateShort || "",
    };

    setStateSelection(normalized);
    setValue("shippingAddress.state", normalized.stateName, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue("shippingAddress.state_short", normalized.stateShort, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

    setCitySelection(null);
    setValue("shippingAddress.city", "", { shouldValidate: true, shouldDirty: true });
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

    const currentState = getValues("shippingAddress.state");
    if (!currentState && city.region) {
      setStateSelection({
        stateName: city.region,
        stateShort: "",
      });
      setValue("shippingAddress.state", city.region, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
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
      const updatedUser = response.payload?.data;
      if (typeof window !== "undefined") {
        const existing = getUser() || {};
        const nextUser = {
          ...existing,
          ...(updatedUser || {}),
          onboarding_step: updatedUser?.onboarding_step ?? ONBOARDING_STEPS.COMPLETED,
        };
        localStorage.setItem("user", JSON.stringify(nextUser));
        window.dispatchEvent(new Event(CLEERCUT_USER_STORAGE_UPDATED));
      }
      clearCampaignPrefsDraft(email);
      onNext?.();
      resetForm();
      localStorage.removeItem("email");
      route.push("/campaign");
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
    stateSelection,
    citySelection,
    countryCode,

    // handlers
    toggleCampaignType,
    handleLanguagesChange,
    handleEthnicityChange,
    handleCountrySelect,
    handleStateSelect,
    handleCitySelect,
    handleInPersonChange,
    handleShippingChange,
    refreshCountryCityFromForm,
  };
}
