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

  const { data: accountStatusData, isLoading: statusLoading } = useSelector(
    (state) => state.collaborationPayment?.getCreatorAccountStatus || {}
  );

  const { isLoading: onboardingLoading } = useSelector(
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
      // Ensure we have a valid origin - check multiple sources
      let origin = window.location?.origin;

      // If origin is not available or invalid, try environment variable
      if (!origin || origin === "null" || origin === "undefined") {
        origin = process.env.NEXT_PUBLIC_MAIN_URL?.replace("/api", "") || "http://localhost:3000";
      }

      // Remove trailing slash if present
      origin = origin.replace(/\/$/, "");

      // Construct URLs
      const returnUrl = `${origin}/settings/payments/payout-methods?onboarding=complete`;
      const refreshUrl = `${origin}/settings/payments/payout-methods?onboarding=refresh`;

      // Validate URLs are properly formatted
      try {
        new URL(returnUrl);
        new URL(refreshUrl);
      } catch (urlError) {
        console.error("Invalid URL format:", { returnUrl, refreshUrl, origin });
        throw new Error(`Invalid URL format: ${urlError.message}`);
      }

      console.log("Creating onboarding link with URLs:", { returnUrl, refreshUrl });

      const result = await dispatch(
        createCreatorOnboardingLink({ returnUrl, refreshUrl })
      ).unwrap();

      if (result.success && result.data?.onboardingUrl) {
        // Redirect to Stripe onboarding
        window.location.href = result.data.onboardingUrl;
      }
    } catch (error) {
      console.error("Failed to create onboarding link:", error);
      // You might want to show a user-friendly error message here
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
        };
      case "incomplete":
        return {
          badge: "Setup incomplete",
          badgeColor: "bg-yellow-100 text-yellow-700",
          buttonText: "Continue setup",
          buttonAction: handleContinueSetup,
        };
      case "connected":
        return {
          badge: "Connected",
          badgeColor: "bg-green-100 text-green-700",
          buttonText: "Update payout details",
          buttonAction: handleManageInStripe,
        };
      case "action_required":
        return {
          badge: "Action required",
          badgeColor: "bg-red-100 text-red-700",
          buttonText: "Fix in Stripe",
          buttonAction: handleManageInStripe,
        };
      default:
        return {
          badge: "Not connected",
          badgeColor: "bg-gray-100 text-gray-700",
          buttonText: "Connect Stripe",
          buttonAction: handleConnectStripe,
        };
    }
  };

  const statusConfig = getStatusConfig();

  return {
    statusConfig,
    isLoading: isLoadingState,
    accountStatus,
  };
}

export default usePayoutMethod;
