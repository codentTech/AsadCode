"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";
import { getOnboardingEmail, getUser } from "@/common/utils/users.util";

export default function useOnboarding() {
  const dispatch = useDispatch();
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const loading = useSelector((state) => state.onboarding?.onboardingStatusLoading);
  const error = useSelector((state) => state.onboarding?.onboardingStatusError);
  const email = getOnboardingEmail();

  useEffect(() => {
    if (email) {
      dispatch(getOnboardingStatus(email));
    }
  }, [dispatch, email]);

  return {
    step: onboardingStatus?.onboardingStep,
    isCompleted: onboardingStatus?.isCompleted,
    role: onboardingStatus?.user?.role,
    profile: onboardingStatus?.creatorProfile || onboardingStatus?.brandProfile || null,
    user: onboardingStatus?.user,
    loading,
    error,
    email,
  };
}
