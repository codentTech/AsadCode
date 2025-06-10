import React, { useState } from "react";
import {
  Search,
  Star,
  MessageCircle,
  Instagram,
  Youtube,
  Check,
  Calendar,
  DollarSign,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import SearchIcon from "@/common/icons/search-icon";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import { avatar } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import TextArea from "@/common/components/text-area/text-area.component";

// Mock data
const completedCampaigns = [
  {
    id: 1,
    title: "Summer Beauty Collection Launch",
    brand: { name: "GlowCo", logo: "/api/placeholder/40/40" },
    platforms: ["instagram", "tiktok"],
    completedDate: "2025-06-05",
    paymentStatus: "Paid",
    totalEarned: 850,
    deliverables: ["3 Instagram posts", "2 TikTok videos", "1 Story series"],
    productImage: "/api/placeholder/120/120",
    hasReview: false,
  },
  {
    id: 2,
    title: "Sustainable Fashion Week",
    brand: { name: "EcoWear", logo: "/api/placeholder/40/40" },
    platforms: ["youtube", "instagram"],
    completedDate: "2025-05-28",
    paymentStatus: "In Escrow",
    totalEarned: 1200,
    deliverables: ["1 YouTube video", "5 Instagram posts", "Story highlights"],
    productImage: "/api/placeholder/120/120",
    hasReview: true,
    review: { rating: 5, text: "Amazing work! Great engagement rates." },
  },
  {
    id: 3,
    title: "Tech Gadget Review Series",
    brand: { name: "TechFlow", logo: "/api/placeholder/40/40" },
    platforms: ["youtube", "tiktok"],
    completedDate: "2025-05-15",
    paymentStatus: "Pending",
    totalEarned: 2000,
    deliverables: ["2 YouTube videos", "4 TikTok videos", "Unboxing content"],
    productImage: "/api/placeholder/120/120",
    hasReview: false,
  },
];

const upcomingPayments = [
  { campaign: "Summer Beauty Collection Launch", amount: 850, date: "2025-06-15" },
  { campaign: "Sustainable Fashion Week", amount: 1200, date: "2025-06-20" },
  { campaign: "Tech Gadget Review Series", amount: 2000, date: "2025-06-25" },
];

const paymentHistory = {
  "June 2025": {
    total: 2750,
    payments: [
      { campaign: "Skincare Routine Campaign", amount: 950, date: "June 8" },
      { campaign: "Fitness Gear Review", amount: 800, date: "June 12" },
      { campaign: "Home Decor Showcase", amount: 1000, date: "June 18" },
    ],
  },
  "May 2025": {
    total: 3200,
    payments: [
      { campaign: "Spring Fashion Haul", amount: 1200, date: "May 5" },
      { campaign: "Travel Essentials", amount: 900, date: "May 15" },
      { campaign: "Beauty Basics", amount: 1100, date: "May 25" },
    ],
  },
};

const CompletedCampaign = () => {
  const { getPlatformIcon, getPlatformColor } = useGetplatform();

  const [selectedCampaign, setSelectedCampaign] = useState(completedCampaigns[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [expandedMonths, setExpandedMonths] = useState({});

  const filteredCampaigns = completedCampaigns.filter(
    (campaign) =>
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.brand.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const toggleMonth = (month) => {
    setExpandedMonths((prev) => ({
      ...prev,
      [month]: !prev[month],
    }));
  };

  const totalEarnings = Object.values(paymentHistory).reduce((sum, month) => sum + month.total, 0);

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* Left Column - Completed Campaign List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Completed Campaigns</h2>
          <div className="relative">
            <CustomInput
              type="text"
              name="search"
              placeholder="Search campaign"
              startIcon={<SearchIcon />}
              className="!h-[36px]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(campaign)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedCampaign?.id === campaign.id
                  ? "bg-indigo-50 border-l-4 border-l-indigo-600"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={avatar}
                  alt={campaign.brand.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
                  <p className="text-xs text-gray-600 mt-1">{campaign.brand.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">
                      Completed {new Date(campaign.completedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(campaign.paymentStatus)}`}
                    >
                      {campaign.paymentStatus}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      ${campaign.totalEarned}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Center Column - Campaign Details */}
      <div className="flex-1 flex flex-col h-screen bg-gray-100">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
          <div className="p-3">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={avatar}
                alt={selectedCampaign?.brand.name}
                className="w-24 h-24 rounded-lg object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{selectedCampaign?.brand.name}</h1>
                <p className="text-lg text-gray-600">{selectedCampaign?.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {selectedCampaign?.platforms.map((platform) => (
                <div key={platform} className={`p-2 ${getPlatformColor(platform)} rounded-md`}>
                  {getPlatformIcon(platform)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 pb-20">
          {/* Campaign Summary */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-md p-4">
            <div className="flex justify-between gap-2">
              {/* Left Side */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Campaign Summary</h3>

                <div className="space-y-3">
                  {/* Deliverables */}
                  <div className="bg-gray-100 rounded-lg p-3">
                    <h5 className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
                      Deliverables
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedCampaign?.deliverables.map((item, index) => (
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

                  {/* Date & Payment */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 mb-1">Completion Date</h4>
                      <p className="text-xs text-gray-600">
                        {new Date(selectedCampaign?.completedDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-1">Payment Status</h4>
                      <span
                        className={`inline-block px-5 py-1 rounded-lg text-xs font-medium ${getPaymentStatusColor(selectedCampaign?.paymentStatus)}`}
                      >
                        {selectedCampaign?.paymentStatus}
                      </span>
                    </div>
                  </div>

                  {/* Total Earned */}
                  <div className="bg-gray-50 border border-green-200 p-3 rounded-lg">
                    <h4 className="text-sm font-semibold text-gray-700 mb-1">Total Earned</h4>
                    <p className="text-2xl font-bold text-green-600">
                      ${selectedCampaign?.totalEarned}
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Product Image + CTA */}
              <div className="flex flex-col items-center justify-center text-center">
                <img
                  src={avatar}
                  alt="Campaign product"
                  className="w-36 h-36 rounded-xl object-cover shadow-sm mb-4"
                />
                <CustomButton text="Message Brand" />
              </div>
            </div>
          </div>

          {/* Brand Review */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Brand Review</h3>

            {selectedCampaign?.hasReview ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedCampaign.review.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm font-medium text-gray-700">
                    {selectedCampaign.review.rating}/5
                  </span>
                </div>
                <p className="text-sm text-gray-600">{selectedCampaign.review.text}</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Leave a review for this brand</p>

                {/* Rating */}
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

                {/* Review Text */}
                <div>
                  <TextArea
                    text="Review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your experience working with this brand..."
                  />
                </div>

                {/* Submit Button */}
                <button className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                  Submit Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Finance Dashboard */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Finance Dashboard</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total Earnings</p>
            <p className="text-3xl font-bold text-green-600">${totalEarnings.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Upcoming Payments */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              Upcoming Payments
            </h3>
            <div className="space-y-3">
              {upcomingPayments.map((payment, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 truncate">{payment.campaign}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-lg font-semibold text-gray-900">${payment.amount}</span>
                    <span className="text-xs text-gray-600">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center gap-2">
              Payment History
            </h3>
            <div className="overflow-y-auto space-y-2">
              {Object.entries(paymentHistory).map(([month, data]) => (
                <div key={month} className="border border-gray-200 rounded-lg">
                  <div
                    onClick={() => toggleMonth(month)}
                    className="p-3 cursor-pointer hover:bg-gray-50 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{month}</p>
                      <p className="text-green-600 font-semibold">${data.total}</p>
                    </div>
                    {expandedMonths[month] ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>

                  {expandedMonths[month] && (
                    <div className="h-20 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                      {data.payments.map((payment, index) => (
                        <div key={index} className="bg-gray-50 p-2 rounded text-sm">
                          <p className="font-medium text-gray-900 truncate">{payment.campaign}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-900">${payment.amount}</span>
                            <span className="text-gray-500">{payment.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletedCampaign;
