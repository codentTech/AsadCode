import ActiveCompleted from "./components/active-completed/active-completed.component";
import CampaignApplication from "./components/applications/applications.component";
import Discover from "./components/discover/discover.component";
import Rejected from "./components/rejected/rejected.component";
import useCampaign from "./use-campaign.hook";

export default function Campaign() {
  const { activeTab, setActiveTab, mainTabs } = useCampaign();

  return (
    <div className="max-h-screen">
      <div className="h-screen overflow-hidden shadow-xl border border-gray-200">
        {/* Top navigation - streamlined and modern */}
        <div className="py-3 flex items-center bg-white border-b">
          <nav className="hidden md:flex">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 py-2 mx-1 text-sm font-bold transition-all relative ${
                  activeTab === tab.id ? "text-primary" : "text-gray-600 hover:text-primary"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary"></span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 2 ? (
          <ActiveCompleted />
        ) : activeTab === 3 ? (
          <ActiveCompleted isCompleted={true} />
        ) : activeTab === 4 ? (
          <CampaignApplication />
        ) : activeTab === 5 ? (
          <Rejected />
        ) : (
          <Discover />
        )}
      </div>
    </div>
  );
}
