import CampaignFeed from "./components/campaign-feed/campaign-feed.component";
import CampaignFilters from "./components/campaign-filters/campaign-filters.component";
import PitchTemplate from "./components/pitch-template/pitch-template.component";

const CampaignDashboard = () => {
  const campaigns = [
    {
      id: 1,
      brandLogo: "🏨",
      brandName: "Luxury Hotels Co.",
      title: "Summer Staycation Campaign",
      type: "Sponsored Post",
      compensation: "Paid",
      deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
      niche: "Travel",
      location: "Remote",
      productImage: "🏖️",
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
      deliverables: ["3 TikTok videos", "2 Instagram posts"],
      niche: "Food",
      location: "New York, NY",
      productImage: "🍽️",
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
      deliverables: ["1 YouTube video", "2 Instagram posts", "3 Instagram Stories"],
      niche: "Travel",
      location: "Remote",
      productImage: "🛫",
      brief:
        "Create content highlighting our premium business class experience. Include booking process, onboard amenities, and overall journey.",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl relative flex flex-1 overflow-hidden pb-20">
      {/* Left Column - Campaign Filters */}
      <CampaignFilters />

      {/* Center Column - Campaign Feed */}
      <CampaignFeed filteredCampaigns={campaigns} />

      {/* Right Column - My Pitch Templates */}
      <PitchTemplate />
    </div>
  );
};

export default CampaignDashboard;
