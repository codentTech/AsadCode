"use client";

import { getOnboardingEmail } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useOnboarding() {
  const dispatch = useDispatch();
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const loading = useSelector((state) => state.onboarding?.onboardingStatusLoading);
  const error = useSelector((state) => state.onboarding?.onboardingStatusError);
  const email = getOnboardingEmail();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedAccountType, setSelectedAccountType] = useState("");

  useEffect(() => {
    if (email) {
      dispatch(getOnboardingStatus(email));
    }
  }, [dispatch, email]);

  useEffect(() => {
    if (!loading && onboardingStatus?.onboardingStep) {
      setCurrentStep(onboardingStatus.onboardingStep || 1);
      if (onboardingStatus.user?.role) {
        setSelectedAccountType(onboardingStatus.user.role.toLowerCase());
        dispatch(setIsCreatorModeMode(onboardingStatus.user.role.toLowerCase() === "creator"));
      }
    }
    !email && setCurrentStep(1);
  }, [onboardingStatus, loading, dispatch, email]);

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
