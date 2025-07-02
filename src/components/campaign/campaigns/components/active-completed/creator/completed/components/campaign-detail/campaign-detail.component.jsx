import CustomButton from "@/common/components/custom-button/custom-button.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { product } from "@/common/constants/auth.constant";
import { Calendar, CheckCircle, ChevronDown, ChevronUp, Circle, Copy, Star, X } from "lucide-react";
import { useState } from "react";

const getPaymentStatusColor = (status) => {
  switch (status) {
    case "Paid":
      return {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
      };
    case "In Escrow":
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
      };
    case "Pending":
      return {
        bg: "bg-orange-100",
        text: "text-orange-800",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-800",
        border: "border-gray-200",
      };
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

  const [expandedSections, setExpandedSections] = useState({
    dosdonts: false,
    styleGuide: false,
    captions: false,
  });

  const statusStyle = getPaymentStatusColor(campaign.paymentStatus);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Sample data for the information sections
  const campaignInfo = {
    dosdonts: {
      dos: [
        "Use natural lighting when filming",
        "Show product application process",
        "Include before/after shots if possible",
        "Mention the discount code: SUMMER20",
        "Tag @GlowCoBeauty in all posts",
      ],
      donts: [
        "Don't use heavy filters that alter skin tone",
        "Avoid filming in poor lighting conditions",
        "Don't make medical claims about the product",
        "Avoid negative comparisons with competitors",
        "Don't forget to disclose partnership (#ad)",
      ],
    },
    styleGuide: {
      colors: ["#FF6B9D", "#4ECDC4", "#FFE66D"],
      fonts: ["Montserrat", "Open Sans"],
      tone: "Fresh, authentic, and approachable",
      aesthetics: [
        "Clean, minimalist backgrounds",
        "Bright, natural lighting",
        "Focus on product textures and results",
        "Include lifestyle elements (morning routine, skincare shelf)",
      ],
    },
    captions: [
      {
        platform: "Instagram",
        caption:
          "Summer glow-up starts with the right skincare! ✨ This lightweight serum from @GlowCoBeauty has been a game-changer for my routine. The SPF 30 protection is perfect for these sunny days! 🌞 Use code SUMMER20 for 20% off! #GlowCoPartner #SummerSkincare #SPFProtection #ad",
        hashtags: "#GlowCoPartner #SummerSkincare #SPFProtection #SkincareRoutine #GlowUp #ad",
      },
      {
        platform: "TikTok",
        caption:
          "POV: You found the perfect summer skincare combo ☀️ This @GlowCoBeauty duo is giving me that healthy glow! Code SUMMER20 for 20% off 💕 #GlowCoPartner #SummerSkincare #SkincareHacks #ad",
        hashtags: "#GlowCoPartner #SummerSkincare #SkincareHacks #GlowUp #SPF #ad",
      },
    ],
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full bg-white border-x flex-1 flex flex-col overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 flex-shrink-0 overflow-hidden">
              <img
                src={campaign.brand.logo}
                alt={campaign.brand.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{campaign.brand.name}</h2>
              <p className="text-sm text-gray-600">{campaign.title}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                <span>Completed: {formatDate(campaign.completedDate)}</span>
              </div>
            </div>
          </div>

          {/* Payment Status and Earnings */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}
            >
              {campaign.paymentStatus}
            </div>

            <div className="flex gap-2 items-center text-left text-xs font-semibold text-gray-900">
              <div>Total Earned -</div>
              <div>{campaign.totalEarned}</div>
            </div>
          </div>
        </div>

        {/* Campaign Content with Product Image */}
        <div className="w-full flex gap-6">
          {/* Main Content */}
          <div className="w-full">
            <div className="w-full flex gap-6">
              {/* Information Sections */}
              <div className="w-full space-y-2">
                {/* Do's and Don'ts */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("dosdonts")}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">Do's and Don'ts</span>
                    </div>
                    {expandedSections.dosdonts ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.dosdonts && (
                    <div className="p-3 bg-white border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <h4 className="text-xs font-medium text-green-700 mb-2 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Do's
                          </h4>
                          <ul className="space-y-1">
                            {campaignInfo.dosdonts.dos.map((item, index) => (
                              <li
                                key={index}
                                className="text-xs text-gray-600 flex items-start gap-1"
                              >
                                <div className="w-1 h-1 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-xs font-medium text-red-700 mb-2 flex items-center gap-1">
                            <X className="w-3 h-3" />
                            Don'ts
                          </h4>
                          <ul className="space-y-1">
                            {campaignInfo.dosdonts.donts.map((item, index) => (
                              <li
                                key={index}
                                className="text-xs text-gray-600 flex items-start gap-1"
                              >
                                <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Style Guide */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("styleGuide")}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">Style Guide</span>
                    </div>
                    {expandedSections.styleGuide ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.styleGuide && (
                    <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                      <div>
                        <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Colors</h4>
                        <div className="flex gap-1">
                          {campaignInfo.styleGuide.colors.map((color, index) => (
                            <div key={index} className="flex flex-col items-center gap-1">
                              <div
                                className="w-6 h-6 rounded border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                              <span className="text-xs text-gray-500">{color}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-medium text-gray-900 mb-1">Brand Tone</h4>
                        <p className="text-xs text-gray-600">{campaignInfo.styleGuide.tone}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Captions and Hashtags */}
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => toggleSection("captions")}
                    className="w-full flex items-center justify-between p-3 bg-gray-100 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-900">Captions & Hashtags</span>
                    </div>
                    {expandedSections.captions ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {expandedSections.captions && (
                    <div className="p-3 bg-white border-t border-gray-200 space-y-2">
                      {campaignInfo.captions.map((item, index) => (
                        <div key={index} className="border border-gray-100 rounded p-2">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-xs font-medium text-gray-900 flex items-center gap-1">
                              <div className="w-3 h-3">{getPlatformIcon(item.platform)}</div>
                              {item.platform}
                            </h4>
                            <button
                              onClick={() => copyToClipboard(item.caption)}
                              className="text-blue-600 hover:text-blue-700"
                              title="Copy caption"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="text-xs text-gray-600 mb-1 line-clamp-2">{item.caption}</p>
                          <p className="text-xs text-blue-600">{item.hashtags}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <img
                  src={product}
                  alt="Campaign Product"
                  className="w-36 h-36 rounded-lg object-cover border border-gray-200"
                />
              </div>
            </div>

            {/* Deliverables */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2 mt-4">Deliverables</h3>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex flex-wrap gap-1">
                  {campaign.deliverables.map((item, index) => (
                    <span
                      key={index}
                      className="bg-white text-xs text-gray-700 px-2 py-1 rounded border flex items-center gap-1"
                    >
                      <div className="w-1 h-1 bg-blue-500 rounded-full" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="border-l-2 border-primary my-5">
              <p className="text-xs text-gray-600 line-clamp-2 ml-2">
                <span className="font-bold">Description:</span> Showcase our new seasonal menu items
                with authentic reactions and honest reviews.
              </p>
            </div>

            {/* Campaign Performance */}
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Campaign Performance</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-700">Content Delivered</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    Complete
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-gray-700">Campaign Completed</span>
                  </div>
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded">
                    Complete
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                  <div className="flex items-center gap-2">
                    {campaign.paymentStatus === "Paid" ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className="text-xs text-gray-700">Payment Received</span>
                  </div>
                  <span
                    className={`text-xs ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} px-2 py-0.5 rounded`}
                  >
                    {campaign.paymentStatus === "Paid" ? "Complete" : "Pending"}
                  </span>
                </div>
              </div>
            </div>

            {/* Brand Review Section */}
            <div className="border border-gray-200 rounded-lg p-4 mt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-1">Brand Review</h3>
              {campaign.hasReview ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < campaign.review.rating
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-sm font-medium text-gray-700">
                      {campaign.review.rating}/5
                    </span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <p className="text-sm text-gray-600">{campaign.review.text}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">Leave a review for this brand</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          onClick={() => setReviewRating(i + 1)}
                          className={`w-6 h-6 cursor-pointer transition-colors ${
                            i < reviewRating
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300 hover:text-yellow-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review</label>
                    <TextArea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience working with this brand..."
                      className="w-full"
                    />
                  </div>

                  <div className="flex justify-end">
                    <CustomButton text="Submit Review" className="btn-primary" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
