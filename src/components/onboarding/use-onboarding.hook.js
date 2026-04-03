"use client";

import { getOnboardingEmail, getUser } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useOnboarding(options = {}) {
  const inviteResumeEmail = options.inviteResumeEmail ?? null;
  const dispatch = useDispatch();
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const loading = useSelector((state) => state.onboarding?.onboardingStatusLoading);
  const error = useSelector((state) => state.onboarding?.onboardingStatusError);

  const resolvedEmail =
    inviteResumeEmail || getOnboardingEmail() || getUser()?.email || null;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  useLayoutEffect(() => {
    if (resolvedEmail) {
      dispatch(getOnboardingStatus(resolvedEmail));
    }
  }, [dispatch, resolvedEmail]);

  useLayoutEffect(() => {
    if (!resolvedEmail) {
      setCurrentStep(1);
      return;
    }
    if (loading) {
      return;
    }
    if (!onboardingStatus?.user?.email) {
      setCurrentStep(1);
      return;
    }
    if (
      onboardingStatus.user.email.toLowerCase() !== resolvedEmail.toLowerCase()
    ) {
      return;
    }
    const step = onboardingStatus.onboardingStep;
    if (step != null) {
      setCurrentStep(Number(step) || 1);
    }
    if (onboardingStatus.user?.role) {
      const roleLower = onboardingStatus.user.role.toLowerCase();
      setSelectedAccountType(roleLower);
      dispatch(setIsCreatorModeMode(roleLower === "creator"));
    }
  }, [onboardingStatus, loading, dispatch, resolvedEmail]);

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

  return {
    step: onboardingStatus?.onboardingStep,
    isCompleted: onboardingStatus?.isCompleted,
    role: onboardingStatus?.user?.role,
    profile: onboardingStatus?.creatorProfile || onboardingStatus?.brandProfile || null,
    user: onboardingStatus?.user,
    loading,
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
