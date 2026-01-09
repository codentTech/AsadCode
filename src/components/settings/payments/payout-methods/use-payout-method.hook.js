import { useState } from "react";

function usePayoutMethod() {
  // TODO: Replace with actual data from backend/Redux
  // State will be determined by: stripeAccountId, stripeOnboardingStatus, stripeChargesEnabled, stripePayoutsEnabled
  const [stripeStatus, setStripeStatus] = useState("not_connected"); // not_connected | incomplete | connected | action_required
  const [isLoading, setIsLoading] = useState(false);

  const handleConnectStripe = async () => {
    // TODO: Implement API call to POST /api/stripe/connect/create
  };

  const handleContinueSetup = async () => {
    // TODO: Implement API call to POST /api/stripe/connect/create to get onboarding link
  };

  const handleManageInStripe = async () => {
    // TODO: Implement API call to POST /api/stripe/connect/login to get dashboard link
  };

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
          buttonText: "Manage in Stripe",
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
    isLoading,
  };
}

export default usePayoutMethod;

