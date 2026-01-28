import HeaderLayout from "@/common/layouts/header.layout";
import Active from "./components/active/active.component";
import CampaignApplication from "./components/applications/applications.component";
import Completed from "./components/completed/completed.component";
import Discover from "./components/discover/discover.component";
import useCampaign from "./use-campaign.hook";

export default function Campaign() {
  const { activeTab, setActiveTab, mainTabs, isCreatorMode } = useCampaign();

  return (
    <HeaderLayout>
      <div className="border-b border-gray-200">
        {/* Top Navigation Bar */}
        <div className="fixed top-12 left-0 w-full z-40 bg-white">
          <nav className="flex items-center py-3 px-2 border-b">
            {/* Main Tabs */}
            <div className="flex items-center gap-2">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`min-w-[120px] h-8 px-4 text-xs rounded-lg transition-all duration-200 whitespace-nowrap text-center flex items-center justify-center ${
                    activeTab === tab.id
                      ? "bg-primary text-white shadow"
                      : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Content padding to avoid overlap with fixed nav */}
        <div className="pt-[35px]">
          {activeTab === 1 ? (
            <Discover />
          ) : activeTab === 2 ? (
            isCreatorMode() ? (
              <Active />
            ) : (
              <CampaignApplication />
            )
          ) : activeTab === 3 ? (
            isCreatorMode() ? (
              <Completed />
            ) : (
              <Active />
            )
          ) : activeTab === 4 ? (
            isCreatorMode() ? (
              <CampaignApplication />
            ) : (
              <Completed />
            )
          ) : (
            <Discover />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}
