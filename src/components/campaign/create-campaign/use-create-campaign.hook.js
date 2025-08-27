import { createCampaign, resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

// Import step components
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
  budget: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: (val) => ["Sponsored Post", "UGC"].includes(val),
      then: (schema) =>
        schema
          .typeError("Budget must be a valid number")
          .positive("Budget must be a positive number")
          .required("Total budget is required for sponsored posts and UGC campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_min: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: (val) => ["Sponsored Post", "UGC"].includes(val),
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
  suggested_max: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: (val) => ["Sponsored Post", "UGC"].includes(val),
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
  fixed_price: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: (val) => ["Sponsored Post", "UGC"].includes(val),
      then: (schema) => schema.nullable(),
      otherwise: (schema) => schema.nullable(),
    }),
  product_value: Yup.number()
    .transform((value, originalValue) => {
      return originalValue === "" ? undefined : value;
    })
    .when("campaign_type", {
      is: "Gifted",
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
      is: "Affiliate",
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
      is: "Affiliate",
      then: (schema) =>
        schema
          .typeError("Product price must be a valid number")
          .positive("Product price must be a positive number")
          .required("Product price is required for affiliate campaigns"),
      otherwise: (schema) => schema.nullable(),
    }),

  // Step 3: Eligibility (conditional validation)
  location_details: Yup.string().when("inPersonRequired", {
    is: true,
    then: (schema) => schema.required("Location details are required for in-person campaigns"),
    otherwise: (schema) => schema.nullable(),
  }),
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

  // Step 4: Description
  short_description: Yup.string().required("Short description is required"),

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
    campaignTypes: [], // For backward compatibility
    otherCampaignType: "",
    niches: [],
    deliverables: [],
    applicationDeadline: "",

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
    compensationType: "fixed",
    budget: null,
    suggested_min: null,
    suggested_max: null,
    fixed_price: null,
    product_value: null,
    commission_percentage: null,
    product_price: null,

    // Location & Eligibility
    isRemote: true,
    inPersonRequired: false,
    location_details: "",
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

    // Campaign Content
    short_description: "",
    long_description: "",
    campaignImage: null,
    hashtags: "",
    nonNegotiables: "",
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
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues,
    mode: "onChange", // Only validate on submit/trigger, not on every change
  });

  // Watch all form values (replaces campaignData state)
  const campaignData = watch();

  // Steps configuration
  const steps = [
    "Campaign Title & Niche",
    "Audience Requirements",
    "Campaign Type & Compensation",
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
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      // Handle array checkboxes (multi-select)
      if (name === "campaignType" || name === "niche" || name === "required_platforms") {
        const fieldNameMap = {
          campaignType: "campaignTypes",
          niche: "niches",
          required_platforms: "required_platforms",
        };
        const fieldName = fieldNameMap[name];
        const currentValues = [...(campaignData[fieldName] || [])];
        const newValues = checked
          ? [...currentValues, value]
          : currentValues.filter((item) => item !== value);
        setValue(fieldName, newValues);
      } else {
        // Handle single checkboxes
        setValue(name, checked);
      }
    } else {
      // Handle regular inputs
      setValue(name, value);
    }
  };

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

  // File upload handlers
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("campaignImage", file);
    }
  };

  const handleStyleGuideUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("styleGuideFile", file);
    }
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

  // Question management
  const addQuestion = () => {
    const currentQuestions = [...(campaignData.questions || [""]), ""];
    setValue("questions", currentQuestions);
  };

  const removeQuestion = (index) => {
    if ((campaignData.questions || []).length > 1) {
      const currentQuestions = (campaignData.questions || []).filter((_, i) => i !== index);
      setValue("questions", currentQuestions);
    }
  };

  const handleQuestionChange = (index, value) => {
    const newQuestions = [...(campaignData.questions || [""])];
    newQuestions[index] = value;
    setValue("questions", newQuestions);
  };

  // ===== API INTEGRATION =====

  // Transform frontend data to backend format (snake_case → snake_case for API)
  const transformDataForAPI = async (data) => {
    return {
      // Basic Campaign Info
      campaign_title: data.campaign_title?.trim() || "",
      campaign_type: data.campaign_type || data.campaignTypes?.[0] || "",
      niches: data.niches || [],
      deliverables: data.deliverables || [],
      application_deadline: data.applicationDeadline || null,

      // Audience Requirements
      min_combined_followers: data.min_combined_followers?.toString() || "0",
      platform_minimums: {
        instagram: data.platformMinimums?.instagram || "",
        tiktok: data.platformMinimums?.tiktok || "",
        youtube: data.platformMinimums?.youtube || "",
        facebook: data.platformMinimums?.facebook || "",
        pinterest: data.platformMinimums?.pinterest || "",
      },
      required_platforms: data.required_platforms || [],

      // Compensation
      compensation_type: data.compensationType || "fixed",
      budget: data.budget ? parseFloat(data.budget) : null,
      suggested_min: data.suggested_min ? parseFloat(data.suggested_min) : null,
      suggested_max: data.suggested_max ? parseFloat(data.suggested_max) : null,
      fixed_price: data.fixed_price ? parseFloat(data.fixed_price) : null,
      product_value: data.product_value ? parseFloat(data.product_value) : null,
      commission_percentage: data.commission_percentage
        ? parseFloat(data.commission_percentage)
        : null,
      product_price: data.product_price ? parseFloat(data.product_price) : null,

      // Location & Eligibility
      is_remote: Boolean(data.isRemote),
      in_person_required: Boolean(data.inPersonRequired),
      location_details: data.location_details?.trim() || "",
      creator_country: data.creator_country?.trim() || "",
      creator_city: data.creator_city?.trim() || "",
      country_requirement: data.countryRequirement || "none",
      city_requirement: data.cityRequirement || "none",
      min_age: data.min_age ? parseInt(data.min_age) : null,
      max_age: data.max_age ? parseInt(data.max_age) : null,
      age_requirement: data.ageRequirement || "none",
      creator_gender: data.creator_gender?.trim() || "",
      gender_requirement: data.genderRequirement || "none",
      creator_language: data.creator_language?.trim() || "",
      language_requirement: data.languageRequirement || "none",

      // Campaign Content
      short_description: data.short_description?.trim() || "",
      long_description: data.long_description?.trim() || "",
      campaign_image: data.campaignImage,
      hashtags: data.hashtags?.trim() || "",
      non_negotiables: data.nonNegotiables?.trim() || "",
      style_guide: data.styleGuide?.trim() || "",
      style_guide_file: data.styleGuideFile,
      questions: (data.questions || []).filter((q) => q.trim() !== ""),
    };
  };

  // ===== SUBMISSION & NAVIGATION =====

  // Handle final campaign submission
  const handleCampaignSubmit = async (data) => {
    // Transform and submit data
    const apiData = await transformDataForAPI(data);
    console.log("Submitting campaign data:", apiData);

    const result = await dispatch(createCampaign(apiData));

    if (createCampaign.fulfilled.match(result)) {
      close();
    }
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
        "fixed_price",
        "product_value",
        "commission_percentage",
        "product_price",
      ], // Compensation
      3: [
        "location_details",
        "creator_country",
        "creator_city",
        "min_age",
        "max_age",
        "creator_gender",
        "creator_language",
      ], // Eligibility
      4: ["short_description"], // Description
      5: ["termsAgreed"], // Terms
    };

    // Trigger validation for current step fields only
    const currentStepFields = stepFields[currentStep] || [];
    const isStepValid = await trigger(currentStepFields);

    console.log(`Step ${currentStep} validation:`, {
      fields: currentStepFields,
      isValid: isStepValid,
      errors: Object.keys(errors).filter((key) => currentStepFields.includes(key)),
    });

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
      3: <Eligibility {...commonProps} handleRequirementToggle={handleRequirementToggle} />,
      4: (
        <Description
          {...commonProps}
          handleImageUpload={handleImageUpload}
          handleStyleGuideUpload={handleStyleGuideUpload}
          addQuestion={addQuestion}
          removeQuestion={removeQuestion}
          handleQuestionChange={handleQuestionChange}
        />
      ),
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

    // Event Handlers
    handleChange,
    handleCheckboxToggle,
    handleImageUpload,
    handleStyleGuideUpload,
    handleRequirementToggle,

    // Array Management
    addDeliverable,
    removeDeliverable,
    addQuestion,
    removeQuestion,
    handleQuestionChange,

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
