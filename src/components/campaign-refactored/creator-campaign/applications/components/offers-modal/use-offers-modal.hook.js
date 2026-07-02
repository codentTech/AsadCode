import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  getPendingContractsForCreator,
  signContract,
  declineContract,
  getContractById,
} from "@/provider/features/contracts/contracts.slice";
import {
  checkCreatorPayoutReady,
  createCreatorOnboardingLink,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import { getUser } from "@/common/utils/users.util";
import { COMPENSATION_TYPE, CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";

const useOffersModal = ({ show, onClose, onContractAction }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const user = getUser();

  const [selectedContract, setSelectedContract] = useState(null);
  const [showContractPreview, setShowContractPreview] = useState(false);
  const [contractPreviewData, setContractPreviewData] = useState(null);
  const [showStripePrompt, setShowStripePrompt] = useState(false);

  const { data: pendingContractsData, isLoading: pendingContractsLoading } = useSelector(
    (state) => state.contracts.getPendingContractsForCreator || {}
  );

  const { isLoading: signLoading } = useSelector((state) => state.contracts.signContract || {});

  const { isLoading: declineLoading } = useSelector(
    (state) => state.contracts.declineContract || {}
  );

  const { data: payoutReadyData } = useSelector(
    (state) => state.collaborationPayment?.checkCreatorPayoutReady || {}
  );

  // Handle both array and nested data structure
  const pendingContracts = (() => {
    if (Array.isArray(pendingContractsData)) {
      return pendingContractsData;
    }
    if (pendingContractsData?.data && Array.isArray(pendingContractsData.data)) {
      return pendingContractsData.data;
    }
    return [];
  })();

  useEffect(() => {
    if (show) {
      dispatch(getPendingContractsForCreator());
    }
  }, [dispatch, show]);

  const formatTimeAgo = useCallback((dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? "day" : "days"} ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
  }, []);

  const handleReviewContract = useCallback(
    async (contract) => {
      setSelectedContract(contract);
      const result = await dispatch(getContractById(contract.id)).unwrap();
      if (result.success) {
        setContractPreviewData(result.data);
        setShowContractPreview(true);
      }
    },
    [dispatch]
  );

  // Gifted/affiliate offers bypass Stripe check per creator-stripe-workflow.md
  const checkIfPaidContract = useCallback(
    (contract) => {
      const compensationType = (
        contractPreviewData?.compensationType ||
        contractPreviewData?.compensation_type ||
        contract?.compensationType ||
        contract?.compensation_type ||
        ""
      ).toUpperCase();
      const campaignType = (
        contractPreviewData?.campaign_type ||
        contractPreviewData?.campaignType ||
        contractPreviewData?.campaign?.campaign_type ||
        contract?.campaign_type ||
        contract?.campaignType ||
        contract?.campaign?.campaign_type ||
        ""
      ).toUpperCase();

      // Bypass: gifted product or commission (no cash payout through platform)
      if (
        compensationType === COMPENSATION_TYPE.GIFTED_PRODUCT ||
        compensationType === COMPENSATION_TYPE.COMMISSION
      ) {
        return false;
      }
      // Bypass: gifted or affiliate campaign type
      if (campaignType === CAMPAIGN_TYPE.GIFTED || campaignType === CAMPAIGN_TYPE.AFFILIATE) {
        return false;
      }
      return compensationType === COMPENSATION_TYPE.PAID;
    },
    [contractPreviewData]
  );

  const handleAccept = useCallback(async () => {
    if (!selectedContract || !user?.id) return;

    // Check if this is a paid contract
    const isPaid = checkIfPaidContract(selectedContract);

    if (isPaid) {
      // Check if creator is payout ready
      const payoutReadyResult = await dispatch(checkCreatorPayoutReady()).unwrap();
      const isPayoutReady = payoutReadyResult?.success && payoutReadyResult?.data?.isPayoutReady;

      if (!isPayoutReady) {
        // Show Stripe setup prompt
        setShowStripePrompt(true);
        return;
      }
    }

    // Proceed with contract signing
    const now = new Date().toISOString();
    const signatureData = {
      signerId: user.id,
      signatureType: "creator",
      signedAt: now,
      signatureTimestamp: now,
      ipAddress: "",
      userAgent: navigator.userAgent,
      signatureData: {
        method: "e-signature",
        consent: true,
        userAgent: navigator.userAgent,
        timestamp: now,
      },
    };

    await dispatch(signContract({ contractId: selectedContract.id, signatureData })).unwrap();

    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
    dispatch(getPendingContractsForCreator());

    if (onContractAction) {
      onContractAction();
    }
    onClose();
  }, [selectedContract, user, dispatch, onContractAction, onClose, checkIfPaidContract]);

  const handleSetupStripe = useCallback(async () => {
    setShowStripePrompt(false);

    // Ensure we have a valid origin - check multiple sources
    let origin = window.location?.origin;

    // If origin is not available or invalid, try environment variable
    if (!origin || origin === "null" || origin === "undefined") {
      origin = process.env.NEXT_PUBLIC_MAIN_URL?.replace("/api", "") || "http://localhost:3000";
    }

    // Remove trailing slash if present
    origin = origin.replace(/\/$/, "");

    // Construct URLs
    const returnUrl = `${origin}/campaign?tab=2`;
    const refreshUrl = `${origin}/campaign?tab=2`;

    // Validate URLs are properly formatted using URL constructor
    try {
      new URL(returnUrl);
      new URL(refreshUrl);
    } catch (urlError) {
      console.error("Invalid URL format:", { returnUrl, refreshUrl, origin });
      return;
    }

    console.log("Creating onboarding link with URLs:", { returnUrl, refreshUrl });

    try {
      const result = await dispatch(
        createCreatorOnboardingLink({ returnUrl, refreshUrl })
      ).unwrap();

      if (result.success && result.data?.onboardingUrl) {
        window.location.href = result.data.onboardingUrl;
      }
    } catch (error) {
      console.error("Failed to create onboarding link:", error);
    }
  }, [dispatch]);

  const handleDecline = useCallback(async () => {
    if (!selectedContract) return;

    await dispatch(declineContract(selectedContract.id)).unwrap();

    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
    dispatch(getPendingContractsForCreator());

    if (onContractAction) {
      onContractAction();
    }
  }, [selectedContract, dispatch, onContractAction]);

  const handleBackToList = useCallback(() => {
    setShowContractPreview(false);
    setSelectedContract(null);
    setContractPreviewData(null);
    setShowStripePrompt(false);
  }, []);

  return {
    user,
    pendingContracts,
    pendingContractsLoading,
    selectedContract,
    showContractPreview,
    contractPreviewData,
    signLoading,
    declineLoading,
    showStripePrompt,
    formatTimeAgo,
    handleReviewContract,
    handleAccept,
    handleDecline,
    handleBackToList,
    handleSetupStripe,
  };
};

export default useOffersModal;
