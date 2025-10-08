import HeaderLayout from "@/common/layouts/header.layout";
import Active from "./components/active/active.component";
import CampaignApplication from "./components/applications/applications.component";
import Completed from "./components/completed/completed.component";
import Discover from "./components/discover/discover.component";
import Rejected from "./components/rejected/rejected.component";
import useCampaign from "./use-campaign.hook";

export default function Campaign() {
  const { activeTab, setActiveTab, mainTabs } = useCampaign();

  return (
    <HeaderLayout>
      <div className="border-b border-gray-200">
        {/* Top Navigation Bar */}
        <div className="fixed top-12 left-0 w-full z-40 bg-white">
          <nav className="flex items-center py-3 px-2 border-b">
            {/* Main Tabs */}
            <div className="flex items-center space-x-3">
              {mainTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-1 text-xs rounded-lg transition-all duration-200 whitespace-nowrap ${
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
            <Active />
          ) : activeTab === 3 ? (
            <Completed />
          ) : activeTab === 4 ? (
            <CampaignApplication />
          ) : activeTab === 5 ? (
            <Rejected />
          ) : (
            <Discover />
          )}
        </div>
      </div>
    </HeaderLayout>
  );
}
