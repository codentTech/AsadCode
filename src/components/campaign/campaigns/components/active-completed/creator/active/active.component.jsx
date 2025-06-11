import { useState } from "react";
import CampaignList from "./components/campaign-list/campaign-list.component";
import CampaignDetail from "./components/campaign-detail/campaign-detail.component";
import ContentPlanning from "./components/content-planning/content-planning.component";

const ActiveCampaign = () => {
  const [selectedCampaign, setSelectedCampaign] = useState(0);

  const campaigns = [
    {
      id: 1,
      title: "Summer Skincare Collection",
      brand: "GlowCo Beauty",
      logo: "🌟",
      deadline: "2025-06-15",
      platforms: ["TikTok", "Instagram"],
      deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
      payment: "$1,200",
      productImage: "🧴",
      completionRate: 65,
      progress: [
        { task: "Content recorded", completed: true },
        { task: "1st draft sent", completed: true },
        { task: "Final post published", completed: false },
      ],
    },
    {
      id: 2,
      title: "Fitness Equipment Review",
      brand: "FitLife Pro",
      logo: "💪",
      deadline: "2025-06-18",
      platforms: ["YouTube", "Instagram"],
      deliverables: ["2 TikTok videos", "1 Instagram Story"],
      payment: "Gifted + $800",
      productImage: "🏋️",
      completionRate: 65,
      progress: [
        { task: "Content recorded", completed: false },
        { task: "1st draft sent", completed: false },
        { task: "Final post published", completed: false },
      ],
    },
    {
      id: 3,
      title: "Tech Gadget Unboxing",
      brand: "TechNova",
      logo: "⚡",
      deadline: "2025-06-22",
      platforms: ["TikTok", "YouTube"],
      deliverables: ["1 Instagram post", "1 Instagram Story"],
      payment: "$950",
      productImage: "📱",
      completionRate: 65,
      progress: [
        { task: "Content recorded", completed: true },
        { task: "1st draft sent", completed: false },
        { task: "Final post published", completed: false },
      ],
    },
  ];

  return (
    <div className="relative flex flex-1 overflow-hidden">
      {/* Left Column - Campaign List */}
      <CampaignList
        campaigns={campaigns}
        selectedCampaign={selectedCampaign}
        setSelectedCampaign={setSelectedCampaign}
      />

      {/* Center Column - Campaign Details */}
      <CampaignDetail campaigns={campaigns} selectedCampaign={selectedCampaign} />

      {/* Right Column - Content Planning + Deadlines */}
      <ContentPlanning />
    </div>
  );
};

export default ActiveCampaign;
