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
    isError: attachError,
    message: attachErrorMessage,
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

  // Reset SetupIntent state when modal closes and refresh payment methods
  useEffect(() => {
    if (!showAddCardModal) {
      setSetupIntentClientSecret(null);
      setErrorMessage(null);
      setIsProcessing(false);
      setupIntentRequestedRef.current = false;
      // Refresh payment methods when modal closes to ensure we have the latest data
      dispatch(getPaymentMethods());
      dispatch(checkHasPaymentMethod());
    }
  }, [showAddCardModal, dispatch]);

  // Refresh payment methods after attach/remove
  useEffect(() => {
    if (attachSuccess) {
      // Small delay to ensure Stripe has processed the attachment
      const refreshTimer = setTimeout(() => {
        dispatch(getPaymentMethods());
        dispatch(checkHasPaymentMethod());
        dispatch(resetAttachPaymentMethod());
        setShowAddCardModal(false);
        setSetupIntentClientSecret(null);
        setIsProcessing(false);
        setErrorMessage(null);
        setupIntentRequestedRef.current = false;
      }, 500);
      
      return () => clearTimeout(refreshTimer);
    }
  }, [attachSuccess, dispatch]);

  // Check for attach errors to refresh and prevent duplicates from showing
  useEffect(() => {
    if (attachError && attachErrorMessage) {
      const isDuplicate = attachErrorMessage.includes("already added") || attachErrorMessage.includes("duplicate");
      if (isDuplicate) {
        // Refresh to show existing cards and prevent duplicate display
        setTimeout(() => {
          dispatch(getPaymentMethods());
          dispatch(checkHasPaymentMethod());
        }, 300);
      }
    }
  }, [attachError, attachErrorMessage, dispatch]);

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
        await dispatch(attachPaymentMethod(paymentMethodId)).unwrap();
      } catch (error) {
        // Extract and format error message
        let errorMsg = "Failed to add payment method. Please try again.";
        let isDuplicateError = false;
        let isCardError = false;
        
        // Check error message from various sources
        const errorMessage = 
          error?.message || 
          error?.response?.data?.message || 
          error?.error?.message || 
          "";
        
        if (errorMessage) {
          errorMsg = errorMessage;
          isDuplicateError = errorMessage.includes("already added") || errorMessage.includes("duplicate");
          isCardError = 
            isDuplicateError ||
            errorMessage.includes("expired") ||
            errorMessage.includes("invalid") ||
            errorMessage.includes("declined") ||
            errorMessage.includes("card") ||
            errorMessage.includes("payment method");
          
          // Provide specific messages for common errors
          if (isDuplicateError) {
            errorMsg = "This card is already added to your account. Please use a different card or remove the existing one first.";
            // Refresh payment methods to show the existing card (don't add new one)
            setTimeout(() => {
              dispatch(getPaymentMethods());
              dispatch(checkHasPaymentMethod());
            }, 300);
          } else if (errorMessage.includes("expired")) {
            errorMsg = "Your card has expired. Please use a valid card with a future expiration date.";
          } else if (errorMessage.includes("invalid")) {
            errorMsg = "Invalid card details. Please check your card information and try again.";
          } else if (errorMessage.includes("declined")) {
            errorMsg = "Your card was declined. Please check your card details or try a different payment method.";
          } else if (errorMessage.includes("network") || errorMessage.includes("connection")) {
            errorMsg = "Network error. Please check your internet connection and try again.";
          }
        }
        
        setErrorMessage(errorMsg);
        setIsProcessing(false);
        
        // Don't refresh payment methods for card errors (except duplicate) - we don't want to show a card that wasn't actually added
        // The duplicate case is handled above to show the existing card
      }
    },
    [dispatch]
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

  const handleRefreshPaymentMethods = useCallback(() => {
    dispatch(getPaymentMethods());
    dispatch(checkHasPaymentMethod());
  }, [dispatch]);

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
    handleRefreshPaymentMethods,
    stripePromise,
    setupIntentClientSecret,
    isProcessing,
    setIsProcessing,
    errorMessage,
    setErrorMessage,
    isRemoving,
  };
}

export default usePaymentMethods;
