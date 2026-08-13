"use client";

import { stripInviteTokenFromUrl } from "@/common/utils/onboarding-flow.util";
import { getOnboardingEmail } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";
import {
  resendEmail,
  reset,
  sendVerificationEmail,
  verifyEmail,
} from "@/provider/features/auth/auth.slice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MAX_CODE_LENGTH = 6;

export default function useEmailVerification({ onNext }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const email = getOnboardingEmail();
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const onboardingStatus = useSelector((state) => state.onboarding?.onboardingStatus);
  const isCreator =
    isCreatorMode || onboardingStatus?.user?.role === ROLES.CREATOR;

  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const digitRefs = useRef([]);

  const verifyEmailState = useSelector((state) => state.auth?.verifyEmail) || {};
  const sendVerificationEmailState =
    useSelector((state) => state.auth?.sendVerificationEmail) || {};
  const { isLoading } = verifyEmailState;
  const { isLoading: isSendingEmail } = sendVerificationEmailState;

  const codeDigits = useMemo(
    () => Array.from({ length: MAX_CODE_LENGTH }, (_, i) => verificationCode[i] || ""),
    [verificationCode]
  );

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const setDigitRef = useCallback((index) => (el) => {
    digitRefs.current[index] = el;
  }, []);

  const focusDigit = useCallback((index) => {
    const next = Math.max(0, Math.min(MAX_CODE_LENGTH - 1, index));
    digitRefs.current[next]?.focus();
  }, []);

  const applyCode = useCallback(
    (raw, focusIndex) => {
      const next = String(raw || "")
        .replace(/\D/g, "")
        .slice(0, MAX_CODE_LENGTH);
      setVerificationCode(next);
      if (typeof focusIndex === "number") {
        focusDigit(focusIndex);
      }
    },
    [focusDigit]
  );

  const handleDigitChange = useCallback(
    (index, e) => {
      const incoming = e.target.value.replace(/\D/g, "");
      if (incoming.length > 1) {
        applyCode(incoming, Math.min(incoming.length, MAX_CODE_LENGTH) - 1);
        return;
      }
      setVerificationCode((prev) => {
        const chars = Array.from({ length: MAX_CODE_LENGTH }, (_, i) => prev[i] || "");
        chars[index] = incoming.slice(-1);
        return chars.join("").replace(/\s/g, "");
      });
      if (incoming) focusDigit(index + 1);
    },
    [applyCode, focusDigit]
  );

  const handleDigitKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace") {
        if (verificationCode[index]) return;
        e.preventDefault();
        setVerificationCode((prev) => prev.slice(0, index));
        focusDigit(index - 1);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusDigit(index - 1);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        focusDigit(index + 1);
      }
    },
    [focusDigit, verificationCode]
  );

  const handleDigitFocus = useCallback((e) => {
    e.target.select();
  }, []);

  const handleCodePaste = useCallback(
    (e) => {
      e.preventDefault();
      const pasted = (e.clipboardData?.getData("text") || "")
        .replace(/\D/g, "")
        .slice(0, MAX_CODE_LENGTH);
      applyCode(pasted, Math.min(pasted.length, MAX_CODE_LENGTH) - 1);
    },
    [applyCode]
  );

  const handleSendVerificationEmail = useCallback(async () => {
    if (!email) return;
    const result = await dispatch(sendVerificationEmail(email));
    if (result.meta?.requestStatus === "fulfilled" && result.payload?.success) {
      setEmailSent(true);
      setCountdown(60);
      setVerificationCode("");
    }
  }, [dispatch, email]);

  const handleResendEmail = useCallback(() => {
    if (email) {
      dispatch(resendEmail(email));
      setEmailSent(true);
      setCountdown(60);
      setVerificationCode("");
    }
  }, [dispatch, email]);

  const handleContinue = useCallback(async () => {
    if (!email) return;
    const code = verificationCode.trim();
    if (code.length !== MAX_CODE_LENGTH) return;
    const { payload } = await dispatch(verifyEmail({ email, verificationCode: code }));
    if (payload?.success || payload?.data?.id) {
      dispatch(reset());
      stripInviteTokenFromUrl();
      if (isCreator) {
        const params = new URLSearchParams({
          resumeOnboarding: "1",
          email: String(email),
        });
        router.push(`/login?${params.toString()}`);
        return;
      }
      onNext();
    }
  }, [dispatch, email, verificationCode, onNext, router, isCreator]);

  return {
    email,
    emailSent,
    countdown,
    codeDigits,
    codeLength: MAX_CODE_LENGTH,
    setDigitRef,
    handleDigitChange,
    handleDigitKeyDown,
    handleDigitFocus,
    handleSendVerificationEmail,
    handleCodePaste,
    handleResendEmail,
    handleContinue,
    isLoading,
    isSendingEmail,
    canSubmit: verificationCode.length === MAX_CODE_LENGTH,
  };
}
