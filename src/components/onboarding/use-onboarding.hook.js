"use client";

import AccessDenied from "@/app/components/access-denied.component";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { normalizeInviteToken } from "@/common/utils/invite-token.util";
import {
  getInviteResumeEmail,
  getInviteValidationState,
  getRememberedCreatorType,
  getStatusResumeStep,
  hasCreatedAccount,
  normalizeCreatorType,
  readCreatorTypeDraft,
  readInviteTokenFromWindow,
  shouldBlockOnInvalidInvite,
  shouldShowCreatorApplication,
  stripInviteTokenFromUrl,
  syncLocalOnboardingStep,
} from "@/common/utils/onboarding-flow.util";
import ROLES from "@/common/constants/role.constant";
import { getOnboardingEmail, getResumeOnboardingStep, getUser, persistOnboardingEmail } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import {
  resetValidateInviteToken,
  selectValidateInviteToken,
  validateInviteToken,
} from "@/provider/features/invites/invites.slice";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import BrandCampaignPreferences from "./brand/campaign-preferences/campaign-preferences.component";
import IdealCreator from "./brand/ideal-creator/ideal-creator.component";
import BrandProfile from "./brand/profile-setup/profile-setup.component";
import AccountType from "./components/account-type/account-type.component";
import PreparingWorkspace from "./components/preparing-workspace/preparing-workspace.component";
import EmailVerification from "./components/email-verification/email-verification.component";
import OnboardingWizardShell from "./components/onboarding-wizard-shell/onboarding-wizard-shell.component";
import {
  getOnboardingWizardIndex,
  getOnboardingWizardSteps,
  isOnboardingWizardStep,
} from "./components/onboarding-wizard-shell/onboarding-wizard.config";
import Register from "./components/register/register.component";
import CampaignPreferences from "./creator/campaign-preferences/campaign-preferences.component";
import ConnectSocial from "./creator/connect-social/connect-social.component";
import CreatorApplicationConfirmation from "./creator/creator-application-confirmation/creator-application-confirmation.component";
import CreatorApplication from "./creator/creator-application/creator-application.component";
import ProfileSetup from "./creator/profile-setup/profile-setup.component";

const CREATOR_PHASE2_STEPS = new Set([
  ONBOARDING_STEPS.PROFILE_SETUP,
  ONBOARDING_STEPS.CONNECT_SOCIAL,
  ONBOARDING_STEPS.CAMPAIGN_PREFERENCES,
]);

const BRAND_PHASE2_STEPS = new Set([
  ONBOARDING_STEPS.PROFILE_SETUP,
  ONBOARDING_STEPS.CONNECT_SOCIAL,
  ONBOARDING_STEPS.CAMPAIGN_PREFERENCES,
  ONBOARDING_STEPS.IDEAL_CREATOR_SETUP,
]);

const isBrandCampaignPreferencesStep = (step) =>
  step === ONBOARDING_STEPS.CONNECT_SOCIAL ||
  step === ONBOARDING_STEPS.CAMPAIGN_PREFERENCES;

