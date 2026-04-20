"use client";

import AccessDenied from "@/app/components/access-denied.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import { normalizeInviteToken } from "@/common/utils/invite-token.util";
import { getOnboardingEmail, getUser } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import {
  resetValidateInviteToken,
  selectValidateInviteToken,
  validateInviteToken,
} from "@/provider/features/invites/invites.slice";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BrandCampaignPreferences from "./brand/campaign-preferences/campaign-preferences.component";
import IdealCreator from "./brand/ideal-creator/ideal-creator.component";
import BrandProfile from "./brand/profile-setup/profile-setup.component";
import AccountType from "./components/account-type/account-type.component";
import EmailVerification from "./components/email-verification/email-verification.component";
import Register from "./components/register/register.component";
import CampaignPreferences from "./creator/campaign-preferences/campaign-preferences.component";
import CreatorApplicationConfirmation from "./creator/creator-application-confirmation/creator-application-confirmation.component";
import CreatorApplication from "./creator/creator-application/creator-application.component";
import ProfileSetup from "./creator/profile-setup/profile-setup.component";

function readInviteTokenFromWindow() {
  if (typeof window === "undefined") return null;
  return normalizeInviteToken(new URLSearchParams(window.location.search).get("token"));
}

export default function useOnboarding() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const validateTokenState = useSelector(selectValidateInviteToken);
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const onboardingStatusLoading = useSelector((state) => state.onboarding?.onboardingStatusLoading);
  const error = useSelector((state) => state.onboarding?.onboardingStatusError);

  const [inviteToken, setInviteToken] = useState(() => readInviteTokenFromWindow());
  const [hasReadInviteFromUrl, setHasReadInviteFromUrl] = useState(false);
  const [showApplicationConfirmation, setShowApplicationConfirmation] = useState(false);
  const [showCreatorApplication, setShowCreatorApplication] = useState(false);

  const inviteTokenPresent = Boolean(inviteToken);

  const inviteResumeEmail = useMemo(() => {
    if (validateTokenState?.isSuccess && validateTokenState?.data?.email) {
      return validateTokenState.data.email;
    }
    return null;
  }, [validateTokenState?.isSuccess, validateTokenState?.data?.email]);

  const resolvedEmail = inviteResumeEmail || getOnboardingEmail() || getUser()?.email || null;

  const [currentStep, setCurrentStep] = useState(() => (readInviteTokenFromWindow() ? 2 : 1));
  const [selectedAccountType, setSelectedAccountType] = useState("");

  useLayoutEffect(() => {
    const t = readInviteTokenFromWindow();
    setInviteToken(t);
    setHasReadInviteFromUrl(true);
  }, []);

  useEffect(() => {
    const fromParams = searchParams?.get("token");
    const normalized = normalizeInviteToken(fromParams);
    if (normalized != null) {
      setInviteToken(normalized);
      setHasReadInviteFromUrl(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!hasReadInviteFromUrl) return;
    if (!inviteToken) {
      dispatch(resetValidateInviteToken());
      return;
    }
    dispatch(validateInviteToken(inviteToken));
  }, [hasReadInviteFromUrl, inviteToken, dispatch]);

  useEffect(() => {
    if (
      validateTokenState?.isSuccess &&
      validateTokenState?.data?.email &&
      typeof window !== "undefined"
    ) {
      window.localStorage.setItem("email", validateTokenState.data.email);
    }
  }, [validateTokenState?.isSuccess, validateTokenState?.data?.email]);

  useLayoutEffect(() => {
    if (resolvedEmail) {
      dispatch(getOnboardingStatus(resolvedEmail));
    }
  }, [dispatch, resolvedEmail]);

  useLayoutEffect(() => {
    if (inviteTokenPresent) {
      setCurrentStep(2);
      dispatch(setIsCreatorModeMode(true));
    }
  }, [inviteTokenPresent]);

  useLayoutEffect(() => {
    if (!resolvedEmail) {
      if (!inviteTokenPresent) {
        setCurrentStep(1);
      }
      return;
    }
    if (onboardingStatusLoading) {
      return;
    }
    if (!onboardingStatus?.user?.email) {
      if (!inviteTokenPresent) {
        setCurrentStep(1);
      }
      return;
    }
    if (onboardingStatus.user.email.toLowerCase() !== resolvedEmail.toLowerCase()) {
      return;
    }
    const step = onboardingStatus.onboardingStep;
    if (step != null) {
      const n = Number(step) || 1;
      setCurrentStep(inviteTokenPresent ? Math.max(n, 2) : n);
    }
    // if (onboardingStatus.user?.role) {
    //   const roleLower = onboardingStatus.user.role.toLowerCase();
    //   setSelectedAccountType(roleLower);
    //   dispatch(setIsCreatorModeMode(roleLower === "creator"));
    // }
  }, [onboardingStatus, onboardingStatusLoading, dispatch, resolvedEmail, inviteTokenPresent]);

  useEffect(() => {
    if (
      isCreatorMode &&
      (!inviteToken || !validateTokenState?.isSuccess) &&
      currentStep === 2 &&
      !showApplicationConfirmation
    ) {
      setShowCreatorApplication(true);
    } else {
      setShowCreatorApplication(false);
    }
  }, [
    isCreatorMode,
    inviteToken,
    validateTokenState?.isSuccess,
    currentStep,
    showApplicationConfirmation,
  ]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const completeOnboarding = useCallback(() => {}, []);

  const handleSelectMode = useCallback(
    (type) => {
      setSelectedAccountType(type);
      dispatch(setIsCreatorModeMode(type === "creator"));
    },
    [dispatch]
  );

  const handleApplicationSuccess = useCallback(() => {
    setShowApplicationConfirmation(true);
    setShowCreatorApplication(false);
  }, []);

  const handleApplicationBack = useCallback(() => {
    setShowCreatorApplication(false);
    prevStep();
  }, [prevStep]);

  const isValidatingToken = Boolean(inviteToken && validateTokenState?.isLoading);
  const isTokenValid = Boolean(inviteToken && validateTokenState?.isSuccess);
  const tokenError = validateTokenState?.isError ? validateTokenState?.message : null;
  const hasValidatedToken =
    !inviteToken ||
    (!validateTokenState?.isLoading &&
      (validateTokenState?.isSuccess || validateTokenState?.isError));

  const stepContent = (() => {
    if (!hasReadInviteFromUrl) {
      return <FullPageLoader />;
    }

    if (inviteToken && (isValidatingToken || !hasValidatedToken)) {
      return <FullPageLoader />;
    }

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

    if (inviteToken && isTokenValid && inviteResumeEmail && onboardingStatusLoading) {
      return <FullPageLoader />;
    }

    if (showApplicationConfirmation) {
      return <CreatorApplicationConfirmation />;
    }

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
  })();

  return {
    stepContent,
    step: onboardingStatus?.onboardingStep,
    isCompleted: onboardingStatus?.isCompleted,
    role: onboardingStatus?.user?.role,
    profile: onboardingStatus?.creatorProfile || onboardingStatus?.brandProfile || null,
    user: onboardingStatus?.user,
    loading: onboardingStatusLoading,
    error,
    currentStep,
    selectedAccountType,
    isCreatorMode,
    nextStep,
    prevStep,
    completeOnboarding,
    handleSelectMode,
  };
}
