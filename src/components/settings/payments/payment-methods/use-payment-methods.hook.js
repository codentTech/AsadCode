import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  getPaymentMethods,
  checkHasPaymentMethod,
  createSetupIntent,
  attachPaymentMethod,
  removePaymentMethod,
  resetAttachPaymentMethod,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function usePaymentMethods() {
  const dispatch = useDispatch();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: paymentMethodsData,
    isLoading,
  } = useSelector((state) => state.collaborationPayment.getPaymentMethods || {});

  const {
    data: hasPaymentMethodData,
    isLoading: isChecking,
  } = useSelector((state) => state.collaborationPayment.hasPaymentMethod || {});

  const {
    data: setupIntentData,
    isLoading: isCreatingSetupIntent,
    isSuccess: setupIntentSuccess,
  } = useSelector((state) => state.collaborationPayment.createSetupIntent || {});

  const {
    isLoading: isAttaching,
    isSuccess: attachSuccess,
  } = useSelector((state) => state.collaborationPayment.attachPaymentMethod || {});

  const {
    isLoading: isRemoving,
    isSuccess: removeSuccess,
  } = useSelector((state) => state.collaborationPayment.removePaymentMethod || {});

  const paymentMethods = Array.isArray(paymentMethodsData) ? paymentMethodsData : [];
  const hasPaymentMethod = hasPaymentMethodData?.hasPaymentMethod || false;

  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
      if (publishableKey) {
        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);
      } else {
        console.warn("Stripe publishable key not found. Payment methods will not work.");
      }
    };
    initStripe();
  }, []);

  // Fetch payment methods on mount
  useEffect(() => {
    dispatch(getPaymentMethods());
    dispatch(checkHasPaymentMethod());
  }, [dispatch]);

  // Refresh payment methods after attach/remove
  useEffect(() => {
    if (attachSuccess || removeSuccess) {
      dispatch(getPaymentMethods());
      dispatch(checkHasPaymentMethod());
      dispatch(resetAttachPaymentMethod());
      setShowAddCardModal(false);
      setSetupIntentClientSecret(null);
      setIsProcessing(false);
      setErrorMessage(null);
    }
  }, [attachSuccess, removeSuccess, dispatch]);

  // Create SetupIntent when modal opens
  useEffect(() => {
    if (showAddCardModal && !setupIntentClientSecret && stripePromise) {
      dispatch(createSetupIntent());
    }
  }, [showAddCardModal, setupIntentClientSecret, stripePromise, dispatch]);

  // Get SetupIntent client secret when created
  useEffect(() => {
    if (setupIntentSuccess && setupIntentData) {
      setSetupIntentClientSecret(setupIntentData.clientSecret);
      setErrorMessage(null);
    }
  }, [setupIntentSuccess, setupIntentData]);

  const handleAddCardSuccess = useCallback(
    async (paymentMethodId) => {
      try {
        await dispatch(attachPaymentMethod(paymentMethodId)).unwrap();
      } catch (error) {
        setErrorMessage(error?.message || "Failed to attach payment method");
        setIsProcessing(false);
      }
    },
    [dispatch]
  );

  const handleAddCardError = useCallback((error) => {
    setErrorMessage(error);
    setIsProcessing(false);
  }, []);

  const handleRemoveCard = useCallback(
    async (paymentMethodId) => {
      if (!window.confirm("Are you sure you want to remove this payment method?")) {
        return;
      }
      try {
        await dispatch(removePaymentMethod(paymentMethodId)).unwrap();
      } catch (error) {
        console.error("Error removing card:", error);
      }
    },
    [dispatch]
  );

  const handleUpdateCard = useCallback(() => {
    setShowAddCardModal(true);
  }, []);

  return {
    paymentMethods,
    hasPaymentMethod,
    isLoading: isLoading || isCreatingSetupIntent || isAttaching || isRemoving,
    isChecking,
    showAddCardModal,
    setShowAddCardModal,
    handleAddCardSuccess,
    handleAddCardError,
    handleRemoveCard,
    handleUpdateCard,
    stripePromise,
    setupIntentClientSecret,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
  };
}

export default usePaymentMethods;
