import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import {
  createCreatorOnboardingLink,
  getCreatorAccountStatus,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function usePayoutMethod() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [connectError, setConnectError] = useState(null);

  const { data: accountStatusData, isLoading: statusLoading } = useSelector(
    (state) => state.collaborationPayment?.getCreatorAccountStatus || {}
  );

  const { isLoading: onboardingLoading, isError: onboardingError, message: onboardingMessage } = useSelector(
    (state) => state.collaborationPayment?.createCreatorOnboardingLink || {}
  );

  // Check for onboarding return query params
  useEffect(() => {
    const onboarding = searchParams.get("onboarding");
    if (onboarding === "complete" || onboarding === "refresh") {
      // Refresh account status after returning from Stripe
      dispatch(getCreatorAccountStatus());
      // Remove query params from URL
      router.replace("/settings/payments/payout-methods", { scroll: false });
    }
  }, [searchParams, dispatch, router]);

  // Fetch account status on mount
  useEffect(() => {
    dispatch(getCreatorAccountStatus());
  }, [dispatch]);

  const accountStatus = accountStatusData || {
    status: "not_started",
    chargesEnabled: false,
    payoutsEnabled: false,
    detailsSubmitted: false,
  };

  const handleConnectStripe = useCallback(async () => {
    setIsLoading(true);
    try {
      // Get origin from window.location (most reliable for client-side)
      let origin = "";
      
      if (typeof window !== "undefined" && window.location) {
        origin = window.location.origin;
      }

      // If origin is not available, try environment variable
      if (!origin || origin === "null" || origin === "undefined" || origin === "") {
        const envUrl = process.env.NEXT_PUBLIC_MAIN_URL;
        if (envUrl) {
          // Remove /api if present and any trailing slashes
          origin = envUrl.replace("/api", "").replace(/\/$/, "");
        } else {
          // Fallback to localhost for development
          origin = "http://localhost:3000";
        }
      }

      // Ensure origin doesn't have trailing slash
      origin = origin.replace(/\/$/, "");

      // Ensure origin has protocol
      if (!origin.startsWith("http://") && !origin.startsWith("https://")) {
        // For localhost, use http, otherwise use https
        if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
          origin = `http://${origin}`;
        } else {
          origin = `https://${origin}`;
        }
      }

      // Construct URLs
      const basePath = "/settings/payments/payout-methods";
      const returnUrl = `${origin}${basePath}?onboarding=complete`;
      const refreshUrl = `${origin}${basePath}?onboarding=refresh`;

      // Validate URLs are properly formatted
      let returnUrlValid = false;
      let refreshUrlValid = false;
      
      try {
        const returnUrlObj = new URL(returnUrl);
        returnUrlValid = returnUrlObj.protocol === "http:" || returnUrlObj.protocol === "https:";
      } catch (urlError) {
        // Invalid URL format
      }

      try {
        const refreshUrlObj = new URL(refreshUrl);
        refreshUrlValid = refreshUrlObj.protocol === "http:" || refreshUrlObj.protocol === "https:";
      } catch (urlError) {
        // Invalid URL format
      }

      if (!returnUrlValid || !refreshUrlValid) {
        throw new Error(
          `Invalid URL format. Return URL: ${returnUrlValid ? "valid" : "invalid"}, Refresh URL: ${refreshUrlValid ? "valid" : "invalid"}`
        );
      }

      // Final check - ensure URLs are strings and not empty
      if (!returnUrl || typeof returnUrl !== "string" || returnUrl.trim() === "") {
        throw new Error(`Return URL is empty. Origin: ${origin}`);
      }
      if (!refreshUrl || typeof refreshUrl !== "string" || refreshUrl.trim() === "") {
        throw new Error(`Refresh URL is empty. Origin: ${origin}`);
      }

      const result = await dispatch(
        createCreatorOnboardingLink({ returnUrl, refreshUrl })
      ).unwrap();

      if (result.success && result.data?.onboardingUrl) {
        // Clear any previous errors
        setConnectError(null);
        // Redirect to Stripe onboarding
        window.location.href = result.data.onboardingUrl;
      }
    } catch (error) {
      // Check if it's a Connect not enabled error
      const errorMessage = error?.message || error?.payload?.message || "";
      if (
        errorMessage.includes("Stripe Connect is not enabled") ||
        errorMessage.includes("signed up for Connect")
      ) {
        setConnectError(
          "Stripe Connect is not enabled for this account. Please enable Stripe Connect in your Stripe Dashboard at https://dashboard.stripe.com/settings/connect"
        );
      }
      // Error is already handled by api.js and shown via snackbar
      // But we also track it in state to show persistent warning
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const handleContinueSetup = useCallback(async () => {
    await handleConnectStripe();
  }, [handleConnectStripe]);

  const handleManageInStripe = useCallback(async () => {
    // For MVP, redirect to onboarding link to update account
    await handleConnectStripe();
  }, [handleConnectStripe]);

  // Map backend status to frontend status
  const getFrontendStatus = () => {
    const status = accountStatus.status;
    if (status === "complete" && accountStatus.chargesEnabled && accountStatus.payoutsEnabled) {
      return "connected";
    }
    if (status === "needs_info") {
      return "action_required";
    }
    if (status === "in_progress" || accountStatus.detailsSubmitted) {
      return "incomplete";
    }
    return "not_connected";
  };

  const stripeStatus = getFrontendStatus();
  const isLoadingState = isLoading || statusLoading || onboardingLoading;

  const getStatusConfig = () => {
    switch (stripeStatus) {
      case "not_connected":
        return {
          badge: "Not connected",
          badgeColor: "bg-gray-100 text-gray-700",
          buttonText: "Connect Stripe",
          buttonAction: handleConnectStripe,
          description: "Connect your Stripe account to receive payments from brands. This is a secure, one-time setup process.",
          details: [
            "Click 'Connect Stripe' to start the setup process",
            "You'll be redirected to Stripe's secure onboarding page",
            "Have your bank account details ready (account number, routing number)",
            "You may need to verify your identity with a government-issued ID",
            "Setup typically takes 5-10 minutes",
            "Stripe securely handles all financial information - CleerCut never sees your bank details",
          ],
          whatYouNeed: [
            "Bank account information (account number and routing number)",
            "Government-issued ID for identity verification",
            "Business information (if applicable)",
            "Tax information (SSN or EIN for US creators)",
          ],
        };
      case "incomplete":
        return {
          badge: "Setup incomplete",
          badgeColor: "bg-yellow-100 text-yellow-700",
          buttonText: "Continue setup",
          buttonAction: handleContinueSetup,
          description: "Your Stripe account setup is in progress. Complete the remaining steps to start receiving payments.",
          details: [
            "Return to Stripe to finish your account setup",
            "Provide any missing information requested",
            "Complete identity verification if needed",
          ],
        };
      case "connected":
        return {
          badge: "Connected",
          badgeColor: "bg-green-100 text-green-700",
          buttonText: "Update payout details",
          buttonAction: handleManageInStripe,
          description: "Your Stripe account is fully set up and ready to receive payments. Funds will be transferred to your connected bank account.",
          details: [
            "You can receive payments from brands",
            "Payouts are automatically sent to your bank account",
            "Update your bank details anytime if needed",
          ],
        };
      case "action_required":
        return {
          badge: "Action required",
          badgeColor: "bg-red-100 text-red-700",
          buttonText: "Complete setup in Stripe",
          buttonAction: handleManageInStripe,
          description: "Stripe needs additional information to complete your account setup. This is required before you can receive payments.",
          details: [
            "Click 'Complete setup in Stripe' to see exactly what information is needed",
            "Common requirements: bank account details, identity verification, tax information, or business details",
            "You can complete this in a few minutes",
            "This is a one-time setup process",
            "You won't be able to receive payments until this is completed",
          ],
          whatYouNeed: [
            "Check what specific information Stripe is requesting",
            "Have your bank account details ready",
            "Government-issued ID may be required",
            "Tax information (SSN, EIN, or equivalent)",
          ],
        };
      default:
        return {
          badge: "Not connected",
          badgeColor: "bg-gray-100 text-gray-700",
          buttonText: "Connect Stripe",
          buttonAction: handleConnectStripe,
          description: "Connect your Stripe account to receive payments from brands.",
          details: [],
        };
    }
  };

  const statusConfig = getStatusConfig();

  return {
    statusConfig,
    isLoading: isLoadingState,
    accountStatus,
    connectError,
    setConnectError,
  };
}

export default usePayoutMethod;
