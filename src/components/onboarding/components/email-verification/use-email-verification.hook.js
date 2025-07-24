"use client";

import { getOnboardingEmail } from "@/common/utils/users.util";
import { resendEmail, reset, verifyEmail } from "@/provider/features/auth/auth.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function useEmailVerification({ onNext }) {
  const dispatch = useDispatch();
  const email = getOnboardingEmail();

  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendEmail = () => {
    if (email) {
      dispatch(resendEmail(email));
      setEmailSent(true);
      setCountdown(60);
    }
  };

  const handleContinue = async () => {
    if (email) {
      const { payload } = await dispatch(
        verifyEmail({ email, verificationCode: "123456" }) // Using hardcoded code for now
      );
      if (payload.success) {
        onNext();
        dispatch(reset());
      }
    }
  };

  return {
    email,
    emailSent,
    countdown,
    handleResendEmail,
    handleContinue,
  };
}
