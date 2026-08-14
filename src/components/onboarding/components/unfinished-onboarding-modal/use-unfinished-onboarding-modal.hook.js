"use client";

import { useCallback, useEffect, useMemo } from "react";
import { getOnboardingStepTitle } from "@/common/utils/users.util";

export default function useUnfinishedOnboardingModal({ show, onClose, resumeStep }) {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!show) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleClose();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [show, handleClose]);

  const stepLabel = useMemo(() => getOnboardingStepTitle(resumeStep), [resumeStep]);

  const message = useMemo(() => {
    if (stepLabel && stepLabel !== "—") {
      return `You still have unfinished onboarding. Pick up at ${stepLabel} to finish setting up your account.`;
    }
    return "You still have unfinished onboarding. Continue where you left off to finish setting up your account.";
  }, [stepLabel]);

  return {
    show: Boolean(show),
    title: "Finish your setup",
    message,
    buttonText: "Continue setup",
    handleClose,
  };
}
