"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { persistOnboardingEmail } from "@/common/utils/users.util";
import { getOnboardingStatus } from "@/provider/features/onboarding/onboarding.slice";

export default function useOnboardingEmailRecovery({ onRecovered, onBack }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = useCallback((e) => {
    setEmail(e?.target?.value ?? "");
    setError("");
  }, []);

  const handleSubmit = useCallback(async () => {
    const normalized = String(email || "")
      .trim()
      .toLowerCase();
    if (!normalized || !normalized.includes("@")) {
      setError("Enter the email you used to register.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    const result = await dispatch(getOnboardingStatus(normalized));
    setIsSubmitting(false);
    if (result.meta?.requestStatus !== "fulfilled") {
      setError("Could not look up that email. Please try again.");
      return;
    }
    const data = result.payload;
    if (!data?.user?.email) {
      setError("No account found for that email. Check the address or use your invite link.");
      return;
    }
    if (
      data.isCompleted ||
      Number(data.onboardingStep) >= ONBOARDING_STEPS.COMPLETED
    ) {
      persistOnboardingEmail(normalized);
      router.push("/login");
      return;
    }
    persistOnboardingEmail(normalized);
    onRecovered?.(normalized);
  }, [dispatch, email, onRecovered, router]);

  const handleBack = useCallback(() => {
    onBack?.();
  }, [onBack]);

  return {
    email,
    error,
    isSubmitting,
    handleEmailChange,
    handleSubmit,
    handleBack,
    title: "Continue your setup",
    description:
      "Enter the email you registered with and we’ll take you back to where you left off.",
    submitText: "Continue",
    backText: "Back",
  };
}
