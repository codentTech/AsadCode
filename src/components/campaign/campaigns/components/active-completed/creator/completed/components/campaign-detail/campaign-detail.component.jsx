import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import { Calendar, Star } from "lucide-react";

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return "bg-green-100 text-green-800";
    case "In Escrow":
      return "bg-yellow-100 text-yellow-800";
    case "Pending":
      return "bg-orange-100 text-orange-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const CampaignDetails = ({
  campaign,
  reviewRating,
  reviewText,
  setReviewRating,
  setReviewText,
  getPlatformIcon,
}) => {
  if (!campaign) return null;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto p-4">
      {/* Header */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          <img
            src={avatar}
            alt={campaign.brand.name}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              {campaign.brand.name}
            </h1>
            <p className="text-sm text-gray-600">{campaign.title}</p>
          </div>
        </div>
        <div className="bg-gray-50 border border-green-200 p-3 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-1">Total Earned</h4>
          <p className="text-2xl font-bold text-green-600">${campaign.totalEarned}</p>
        </div>
      </div>

      {/* Platforms and Payment Status */}
      <div className="flex justify-between my-4">
        <div className="flex gap-4 flex-wrap">
          {campaign.platforms.map((platform) => (
            <div key={platform} className="flex items-center px-2 py-1 rounded-lg bg-gray-100">
              <div className="flex items-center gap-2 pr-1">
                <div className="rounded-md">{getPlatformIcon(platform)}</div>
                <span className="text-xs font-medium text-gray-600 capitalize">{platform}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-5 bg-gray-100 rounded-lg p-2 my-1">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <h3 className="text-sm font-medium text-gray-900">Due Date:</h3>
            <p className="text-sm text-gray-600">
              {new Date(campaign.completedDate).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900">Payment Status:</h3>
            <span
              className={`inline-block px-5 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(
                campaign.paymentStatus
              )}`}
            >
              {campaign.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Deliverables */}
      <div className="bg-gray-100 rounded-lg p-3 mb-4">
        <h5 className="text-xs font-semibold text-gray-600 mb-2">Deliverables</h5>
        <div className="flex flex-wrap gap-2">
          {campaign.deliverables.map((item, index) => (
            <span
              key={index}
              className="bg-white border text-xs text-gray-700 px-2 py-1 rounded-lg flex items-center gap-1"
            >
              <div className="w-1 h-1 bg-primary rounded-full" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Review Section */}
      <div className="bg-white py-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Brand Review</h3>
        {campaign.hasReview ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < campaign.review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm font-medium text-gray-700">{campaign.review.rating}/5</span>
            </div>
            <p className="text-sm text-gray-600">{campaign.review.text}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">Leave a review for this brand</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    onClick={() => setReviewRating(i + 1)}
                    className={`w-6 h-6 cursor-pointer ${
                      i < reviewRating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 hover:text-yellow-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <TextArea
              text="Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience working with this brand..."
            />
            <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
              Submit Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
