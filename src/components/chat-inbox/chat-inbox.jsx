import useChatInbox from "./use-chat-inbox";
import ChatList from "./components/chat-list/chat-list";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";

export default function ChatInbox() {
  const {
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
    isCreaterInbox,
  } = useChatInbox();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto max-w-7xl h-screen rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
        <main className="h-full flex flex-col">
          {/* Top navigation - streamlined and modern */}
          <div className="bg-white border-b">
            <div className="container mx-auto px-6 py-3 flex items-center justify-between">
              <nav className="hidden md:flex">
                {mainTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-2 mx-1 text-sm font-bold transition-all relative ${
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

          {/* Section tabs - more spaced and visually distinct */}
          {![1, 2, 3].includes(activeTab) && (
            <div className="bg-gray-50 py-2 px-6 border-b">
              <div className="container mx-auto flex flex-wrap gap-2 justify-start">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-sm transition-all ${
                      activeSection === section.id
                        ? "bg-primary text-white shadow-sm"
                        : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            {/* Chat list */}
            <ChatList isCreaterInbox={isCreaterInbox} activeTab={activeTab} />

            {/* Chat area */}
            <Inbox />

            {/* Right sidebar - Profile and connections */}
            <Profile isCreaterInbox={isCreaterInbox} activeTab={activeTab} />
          </div>
        </main>
      </div>
    </div>
  );
}
