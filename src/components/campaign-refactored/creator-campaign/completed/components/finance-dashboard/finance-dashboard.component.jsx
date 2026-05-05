import { ChevronDown, ChevronUp, Star } from "lucide-react";
import TextArea from "@/common/components/text-area/text-area.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import { getCompensationTypeLabel } from "@/common/utils/campaign.utils";
import useFinanceDashboard from "./use-finance-dashboard.hook";

const FinanceDashboard = ({ expandedMonths, setExpandedMonths, selectedCampaign }) => {
  const {
    user,
    creatorProfileId,
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
    isReviewsLoading,
    showMarkCompleteModal,
    markCompleteRating,
    setMarkCompleteRating,
    markCompleteFeedback,
    setMarkCompleteFeedback,
    handleMarkCompleteClick,
    handleCancelMarkComplete,
    handleConfirmMarkComplete,
    handleToggleMonth,
  } = useFinanceDashboard(selectedCampaign, setExpandedMonths);

  const showMarkCompleteCta =
    reviewStatus &&
    !reviewStatus.hasCreatorReview &&
    (selectedCampaign?.id || selectedCampaign?.campaign?.id) &&
    creatorProfileId;

  return (
    <div className="flex w-full flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 p-3 sm:p-4">
        <h2 className="mb-2 text-sm font-semibold text-gray-900 sm:text-lg md:text-xl">
          Finance Dashboard
        </h2>
        <div className="rounded-lg bg-gray-100 p-2">
          <p className="text-[10px] text-gray-600 sm:text-sm">Total Earnings</p>
          {paymentsLoading ? (
            <div className="flex items-center gap-2">
              <Loader loading={true} size="small" />
              <p className="text-sm font-bold text-gray-400 sm:text-lg">Loading...</p>
            </div>
          ) : (
            <p className="text-sm font-bold text-green-600 sm:text-lg">
              $
              {totalEarnings.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-lg">Payment History</h3>
          {paymentsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader loading={true} />
            </div>
          ) : Object.keys(paymentHistory).length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-xs text-gray-500 sm:text-sm">No payment history available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(paymentHistory).map(([month, data]) => (
                <div key={month} className="rounded-lg border border-gray-200">
                  <div
                    onClick={() => handleToggleMonth(month)}
                    className="flex cursor-pointer items-center justify-between px-3 py-1 hover:bg-gray-50"
                  >
                    <div>
                      <p className="text-[10px] font-medium text-gray-900 sm:text-xs">{month}</p>
                      <p className="text-[10px] font-bold text-green-600 sm:text-xs">
                        ${data.total}
                      </p>
                    </div>
                    {expandedMonths[month] ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {expandedMonths[month] && (
                    <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 h-40 space-y-2 overflow-y-auto pr-2 text-xs">
                      {data.payments.map((payment, index) => {
                        let compensationDisplay = "";
                        if (payment.commissionPercentage) {
                          compensationDisplay = `${payment.commissionPercentage}% Commission`;
                        } else if (payment.creatorFixedPrice) {
                          compensationDisplay = "Paid";
                        } else if (payment.productValue) {
                          compensationDisplay = "Gifted Product";
                        } else if (payment.compensationType) {
                          compensationDisplay = getCompensationTypeLabel(payment.compensationType);
                        } else {
                          compensationDisplay = "Payment";
                        }

                        return (
                          <div key={index} className="rounded bg-gray-50 p-2 text-sm">
                            <p className="truncate text-[10px] font-medium text-gray-900 sm:text-xs">
                              {payment.campaign}
                            </p>
                            <div className="mt-1 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-600 sm:text-xs">
                                  {compensationDisplay} -
                                </span>
                                <span className="text-[10px] font-semibold text-gray-900 sm:text-xs">
                                  ${payment.amount}
                                </span>
                              </div>
                              <span className="text-[10px] text-gray-500 sm:text-xs">
                                {payment.date}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-b border-gray-200 p-3 sm:p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-900 sm:text-lg">Reviews</h3>

          {isReviewsLoading ? (
            <div className="flex justify-center py-4">
              <Loader loading={true} size="small" />
            </div>
          ) : null}

          {!isReviewsLoading &&
            reviewStatus &&
            reviewStatus.hasBrandReview &&
            !reviewStatus.hasCreatorReview && (
              <div className="mb-3 rounded-lg border border-blue-200 bg-blue-50 p-2">
                <p className="text-[11px] text-blue-800 sm:text-xs">
                  The brand has submitted a review. Use Mark Complete below to submit yours and view
                  both reviews.
                </p>
              </div>
            )}

          {(() => {
            const filteredReviews =
              campaignReviews?.filter((review) => {
                if (!reviewStatus?.isUnlocked) {
                  return review.created_by?.id === user?.id;
                }
                return review.reviewer_role === "BRAND";
              }) || [];

            return reviewStatus && reviewStatus.isUnlocked && filteredReviews.length > 0 ? (
              <div className="mb-3 space-y-2">
                {filteredReviews.map((review, index) => (
                  <div key={review.id || index} className="border-l-2 border-indigo-500 py-1 pl-3">
                    <span className="mb-1 block text-[10px] font-semibold text-gray-500">
                      Brand&apos;s Review
                    </span>
                    <div className="mb-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${i < (review.rating || 0) ? "fill-current text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-gray-700">{review.review}</p>
                    <span className="mt-0.5 block text-[11px] text-gray-400">
                      {new Date(review.created_at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : null;
          })()}

          {showMarkCompleteCta ? (
            <div className="mt-2">
              <CustomButton
                text="Mark Complete"
                onClick={handleMarkCompleteClick}
                className={
                  isPaymentSettlementLockActive || paymentsLoading
                    ? "btn-disabled w-full"
                    : "btn-primary w-full"
                }
                disabled={
                  isPaymentSettlementLockActive || paymentsLoading || createReviewState.isLoading
                }
              />
              {isPaymentSettlementLockActive && formattedPayoutAvailableAt ? (
                <p className="mt-2 text-[10px] leading-snug text-gray-600 sm:text-xs">
                  Payment marking is available from {formattedPayoutAvailableAt}. This allows time
                  for the payment to settle and prevents any payout issues.
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      <Modal
        show={showMarkCompleteModal}
        onClose={handleCancelMarkComplete}
        title={`Leave a review for ${brandName}`}
        size="md"
      >
        <div className="p-4">
          <div className="mb-6">
            <p className="mb-4 text-sm text-gray-600">
              Your review helps other creators choose brands to work with on CleerCut.
            </p>
            <div className="mb-4 flex items-center justify-between">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 cursor-pointer transition-colors ${
                      i < markCompleteRating ? "fill-current text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setMarkCompleteRating(i + 1)}
                  />
                ))}
                {markCompleteRating > 0 ? (
                  <span className="ml-2 text-sm text-gray-600">{markCompleteRating}/5</span>
                ) : null}
              </div>
            </div>
            <div className="mb-4">
              <TextArea
                label="Feedback"
                placeholder="Share your experience working with this brand..."
                value={markCompleteFeedback}
                onChange={(e) => setMarkCompleteFeedback(e.target.value)}
                rows={4}
              />
            </div>
            <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-xs text-blue-800">
                <span className="font-semibold">Notice:</span> Submitting releases your payout when
                funds have settled. This collaboration closes after you complete this step.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel flex-1"
              onClick={handleCancelMarkComplete}
              disabled={createReviewState.isLoading}
            />
            <CustomButton
              text="Mark Complete"
              className="btn-primary flex-1"
              onClick={handleConfirmMarkComplete}
              disabled={
                !markCompleteFeedback ||
                !markCompleteFeedback.trim() ||
                markCompleteRating === 0 ||
                createReviewState.isLoading
              }
              loading={createReviewState.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinanceDashboard;
