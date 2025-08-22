import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createCampaign, resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";

// Import step components
import CampaignTypeNiche from "./components/campaign-type-niche.component/campaign-type-niche.component";
import AudienceRequirementsExperience from "./components/audience-requirements-experience/audience-requirements-experience";
import Compensation from "./components/compensation/compensation";
import Eligibility from "./components/eligibility/eligibility";
import Description from "./components/description/description";
import Preview from "./components/preview/preview";

// Validation schema for campaign creation (temporarily disabled)
/*
const validationSchema = Yup.object().shape({
  campaign_title: Yup.string()
    .min(3, "Campaign title must be at least 3 characters")
    .max(255, "Campaign title cannot exceed 255 characters")
    .required("Campaign title is required"),

  campaign_type: Yup.string()
    .oneOf(["Sponsored Post", "UGC", "Gifted", "Affiliate"], "Please select a valid campaign type")
    .required("Campaign type is required"),

  niches: Yup.array()
    .min(1, "At least one niche is required")
    .of(Yup.string().required("Niche cannot be empty"))
    .required("Niches are required"),

  deliverables: Yup.array()
    .min(1, "At least one deliverable is required")
    .of(Yup.string().required("Deliverable cannot be empty")),

  min_combined_followers: Yup.string()
    .matches(/^\d+$/, "Must be a valid number")
    .min(1, "Minimum followers is required"),

  platform_minimums: Yup.object().shape({
    instagram: Yup.string().matches(/^\d*$/, "Must be a valid number"),
    tiktok: Yup.string().matches(/^\d*$/, "Must be a valid number"),
    youtube: Yup.string().matches(/^\d*$/, "Must be a valid number"),
    facebook: Yup.string().matches(/^\d*$/, "Must be a valid number"),
    pinterest: Yup.string().matches(/^\d*$/, "Must be a valid number"),
  }),

  compensation_type: Yup.string()
    .oneOf(["fixed", "commission", "gifted"], "Please select a valid compensation type")
    .required("Compensation type is required"),

  budget: Yup.number().when("compensation_type", {
    is: "fixed",
    then: (schema) =>
      schema
        .required("Budget is required for fixed compensation")
        .min(1, "Budget must be greater than 0"),
    otherwise: (schema) => schema.optional(),
  }),

  suggested_min: Yup.number().when("compensation_type", {
    is: "fixed",
    then: (schema) => schema.optional().min(0, "Suggested minimum cannot be negative"),
    otherwise: (schema) => schema.optional(),
  }),

  suggested_max: Yup.number()
    .when("compensation_type", {
      is: "fixed",
      then: (schema) => schema.optional().min(0, "Suggested maximum cannot be negative"),
      otherwise: (schema) => schema.optional(),
    })
    .test("max-greater-than-min", "Maximum must be greater than minimum", function (value) {
      const { suggested_min } = this.parent;
      if (value && suggested_min && value <= suggested_min) {
        return this.createError({ message: "Maximum must be greater than minimum" });
      }
      return true;
    }),

  fixed_price: Yup.number().when("compensation_type", {
    is: "fixed",
    then: (schema) => schema.optional().min(0, "Fixed price cannot be negative"),
    otherwise: (schema) => schema.optional(),
  }),

  product_value: Yup.number().when("campaign_type", {
    is: "Gifted",
    then: (schema) =>
      schema
        .required("Product value is required for gifted campaigns")
        .min(0, "Product value cannot be negative"),
    otherwise: (schema) => schema.optional(),
  }),

  commission_percentage: Yup.number().when("campaign_type", {
    is: "Affiliate",
    then: (schema) =>
      schema
        .required("Commission percentage is required for affiliate campaigns")
        .min(0, "Commission percentage cannot be negative")
        .max(100, "Commission percentage cannot exceed 100%"),
    otherwise: (schema) => schema.optional(),
  }),

  product_price: Yup.number().when("campaign_type", {
    is: "Affiliate",
    then: (schema) =>
      schema
        .required("Product price is required for affiliate campaigns")
        .min(0, "Product price cannot be negative"),
    otherwise: (schema) => schema.optional(),
  }),

  is_remote: Yup.boolean().required("Remote work preference is required"),

  in_person_required: Yup.boolean().required("In-person requirement is required"),

  location_details: Yup.string().when("in_person_required", {
    is: true,
    then: (schema) =>
      schema.required("Location details are required when in-person filming is required"),
    otherwise: (schema) => schema.optional(),
  }),

  required_platforms: Yup.array()
    .min(1, "At least one platform is required")
    .of(Yup.string().required("Platform cannot be empty"))
    .required("Required platforms are required"),

  application_deadline: Yup.date()
    .min(new Date(), "Application deadline must be in the future")
    .required("Application deadline is required"),

  short_description: Yup.string()
    .min(10, "Short description must be at least 10 characters")
    .max(500, "Short description cannot exceed 500 characters")
    .required("Short description is required"),

  long_description: Yup.string()
    .min(20, "Long description must be at least 20 characters")
    .max(2000, "Long description cannot exceed 2000 characters"),

  hashtags: Yup.string().max(500, "Hashtags cannot exceed 500 characters"),

  non_negotiables: Yup.string().max(1000, "Do's and Don'ts cannot exceed 1000 characters"),

  style_guide: Yup.string().max(1000, "Style guide cannot exceed 1000 characters"),

  questions: Yup.array()
    .of(
      Yup.string()
        .min(5, "Question must be at least 5 characters")
        .max(200, "Question cannot exceed 200 characters")
    )
    .max(10, "Maximum 10 questions allowed"),

  creator_country: Yup.string().max(100, "Country name cannot exceed 100 characters"),

  creator_city: Yup.string().max(100, "City name cannot exceed 100 characters"),

  country_requirement: Yup.string().oneOf(
    ["none", "preferred", "mandatory"],
    "Please select a valid requirement level"
  ),

  city_requirement: Yup.string().oneOf(
    ["none", "preferred", "mandatory"],
    "Please select a valid requirement level"
  ),

  min_age: Yup.number()
    .min(13, "Minimum age must be at least 13")
    .max(100, "Minimum age cannot exceed 100"),

  max_age: Yup.number()
    .min(13, "Minimum age must be at least 13")
    .max(100, "Maximum age cannot exceed 100")
    .test("max-greater-than-min", "Maximum age must be greater than minimum age", function (value) {
      const { min_age } = this.parent;
      if (value && min_age && value <= min_age) {
        return this.createError({ message: "Maximum age must be greater than minimum age" });
      }
      return true;
    }),

  age_requirement: Yup.string().oneOf(
    ["none", "preferred", "mandatory"],
    "Please select a valid requirement level"
  ),

  creator_gender: Yup.string().max(50, "Gender preference cannot exceed 50 characters"),

  gender_requirement: Yup.string().oneOf(
    ["none", "preferred", "mandatory"],
    "Please select a valid requirement level"
  ),

  creator_language: Yup.string().max(100, "Language preference cannot exceed 100 characters"),

  language_requirement: Yup.string().oneOf(
    ["none", "preferred", "mandatory"],
    "Please select a valid requirement level"
  ),
});
*/

