"use client";

import { getOnboardingEmail } from "@/common/utils/users.util";
import {
  resendEmail,
  reset,
  sendVerificationEmail,
  verifyEmail,
} from "@/provider/features/auth/auth.slice";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const MAX_CODE_LENGTH = 6;

export default function useEmailVerification({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");

  const verifyEmailState = useSelector((state) => state.auth?.verifyEmail) || {};
  const sendVerificationEmailState = useSelector(
    (state) => state.auth?.sendVerificationEmail
  ) || {};
  const { isLoading, isError } = verifyEmailState;
  const { isLoading: isSendingEmail } = sendVerificationEmailState;

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleCodeChange = useCallback((e) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, MAX_CODE_LENGTH);
    setVerificationCode(raw);
  }, []);

  const handleCodePaste = useCallback((e) => {
    e.preventDefault();
    const pasted = (e.clipboardData?.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, MAX_CODE_LENGTH);
    setVerificationCode(pasted);
  }, []);

  const handleSendVerificationEmail = useCallback(async () => {
    if (!email) return;
    const result = await dispatch(sendVerificationEmail(email));
    if (result.meta?.requestStatus === "fulfilled" && result.payload?.success) {
      setEmailSent(true);
      setCountdown(60);
    }
  }, [dispatch, email]);

  const handleResendEmail = useCallback(() => {
    if (email) {
      dispatch(resendEmail(email));
      setEmailSent(true);
      setCountdown(60);
    }
  }, [dispatch, email]);

  const handleContinue = useCallback(async () => {
    if (!email) return;
    const code = verificationCode.trim();
    if (code.length !== MAX_CODE_LENGTH) return;
    const { payload } = await dispatch(verifyEmail({ email, verificationCode: code }));
    if (payload?.success || payload?.data?.id) {
      onNext();
      dispatch(reset());
    }
  }, [dispatch, email, verificationCode, onNext]);

  return {
    email,
    emailSent,
    countdown,
    verificationCode,
    handleSendVerificationEmail,
    handleCodeChange,
    handleCodePaste,
    handleResendEmail,
    handleContinue,
    isLoading,
    isSendingEmail,
    canSubmit: verificationCode.length === MAX_CODE_LENGTH,
  };
}
