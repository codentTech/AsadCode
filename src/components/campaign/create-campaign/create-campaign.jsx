import CustomStepper from "@/common/components/custom-stepper/custom-stepper";
import { useState } from "react";
import AudienceRequirementsExperience from "./components/audience-requirements -experience/audience-requirements-experience";
import CampaignTypeNiche from "./components/campaign-type-niche.component/campaign-type-niche.component";
import Compensation from "./components/compensation/compensation";
import Description from "./components/description/description";
import Logistics from "./components/logistics/logistics";
import Preview from "./components/preview/preview";
import Modal from "@/common/components/modal/modal.component";

export default function CampaignCreationWizard({ open, close }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  // Form state
  const [campaignData, setCampaignData] = useState({
    // Step 1: Campaign Type & Niche
    campaignTitle: "",
    campaignTypes: [],
    otherCampaignType: "",
    niches: [],

    // Step 2: Audience Requirements & Experience
    minCombinedFollowers: "",
    platformMinimums: {
      instagram: "",
      tiktok: "",
      youtube: "",
      facebook: "",
      pinterest: "",
    },

    // Step 3: Compensation
    compensationType: "fixed",
    budget: "",
    commissionPercentage: "",
    productPrice: "",

    // Step 4: Logistics
    isRemote: true,
    inPersonRequired: false,
    locationDetails: "",
    requiredPlatforms: [],
    applicationDeadline: "",

    // Step 5: Description
    shortDescription: "",
    longDescription: "",
    campaignImage: null,

    // Final Step
    termsAgreed: false,
  });

  const steps = [
    "Campaign Type & Niche",
    "Audience Requirements",
    "Compensation",
    "Logistics",
    "Description",
    "Preview & Publish",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "campaignType" || name === "niche" || name === "requiredPlatform") {
        // Handle multi-select options
        const fieldNameMap = {
          campaignType: "campaignTypes",
          niche: "niches",
          requiredPlatform: "requiredPlatforms",
        };

        const fieldName = fieldNameMap[name];

        setCampaignData((prev) => {
          const currentValues = [...prev[fieldName]];

          if (checked) {
            return { ...prev, [fieldName]: [...currentValues, value] };
          } else {
            return {
              ...prev,
              [fieldName]: currentValues.filter((item) => item !== value),
            };
          }
        });
      } else if (name.startsWith("platformMinimum.")) {
        // Handle platform-specific minimums
        const platform = name.split(".")[1];
        setCampaignData((prev) => ({
          ...prev,
          platformMinimums: {
            ...prev.platformMinimums,
            [platform]: value,
          },
        }));
      } else {
        // Handle regular checkboxes
        setCampaignData((prev) => ({ ...prev, [name]: checked }));
      }
    } else {
      // Handle regular inputs
      setCampaignData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxToggle = (fieldName, value) => {
    setCampaignData((prev) => {
      const currentValues = [...prev[fieldName]];

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [fieldName]: currentValues.filter((item) => item !== value),
        };
      } else {
        return { ...prev, [fieldName]: [...currentValues, value] };
      }
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
          <Logistics
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

  return (
    <Modal title="Create Campaign" show={open} onClose={close} size="lg" height="fixed">
      <div className="h-full w-full max-w-3xl mx-auto bg-white overflow-hidden">
        <CustomStepper
          steps={steps}
          activeStep={currentStep}
          setActiveStep={setCurrentStep}
          showPreview={showPreview}
          setShowPreview={setShowPreview}
          onStepClick={(index) => setCurrentStep(index)}
        >
          <div className="px-6 py-2">
            <h3 className="mb-2">{steps[currentStep]}</h3>

            {renderStep()}
          </div>
        </CustomStepper>
      </div>
    </Modal>
  );
}
