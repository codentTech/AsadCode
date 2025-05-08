import AudienceAnalytics from "./components/audience-analytics/audience-analytics";
import BioPricing from "./components/bio-pricing/bio-pricing";
import Gallary from "./components/gallary/gallary";
import ProfileOverview from "./components/profile-overview/profile-overview";
import Reviews from "./components/reviews/reviews";

export default function CreatorPortfolio() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="w-full flex flex-col gap-4 mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Overview Section */}
        <ProfileOverview />

        {/* Bio & Pricing Section */}
        <BioPricing />

        {/* Portfolio Gallery Section */}
        <Gallary />

        {/* Audience Analytics Section */}
        <AudienceAnalytics />

        {/* Reviews Section */}
        <Reviews />
      </main>
    </div>
  );
}
