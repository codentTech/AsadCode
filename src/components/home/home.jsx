"use client";

import Loadar from "@/common/components/loadar/loadar.component";
import Footer from "../home/footer/footer.component";
import Header from "../home/header/header.component";
import UserMiniProfile from "../home/user-mini-profile/user-mini-profile";
import ModernStories from "../home/modern-stories/modern-stories";
import PremiumSidebar from "../home/premium-sidebar/premium-sidebar";
import PostFeed from "../home/post-feeds/post-feeds";
import UltraPostFeed from "../home/feed/feed";
import useHome from "./use-home";

/**
 * Home page component
 */
function HomePage() {
  const { loader } = useHome();

  if (loader) {
    return <Loadar />;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4">
        <main className="flex-1">
          <div
            className="home-wrapper flex flex-col lg:flex-row gap-4 py-[5.7rem]"
            data-auto-select="true"
          >
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
            <div className="hidden sm:block">
              <PremiumSidebar />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
