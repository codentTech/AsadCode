import CustomButton from "@/common/components/custom-button/custom-button.component";
import ChatList from "./components/chat-list/chat-list";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";
import QuickHire from "./components/quick-hire/quick-hire";
import useChatInbox from "./use-chat-inbox";

export default function ChatInbox() {
  const {
    isCreatorMode,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
    handleOpenQuickHire,
    openQuickHire,
    handleCloseQuickHire,
  } = useChatInbox();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white">
      <div className="container mx-auto max-w-7xl h-screen rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
        <main className="h-full flex flex-col">
          {/* Top navigation - streamlined and modern */}
          <div className="flex justify-between items-center bg-white border-b">
            <div className="py-3 flex items-center justify-between">
              <nav className="hidden md:flex">
                {mainTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-2 py-2 mx-1 text-sm font-bold transition-all relative ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
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
          </div>

          {![1, 2, 3].includes(activeTab) && (
            <div className="flex justify-between items-center bg-gray-50 border-b py-2 px-2">
              {/* Section tabs - more spaced and visually distinct */}
              <div className="flex flex-wrap gap-2 justify-start">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-sm ${
                      activeSection === section.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
              {[4, 5].includes(activeTab) && !isCreatorMode && (
                <CustomButton
                  onClick={handleOpenQuickHire}
                  text="Quick Hire"
                  className="mr-4 h-8 btn-primary"
                />
              )}
            </div>
          )}

          {openQuickHire && (
            <QuickHire
              openQuickHire={openQuickHire}
              handleCloseQuickHire={handleCloseQuickHire}
            />
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Chat list */}
            <ChatList isCreatorMode={isCreatorMode} activeTab={activeTab} />

            {/* Chat area */}
            <Inbox />

            {/* Right sidebar - Profile and connections */}
            <Profile isCreatorMode={isCreatorMode} activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
}
