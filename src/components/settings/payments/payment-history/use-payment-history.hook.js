import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCreatorPayments } from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function usePaymentHistory() {
  const dispatch = useDispatch();

  const {
    data: paymentsData,
    isLoading,
    isSuccess,
    isError,
  } = useSelector((state) => state.collaborationPayment?.getCreatorPayments || {});

  useEffect(() => {
    dispatch(getCreatorPayments());
  }, [dispatch]);

  // Transform payment data for table display
  const payments = useMemo(() => {
    if (!isSuccess || !paymentsData || !Array.isArray(paymentsData)) {
      return [];
    }

    return paymentsData.map((payment) => {
      // Get campaign name from collaboration (contract) -> campaign relation
      const campaignName =
        payment.collaboration?.campaign?.campaign_title ||
        payment.collaboration?.campaign?.title ||
        "Unknown Campaign";

      // Get brand name from brand relation
      const brandName =
        payment.brand?.brand_profile?.brand_name ||
        `${payment.brand?.first_name || ""} ${payment.brand?.last_name || ""}`.trim() ||
        "Unknown Brand";

      // Convert cents to dollars
      const amount = payment.gross_amount_cents
        ? (payment.gross_amount_cents / 100).toFixed(2)
        : 0;

      // Determine status based on payout_status
      // If payout is COMPLETED, it's paid
      // If payout is BLOCKED or PENDING, it's pending
      let status = "pending";
      if (payment.payout_status === "COMPLETED") {
        status = "paid";
      } else if (payment.payout_status === "BLOCKED" || payment.payout_status === "PENDING") {
        status = "pending";
      }

      // Get payout date
      const datePaid = payment.payout_completed_at
        ? new Date(payment.payout_completed_at).toISOString().split("T")[0]
        : null;

      return {
        id: payment.id,
        paymentId: payment.id,
        campaignName,
        brandName,
        amount: parseFloat(amount),
        status,
        datePaid,
        // Include full payment object for details view
        paymentData: payment,
        fundingStatus: payment.funding_status,
        payoutStatus: payment.payout_status,
        currency: payment.currency || "USD",
        grossAmountCents: payment.gross_amount_cents,
        netPayoutCents: payment.net_payout_cents,
        heldAmountCents: payment.held_amount_cents,
      };
    });
  }, [isSuccess, paymentsData]);

  return {
    payments,
    isLoading,
    isError,
    isSuccess,
  };
}

export default usePaymentHistory;
