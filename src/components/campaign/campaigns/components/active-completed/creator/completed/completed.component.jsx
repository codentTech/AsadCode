import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { useState } from "react";
import CampaignDetails from "./components/campaign-detail/campaign-detail.component";
import CompletedCampaignList from "./components/campaign-lits/campaign-list.component";
import FinanceDashboard from "./components/finance-dashboard/finance-dashboard.component";
import { avatar } from "@/common/constants/auth.constant";

// Mock data
const completedCampaigns = [
  {
    id: 1,
    title: "Summer Beauty Collection Launch",
    brand: { name: "GlowCo", logo: avatar },
    platforms: ["instagram", "tiktok"],
    completedDate: "2025-06-05",
    paymentStatus: "Paid",
    totalEarned: 850,
    deliverables: ["3 Instagram posts", "2 TikTok videos", "1 Story series"],
    productImage: avatar,
    hasReview: false,
  },
  {
    id: 2,
    title: "Sustainable Fashion Week",
    brand: { name: "EcoWear", logo: avatar },
    platforms: ["youtube", "instagram"],
    completedDate: "2025-05-28",
    paymentStatus: "In Escrow",
    totalEarned: 1200,
    deliverables: ["1 YouTube video", "5 Instagram posts", "Story highlights"],
    productImage: avatar,
    hasReview: true,
    review: { rating: 5, text: "Amazing work! Great engagement rates." },
  },
  {
    id: 3,
    title: "Tech Gadget Review Series",
    brand: { name: "TechFlow", logo: avatar },
    platforms: ["youtube", "tiktok"],
    completedDate: "2025-05-15",
    paymentStatus: "Pending",
    totalEarned: 2000,
    deliverables: ["2 YouTube videos", "4 TikTok videos", "Unboxing content"],
    productImage: avatar,
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

  return (
    <div className="relative flex flex-1 overflow-hidden">
      <CompletedCampaignList
        campaigns={filteredCampaigns}
        selectedCampaign={selectedCampaign}
        onSelect={setSelectedCampaign}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
      />
      <CampaignDetails
        campaign={selectedCampaign}
        reviewRating={reviewRating}
        reviewText={reviewText}
        setReviewRating={setReviewRating}
        setReviewText={setReviewText}
        getPlatformIcon={getPlatformIcon}
        getPlatformColor={getPlatformColor}
      />
      <FinanceDashboard
        paymentHistory={paymentHistory}
        upcomingPayments={upcomingPayments}
        expandedMonths={expandedMonths}
        setExpandedMonths={setExpandedMonths}
      />
    </div>
  );
};

export default CompletedCampaign;
