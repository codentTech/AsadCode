import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  getPaymentMethods,
  checkHasPaymentMethod,
  createSetupIntent,
  attachPaymentMethod,
  removePaymentMethod,
  resetAttachPaymentMethod,
  resetRemovePaymentMethod,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function usePaymentMethods() {
  const dispatch = useDispatch();
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [stripePromise, setStripePromise] = useState(null);
  const [setupIntentClientSecret, setSetupIntentClientSecret] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [updatingPaymentMethodId, setUpdatingPaymentMethodId] = useState(null);
  const setupIntentRequestedRef = useRef(false);

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
    isError: setupIntentError,
    message: setupIntentErrorMessage,
  } = useSelector((state) => state.collaborationPayment.createSetupIntent || {});

  const {
    isLoading: isAttaching,
    isSuccess: attachSuccess,
  } = useSelector((state) => state.collaborationPayment.attachPaymentMethod || {});

  const {
    isLoading: isRemoving,
    isSuccess: removeSuccess,
  } = useSelector((state) => state.collaborationPayment.removePaymentMethod || {});

  // Handle payment methods data - could be array directly or nested
  const paymentMethods = useMemo(() => {
    if (!paymentMethodsData) return [];
    if (Array.isArray(paymentMethodsData)) return paymentMethodsData;
    if (Array.isArray(paymentMethodsData.paymentMethods)) return paymentMethodsData.paymentMethods;
    if (Array.isArray(paymentMethodsData.data)) return paymentMethodsData.data;
    return [];
  }, [paymentMethodsData]);

  // Handle hasPaymentMethod - check both the flag and actual payment methods
  const hasPaymentMethod = useMemo(() => {
    // If we have payment methods, we have a payment method
    if (paymentMethods && paymentMethods.length > 0) return true;
    // Otherwise check the flag
    return hasPaymentMethodData?.hasPaymentMethod || false;
  }, [hasPaymentMethodData, paymentMethods]);

  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      const publishableKey =
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ||
        "";
      if (publishableKey) {
        const stripe = await loadStripe(publishableKey);
        setStripePromise(stripe);
      }
    };
    initStripe();
  }, []);

  // Fetch payment methods on mount
  useEffect(() => {
    dispatch(getPaymentMethods());
    dispatch(checkHasPaymentMethod());
  }, [dispatch]);

  // Reset SetupIntent state when modal closes
  useEffect(() => {
    if (!showAddCardModal) {
      setSetupIntentClientSecret(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setIsUpdateMode(false);
      setUpdatingPaymentMethodId(null);
      setupIntentRequestedRef.current = false;
    }
  }, [showAddCardModal]);

  // Refresh payment methods after attach/remove
  useEffect(() => {
    if (attachSuccess) {
      dispatch(getPaymentMethods());
      dispatch(checkHasPaymentMethod());
      dispatch(resetAttachPaymentMethod());
      setShowAddCardModal(false);
      setSetupIntentClientSecret(null);
      setIsProcessing(false);
      setErrorMessage(null);
      setIsUpdateMode(false);
      setUpdatingPaymentMethodId(null);
      setupIntentRequestedRef.current = false;
    }
  }, [attachSuccess, dispatch]);

  // Separate effect for remove to prevent duplicate refreshes
  useEffect(() => {
    if (removeSuccess) {
      // Use a small delay to ensure Stripe has processed the deletion
      const refreshTimer = setTimeout(() => {
        dispatch(getPaymentMethods());
        dispatch(checkHasPaymentMethod());
        dispatch(resetRemovePaymentMethod());
      }, 300);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [removeSuccess, dispatch]);

  // Create SetupIntent when modal opens
  useEffect(() => {
    if (
      showAddCardModal &&
      !setupIntentClientSecret &&
      !isCreatingSetupIntent &&
      !setupIntentRequestedRef.current &&
      stripePromise
    ) {
      setupIntentRequestedRef.current = true;
      dispatch(createSetupIntent());
    }
  }, [showAddCardModal, setupIntentClientSecret, isCreatingSetupIntent, stripePromise, dispatch]);

  // Get SetupIntent client secret when created
  useEffect(() => {
    if (setupIntentSuccess && setupIntentData?.clientSecret) {
      setSetupIntentClientSecret(setupIntentData.clientSecret);
      setErrorMessage(null);
      setupIntentRequestedRef.current = false; // Reset after successful creation
    }
  }, [setupIntentSuccess, setupIntentData]);

  // Handle SetupIntent errors
  useEffect(() => {
    if (setupIntentError && showAddCardModal) {
      let errorMsg = setupIntentErrorMessage || "Failed to initialize payment form.";
      
      // Provide more specific error messages
      if (setupIntentErrorMessage?.includes("network") || setupIntentErrorMessage?.includes("connection")) {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (setupIntentErrorMessage?.includes("timeout")) {
        errorMsg = "Request timed out. Please try again.";
      } else if (setupIntentErrorMessage?.includes("server")) {
        errorMsg = "Server error. Please try again in a few moments.";
      }
      
      setErrorMessage(errorMsg);
    }
  }, [setupIntentError, setupIntentErrorMessage, showAddCardModal]);

  const handleAddCardSuccess = useCallback(
    async (paymentMethodId) => {
      try {
        if (isUpdateMode && updatingPaymentMethodId) {
          // Remove old payment method first, then attach new one
          await dispatch(removePaymentMethod(updatingPaymentMethodId)).unwrap();
        }
        await dispatch(attachPaymentMethod(paymentMethodId)).unwrap();
      } catch (error) {
        // Extract and format error message
        let errorMsg = "Failed to add payment method. Please try again.";
        
        if (error?.message) {
          errorMsg = error.message;
          
          // Provide specific messages for common errors
          if (error.message.includes("already added") || error.message.includes("duplicate")) {
            errorMsg = "This card is already added to your account. Please use a different card or remove the existing one first.";
          } else if (error.message.includes("expired")) {
            errorMsg = "Your card has expired. Please use a valid card with a future expiration date.";
          } else if (error.message.includes("invalid")) {
            errorMsg = "Invalid card details. Please check your card information and try again.";
          } else if (error.message.includes("declined")) {
            errorMsg = "Your card was declined. Please check your card details or try a different payment method.";
          } else if (error.message.includes("network") || error.message.includes("connection")) {
            errorMsg = "Network error. Please check your internet connection and try again.";
          }
        } else if (error?.response?.data?.message) {
          errorMsg = error.response.data.message;
        } else if (error?.error?.message) {
          errorMsg = error.error.message;
        }
        
        setErrorMessage(errorMsg);
        setIsProcessing(false);
      }
    },
    [dispatch, isUpdateMode, updatingPaymentMethodId]
  );

  const handleAddCardError = useCallback((error) => {
    // Error is already formatted in CardFormComponent, but ensure it's a string
    const errorMsg = typeof error === "string" ? error : error?.message || "An error occurred while processing your card.";
    setErrorMessage(errorMsg);
    setIsProcessing(false);
  }, []);

  const handleRemoveCard = useCallback(
    async (paymentMethodId) => {
      if (!paymentMethodId) {
        return;
      }
      
      // Prevent duplicate removal calls
      if (isRemoving) {
        return;
      }
      
      try {
        await dispatch(removePaymentMethod(paymentMethodId)).unwrap();
      } catch (error) {
        // Error handled by global error handler
        throw error;
      }
    },
    [dispatch, isRemoving]
  );

  const handleUpdateCard = useCallback(
    (paymentMethodId) => {
      setIsUpdateMode(true);
      setUpdatingPaymentMethodId(paymentMethodId);
      setShowAddCardModal(true);
    },
    []
  );

  return {
    paymentMethods,
    hasPaymentMethod,
    isLoading: isLoading || isCreatingSetupIntent || isAttaching || isRemoving,
    isChecking,
    isCreatingSetupIntent,
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
    isUpdateMode,
    updatingPaymentMethodId,
    isRemoving,
  };
}

export default usePaymentMethods;
