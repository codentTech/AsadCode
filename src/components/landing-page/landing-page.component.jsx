"use client";

import Loadar from "@/common/components/loadar/loadar.component";
import Footer from "./components/footer/footer.component";
import Header from "./components/header/header.component";
import useLandingPage from "./use-landing-page.hook";
import UserMiniProfile from "./components/user-mini-profile/user-mini-profile";
import ModernStories from "./components/modern-stories/modern-stories";
import PremiumSidebar from "./components/premium-sidebar/premium-sidebar";
import PostFeed from "./components/post-feeds/post-feeds";
import UltraPostFeed from "./components/feed/feed";

/**
 * Landing page component
 */
function LandingPage() {
  const { loader } = useLandingPage();

  if (loader) {
    return <Loadar />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4">
        <main className="flex-1">
          <div className="home-wrapper flex flex-col lg:flex-row gap-4 py-[5.7rem]" data-auto-select="true">
            {/* Sidebar - hidden on small screens */}
            <div className="hidden lg:block">
              <UserMiniProfile />
            </div>

            <div className="w-full max-w-[40rem] gap-4 flex flex-col">
              <ModernStories />
              <PostFeed />
              <UltraPostFeed />
            </div>

            {/* Sidebar - hidden on small screens */}
            <div className="hidden xl:block">
              <PremiumSidebar />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;
