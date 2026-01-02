"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Onboarding from "@/components/onboarding/onboarding.component";
import invitesService from "@/provider/features/invites/invites.service";
import AccessDenied from "@/app/components/access-denied.component";

const InviteSignup = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get("token");
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [inviteEmail, setInviteEmail] = useState(null);
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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Validating invite...</p>
        </div>
      </div>
    );
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
