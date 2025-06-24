"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AccountType from "../components/account-type/account-type.component";
import EmailVerification from "../components/email-verification/email-verification";
import SignUp from "../components/sign-up/sign-up.component";
import ProfileSetup from "../creator/profile-setup/profile-setup.component";
import BrandCampaignPreferences from "./campaign-preferences/campaign-preferences.component";
import BrandProfile from "./profile-setup/profile-setup.component";
import IdealCreator from "./ideal-creator/ideal-creator.component";
import CampaignPreferences from "../creator/campaign-preferences/campaign-preferences.component";

export default function BrandOnboardingFlow() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  const nextStep = () => {
    console.log(currentStep);
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const completeOnboarding = () => {
    // dispatch(setIsCreatorModeMode(selectedAccountType === "creator"));
  };

  const handleSelectMode = (type) => {
    setSelectedAccountType(type);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <AccountType
            selectedType={selectedAccountType}
            handleSelectMode={handleSelectMode}
            onNext={nextStep}
          />
        );
      case 2:
        return <SignUp onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <EmailVerification onNext={nextStep} onBack={prevStep} />;
      case 4:
        return isCreatorMode ? (
          <ProfileSetup onNext={nextStep} onBack={prevStep} />
        ) : (
          <BrandProfile onNext={nextStep} onBack={prevStep} />
        );
      case 5:
        return isCreatorMode ? (
          <CampaignPreferences onNext={completeOnboarding} onBack={prevStep} />
        ) : (
          <BrandCampaignPreferences onNext={nextStep} onBack={prevStep} />
        );
      case 6:
        return !isCreatorMode && <IdealCreator onNext={completeOnboarding} onBack={prevStep} />;
      default:
        return (
          <AccountType
            selectedType={selectedAccountType}
            handleSelectMode={handleSelectMode}
            onNext={nextStep}
          />
        );
    }
  };

  return <div className="min-h-screen">{renderStep()}</div>;
}
