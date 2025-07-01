import { useState, useMemo } from "react";

const campaigns = [
  {
    id: 1,
    brandLogo: "🏨",
    brandName: "Luxury Hotels Co.",
    title: "Summer Staycation Campaign",
    type: "Sponsored Post",
    compensation: "Paid",
    compensationAmount: "$450",
    compensationValue: 450, // For sorting
    deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
    niche: "Travel",
    location: "US Creator Mandatory",
    locationMandatory: true,
    locationPreferred: false,
    productImage: "🏖️",
    language: "English Preferred",
    followerMin: "5K Combined",
    description:
      "Create engaging content showcasing our luxury hotel experience during summer season.",
    brief:
      "Create engaging content showcasing our luxury hotel experience during summer season. Focus on amenities, views, and unique experiences.",
    postedDate: new Date("2024-01-15"),
  },
  {
    id: 2,
    brandLogo: "🍕",
    brandName: "Taste Buds Restaurant",
    title: "New Menu Launch",
    type: "UGC",
    compensation: "Gifted",
    compensationAmount: "Free Meal ($75 value)",
    compensationValue: 75,
    deliverables: ["3 TikTok videos", "2 Instagram posts"],
    niche: "Food",
    location: "New York, NY",
    locationMandatory: true,
    locationPreferred: false,
    productImage: "🍽️",
    language: "English Required",
    followerMin: "3K Combined",
    description:
      "Showcase our new seasonal menu items with authentic reactions and honest reviews.",
    brief:
      "Showcase our new seasonal menu items with authentic reactions and honest reviews. Focus on taste, presentation, and dining experience.",
    postedDate: new Date("2024-01-16"),
  },
  {
    id: 3,
    brandLogo: "✈️",
    brandName: "Sky Airlines",
    title: "Business Class Experience",
    type: "Affiliate",
    compensation: "Commission",
    compensationAmount: "15% Commission",
    compensationValue: 1000, // Estimated value for sorting
    deliverables: ["1 YouTube video", "2 Instagram posts", "3 Instagram Stories"],
    niche: "Travel",
    location: "Remote",
    locationMandatory: false,
    locationPreferred: false,
    productImage: "🛫",
    language: "English Preferred",
    followerMin: "10K Combined",
    description: "Create content highlighting our premium business class experience.",
    brief:
      "Create content highlighting our premium business class experience. Include booking process, onboard amenities, and overall journey.",
    postedDate: new Date("2024-01-17"),
  },
  {
    id: 4,
    brandLogo: "💄",
    brandName: "Beauty Co.",
    title: "Skincare Routine Challenge",
    type: "Gifted",
    compensation: "Product",
    compensationAmount: "Product Bundle ($120 value)",
    compensationValue: 120,
    deliverables: ["5 TikTok videos", "3 Instagram posts", "Daily Stories"],
    niche: "Beauty",
    location: "Canada Preferred",
    locationMandatory: false,
    locationPreferred: true,
    productImage: "🧴",
    language: "English/French",
    followerMin: "8K Combined",
    description: "Document your 30-day skincare journey using our complete product line.",
    brief:
      "Document your 30-day skincare journey using our complete product line. Show before/after results and daily routine.",
    postedDate: new Date("2024-01-18"),
  },
  {
    id: 5,
    brandLogo: "🎮",
    brandName: "GameTech Studios",
    title: "New Game Launch Campaign",
    type: "Sponsored Post",
    compensation: "Paid",
    compensationAmount: "$800",
    compensationValue: 800,
    deliverables: ["3 YouTube videos", "5 TikTok videos", "10 Instagram Stories"],
    niche: "Gaming",
    location: "Remote",
    locationMandatory: false,
    locationPreferred: false,
    productImage: "🎯",
    language: "English Required",
    followerMin: "15K Combined",
    description: "Showcase our new mobile game with gameplay footage and honest reviews.",
    brief:
      "Showcase our new mobile game with gameplay footage and honest reviews. Focus on unique features and gameplay mechanics.",
    postedDate: new Date("2024-01-19"),
  },
];

export function useCampaignFeed() {
  const [showFullBrief, setShowFullBrief] = useState(false);
  const [briefCampaign, setBriefCampaign] = useState(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationCampaign, setApplicationCampaign] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Sort campaigns based on selected criteria
  const sortedCampaigns = useMemo(() => {
    const sorted = [...campaigns];

    switch (sortBy) {
      case "latest":
        return sorted.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

      case "highest-value":
        return sorted.sort((a, b) => b.compensationValue - a.compensationValue);

      default:
        return sorted;
    }
  }, [sortBy]);

  const handleOpenBrief = (campaign) => {
    setBriefCampaign(campaign);
    setShowFullBrief(true);
  };

  const handleOpenApplication = (campaign) => {
    setApplicationCampaign(campaign);
    setShowApplication(true);
  };

  const closeBrief = () => {
    setShowFullBrief(false);
    setBriefCampaign(null);
  };

  const closeApplication = () => {
    setShowApplication(false);
    setApplicationCampaign(null);
    setApplicationPitch("");
  };

  return {
    campaigns,
    sortBy,
    setSortBy,
    sortedCampaigns,
    showFullBrief,
    briefCampaign,
    showApplication,
    applicationCampaign,
    applicationPitch,
    setApplicationPitch,
    handleOpenBrief,
    handleOpenApplication,
    closeBrief,
    closeApplication,
  };
}
