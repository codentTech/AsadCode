import { resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

// Import step components
import { CAMPAIGN_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";
import AudienceRequirementsExperience from "./components/audience-requirements-experience/audience-requirements-experience";
import CampaignTypeNiche from "./components/campaign-type-niche.component/campaign-type-niche.component";
import Compensation from "./components/compensation/compensation";
import Description from "./components/description/description";
import Eligibility from "./components/eligibility/eligibility";
import Preview from "./components/preview/preview";

// ===== YUP VALIDATION SCHEMA =====
// Note: All number fields use .transform() to convert empty strings "" to undefined
// This prevents "NaN" errors when users clear input fields
const validationSchema = Yup.object().shape({
  // Step 0: Campaign Title & Niche
  campaign_title: Yup.string().required("Campaign title is required"),
  niches: Yup.array().min(1, "At least one niche is required"),

  // Step 1: Audience Requirements
  min_combined_followers: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .typeError("Minimum combined followers must be a valid number")
    .positive("Minimum combined followers must be a positive number")
    .required("Minimum combined followers is required"),
  required_platforms: Yup.array().min(1, "At least one platform is required"),

  // Step 2: Compensation (conditional validation)
  campaign_type: Yup.string().required("Campaign type is required"),
  compensation_type: Yup.string()
    .oneOf(
      ["PAID", "GIFTED_PRODUCT", "COMMISSION", ""],
      "Compensation type must be PAID, GIFTED_PRODUCT, COMMISSION or empty"
    )
    .required("Compensation type is required"),
  creator_compensation_option: Yup.string().when(["campaign_type", "compensation_type"], {
    is: (campaignType, compensationType) =>
      ["SPONSORED_POST", "UGC"].includes(campaignType) && compensationType === "PAID",
    then: (schema) => schema.required("Select how the creator will be compensated"),
    otherwise: (schema) => schema.nullable(),
  }),
  budget: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when(["campaign_type", "compensation_type"], {
      is: (campaignType, compensationType) =>
        ["SPONSORED_POST", "UGC"].includes(campaignType) && compensationType === "PAID",
      then: (schema) =>
        schema
          .typeError("Budget must be a valid number")
          .positive("Budget must be a positive number")
          .required(
            "Enter your planned campaign budget. This amount is not charged or publicly visible to creators. It is only used to track your planned budget and remaining spend."
          ),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_min: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when(["campaign_type", "creator_compensation_option"], {
      is: (campaignType, creatorCompOption) =>
        ["SPONSORED_POST", "UGC"].includes(campaignType) && creatorCompOption === "suggested",
      then: (schema) =>
        schema
          .typeError("Suggested minimum must be a valid number")
          .positive("Suggested minimum must be a positive number")
          .required("Suggested minimum is required when using a range"),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_max: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when(["campaign_type", "creator_compensation_option", "suggested_min"], {
      is: (campaignType, creatorCompOption) =>
        ["SPONSORED_POST", "UGC"].includes(campaignType) && creatorCompOption === "suggested",
      then: (schema) =>
        schema
          .typeError("Suggested maximum must be a valid number")
          .positive("Suggested maximum must be a positive number")
          .required("Suggested maximum is required when using a range")
          .min(Yup.ref("suggested_min"), "Maximum must be greater than minimum"),
      otherwise: (schema) => schema.nullable(),
    }),
  creator_fixed_price: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when(["campaign_type", "creator_compensation_option"], {
      is: (campaignType, creatorCompOption) =>
        ["SPONSORED_POST", "UGC"].includes(campaignType) && creatorCompOption === "set-price",
      then: (schema) =>
        schema
          .typeError("Fixed creator payment must be a valid number")
          .positive("Fixed creator payment must be a positive number")
          .required("Fixed creator payment is required when choosing set price"),
      otherwise: (schema) => schema.nullable(),
    }),
  product_value: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: "GIFTED",
      then: (schema) =>
        schema
          .typeError("Product value must be a valid number")
          .positive("Product value must be a positive number")
          .required("Product value is required for gifted campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),
  commission_percentage: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: "AFFILIATE",
      then: (schema) =>
        schema
          .typeError("Commission percentage must be a valid number")
          .positive("Commission percentage must be a positive number")
          .max(100, "Commission percentage cannot exceed 100%")
          .required("Commission percentage is required for affiliate campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),
  product_price: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: "AFFILIATE",
      then: (schema) =>
        schema
          .typeError("Product price must be a valid number")
          .positive("Product price must be a positive number")
          .required("Product price is required for affiliate campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Step 3: Eligibility (conditional validation)
  creator_country: Yup.string().when("countryRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("Country is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  creator_city: Yup.string().when("cityRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("City is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  min_age: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("ageRequirement", {
      is: "mandatory",
      then: (schema) =>
        schema
          .typeError("Minimum age must be a valid number")
          .min(13, "Minimum age must be at least 13")
          .max(100, "Minimum age cannot exceed 100")
          .required("Minimum age is required when age range is mandatory"),
      otherwise: (schema) => schema.nullable(),
    }),
  max_age: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when(["ageRequirement", "min_age"], {
      is: (ageRequirement, minAge) => ageRequirement === "mandatory",
      then: (schema) =>
        schema
          .typeError("Maximum age must be a valid number")
          .min(Yup.ref("min_age"), "Maximum age must be greater than minimum age")
          .max(100, "Maximum age cannot exceed 100")
          .required("Maximum age is required when age range is mandatory"),
      otherwise: (schema) => schema.nullable(),
    }),
  creator_gender: Yup.string().when("genderRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("Gender is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  creator_language: Yup.string().when("languageRequirement", {
    is: "mandatory",
    then: (schema) => schema.required("Language is required when set to mandatory"),
    otherwise: (schema) => schema.nullable(),
  }),
  application_deadline: Yup.date()
    .required("Application deadline is required")
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    }),

  // Step 4: Description
  short_description: Yup.string().required("Short description is required"),
  campaignImage: Yup.string()
    .nullable()
    .transform((value, originalValue) => {
      if (originalValue === "" || originalValue === null || originalValue === undefined) {
        return null;
      }
      return value;
    })
    .required("Campaign image is required"),

  // Step 5: Terms
  termsAgreed: Yup.boolean().oneOf([true], "You must agree to the Terms of Service"),
});

export default function useCreateCampaign(close) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Redux state
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.campaigns?.createCampaign || {}
  );

  // Default values for React Hook Form
  const defaultValues = {
    // Basic Campaign Info
    campaign_title: "",
    campaign_type: "",
    niches: [],
    deliverables: [],
    usageRights: "no_usage",
    usageRightsRequirement: "negotiable",
    exclusivityClause: "none",
    exclusivityClauseRequirement: "negotiable",
    creator_compensation_option: "",

    // Audience Requirements
    min_combined_followers: null,
    platformMinimums: {
      instagram: null,
      tiktok: null,
      youtube: null,
      facebook: null,
      pinterest: null,
    },
    required_platforms: [],

    // Compensation
    compensation_type: "PAID",
    budget: null,
    suggested_min: null,
    suggested_max: null,
    creator_fixed_price: null,
    product_value: null,
    commission_percentage: null,
    product_price: null,

    // Location & Eligibility
    locationOptions: [],
    creator_country: "",
    creator_city: "",
    countryRequirement: "none",
    cityRequirement: "none",
    min_age: null,
    max_age: null,
    ageRequirement: "none",
    creator_gender: "",
    genderRequirement: "none",
    creator_language: "",
    languageRequirement: "none",
    application_deadline: "",
    // Campaign Content
    short_description: "",
    long_description: "",
    campaignImage: "",
    hashtags: "",
    nonNegotiablesDo: [""],
    nonNegotiablesDont: [""],
    styleGuide: "",
    styleGuideFile: null,
    questions: [""],

    // Final Agreement
    termsAgreed: false,
  };

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onChange", // Only validate on submit/trigger, not on every change
  });

  const campaignData = watch();

  const getWatchedValue = useCallback((fieldName) => watch(fieldName), [watch]);

  // Steps configuration
  const steps = [
    "Campaign Title & Niche",
    "Audience Requirements",
    "Compensation",
    "Eligibility",
    "Description",
    "Preview & Publish",
  ];

  // Reset form state when component unmounts or on success
  useEffect(() => {
    return () => {
      dispatch(resetCreateCampaign());
    };
  }, [dispatch]);

  // Redirect on successful campaign creation
  useEffect(() => {
    if (isSuccess) {
      dispatch(resetCreateCampaign());
      reset(); // Reset form
    }
  }, [isSuccess, router, dispatch, reset]);

  // ===== EVENT HANDLERS =====

  // Main form field change handler
  const handleChange = useCallback(
    (event) => {
      if (!event?.target?.name) return;
      const { name, value, type, checked } = event.target;

      if (type === "checkbox") {
        setValue(name, Boolean(checked), { shouldDirty: true, shouldValidate: true });
        return;
      }

      setValue(name, value, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  // Checkbox toggle helper for arrays
  const handleCheckboxToggle = (fieldName, value) => {
    // Map field names to their actual form field names
    const fieldNameMap = {
      required_platforms: "required_platforms",
      niches: "niches",
      deliverables: "deliverables",
    };

    const actualFieldName = fieldNameMap[fieldName] || fieldName;
    const currentValues = [...(campaignData[actualFieldName] || [])];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setValue(actualFieldName, newValues);
  };

  // Requirement level toggle (for eligibility)
  const handleRequirementToggle = (field, value) => {
    // Map field names to their actual form field names
    const fieldNameMap = {
      country: "countryRequirement",
      city: "cityRequirement",
      age: "ageRequirement",
      gender: "genderRequirement",
      language: "languageRequirement",
    };

    const requirementField = fieldNameMap[field] || `${field}Requirement`;
    const newValue = campaignData[requirementField] === value ? "none" : value;
    setValue(requirementField, newValue);
  };

  // ===== ARRAY MANAGEMENT HELPERS =====

  // Deliverable management
  const addDeliverable = (deliverable) => {
    const currentDeliverables = [...(campaignData.deliverables || [])];
    setValue("deliverables", [...currentDeliverables, deliverable]);
  };

  const removeDeliverable = (index) => {
    const currentDeliverables = campaignData.deliverables.filter((_, i) => i !== index);
    setValue("deliverables", currentDeliverables);
  };

  // ===== API INTEGRATION =====

  // Transform frontend data to backend format (snake_case → snake_case for API)
  const transformDataForAPI = async (data) => {
    console.log(data);
    const trim = (value) => (typeof value === "string" ? value.trim() : "");
    const toNumber = (value) => {
      if (value === "" || value === null || value === undefined) return null;
      const parsed = Number(value);
      return Number.isNaN(parsed) ? null : parsed;
    };
    const toInteger = (value) => {
      if (value === "" || value === null || value === undefined) return null;
      const parsed = parseInt(value, 10);
      return Number.isNaN(parsed) ? null : parsed;
    };
    const sanitizeArray = (items) =>
      Array.isArray(items) ? items.filter((item) => item !== null && item !== undefined) : [];
    const sanitizeStrings = (items) =>
      sanitizeArray(items)
        .map((item) => (typeof item === "string" ? item.trim() : ""))
        .filter(Boolean);

    const transformedDeliverables = sanitizeArray(data.deliverables)
      .map((deliverable) => {
        if (typeof deliverable === "string") return deliverable;
        if (deliverable?.displayText) return deliverable.displayText;
        if (deliverable?.text) return deliverable.text;
        return "";
      })
      .filter(Boolean);

    const doItems = sanitizeStrings(data.nonNegotiablesDo);
    const dontItems = sanitizeStrings(data.nonNegotiablesDont);

    const commissionPercentage = Number(data.commission_percentage || 0);
    const productPrice = Number(data.product_price || 0);
    const commissionPayment = (commissionPercentage / 100) * productPrice;

    const creator_fee =
      data?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
      data?.campaign_type === CAMPAIGN_TYPE.UGC
        ? data.compensation_type == COMPENSATION_TYPE.PAID
          ? data.creator_fixed_price || 0
          : `${data.suggested_min || 0} - ${data.suggested_max || 0} (Range)` || 0
        : data.campaign_type === CAMPAIGN_TYPE.GIFTED
          ? data.product_value || 0
          : data.campaign_type === CAMPAIGN_TYPE.AFFILIATE
            ? commissionPayment || 0
            : 0;

    return {
      campaign_title: trim(data.campaign_title) || "",
      campaign_type: data.campaign_type || "",
      niches: sanitizeStrings(data.niches),
      deliverables: transformedDeliverables,
      usage_rights: data.usageRights || null,
      usage_rights_requirement: data.usageRightsRequirement || "negotiable",
      exclusivity_clause: data.exclusivityClause || null,
      exclusivity_clause_requirement: data.exclusivityClauseRequirement || "negotiable",
      application_deadline: data.application_deadline || null,

      min_combined_followers: toNumber(data.min_combined_followers),
      platform_minimums: {
        instagram: trim(data.platformMinimums?.instagram) || null,
        tiktok: trim(data.platformMinimums?.tiktok) || null,
        youtube: trim(data.platformMinimums?.youtube) || null,
        facebook: trim(data.platformMinimums?.facebook) || null,
        pinterest: trim(data.platformMinimums?.pinterest) || null,
      },
      required_platforms: sanitizeStrings(data.required_platforms),

      compensation_type: data.compensation_type || null,
      budget: toNumber(data.budget),
      suggested_min: toNumber(data.suggested_min),
      suggested_max: toNumber(data.suggested_max),
      creator_fixed_price: toNumber(data.creator_fixed_price),
      product_value: toNumber(data.product_value),
      commission_percentage: toNumber(data.commission_percentage),
      product_price: toNumber(data.product_price),

      location_options: data.locationOptions || "",
      creator_country: trim(data.creator_country),
      creator_city: trim(data.creator_city),
      country_requirement: data.countryRequirement || "none",
      city_requirement: data.cityRequirement || "none",
      min_age: toInteger(data.min_age),
      max_age: toInteger(data.max_age),
      age_requirement: data.ageRequirement || "none",
      creator_gender: trim(data.creator_gender),
      gender_requirement: data.genderRequirement || "none",
      creator_language: trim(data.creator_language),
      language_requirement: data.languageRequirement || "none",

      short_description: trim(data.short_description),
      long_description: trim(data.long_description),
      campaign_image: data.campaignImage || "",
      hashtags: trim(data.hashtags),
      non_negotiables_do: doItems,
      non_negotiables_dont: dontItems,
      style_guide: trim(data.styleGuide),
      style_guide_file: data.styleGuideFile || "",
      questions: sanitizeStrings(data.questions),

      creator_fee: Number(creator_fee),
    };
  };

  // ===== SUBMISSION & NAVIGATION =====

  // Handle final campaign submission
  const handleCampaignSubmit = async (data) => {
    // Transform and submit data
    const apiData = await transformDataForAPI(data);
    console.log(apiData);
    // const result = await dispatch(createCampaign(apiData));

    // if (createCampaign.fulfilled.match(result)) {
    //   close();
    //   setCurrentStep(0);
    // }
  };

  // Step navigation with validation
  const handleNextStep = async () => {
    // Define fields for each step
    const stepFields = {
      0: ["campaign_title", "niches"], // Campaign Title & Niche
      1: ["min_combined_followers", "required_platforms"], // Audience Requirements
      2: [
        "campaign_type",
        "budget",
        "suggested_min",
        "suggested_max",
        "creator_fixed_price",
        "product_value",
        "commission_percentage",
        "product_price",
        "creator_compensation_option",
      ], // Compensation
      3: [
        "creator_country",
        "creator_city",
        "min_age",
        "max_age",
        "creator_gender",
        "creator_language",
        "application_deadline",
      ], // Eligibility
      4: ["short_description", "campaignImage"], // Description
      5: ["termsAgreed"], // Terms
    };

    // Trigger validation for current step fields only
    const currentStepFields = stepFields[currentStep] || [];
    const isStepValid = await trigger(currentStepFields);

    if (isStepValid) {
      setCurrentStep(Math.min(currentStep + 1, steps.length - 1));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  // ===== COMPONENT RENDERING =====

  // Render current step component
  const renderStep = () => {
    const commonProps = {
      campaignData,
      handleChange,
      handleCheckboxToggle,
      errors,
      register,
      watch,
      setValue,
      getWatchedValue,
      control,
    };

    const stepComponents = {
      0: (
        <CampaignTypeNiche
          {...commonProps}
          addDeliverable={addDeliverable}
          removeDeliverable={removeDeliverable}
        />
      ),
      1: <AudienceRequirementsExperience {...commonProps} />,
      2: <Compensation {...commonProps} />,
      3: (
        <Eligibility
          {...commonProps}
          handleRequirementToggle={handleRequirementToggle}
          getWatchedValue={getWatchedValue}
        />
      ),
      4: <Description {...commonProps} />,
      5: (
        <Preview
          {...commonProps}
          handleSubmit={handleSubmit(handleCampaignSubmit)}
          isLoading={isLoading}
          isError={isError}
          message={message}
        />
      ),
    };

    return stepComponents[currentStep] || <div>Step not found</div>;
  };

  // ===== HOOK RETURN =====

  return {
    // Step Management
    currentStep,
    steps,
    setCurrentStep,
    showPreview,
    setShowPreview,
    renderStep,

    // React Hook Form
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    errors,

    // Campaign Data
    campaignData,
    getWatchedValue,

    // Event Handlers
    handleChange,
    handleCheckboxToggle,
    handleRequirementToggle,

    // Array Management
    addDeliverable,
    removeDeliverable,

    // Navigation
    handleNextStep,
    handlePrevStep,
    handleSubmit: handleSubmit(handleCampaignSubmit),

    // Redux State
    isLoading,
    isSuccess,
    isError,
    message,
  };
}
