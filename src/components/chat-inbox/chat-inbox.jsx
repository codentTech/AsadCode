import CustomButton from "@/common/components/custom-button/custom-button.component";
import ChatList from "./components/chat-list/chat-list";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";
import QuickHire from "./components/quick-hire/quick-hire";
import useChatInbox from "./use-chat-inbox";

export default function ChatInbox() {
  const {
    creatorMode,
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
    handleOpenQuickHire,
    openQuickHire,
    handleCloseQuickHire,
    selectedChatId,
    setSelectedChatId,
  } = useChatInbox();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-white">
      <div className="container mx-auto max-w-7xl h-screen rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
        <main className="h-full flex flex-col">
          {/* Top navigation - streamlined and modern */}
          <div className="bg-primary border-b">
            <div className="flex items-center h-12">
              <nav className="flex items-center space-x-3 px-4">
                {mainTabs.map((tab) => {
                  const isActive = activeTab === tab.id;

                  const baseStyles =
                    "text-xs font-medium px-3 py-1 rounded-md transition-all duration-200";
                  const activeStyles = "text-primary bg-white";
                  const inactiveStyles = "text-white hover:text-primary hover:bg-gray-100";

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`${baseStyles} ${isActive ? activeStyles : inactiveStyles}`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
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
              {[4, 5].includes(activeTab) && !creatorMode && (
                <CustomButton
                  onClick={handleOpenQuickHire}
                  text="Quick Hire"
                  className="mr-4 h-8 btn-primary"
                />
              )}
            </div>
          )}

          {openQuickHire && (
            <QuickHire openQuickHire={openQuickHire} handleCloseQuickHire={handleCloseQuickHire} />
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Chat list */}
            <ChatList
              isCreatorMode={creatorMode}
              activeTab={activeTab}
              selectedChatId={selectedChatId}
              setSelectedChatId={setSelectedChatId}
            />

            {/* Chat area */}
            <Inbox selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />

            {/* Right sidebar - Profile and connections */}
            <Profile
              isCreatorMode={creatorMode}
              activeTab={activeTab}
              selectedChatId={selectedChatId}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
