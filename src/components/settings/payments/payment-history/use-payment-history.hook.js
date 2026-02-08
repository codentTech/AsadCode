import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCreatorMode } from "@/common/utils/users.util";
import {
  getCreatorPayments,
  getBrandPayments,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function usePaymentHistory() {
  const dispatch = useDispatch();
  const isCreator = isCreatorMode();

  const {
    data: creatorPaymentsData,
    isLoading: creatorLoading,
  } = useSelector((state) => state.collaborationPayment.getCreatorPayments || {});

  const {
    data: brandPaymentsData,
    isLoading: brandLoading,
  } = useSelector((state) => state.collaborationPayment.getBrandPayments || {});

  const rawPayments = isCreator ? creatorPaymentsData : brandPaymentsData;
  const isLoading = isCreator ? creatorLoading : brandLoading;

  // Fetch payments on mount
  useEffect(() => {
    if (isCreator) {
      dispatch(getCreatorPayments());
    } else {
      dispatch(getBrandPayments());
    }
  }, [dispatch, isCreator]);

  // Transform payments data
  const payments = useMemo(() => {
    if (!rawPayments || !Array.isArray(rawPayments)) {
      return [];
    }

    return rawPayments.map((payment) => {
      const amount = payment.gross_amount_cents
        ? (payment.gross_amount_cents / 100).toFixed(2)
        : 0;

      // Determine status based on funding and payout status
      let status = "pending";
      if (payment.payout_status === "PAID") {
        status = "paid";
      } else if (payment.funding_status === "FAILED") {
        status = "failed";
      } else if (payment.funding_status === "SUCCEEDED" && payment.payout_status !== "PAID") {
        status = "pending";
      }

      // Get date paid (when payout was released)
      const datePaid =
        payment.payout_status === "PAID" && payment.payout_released_at
          ? payment.payout_released_at
          : null;

      // For creators: show brand name
      // For brands: show creator name
      const collaboratorName = isCreator
        ? payment.brand?.brand_name || payment.brand?.user?.first_name || "Unknown Brand"
        : payment.creator?.user?.first_name && payment.creator?.user?.last_name
        ? `${payment.creator.user.first_name} ${payment.creator.user.last_name}`
        : payment.creator?.user?.first_name || "Unknown Creator";

      return {
        id: payment.id,
        campaignName: payment.campaign?.campaign_title || "Unknown Campaign",
        collaboratorName, // Brand name for creators, Creator name for brands
        amount: parseFloat(amount),
        status,
        datePaid,
        payment, // Keep full payment object for details
      };
    });
  }, [rawPayments, isCreator]);

  return {
    payments,
    isLoading,
    isCreator,
  };
}

export default usePaymentHistory;
