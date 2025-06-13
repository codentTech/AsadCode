import { useState } from "react";
import AudienceRequirementsExperience from "./components/audience-requirements-experience/audience-requirements-experience";
import CampaignTypeNiche from "./components/campaign-type-niche.component/campaign-type-niche.component";
import Compensation from "./components/compensation/compensation";
import Description from "./components/description/description";
import Eligibility from "./components/eligibility/eligibility";
import Preview from "./components/preview/preview";

export default function useCreateCampaign() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const [campaignData, setCampaignData] = useState({
    campaignTitle: "",
    campaignTypes: [],
    otherCampaignType: "",
    niches: [],
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
        campaignImage: URL.createObjectURL(e.target.files[0]),
      }));
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
          />
        );
      case 5:
        return <Preview campaignData={campaignData} handleChange={handleChange} />;
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
  };
}
