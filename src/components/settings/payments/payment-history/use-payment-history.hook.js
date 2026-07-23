import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isCreatorMode } from "@/common/utils/users.util";
import {
  getCreatorPayments,
  getBrandPayments,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import {
  getShopifyCommissionSettlements,
  selectShopifyCommissionSettlementsState,
} from "@/provider/features/shopify/shopify.slice";

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

  const commissionSettlementsState = useSelector(selectShopifyCommissionSettlementsState);

  const rawPayments = isCreator ? creatorPaymentsData : brandPaymentsData;
  const isLoading =
    (isCreator ? creatorLoading : brandLoading) ||
    (!isCreator && Boolean(commissionSettlementsState?.isLoading));
  const isSuccess = isCreator ? creatorSuccess : brandSuccess;

  useEffect(() => {
    if (isCreator) {
      dispatch(getCreatorPayments());
    } else {
      dispatch(getBrandPayments());
      dispatch(getShopifyCommissionSettlements());
    }
  }, [dispatch, isCreator]);

  const payments = useMemo(() => {
    const escrowRows =
      isSuccess && Array.isArray(rawPayments)
        ? rawPayments.map((payment) => {
            const campaignName =
              payment.collaboration?.campaign?.campaign_title ||
              payment.campaign?.campaign_title ||
              payment.collaboration?.campaign?.title ||
              "Unknown Campaign";

            const brandName =
              payment.brand?.brand_profile?.brand_name ||
              payment.brand?.brand_name ||
              `${payment.brand?.first_name || ""} ${payment.brand?.last_name || ""}`.trim() ||
              "Unknown Brand";

            const creatorName =
              payment.creator?.user?.first_name && payment.creator?.user?.last_name
                ? `${payment.creator.user.first_name} ${payment.creator.user.last_name}`
                : payment.creator?.user?.first_name || "Unknown Creator";

            const amount = payment.gross_amount_cents
              ? parseFloat((payment.gross_amount_cents / 100).toFixed(2))
              : 0;

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

            const datePaid =
              (payment.payout_status === "PAID" ||
                payment.payout_status === "COMPLETED") &&
              (payment.payout_released_at || payment.payout_completed_at)
                ? payment.payout_released_at || payment.payout_completed_at
                : null;

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
              payment,
              paymentData: payment,
              fundingStatus: payment.funding_status,
              payoutStatus: payment.payout_status,
              currency: payment.currency || "USD",
              grossAmountCents: payment.gross_amount_cents,
              netPayoutCents: payment.net_payout_cents,
              heldAmountCents: payment.held_amount_cents,
              funded_at: payment.funded_at,
              payout_released_at: payment.payout_released_at,
              payout_completed_at: payment.payout_completed_at,
              paymentType: "escrow",
            };
          })
        : [];

    if (isCreator) return escrowRows;

    const settlementRows = Array.isArray(commissionSettlementsState?.data)
      ? commissionSettlementsState.data.map((settlement) => {
          const statusRaw = String(settlement.status || "").toLowerCase();
          let status = "pending";
          if (statusRaw === "completed" || statusRaw === "charged" || statusRaw === "partial") {
            status = "paid";
          } else if (statusRaw === "failed") {
            status = "failed";
          }

          return {
            id: settlement.id,
            paymentId: settlement.id,
            campaignName: settlement.campaignTitle || "Affiliate commission",
            collaboratorName: "Commission settlement",
            amount: settlement.grossCents
              ? parseFloat((settlement.grossCents / 100).toFixed(2))
              : 0,
            status,
            datePaid: settlement.chargedAt || settlement.createdAt || null,
            payment: settlement,
            paymentData: settlement,
            fundingStatus: statusRaw,
            payoutStatus: statusRaw,
            currency: settlement.currency || "USD",
            grossAmountCents: settlement.grossCents,
            funded_at: settlement.chargedAt,
            paymentType: "shopify_commission",
          };
        })
      : [];

    return [...escrowRows, ...settlementRows].sort((a, b) => {
      const aTime = a.datePaid || a.funded_at || 0;
      const bTime = b.datePaid || b.funded_at || 0;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [
    rawPayments,
    isSuccess,
    isCreator,
    commissionSettlementsState?.data,
  ]);

  return {
    payments,
    isLoading,
    isCreator,
    isSuccess: isCreator ? isSuccess : isSuccess || commissionSettlementsState?.isSuccess,
  };
}

export default usePaymentHistory;
