"use client";

import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BrandCampaignPreferences from "./brand/campaign-preferences/campaign-preferences.component";
import IdealCreator from "./brand/ideal-creator/ideal-creator.component";
import BrandProfile from "./brand/profile-setup/profile-setup.component";
import AccountType from "./components/account-type/account-type.component";
import EmailVerification from "./components/email-verification/email-verification";
import Register from "./components/register/register.component";
import CampaignPreferences from "./creator/campaign-preferences/campaign-preferences.component";
import ProfileSetup from "./creator/profile-setup/profile-setup.component";
import useOnboarding from "./use-onboarding.hook";

export default function Onboarding() {
  // const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const isCreatorMode = true;
  const dispatch = useDispatch();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  // Use onboarding status from API
  const { step: onboardingStep, role, loading, email } = useOnboarding();

  useEffect(() => {
    if (!loading && onboardingStep) {
      setCurrentStep(onboardingStep || 1);
      if (role) {
        setSelectedAccountType(role.toLowerCase());
        dispatch(setIsCreatorModeMode(role.toLowerCase() === "creator"));
      }
    }
  }, [onboardingStep, role, loading, dispatch]);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const completeOnboarding = () => {};

  const handleSelectMode = (type) => {
    setSelectedAccountType(type);
    dispatch(setIsCreatorModeMode(type === "creator"));
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
        return <Register onNext={nextStep} onBack={prevStep} email={email} />;
      case 3:
        return <EmailVerification onNext={nextStep} onBack={prevStep} email={email} />;
      case 4:
        return isCreatorMode ? (
          <ProfileSetup onNext={nextStep} onBack={prevStep} email={email} />
        ) : (
          <BrandProfile onNext={nextStep} onBack={prevStep} email={email} />
        );
      case 5:
        return isCreatorMode ? (
          <CampaignPreferences onNext={completeOnboarding} onBack={prevStep} email={email} />
        ) : (
          <BrandCampaignPreferences onNext={nextStep} onBack={prevStep} email={email} />
        );
      case 6:
        return (
          !isCreatorMode && (
            <IdealCreator onNext={completeOnboarding} onBack={prevStep} email={email} />
          )
        );
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
