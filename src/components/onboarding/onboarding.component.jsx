"use client";

import BrandCampaignPreferences from "./brand/campaign-preferences/campaign-preferences.component";
import IdealCreator from "./brand/ideal-creator/ideal-creator.component";
import BrandProfile from "./brand/profile-setup/profile-setup.component";
import AccountType from "./components/account-type/account-type.component";
import EmailVerification from "./components/email-verification/email-verification";
import Register from "./components/register/register.component";
import CampaignPreferences from "./creator/campaign-preferences/campaign-preferences.component";
import ProfileSetup from "./creator/profile-setup/profile-setup.component";
import CreatorApplication from "./creator/creator-application/creator-application.component";
import CreatorApplicationConfirmation from "./creator/creator-application-confirmation/creator-application-confirmation.component";
import useOnboarding from "./use-onboarding.hook";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import invitesService from "@/provider/features/invites/invites.service";
import FullPageLoader from "@/common/components/full-page-loader/full-page-loader.component";
import AccessDenied from "@/app/components/access-denied.component";

export default function Onboarding() {
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get("token");
  const [showApplicationConfirmation, setShowApplicationConfirmation] = useState(false);
  const [showCreatorApplication, setShowCreatorApplication] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [hasValidatedToken, setHasValidatedToken] = useState(false);

  const {
    currentStep,
    selectedAccountType,
    isCreatorMode,
    nextStep,
    prevStep,
    completeOnboarding,
    handleSelectMode,
  } = useOnboarding();

  // Validate invite token if present
  useEffect(() => {
    const validateToken = async () => {
      if (inviteToken) {
        setIsValidatingToken(true);
        setTokenError(null);
        setHasValidatedToken(false);
        try {
          const response = await invitesService.validateTokenOnly(inviteToken);
          if (response.success && response.data?.valid) {
            setIsTokenValid(true);
          } else {
            setIsTokenValid(false);
            setTokenError(response.message || "Invalid or expired invite token");
          }
        } catch (error) {
          setIsTokenValid(false);
          setTokenError(error.response?.data?.message || "Invalid or expired invite token");
        } finally {
          setIsValidatingToken(false);
          setHasValidatedToken(true);
        }
      } else {
        setIsTokenValid(false);
        setHasValidatedToken(true);
      }
    };

    validateToken();
  }, [inviteToken]);

  // Check if we should show the creator application form
  // This happens when:
  // 1. Creator mode is selected
  // 2. No invite token exists (or token is invalid)
  // 3. User is on step 2 (after account type selection)
  useEffect(() => {
    if (
      isCreatorMode &&
      (!inviteToken || !isTokenValid) &&
      currentStep === 2 &&
      !showApplicationConfirmation
    ) {
      setShowCreatorApplication(true);
    } else {
      setShowCreatorApplication(false);
    }
  }, [isCreatorMode, inviteToken, isTokenValid, currentStep, showApplicationConfirmation]);

  const handleApplicationSuccess = () => {
    setShowApplicationConfirmation(true);
    setShowCreatorApplication(false);
  };

  const handleApplicationBack = () => {
    setShowCreatorApplication(false);
    prevStep();
  };

  const renderStep = () => {
    // Show loading state while validating token or if token exists but validation hasn't started yet
    if (inviteToken && (isValidatingToken || !hasValidatedToken)) {
      return <FullPageLoader />;
    }

    // Show error if token is invalid (only after validation has completed)
    if (inviteToken && hasValidatedToken && !isTokenValid) {
      return (
        <AccessDenied
          title="Access Denied"
          message={tokenError || "This invite link is invalid or has expired."}
          buttonText="Back to Home"
          buttonRoute="/"
        />
      );
    }

    // Show confirmation after application submission
    if (showApplicationConfirmation) {
      return <CreatorApplicationConfirmation />;
    }

    // Show creator application form if creator mode and no invite token
    if (showCreatorApplication) {
      return (
        <CreatorApplication onBack={handleApplicationBack} onSuccess={handleApplicationSuccess} />
      );
    }

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
        // Only show Register form if token is valid (or no token at all)
        return (
          <Register
            onNext={nextStep}
            onBack={prevStep}
            inviteToken={isTokenValid ? inviteToken : null}
          />
        );
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
