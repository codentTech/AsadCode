import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import {
  getPaymentByCollaboration,
  retryFunding,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import { AlertCircle, CheckCircle2, Clock, XCircle, RefreshCw } from "lucide-react";

const FUNDING_STATUS = {
  NOT_REQUIRED: "not_required",
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED_ACTION_REQUIRED: "failed_action_required",
};

function FundingStatusBadge({ contractId, compensationType }) {
  const dispatch = useDispatch();
  const [showRetryModal, setShowRetryModal] = useState(false);

  const {
    data: paymentData,
    isLoading: isLoadingPayment,
  } = useSelector((state) => state.collaborationPayment.getPaymentByCollaboration || {});

  const {
    isLoading: isRetrying,
    isSuccess: retrySuccess,
  } = useSelector((state) => state.collaborationPayment.retryFunding || {});

  // Only fetch payment status for PAID collaborations
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

  if (!shouldFetchPayment) {
    return null;
  }

  if (isLoadingPayment) {
    return (
      <li className="flex items-center justify-between">
        <span>Funding Status:</span>
        <span className="text-xs text-gray-500">Loading...</span>
      </li>
    );
  }

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

  const statusConfig = getStatusConfig();

  const handleRetryFunding = async () => {
    try {
      await dispatch(retryFunding({ collaborationId: contractId, paymentMethodId: null })).unwrap();
    } catch (error) {
      console.error("Error retrying funding:", error);
    }
  };

  return (
    <>
      <li className="flex items-center justify-between">
        <span>Funding Status:</span>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded ${statusConfig.color}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
          {fundingStatus === FUNDING_STATUS.FAILED_ACTION_REQUIRED && (
            <CustomButton
              text="Retry"
              className="btn-secondary text-xs px-2 py-1"
              onClick={() => setShowRetryModal(true)}
              icon={<RefreshCw className="w-3 h-3" />}
              loading={isRetrying}
              disabled={isRetrying}
            />
          )}
        </div>
      </li>

      {/* Retry Funding Modal */}
      {showRetryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Retry Funding</h3>
                <p className="text-sm text-gray-600">
                  The previous payment attempt failed. Would you like to retry with your default
                  payment method, or update your payment method first?
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <CustomButton
                text="Cancel"
                className="btn-secondary"
                onClick={() => setShowRetryModal(false)}
                disabled={isRetrying}
              />
              <CustomButton
                text="Update Payment Method"
                className="btn-outline"
                onClick={() => {
                  setShowRetryModal(false);
                  window.location.href = "/settings/payments/payment-methods";
                }}
                disabled={isRetrying}
              />
              <CustomButton
                text={isRetrying ? "Retrying..." : "Retry Funding"}
                className="btn-primary"
                onClick={handleRetryFunding}
                loading={isRetrying}
                disabled={isRetrying}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FundingStatusBadge;
