"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FullPageLoader from "@/common/components/loader/full-page-loader.component";
import Onboarding from "@/components/onboarding/onboarding.component";
import AccessDenied from "@/app/components/access-denied.component";

const InviteSignup = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setError("Invalid invite link");
        setIsValidating(false);
        return;
      }

      // Token validation will happen in the register component
      // We just ensure token exists and render onboarding
      setIsValid(true);
      setIsValidating(false);
    };

    validateToken();
  }, [token]);

  if (isValidating) {
    return <FullPageLoader />;
  }

  if (error || !isValid) {
    return (
      <AccessDenied
        title="Access Denied"
        message={error || "This invite link is invalid or has expired."}
        buttonText="Back to Home"
        buttonRoute="/"
      />
    );
  }

  // Render onboarding with token in URL
  return <Onboarding />;
};

export default InviteSignup;
