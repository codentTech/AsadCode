import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { createCampaign, resetCreateCampaign } from "@/provider/features/campaigns/campaigns.slice";
import AudienceRequirementsExperience from "./components/audience-requirements-experience/audience-requirements-experience";
import CampaignTypeNiche from "./components/campaign-type-niche.component/campaign-type-niche.component";
import Compensation from "./components/compensation/compensation";
import Description from "./components/description/description";
import Eligibility from "./components/eligibility/eligibility";
import Preview from "./components/preview/preview";

export default function useCreateCampaign() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Redux state
  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.campaigns?.createCampaign || {}
  );

  const [campaignData, setCampaignData] = useState({
    campaignTitle: "",
    campaignTypes: [],
    otherCampaignType: "",
    niches: [],
    deliverables: [],
    minCombinedFollowers: "",
    platformMinimums: {
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      pinterest: "",
    },
    compensationType: "fixed",
    budget: "",
    suggestedMin: "",
    suggestedMax: "",
    fixedPrice: "",
    productValue: "",
    commissionPercentage: "",
    productPrice: "",
    isRemote: true,
    inPersonRequired: false,
    locationDetails: "",
    requiredPlatforms: [],
    applicationDeadline: "",
    shortDescription: "",
    longDescription: "",
    campaignImage: null,
    hashtags: "",
    nonNegotiables: "",
    styleGuide: "",
    questions: [""],
    creatorCountry: "",
    creatorCity: "",
    countryRequirement: "none",
    cityRequirement: "none",
    minAge: "",
    maxAge: "",
    ageRequirement: "none",
    creatorGender: "",
    genderRequirement: "none",
    creatorLanguage: "",
    languageRequirement: "none",
    termsAgreed: false,
  });

  const steps = [
    "Deliverables & Niche",
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
      router.push("/campaigns");
      dispatch(resetCreateCampaign());
    }
  }, [isSuccess, router, dispatch]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "campaignType" || name === "niche" || name === "requiredPlatform") {
        const fieldNameMap = {
          campaignType: "campaignTypes",
          niche: "niches",
          requiredPlatform: "requiredPlatforms",
        };
        const fieldName = fieldNameMap[name];

        setCampaignData((prev) => {
          const currentValues = [...prev[fieldName]];
          return {
            ...prev,
            [fieldName]: checked
              ? [...currentValues, value]
              : currentValues.filter((item) => item !== value),
          };
        });
      } else {
        setCampaignData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      setCampaignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxToggle = (fieldName, value) => {
    setCampaignData((prev) => {
      const currentValues = [...prev[fieldName]];
      return {
        ...prev,
        [fieldName]: currentValues.includes(value)
          ? currentValues.filter((item) => item !== value)
          : [...currentValues, value],
      };
    });
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCampaignData((prev) => ({
        ...prev,
        campaignImage: e.target.files[0], // Store actual file, not URL
      }));
    }
  };

  // Add deliverable management functions
  const addDeliverable = (deliverable) => {
    setCampaignData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, deliverable],
    }));
  };

  const removeDeliverable = (index) => {
    setCampaignData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }));
  };

  // Add question management functions
  const addQuestion = () => {
    setCampaignData((prev) => ({
      ...prev,
      questions: [...prev.questions, ""],
    }));
  };

  const removeQuestion = (index) => {
    setCampaignData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const handleQuestionChange = (index, value) => {
    setCampaignData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = value;
      return {
        ...prev,
        questions: newQuestions,
      };
    });
  };

  // Transform data from frontend format to backend format
  const transformDataForAPI = (data) => {
    return {
      campaign_title: data.campaignTitle,
      campaign_type: data.campaignTypes[0] || "", // Take first campaign type as string
      niches: data.niches,
      deliverables: data.deliverables,
      min_combined_followers: data.minCombinedFollowers,
      platform_minimums: data.platformMinimums,
      compensation_type: data.compensationType,
      budget: data.budget ? parseFloat(data.budget) : null,
      suggested_min: data.suggestedMin ? parseFloat(data.suggestedMin) : null,
      suggested_max: data.suggestedMax ? parseFloat(data.suggestedMax) : null,
      fixed_price: data.fixedPrice ? parseFloat(data.fixedPrice) : null,
      product_value: data.productValue ? parseFloat(data.productValue) : null,
      commission_percentage: data.commissionPercentage ? parseFloat(data.commissionPercentage) : null,
      product_price: data.productPrice ? parseFloat(data.productPrice) : null,
      is_remote: data.isRemote,
      in_person_required: data.inPersonRequired,
      location_details: data.locationDetails,
      required_platforms: data.requiredPlatforms,
      application_deadline: data.applicationDeadline,
      short_description: data.shortDescription,
      long_description: data.longDescription,
      campaign_image: data.campaignImage,
      hashtags: data.hashtags,
      non_negotiables: data.nonNegotiables,
      style_guide: data.styleGuide,
      questions: data.questions.filter(q => q.trim() !== ""), // Remove empty questions
      creator_country: data.creatorCountry,
      creator_city: data.creatorCity,
      country_requirement: data.countryRequirement,
      city_requirement: data.cityRequirement,
      min_age: data.minAge ? parseInt(data.minAge) : null,
      max_age: data.maxAge ? parseInt(data.maxAge) : null,
      age_requirement: data.ageRequirement,
      creator_gender: data.creatorGender,
      gender_requirement: data.genderRequirement,
      creator_language: data.creatorLanguage,
      language_requirement: data.languageRequirement,
    };
  };

  // Handle final submission
  const handleSubmit = async () => {
    try {
      const apiData = transformDataForAPI(campaignData);
      await dispatch(createCampaign(apiData));
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <CampaignTypeNiche
            campaignData={campaignData}
            handleChange={handleChange}
            handleCheckboxToggle={handleCheckboxToggle}
            addDeliverable={addDeliverable}
            removeDeliverable={removeDeliverable}
          />
        );
      case 1:
        return (
          <AudienceRequirementsExperience
            campaignData={campaignData}
            setCampaignData={setCampaignData}
            handleChange={handleChange}
          />
        );
      case 2:
        return <Compensation campaignData={campaignData} handleChange={handleChange} />;
      case 3:
        return (
          <Eligibility
            campaignData={campaignData}
            handleChange={handleChange}
            handleCheckboxToggle={handleCheckboxToggle}
          />
        );
      case 4:
        return (
          <Description
            campaignData={campaignData}
            handleChange={handleChange}
            handleImageUpload={handleImageUpload}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            handleQuestionChange={handleQuestionChange}
          />
        );
      case 5:
        return (
          <Preview 
            campaignData={campaignData} 
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            isError={isError}
            message={message}
          />
        );
      default:
        return null;
    }
  };

  return {
    currentStep,
    steps,
    setCurrentStep,
    renderStep,
    showPreview,
    setShowPreview,
    campaignData,
    setCampaignData,
    handleChange,
    handleCheckboxToggle,
    handleImageUpload,
    handleSubmit,
    isLoading,
    isError,
    message,
  };
}