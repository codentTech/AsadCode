import { useState } from "react";

const campaigns = [
  {
    id: 1,
    brandLogo: "🏨",
    brandName: "Luxury Hotels Co.",
    title: "Summer Staycation Campaign",
    type: "Sponsored Post",
    compensation: "Paid",
    compensationAmount: "Fixed $450",
    deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
    niche: "Travel",
    location: "Remote",
    productImage: "🏖️",
    location: "US Creator Mandatory",
    language: "English Preferred",
    followerMin: "5000 Combined",
    description:
      "Launching our new protein blend—looking for creators to try it and share honest reviews!",
    brief:
      "Create engaging content showcasing our luxury hotel experience during summer season. Focus on amenities, views, and unique experiences.",
  },
  {
    id: 2,
    brandLogo: "🍕",
    brandName: "Taste Buds Restaurant",
    title: "New Menu Launch",
    type: "UGC",
    compensation: "Gifted",
    compensationAmount: "Fixed $450",
    deliverables: ["3 TikTok videos", "2 Instagram posts"],
    niche: "Food",
    location: "New York, NY",
    productImage: "🍽️",
    location: "US Creator Mandatory",
    language: "English Preferred",
    followerMin: "5000 Combined",
    description:
      "Launching our new protein blend—looking for creators to try it and share honest reviews!",

    brief:
      "Showcase our new seasonal menu items with authentic reactions and honest reviews. Focus on taste, presentation, and dining experience.",
  },
  {
    id: 3,
    brandLogo: "✈️",
    brandName: "Sky Airlines",
    title: "Business Class Experience",
    type: "Affiliate",
    compensation: "Commission",
    compensationAmount: "Fixed $450",
    deliverables: ["1 YouTube video", "2 Instagram posts", "3 Instagram Stories"],
    niche: "Travel",
    location: "Remote",
    productImage: "🛫",
    location: "US Creator Mandatory",
    language: "English Preferred",
    followerMin: "5000 Combined",
    description:
      "Launching our new protein blend—looking for creators to try it and share honest reviews!",
    brief:
      "Create content highlighting our premium business class experience. Include booking process, onboard amenities, and overall journey.",
  },
];

export function useCampaignFeed() {
  const [showFullBrief, setShowFullBrief] = useState(false);
  const [briefCampaign, setBriefCampaign] = useState(null);

  const [showApplication, setShowApplication] = useState(false);
  const [applicationCampaign, setApplicationCampaign] = useState(null);
  const [applicationPitch, setApplicationPitch] = useState("");

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
