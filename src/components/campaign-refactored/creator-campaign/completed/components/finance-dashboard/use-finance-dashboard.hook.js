import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import {
  createCampaignReview,
  getCampaignReviewsByCreatorProfile,
  getReviewStatus,
  resetCreateCampaignReview,
} from "@/provider/features/campaign-reviews/campaign-reviews.slice";
import { getCreatorCollaborationHistory } from "@/provider/features/campaigns/campaigns.slice";
import {
  calculateEarningFromCampaignType,
  historyRowsForSelection,
  sumPaymentHistoryByMonth,
} from "@/common/utils/creator-collaboration-finance.util";
import {
  getCollaborationHistoryRows,
  getExpectedPayoutAvailableAtFromHistoryRow,
} from "@/common/utils/creator-payout-availability.util";
import { getUser } from "@/common/utils/users.util";
import { PAYOUT_AVAILABLE_DATETIME_FORMAT } from "@/common/utils/date.utils";

export default function useFinanceDashboard(selectedCampaign, setExpandedMonths) {
  const dispatch = useDispatch();
  const user = getUser();
  const creatorProfileId = user?.creator_profile?.id;

  const historySlice = useSelector(
    (state) => state.campaigns.getCreatorCollaborationHistory || {}
  );
  const { data: historyData, isLoading: paymentsLoading, isSuccess: historySuccess } = historySlice;

  const {
    createCampaignReview: createReviewState,
    getCampaignReviewsByCreatorProfile: getReviewsState,
    getReviewStatus: getReviewStatusState,
  } = useSelector((state) => state.campaignReviews || {});

  const [showMarkCompleteModal, setShowMarkCompleteModal] = useState(false);
  const [markCompleteRating, setMarkCompleteRating] = useState(0);
  const [markCompleteFeedback, setMarkCompleteFeedback] = useState("");
  const pendingMarkCompleteRef = useRef(false);

  const reviewStatus = getReviewStatusState.data || null;
  const campaignReviews = getReviewsState.data || [];

  const campaignId = selectedCampaign?.id || selectedCampaign?.campaign?.id;
  const brandName =
    selectedCampaign?.created_by?.brand_profile?.brand_name ||
    selectedCampaign?.brand?.name ||
    "the brand";

  useEffect(() => {
    if (creatorProfileId) {
      dispatch(getCreatorCollaborationHistory(creatorProfileId));
    }
  }, [dispatch, creatorProfileId]);

  const paymentHistory = useMemo(() => {
    const rows = getCollaborationHistoryRows(historyData);
    if (!historySuccess || !Array.isArray(rows)) {
      return {};
    }

    const filteredHistory = historyRowsForSelection(rows, selectedCampaign);
    const paymentsByMonth = {};

    filteredHistory.forEach((item) => {
      const paymentAmount = calculateEarningFromCampaignType(item);

      if (item.completionDate && paymentAmount > 0) {
        const completedDate = new Date(item.completionDate);
        const monthKey = format(completedDate, "MMMM yyyy");
        const dayKey = format(completedDate, "MMMM d");

        if (!paymentsByMonth[monthKey]) {
          paymentsByMonth[monthKey] = {
            total: 0,
            payments: [],
          };
        }

        paymentsByMonth[monthKey].total += Number(paymentAmount);
        const commissionPercentage = item.campaign?.commission_percentage || null;

        paymentsByMonth[monthKey].payments.push({
          campaign: item.campaignName || "Campaign",
          amount: Number(paymentAmount).toFixed(2),
          date: dayKey,
          completedAt: completedDate,
          compensationType: item.campaign?.compensation_type || null,
          campaignType: item.campaign?.campaign_type || null,
          commissionPercentage: commissionPercentage,
          creatorFixedPrice: item.campaign?.creator_fixed_price || null,
          productValue: item.campaign?.product_value || null,
          expectedPayoutAvailableAt:
            getExpectedPayoutAvailableAtFromHistoryRow(item) ?? null,
          payoutStatus: item.payoutStatus || null,
          payoutBlockReason: item.payoutBlockReason || null,
        });
      }
    });

    Object.keys(paymentsByMonth).forEach((month) => {
      if (paymentsByMonth[month].total === 0) {
        delete paymentsByMonth[month];
      } else {
        paymentsByMonth[month].payments.sort(
          (a, b) => new Date(b.completedAt) - new Date(a.completedAt)
        );
      }
    });

    const sortedMonths = Object.keys(paymentsByMonth).sort((a, b) => {
      const dateA = new Date(a);
      const dateB = new Date(b);
      return dateB - dateA;
    });

    const sortedPaymentHistory = {};
    sortedMonths.forEach((month) => {
      sortedPaymentHistory[month] = paymentsByMonth[month];
    });

    return sortedPaymentHistory;
  }, [historySuccess, historyData, selectedCampaign]);

  const totalEarnings = useMemo(
    () => sumPaymentHistoryByMonth(paymentHistory),
    [paymentHistory]
  );

  const expectedPayoutAvailableAt = useMemo(() => {
    const rows = getCollaborationHistoryRows(historyData);
    if (!historySuccess || !Array.isArray(rows)) {
      return null;
    }
    const scope = historyRowsForSelection(rows, selectedCampaign);
    if (selectedCampaign) {
      return getExpectedPayoutAvailableAtFromHistoryRow(scope[0]);
    }
    const row = scope.find((item) => getExpectedPayoutAvailableAtFromHistoryRow(item) != null);
    return getExpectedPayoutAvailableAtFromHistoryRow(row) ?? null;
  }, [historySuccess, historyData, selectedCampaign]);

  const formattedPayoutAvailableAt = useMemo(() => {
    if (!expectedPayoutAvailableAt) return null;
    return format(new Date(expectedPayoutAvailableAt), PAYOUT_AVAILABLE_DATETIME_FORMAT);
  }, [expectedPayoutAvailableAt]);

  const isPaymentSettlementLockActive = useMemo(() => {
    if (expectedPayoutAvailableAt == null || expectedPayoutAvailableAt === "") {
      return false;
    }
    const unlockMs = new Date(expectedPayoutAvailableAt).getTime();
    if (Number.isNaN(unlockMs)) {
      return false;
    }
    return unlockMs > Date.now();
  }, [expectedPayoutAvailableAt]);

  useEffect(() => {
    if (!campaignId || !creatorProfileId) return;
    dispatch(getReviewStatus({ campaignId, creatorProfileId }));
    dispatch(getCampaignReviewsByCreatorProfile({ campaignId, creatorProfileId }));
  }, [dispatch, campaignId, creatorProfileId]);

  const handleMarkCompleteClick = useCallback(() => {
    dispatch(resetCreateCampaignReview());
    setShowMarkCompleteModal(true);
  }, [dispatch]);

  const handleCancelMarkComplete = useCallback(() => {
    dispatch(resetCreateCampaignReview());
    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
  }, [dispatch]);

  const handleConfirmMarkComplete = useCallback(() => {
    if (
      !campaignId ||
      !creatorProfileId ||
      markCompleteRating === 0 ||
      !markCompleteFeedback ||
      !markCompleteFeedback.trim()
    ) {
      return;
    }
    pendingMarkCompleteRef.current = true;
    dispatch(
      createCampaignReview({
        campaignId,
        creatorProfileId,
        reviewData: {
          rating: markCompleteRating,
          review: markCompleteFeedback.trim(),
        },
      })
    );
  }, [campaignId, creatorProfileId, markCompleteRating, markCompleteFeedback, dispatch]);

  useEffect(() => {
    if (!pendingMarkCompleteRef.current || !createReviewState.isSuccess) return;
    pendingMarkCompleteRef.current = false;
    setShowMarkCompleteModal(false);
    setMarkCompleteRating(0);
    setMarkCompleteFeedback("");
    dispatch(resetCreateCampaignReview());
    if (campaignId && creatorProfileId) {
      dispatch(getReviewStatus({ campaignId, creatorProfileId }));
      dispatch(getCampaignReviewsByCreatorProfile({ campaignId, creatorProfileId }));
    }
    if (creatorProfileId) {
      dispatch(getCreatorCollaborationHistory(creatorProfileId));
    }
  }, [createReviewState.isSuccess, dispatch, campaignId, creatorProfileId]);

  useEffect(() => {
    if (!pendingMarkCompleteRef.current || !createReviewState.isError) return;
    pendingMarkCompleteRef.current = false;
  }, [createReviewState.isError]);

  const handleToggleMonth = useCallback(
    (month) => {
      setExpandedMonths((prev) => ({
        ...prev,
        [month]: !prev[month],
      }));
    },
    [setExpandedMonths]
  );

  return {
    user,
    creatorProfileId,
    campaignId,
    brandName,
    paymentHistory,
    totalEarnings,
    paymentsLoading,
    formattedPayoutAvailableAt,
    expectedPayoutAvailableAt,
    isPaymentSettlementLockActive,
    reviewStatus,
    campaignReviews,
    createReviewState,
    isReviewsLoading:
      getReviewStatusState.isLoading || getReviewsState.isLoading,
    showMarkCompleteModal,
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
    handleToggleMonth,
  };
}
