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
    isSuccess: creatorSuccess,
  } = useSelector((state) => state.collaborationPayment?.getCreatorPayments || {});

  const {
    data: brandPaymentsData,
    isLoading: brandLoading,
    isSuccess: brandSuccess,
  } = useSelector((state) => state.collaborationPayment?.getBrandPayments || {});

  const rawPayments = isCreator ? creatorPaymentsData : brandPaymentsData;
  const isLoading = isCreator ? creatorLoading : brandLoading;
  const isSuccess = isCreator ? creatorSuccess : brandSuccess;

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
    if (!isSuccess || !rawPayments || !Array.isArray(rawPayments)) {
      return [];
    }

    return rawPayments.map((payment) => {
      // Get campaign name from various possible locations
      const campaignName =
        payment.collaboration?.campaign?.campaign_title ||
        payment.campaign?.campaign_title ||
        payment.collaboration?.campaign?.title ||
        "Unknown Campaign";

      // Get brand name (for creators)
      const brandName =
        payment.brand?.brand_profile?.brand_name ||
        payment.brand?.brand_name ||
        `${payment.brand?.first_name || ""} ${payment.brand?.last_name || ""}`.trim() ||
        "Unknown Brand";

      // Get creator name (for brands)
      const creatorName =
        payment.creator?.user?.first_name && payment.creator?.user?.last_name
          ? `${payment.creator.user.first_name} ${payment.creator.user.last_name}`
          : payment.creator?.user?.first_name || "Unknown Creator";

      // Convert cents to dollars
      const amount = payment.gross_amount_cents
        ? parseFloat((payment.gross_amount_cents / 100).toFixed(2))
        : 0;

      // Determine status based on funding and payout status
      let status = "pending";
      if (
        payment.payout_status === "PAID" ||
        payment.payout_status === "COMPLETED"
      ) {
        status = "paid";
      } else if (payment.funding_status === "FAILED") {
        status = "failed";
      } else if (
        payment.funding_status === "SUCCEEDED" &&
        payment.payout_status !== "PAID" &&
        payment.payout_status !== "COMPLETED"
      ) {
        status = "pending";
      }

      // Get date paid (when payout was released)
      const datePaid =
        (payment.payout_status === "PAID" ||
          payment.payout_status === "COMPLETED") &&
        (payment.payout_released_at || payment.payout_completed_at)
          ? payment.payout_released_at || payment.payout_completed_at
          : null;

      // For creators: show brand name
      // For brands: show creator name
      const collaboratorName = isCreator ? brandName : creatorName;

      return {
        id: payment.id,
        paymentId: payment.id,
        campaignName,
        collaboratorName,
        brandName: isCreator ? brandName : undefined,
        creatorName: !isCreator ? creatorName : undefined,
        amount,
        status,
        datePaid,
        payment, // Keep full payment object for details
        paymentData: payment, // Also keep as paymentData for compatibility
        fundingStatus: payment.funding_status,
        payoutStatus: payment.payout_status,
        currency: payment.currency || "USD",
        grossAmountCents: payment.gross_amount_cents,
        netPayoutCents: payment.net_payout_cents,
        heldAmountCents: payment.held_amount_cents,
        funded_at: payment.funded_at,
        payout_released_at: payment.payout_released_at,
        payout_completed_at: payment.payout_completed_at,
      };
    });
  }, [rawPayments, isSuccess, isCreator]);

  return {
    payments,
    isLoading,
    isCreator,
    isSuccess,
  };
}

export default usePaymentHistory;
