import { ChevronDown, ChevronUp, Star } from "lucide-react";
import NotFound from "@/common/components/not-found/not-found.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useDeliverablesProgress from "@/components/campaign/campaigns/components/active/brand/components/deliverables-progress/use-deliverables-progress.hook";

const FinanceDashboard = ({
  paymentHistory,
  upcomingPayments,
  expandedMonths,
  setExpandedMonths,
  selectedCampaign,
}) => {
  const {
    newReviewText,
    setNewReviewText,
    newReviewRating,
    setNewReviewRating,
    handleSaveNewReview,
    reviewStatus,
    campaignReviews,
  } = useDeliverablesProgress(selectedCampaign?.id, selectedCampaign);
  const totalEarnings = Object.values(paymentHistory).reduce((sum, month) => sum + month.total, 0);

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  return (
    <div className="w-[27%] bg-white border-l border-gray-200 flex flex-col">
      {/* Double-blind review unlocked message placeholder
      {reviewStatus &&
        !reviewStatus.isUnlocked &&
        reviewStatus.hasBrandReview &&
        !reviewStatus.hasCreatorReview && (
          <div className="p-3 border-b border-gray-200">
            <NotFound
              title="Brand submitted a review"
              description="Submit your review to unlock and view both."
            />
          </div>
        )}

      {reviewStatus &&
        !reviewStatus.isUnlocked &&
        reviewStatus.hasCreatorReview &&
        !reviewStatus.hasBrandReview && (
          <div className="p-3 border-b border-gray-200">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <h4 className="text-sm font-semibold text-blue-800">Review Submitted</h4>
              </div>
              <p className="text-xs text-blue-700 mt-1">
                Your review has been submitted. Waiting for brand to submit their review to unlock
                both reviews.
              </p>
            </div>
          </div>
        )} */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Finance Dashboard</h2>
        <div className="bg-gray-100 p-2 rounded-lg">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-lg font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Payment History */}
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment History</h3>
          <div className="space-y-2">
            {Object.entries(paymentHistory).map(([month, data]) => (
              <div key={month} className="border border-gray-200 rounded-lg">
                <div
                  onClick={() => toggleMonth(month)}
                  className="px-3 py-1 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-medium text-gray-900">{month}</p>
                    <p className="text-xs text-green-600 font-bold">${data.total}</p>
                  </div>
                  {expandedMonths[month] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>

                {expandedMonths[month] && (
                  <div className="text-xs h-40 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {data.payments.map((payment, index) => (
                      <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {payment.campaign}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-900">${payment.amount}</span>
                          <span className="text-xs text-gray-500">{payment.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="p-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Upcoming Payments</h3>
          <div className="space-y-3">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-900 truncate">{payment.campaign}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs font-semibold text-gray-900">${payment.amount}</span>
                  <span className="text-xs text-gray-600">
                    {new Date(payment.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Review form (creator side) */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Reviews</h3>

          {/* Waiting for brand indicator (locked state) */}
          {reviewStatus &&
            !reviewStatus.isUnlocked &&
            !reviewStatus.hasBrandReview &&
            reviewStatus.hasCreatorReview && (
              <div className="mb-2 bg-amber-50 border border-amber-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-amber-800">Review Submitted</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Waiting for brand to submit their review to unlock both.
                </p>
              </div>
            )}

          {/* Brand submitted, waiting for creator */}
          {reviewStatus &&
            !reviewStatus.isUnlocked &&
            reviewStatus.hasBrandReview &&
            !reviewStatus.hasCreatorReview && (
              <div className="mb-2 bg-blue-50 border border-blue-200 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-semibold text-blue-800">
                    Brand submitted a review
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">
                  Submit your review to unlock both reviews.
                </p>
              </div>
            )}

          {/* Reviews list - shows brand's review after unlocking */}
          {campaignReviews && campaignReviews.length > 0 && (
            <div className="space-y-2 mb-3">
              {campaignReviews.map((review, index) => (
                <div key={review.id || index} className="border-l-2 border-indigo-500 pl-3 py-1">
                  <span className="text-[10px] font-semibold text-gray-500 mb-1 block">
                    Brand's Review
                  </span>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < (review.rating || 0) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-700">{review.review}</p>
                  <span className="text-[11px] text-gray-400 mt-0.5 block">
                    {new Date(review.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Review submission form */}
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Leave a review</h4>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-600">Rating:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 cursor-pointer ${i < newReviewRating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                    onClick={() => setNewReviewRating(i + 1)}
                  />
                ))}
              </div>
            </div>
            <TextArea
              placeholder="Write your review..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="text-xs"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <CustomButton
                text="Submit Review"
                className="btn-primary text-xs"
                onClick={handleSaveNewReview}
                disabled={!newReviewText.trim()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