export default function useOnboarding() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const validateTokenState = useSelector(selectValidateInviteToken);
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const onboardingStatusLoading = useSelector((state) => state.onboarding?.onboardingStatusLoading);
  const error = useSelector((state) => state.onboarding?.onboardingStatusError);

  const [inviteToken, setInviteToken] = useState(null);
  const [hasReadInviteFromUrl, setHasReadInviteFromUrl] = useState(false);
  const [showApplicationConfirmation, setShowApplicationConfirmation] = useState(false);
  const [showCreatorApplication, setShowCreatorApplication] = useState(false);

  const inviteTokenPresent = Boolean(inviteToken);

  const inviteResumeEmail = useMemo(
    () => getInviteResumeEmail(validateTokenState),
    [validateTokenState]
  );

  const loggedInUser = getUser();
  const resolvedEmail =
    loggedInUser?.email || inviteResumeEmail || getOnboardingEmail() || null;

  const hasUserNavigatedRef = useRef(false);
  const hasShownUnfinishedModalRef = useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");
  const [preparingRedirect, setPreparingRedirect] = useState(null);
  const [visitedSteps, setVisitedSteps] = useState(() => new Set());
  const [selectedCreatorType, setSelectedCreatorType] = useState(null);
  const [showUnfinishedOnboardingModal, setShowUnfinishedOnboardingModal] = useState(false);

  const creatorTypeHint = useMemo(() => {
    return (
      normalizeCreatorType(selectedCreatorType) ||
      readCreatorTypeDraft(resolvedEmail) ||
      normalizeCreatorType(
        onboardingStatus?.creatorProfile?.creator_type ||
          onboardingStatus?.creatorProfile?.creatorType
      ) ||
      null
    );
  }, [
    selectedCreatorType,
    resolvedEmail,
    onboardingStatus?.creatorProfile?.creator_type,
    onboardingStatus?.creatorProfile?.creatorType,
  ]);

  useLayoutEffect(() => {
    const t = readInviteTokenFromWindow();
    setInviteToken(t);
    setHasReadInviteFromUrl(true);

    const user = getUser();
    const resumeStep = getResumeOnboardingStep(user);
    if (user?.role === ROLES.CREATOR) {
      dispatch(setIsCreatorModeMode(true));
    } else if (user?.role === ROLES.BRAND) {
      dispatch(setIsCreatorModeMode(false));
    }
    if (
      resumeStep != null &&
      !hasUserNavigatedRef.current
    ) {
      setCurrentStep(resumeStep);
    }
    if (user?.email) {
      persistOnboardingEmail(user.email);
    }
    const rememberedType =
      getRememberedCreatorType() ||
      readCreatorTypeDraft(user?.email || getOnboardingEmail()) ||
      null;
    if (rememberedType) {
      setSelectedCreatorType(rememberedType);
    }
  }, [dispatch]);

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
      persistOnboardingEmail(resolvedEmail);
      dispatch(getOnboardingStatus(resolvedEmail));
    }
  }, [dispatch, resolvedEmail]);

  useLayoutEffect(() => {
    if (inviteTokenPresent && !hasCreatedAccount(onboardingStatus)) {
      setCurrentStep((prev) =>
        prev >= ONBOARDING_STEPS.PROFILE_SETUP ? prev : 2
      );
      dispatch(setIsCreatorModeMode(true));
    }
  }, [inviteTokenPresent, onboardingStatus, dispatch]);

  useLayoutEffect(() => {
    const role = onboardingStatus?.user?.role || getUser()?.role;
    if (role === ROLES.CREATOR) {
      dispatch(setIsCreatorModeMode(true));
    } else if (role === ROLES.BRAND) {
      dispatch(setIsCreatorModeMode(false));
    }
  }, [onboardingStatus?.user?.role, dispatch]);

  useLayoutEffect(() => {
    if (hasUserNavigatedRef.current) return;

    const storedStep = getResumeOnboardingStep();

    if (!resolvedEmail) {
      if (!inviteTokenPresent && storedStep == null) {
        setCurrentStep((prev) => (prev >= 3 ? prev : 1));
      }
      return;
    }

    if (onboardingStatusLoading) {
      return;
    }

    const statusEmail = onboardingStatus?.user?.email;
    if (!statusEmail) {
      if (storedStep != null && storedStep < ONBOARDING_STEPS.PROFILE_SETUP) {
        setCurrentStep(storedStep);
      }
      return;
    }
    if (statusEmail.toLowerCase() !== resolvedEmail.toLowerCase()) {
      return;
    }

    syncLocalOnboardingStep(onboardingStatus);
    if (
      onboardingStatus?.isCompleted ||
      Number(onboardingStatus?.onboardingStep) >= ONBOARDING_STEPS.COMPLETED
    ) {
      return;
    }
    const resumeStep = getStatusResumeStep(onboardingStatus, inviteTokenPresent);
    if (resumeStep > 0) {
      setCurrentStep(resumeStep);
      if (
        !hasShownUnfinishedModalRef.current &&
        resumeStep >= ONBOARDING_STEPS.EMAIL_VERIFICATION &&
        resumeStep < ONBOARDING_STEPS.COMPLETED
      ) {
        hasShownUnfinishedModalRef.current = true;
        setShowUnfinishedOnboardingModal(true);
      }
    }
  }, [
    onboardingStatus,
    onboardingStatusLoading,
    resolvedEmail,
    inviteTokenPresent,
  ]);

  useEffect(() => {
    setVisitedSteps((prev) => {
      if (prev.has(currentStep)) return prev;
      const next = new Set(prev);
      next.add(currentStep);
      return next;
    });
  }, [currentStep]);

  useEffect(() => {
    if (onboardingStatusLoading) return;
    const completed =
      Boolean(onboardingStatus?.isCompleted) ||
      Number(onboardingStatus?.onboardingStep) >= ONBOARDING_STEPS.COMPLETED;
    if (!completed || !onboardingStatus?.user?.email) return;
    router.push("/campaign");
  }, [onboardingStatus, onboardingStatusLoading, router]);

  useEffect(() => {
    if (hasCreatedAccount(onboardingStatus) && inviteToken) {
      stripInviteTokenFromUrl();
      setInviteToken(null);
      dispatch(resetValidateInviteToken());
    }
  }, [onboardingStatus, inviteToken, dispatch]);

  useEffect(() => {
    if (
      shouldShowCreatorApplication({
        isCreatorMode,
        inviteToken,
        isTokenValid: validateTokenState?.isSuccess,
        currentStep,
        showApplicationConfirmation,
      })
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

  const getMinOnboardingStep = useCallback(() => {
    const loggedInStep = Number(getUser()?.onboarding_step);
    const emailVerified = onboardingStatus?.checklist?.emailVerified === true;

    if (
      hasCreatedAccount(onboardingStatus) ||
      (Number.isFinite(loggedInStep) && loggedInStep >= ONBOARDING_STEPS.EMAIL_VERIFICATION)
    ) {
      if (!emailVerified) {
        return ONBOARDING_STEPS.EMAIL_VERIFICATION;
      }
      return ONBOARDING_STEPS.PROFILE_SETUP;
    }
    if (inviteTokenPresent && !hasCreatedAccount(onboardingStatus)) {
      return ONBOARDING_STEPS.REGISTRATION;
    }
    return ONBOARDING_STEPS.ACCOUNT_TYPE_SELECTION;
  }, [onboardingStatus, inviteTokenPresent]);

  const closeUnfinishedOnboardingModal = useCallback(() => {
    setShowUnfinishedOnboardingModal(false);
  }, []);

  const nextStep = useCallback(() => {
    hasUserNavigatedRef.current = true;
    setCurrentStep((prev) => prev + 1);
  }, []);

  const goToStep = useCallback((step) => {
    const next = Number(step);
    if (!Number.isFinite(next) || next < 1) return;
    hasUserNavigatedRef.current = true;
    setCurrentStep(next);
  }, []);

  const prevStep = useCallback(() => {
    hasUserNavigatedRef.current = true;
    const isCreatorWizard =
      Boolean(isCreatorMode) ||
      onboardingStatus?.user?.role === ROLES.CREATOR ||
      getUser()?.role === ROLES.CREATOR;
    setCurrentStep((prev) => {
      if (prev === ONBOARDING_STEPS.IDEAL_CREATOR_SETUP) {
        return ONBOARDING_STEPS.CONNECT_SOCIAL;
      }
      if (prev === ONBOARDING_STEPS.CAMPAIGN_PREFERENCES) {
        return isCreatorWizard
          ? ONBOARDING_STEPS.CONNECT_SOCIAL
          : ONBOARDING_STEPS.PROFILE_SETUP;
      }
      return Math.max(getMinOnboardingStep(), prev - 1);
    });
  }, [getMinOnboardingStep, isCreatorMode, onboardingStatus?.user?.role]);

  const goToIdealCreatorSetup = useCallback(() => {
    hasUserNavigatedRef.current = true;
    setCurrentStep(ONBOARDING_STEPS.IDEAL_CREATOR_SETUP);
  }, []);

  const handleWizardStepSelect = useCallback(
    (index) => {
      const isCreatorWizard =
        Boolean(isCreatorMode) ||
        onboardingStatus?.user?.role === ROLES.CREATOR ||
        getUser()?.role === ROLES.CREATOR;
      const wizardSteps = getOnboardingWizardSteps(isCreatorWizard);
      const target = wizardSteps[index];
      if (!target) return;
      const minStep = getMinOnboardingStep();
      if (target.id < minStep) return;
      const activeIndex = getOnboardingWizardIndex(currentStep, isCreatorWizard);
      if (index > activeIndex) return;
      hasUserNavigatedRef.current = true;
      setCurrentStep(target.id);
    },
    [currentStep, getMinOnboardingStep, isCreatorMode, onboardingStatus?.user?.role]
  );

  const handleCreatorTypeChange = useCallback((type) => {
    const normalized = normalizeCreatorType(type);
    if (normalized) setSelectedCreatorType(normalized);
  }, []);

  const completeOnboarding = useCallback(() => {
    setPreparingRedirect("/campaign");
  }, []);

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

  const { isValidatingToken, isTokenValid, tokenError, hasValidatedToken } =
    getInviteValidationState(inviteToken, validateTokenState);

  const isHidden = (step) =>
    currentStep === step ? "flex h-full min-h-0 flex-1 flex-col" : "hidden";
  const showStep = (step) => visitedSteps.has(step) || currentStep === step;

  const renderCreatorPhase2 = () => (
    <>
      {showStep(ONBOARDING_STEPS.PROFILE_SETUP) && (
        <div
          className={isHidden(ONBOARDING_STEPS.PROFILE_SETUP)}
          aria-hidden={currentStep !== ONBOARDING_STEPS.PROFILE_SETUP}
        >
          <ProfileSetup
            onNext={nextStep}
            onBack={prevStep}
            onCreatorTypeChange={handleCreatorTypeChange}
          />
        </div>
      )}
      {showStep(ONBOARDING_STEPS.CONNECT_SOCIAL) ||
      currentStep === ONBOARDING_STEPS.PROFILE_SETUP ? (
        <div
          className={isHidden(ONBOARDING_STEPS.CONNECT_SOCIAL)}
          aria-hidden={currentStep !== ONBOARDING_STEPS.CONNECT_SOCIAL}
        >
          <ConnectSocial
            onNext={nextStep}
            onBack={prevStep}
            onResumeStep={goToStep}
            creatorTypeHint={creatorTypeHint}
          />
        </div>
      ) : null}
      {showStep(ONBOARDING_STEPS.CAMPAIGN_PREFERENCES) && (
        <div
          className={isHidden(ONBOARDING_STEPS.CAMPAIGN_PREFERENCES)}
          aria-hidden={currentStep !== ONBOARDING_STEPS.CAMPAIGN_PREFERENCES}
        >
          <CampaignPreferences
            onNext={completeOnboarding}
            onBack={prevStep}
            onResumeStep={goToStep}
          />
        </div>
      )}
    </>
  );

  const showBrandCampaignPreferences =
    isBrandCampaignPreferencesStep(currentStep) ||
    visitedSteps.has(ONBOARDING_STEPS.CONNECT_SOCIAL) ||
    visitedSteps.has(ONBOARDING_STEPS.CAMPAIGN_PREFERENCES);

  const renderBrandPhase2 = () => (
    <>
      {showStep(ONBOARDING_STEPS.PROFILE_SETUP) && (
        <div
          className={isHidden(ONBOARDING_STEPS.PROFILE_SETUP)}
          aria-hidden={currentStep !== ONBOARDING_STEPS.PROFILE_SETUP}
        >
          <BrandProfile
            onNext={nextStep}
            onBack={prevStep}
            isActive={currentStep === ONBOARDING_STEPS.PROFILE_SETUP}
          />
        </div>
      )}
      {showBrandCampaignPreferences || currentStep === ONBOARDING_STEPS.PROFILE_SETUP ? (
        <div
          className={
            isBrandCampaignPreferencesStep(currentStep)
              ? "flex h-full min-h-0 flex-1 flex-col"
              : "hidden"
          }
          aria-hidden={!isBrandCampaignPreferencesStep(currentStep)}
        >
          <BrandCampaignPreferences
            onNext={goToIdealCreatorSetup}
            onBack={prevStep}
            onResumeStep={goToStep}
            isActive={isBrandCampaignPreferencesStep(currentStep)}
          />
        </div>
      ) : null}
      {showStep(ONBOARDING_STEPS.IDEAL_CREATOR_SETUP) && (
        <div
          className={isHidden(ONBOARDING_STEPS.IDEAL_CREATOR_SETUP)}
          aria-hidden={currentStep !== ONBOARDING_STEPS.IDEAL_CREATOR_SETUP}
        >
          <IdealCreator
            onNext={completeOnboarding}
            onBack={prevStep}
            onResumeStep={goToStep}
            isActive={currentStep === ONBOARDING_STEPS.IDEAL_CREATOR_SETUP}
          />
        </div>
      )}
    </>
  );

  const stepContent = (() => {
    if (preparingRedirect) {
      return (
        <PreparingWorkspace
          onReady={() => {
            router.push(preparingRedirect);
          }}
        />
      );
    }

    if (!hasReadInviteFromUrl) {
      return <FullPageLoader />;
    }

    const resumeStep = getResumeOnboardingStep();
    if (resolvedEmail && onboardingStatusLoading && !hasUserNavigatedRef.current) {
      return <FullPageLoader />;
    }
    if (
      onboardingStatus?.isCompleted ||
      Number(onboardingStatus?.onboardingStep) >= ONBOARDING_STEPS.COMPLETED
    ) {
      return <FullPageLoader />;
    }
    if (
      onboardingStatusLoading &&
      resumeStep != null &&
      resumeStep >= ONBOARDING_STEPS.PROFILE_SETUP &&
      currentStep < ONBOARDING_STEPS.PROFILE_SETUP
    ) {
      return <FullPageLoader />;
    }

    if (inviteToken && (isValidatingToken || !hasValidatedToken) && currentStep < ONBOARDING_STEPS.PROFILE_SETUP) {
      return <FullPageLoader />;
    }

    if (
      shouldBlockOnInvalidInvite({
        inviteToken,
        isTokenValid,
        hasValidatedToken,
        onboardingStatus,
        currentStep,
      })
    ) {
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
      onboardingStatusLoading &&
      currentStep < ONBOARDING_STEPS.PROFILE_SETUP
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

    const isCreatorWizard =
      Boolean(isCreatorMode) ||
      onboardingStatus?.user?.role === ROLES.CREATOR ||
      getUser()?.role === ROLES.CREATOR;

    const wrapWizard = (content) => {
      if (!isOnboardingWizardStep(currentStep)) return content;
      const activeIndex = getOnboardingWizardIndex(currentStep, isCreatorWizard);
      const minStep = getMinOnboardingStep();
      const wizardSteps = getOnboardingWizardSteps(isCreatorWizard).map((step, index) => ({
        ...step,
        disabled: step.id < minStep || index > activeIndex,
      }));
      const showBack = currentStep > minStep;
      return (
        <OnboardingWizardShell
          title={isCreatorWizard ? "Creator setup" : "Client setup"}
          steps={wizardSteps}
          activeIndex={activeIndex}
          onBack={prevStep}
          onStepSelect={handleWizardStepSelect}
          showBack={showBack}
        >
          {content}
        </OnboardingWizardShell>
      );
    };

    if (isCreatorWizard && CREATOR_PHASE2_STEPS.has(currentStep)) {
      return wrapWizard(renderCreatorPhase2());
    }

    if (!isCreatorWizard && BRAND_PHASE2_STEPS.has(currentStep)) {
      return wrapWizard(renderBrandPhase2());
    }

    if (
      currentStep === ONBOARDING_STEPS.REGISTRATION ||
      currentStep === ONBOARDING_STEPS.EMAIL_VERIFICATION
    ) {
      return wrapWizard(
        <>
          {showStep(ONBOARDING_STEPS.REGISTRATION) && (
            <div
              className={isHidden(ONBOARDING_STEPS.REGISTRATION)}
              aria-hidden={currentStep !== ONBOARDING_STEPS.REGISTRATION}
            >
              <Register
                onNext={nextStep}
                onBack={prevStep}
                inviteToken={isTokenValid ? inviteToken : null}
              />
            </div>
          )}
          {showStep(ONBOARDING_STEPS.EMAIL_VERIFICATION) && (
            <div
              className={isHidden(ONBOARDING_STEPS.EMAIL_VERIFICATION)}
              aria-hidden={currentStep !== ONBOARDING_STEPS.EMAIL_VERIFICATION}
            >
              <EmailVerification onNext={nextStep} onBack={prevStep} />
            </div>
          )}
        </>
      );
    }

    switch (currentStep) {
      case ONBOARDING_STEPS.ACCOUNT_TYPE_SELECTION:
        return (
          <AccountType
            selectedType={selectedAccountType}
            handleSelectMode={handleSelectMode}
            onNext={nextStep}
          />
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
    showUnfinishedOnboardingModal,
    closeUnfinishedOnboardingModal,
  };
}

