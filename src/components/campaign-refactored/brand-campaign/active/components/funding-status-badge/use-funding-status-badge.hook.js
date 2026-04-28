import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getPaymentByCollaboration,
  retryFunding,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import { CheckCircle2, Clock, XCircle } from "lucide-react";

const FUNDING_STATUS = {
  NOT_REQUIRED: "not_required",
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED_ACTION_REQUIRED: "failed_action_required",
};

export default function useFundingStatusBadge({ contractId, compensationType }) {
  const dispatch = useDispatch();

  // ============================================
  // 2. REDUX SELECTORS
  // ============================================
  const { data: paymentData, isLoading: isLoadingPayment } = useSelector(
    (state) => state.collaborationPayment.getPaymentByCollaboration || {}
  );

  const { isLoading: isRetrying, isSuccess: retrySuccess } = useSelector(
    (state) => state.collaborationPayment.retryFunding || {}
  );

  // ============================================
  // 3. LOCAL STATE
  // ============================================
  const [showRetryModal, setShowRetryModal] = useState(false);

  // ============================================
  // 4. USEEFFECTS
  // ============================================
  const shouldFetchPayment = compensationType === "PAID" || compensationType === "Paid";

  useEffect(() => {
    if (contractId && shouldFetchPayment) {
      dispatch(getPaymentByCollaboration(contractId));
    }
  }, [contractId, shouldFetchPayment, dispatch]);

  useEffect(() => {
    if (retrySuccess) {
      dispatch(getPaymentByCollaboration(contractId));
      setShowRetryModal(false);
    }
  }, [retrySuccess, contractId, dispatch]);

  // ============================================
  // 5. CALLBACKS
  // ============================================
  const handleRetryFunding = async () => {
    try {
      await dispatch(retryFunding({ collaborationId: contractId, paymentMethodId: null })).unwrap();
    } catch (error) {
      console.error("Error retrying funding:", error);
    }
  };

  const handleOpenModal = () => setShowRetryModal(true);
  const handleCloseModal = () => setShowRetryModal(false);

  const handleUpdatePaymentMethod = () => {
    setShowRetryModal(false);
    window.location.href = "/settings/payments/payment-methods";
  };

  // ============================================
  // 6. COMPUTED VALUES
  // ============================================
  const fundingStatus = paymentData?.funding_status || FUNDING_STATUS.NOT_REQUIRED;

  const getStatusConfig = () => {
    switch (fundingStatus) {
      case FUNDING_STATUS.SUCCEEDED:
        return {
          label: "Funded",
          icon: <CheckCircle2 className="w-3 h-3" />,
          color: "text-green-700 bg-green-100",
        };
      case FUNDING_STATUS.PENDING:
        return {
          label: "Funding Pending",
          icon: <Clock className="w-3 h-3" />,
          color: "text-yellow-700 bg-yellow-100",
        };
      case FUNDING_STATUS.FAILED_ACTION_REQUIRED:
        return {
          label: "Funding Failed",
          icon: <XCircle className="w-3 h-3" />,
          color: "text-red-700 bg-red-100",
        };
      default:
        return {
          label: "Not Required",
          icon: null,
          color: "text-gray-700 bg-gray-100",
        };
    }
  };

  // ============================================
  // 7. RETURN OBJECT
  // ============================================
  return {
    shouldFetchPayment,
    isLoadingPayment,
    fundingStatus,
    statusConfig: getStatusConfig(),
    showRetryModal,
    isRetrying,
    handleRetryFunding,
    handleOpenModal,
    handleCloseModal,
    handleUpdatePaymentMethod,
  };
}