export default function useCreateCampaign() {
  console.log("useCreateCampaign hook started");

  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Redux state
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.campaigns?.createCampaign || {}
  );

  // Simple form state using useState
  const [formData, setFormData] = useState({
    campaign_title: "",
    campaign_type: "",
    niches: [],
    deliverables: [],
    min_combined_followers: "",
    platform_minimums: {
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      pinterest: "",
    },
    compensation_type: "fixed",
    budget: "",
    suggested_min: "",
    suggested_max: "",
    fixed_price: "",
    product_value: "",
    commission_percentage: "",
    product_price: "",
    is_remote: true,
    in_person_required: false,
    location_details: "",
    required_platforms: [],
    application_deadline: "",
    short_description: "",
    long_description: "",
    campaign_image: null,
    hashtags: "",
    non_negotiables: "",
    style_guide: "",
    questions: [""],
    creator_country: "",
    creator_city: "",
    country_requirement: "none",
    city_requirement: "none",
    min_age: "",
    max_age: "",
    age_requirement: "none",
    creator_gender: "",
    gender_requirement: "none",
    creator_language: "",
    language_requirement: "none",
  });

  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  // Simple form methods
  const register = (fieldName) => {
    console.log("register called for field:", fieldName);
    return {
      name: fieldName,
      value: formData[fieldName] || "",
      onChange: (e) => {
        console.log("onChange called for field:", fieldName, "value:", e.target.value);
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
          ...prev,
          [name]: type === "checkbox" ? checked : value,
        }));
      },
    };
  };

  const setValue = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const watch = (fieldName) => {
    if (fieldName) {
      return formData[fieldName];
    }
    return formData;
  };

  const handleSubmit = (onSubmit) => (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const trigger = async () => {
    // Simple validation - check if required fields are filled
    const requiredFields = ["campaign_title", "campaign_type"];
    const newErrors = {};

    requiredFields.forEach((field) => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = { message: `${field.replace(/_/g, " ")} is required` };
      }
    });

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);

    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setFormData({
      campaign_title: "",
      campaign_type: "",
      niches: [],
      deliverables: [],
      min_combined_followers: "",
      platform_minimums: {
        instagram: "",
        tiktok: "",
        youtube: "",
        facebook: "",
        pinterest: "",
      },
      compensation_type: "fixed",
      budget: "",
      suggested_min: "",
      suggested_max: "",
      fixed_price: "",
      product_value: "",
      commission_percentage: "",
      product_price: "",
      is_remote: true,
      in_person_required: false,
      location_details: "",
      required_platforms: [],
      application_deadline: "",
      short_description: "",
      long_description: "",
      campaign_image: null,
      hashtags: "",
      non_negotiables: "",
      style_guide: "",
      questions: [""],
      creator_country: "",
      creator_city: "",
      country_requirement: "none",
      city_requirement: "none",
      min_age: "",
      max_age: "",
      age_requirement: "none",
      creator_gender: "",
      gender_requirement: "none",
      creator_language: "",
      language_requirement: "none",
    });
    setErrors({});
    setIsValid(false);
  };

  // Form is always ready with this approach
  const isFormReady = true;

  // Debug logging
  console.log("Hook values:", {
    isFormReady,
    currentStep,
    steps: steps.length,
    formDataKeys: Object.keys(formData),
    errors: Object.keys(errors),
    isValid,
  });

  // Reset form state when component unmounts or on success
  useEffect(() => {
    return () => {
      dispatch(resetCreateCampaign());
    };
  }, [dispatch]);

  // Redirect on successful campaign creation
  useEffect(() => {
    if (isSuccess) {
      router.push("/campaigns");
      dispatch(resetCreateCampaign());
    }
  }, [isSuccess, router, dispatch]);

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      if (!trigger) {
        console.error("Trigger function not available");
        return;
      }

      // Validate current step before proceeding
      const isStepValid = await trigger();
      if (!isStepValid) {
        return;
      }

      // If not on last step, proceed to next step
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        return;
      }

      // On final step, submit the campaign
      await dispatch(createCampaign(values));
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  // Handle step navigation
  const handleNextStep = async () => {
    if (!trigger) {
      console.error("Trigger function not available");
      return;
    }

    const isStepValid = await trigger();
    if (isStepValid) {
      setCurrentStep(Math.min(currentStep + 1, 5));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };

  // Handle form field changes
  const handleChange = (e) => {
    if (!setValue) {
      console.error("setValue function not available");
      return;
    }

    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setValue(name, checked);
    } else {
      setValue(name, value);
    }
  };

  // Handle checkbox toggle for arrays
  const handleCheckboxToggle = (fieldName, value) => {
    if (!setValue) {
      console.error("setValue function not available");
      return;
    }

    const currentValues = formData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value];
    setValue(fieldName, newValues);
  };

  // Handle deliverable management
  const addDeliverable = (deliverable) => {
    const currentDeliverables = formData.deliverables || [];
    setValue("deliverables", [...currentDeliverables, deliverable]);
  };

  const removeDeliverable = (index) => {
    const currentDeliverables = formData.deliverables || [];
    const newDeliverables = currentDeliverables.filter((_, i) => i !== index);
    setValue("deliverables", newDeliverables);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("campaign_image", file);
    }
  };

  // Handle question management
  const addQuestion = () => {
    const currentQuestions = formData.questions || [""];
    setValue("questions", [...currentQuestions, ""]);
  };

  const removeQuestion = (index) => {
    const currentQuestions = formData.questions || [""];
    if (currentQuestions.length > 1) {
      const newQuestions = currentQuestions.filter((_, i) => i !== index);
      setValue("questions", newQuestions);
    }
  };

  const handleQuestionChange = (index, value) => {
    const currentQuestions = formData.questions || [""];
    const newQuestions = [...currentQuestions];
    newQuestions[index] = value;
    setValue("questions", newQuestions);
  };

  // Handle style guide file upload
  const handleStyleGuideUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("style_guide_file", file);
    }
  };

  // Handle requirement level changes
  const handleRequirementToggle = (field, value) => {
    const requirementField = `${field}_requirement`;
    const newValue = formData[requirementField] === value ? "none" : value;
    setValue(requirementField, newValue);
  };

  // Steps configuration
  const steps = [
    "Deliverables & Niche",
    "Audience Requirements",
    "Compensation",
    "Eligibility",
    "Description",
    "Preview & Publish",
  ];

  console.log("Steps created:", steps);

  // Render step components using your original UI
  const renderStep = () => {
    console.log("renderStep called with currentStep:", currentStep);

    switch (currentStep) {
      case 0:
        return (
          <CampaignTypeNiche
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleChange={handleChange}
            handleCheckboxToggle={handleCheckboxToggle}
            addDeliverable={addDeliverable}
            removeDeliverable={removeDeliverable}
          />
        );
      case 1:
        return (
          <AudienceRequirementsExperience
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleChange={handleChange}
            handleCheckboxToggle={handleCheckboxToggle}
          />
        );
      case 2:
        return (
          <Compensation
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleChange={handleChange}
          />
        );
      case 3:
        return (
          <Eligibility
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleChange={handleChange}
            handleCheckboxToggle={handleCheckboxToggle}
            handleRequirementToggle={handleRequirementToggle}
          />
        );
      case 4:
        return (
          <Description
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            handleQuestionChange={handleQuestionChange}
            handleStyleGuideUpload={handleStyleGuideUpload}
          />
        );
      case 5:
        return <Preview watch={watch} errors={errors} isLoading={isLoading} onSubmit={onSubmit} />;
      default:
        return <div>Step not found</div>;
    }
  };

  const returnValue = {
    // Form state
    currentStep,
    steps,
    showPreview,
    setShowPreview,

    // Form methods
    register,
    handleSubmit,
    watch,
    errors,
    isValid,
    isFormReady,

    // Loading states
    isLoading,
    isError,
    message,

    // Step navigation
    handleNextStep,
    handlePrevStep,
    setCurrentStep,

    // Form submission
    onSubmit,

    // Field handlers
    handleChange,
    handleCheckboxToggle,
    addDeliverable,
    removeDeliverable,
    handleImageUpload,
    addQuestion,
    removeQuestion,
    handleQuestionChange,
    handleStyleGuideUpload,
    handleRequirementToggle,

    // Validation
    trigger,

    // Render step
    renderStep,
  };

  console.log("Hook returning:", {
    currentStep,
    stepsLength: steps?.length,
    isFormReady,
    renderStep: typeof renderStep,
  });

  return returnValue;
}
