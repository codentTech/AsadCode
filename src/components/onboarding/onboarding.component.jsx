"use client";

import AccessDenied from "@/app/components/access-denied.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import invitesService from "@/provider/features/invites/invites.service";
import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
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
import useOnboarding from "./use-onboarding.hook";

function normalizeInviteToken(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  if (!s) return null;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function parseInviteValidationBody(body) {
  if (!body || typeof body !== "object") {
    return { valid: false, message: "Invalid response" };
  }
  const inner = body.data?.data ?? body.data ?? body;
  if (!inner || typeof inner !== "object") {
    return { valid: false, message: body.message || "Invalid response" };
  }
  const valid =
    inner.valid === true ||
    (typeof inner.valid === "string" && inner.valid.toLowerCase() === "true");
  return {
    valid,
    message: inner.message,
    email: inner.email,
  };
}

export default function Onboarding() {
  const searchParams = useSearchParams();
  const [inviteToken, setInviteToken] = useState(null);
  const [hasReadInviteFromUrl, setHasReadInviteFromUrl] = useState(false);
  const [showApplicationConfirmation, setShowApplicationConfirmation] = useState(false);
  const [showCreatorApplication, setShowCreatorApplication] = useState(false);
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  const [hasValidatedToken, setHasValidatedToken] = useState(false);
  const [inviteResumeEmail, setInviteResumeEmail] = useState(null);

  const {
    currentStep,
    selectedAccountType,
    isCreatorMode,
    nextStep,
    prevStep,
    completeOnboarding,
    handleSelectMode,
    loading: onboardingStatusLoading,
  } = useOnboarding({ inviteResumeEmail });

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const t = normalizeInviteToken(new URLSearchParams(window.location.search).get("token"));
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
    if (!hasReadInviteFromUrl) {
      return;
    }

    if (!inviteToken) {
      setIsTokenValid(false);
      setTokenError(null);
      setInviteResumeEmail(null);
      setHasValidatedToken(true);
      setIsValidatingToken(false);
      return;
    }

    setIsValidatingToken(true);
    setTokenError(null);
    setHasValidatedToken(false);

    invitesService
      .validateTokenOnly(inviteToken)
      .then((body) => {
        const { valid, message, email: inviteEmail } = parseInviteValidationBody(body);
        if (valid) {
          setIsTokenValid(true);
          setTokenError(null);
          if (inviteEmail) {
            setInviteResumeEmail(inviteEmail);
            if (typeof window !== "undefined") {
              window.localStorage.setItem("email", inviteEmail);
            }
          }
        } else {
          setIsTokenValid(false);
          setInviteResumeEmail(null);
          setTokenError(
            message || body?.message || "This invite link is invalid or has expired."
          );
        }
      })
      .catch(() => {
        setIsTokenValid(false);
        setInviteResumeEmail(null);
        setTokenError("Could not verify this invite link. Please try again.");
      })
      .finally(() => {
        setIsValidatingToken(false);
        setHasValidatedToken(true);
      });
  }, [hasReadInviteFromUrl, inviteToken]);

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

    if (
      inviteToken &&
      isTokenValid &&
      inviteResumeEmail &&
      onboardingStatusLoading
    ) {
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
  };

  return <div className="min-h-screen">{renderStep()}</div>;
}
