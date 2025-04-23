import { useState } from "react";
import ChatList from "./components/chat-list/chat-list";
import Inbox from "./components/inbox/inbox";
import Profile from "./components/profile/profile";
import useChatInbox from "./chat-inbox";

export default function ChatInbox() {
  const {
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
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
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 mx-1 text-sm font-medium transition-all relative ${
                      activeTab === tab
                        ? "text-indigo-600"
                        : "text-gray-600 hover:text-indigo-500"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"></span>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Section tabs - more spaced and visually distinct */}
          <div className="bg-gray-50 py-2 px-6 border-b">
            <div className="container mx-auto flex flex-wrap gap-2 justify-start">
              {sections.map((section) => (
                <button
                  key={section}
                  onClick={() => setActiveSection(section)}
                  className={`px-4 py-1.5 rounded-full text-xs font-sm transition-all ${
                    activeSection === section
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm"
                      : "bg-white text-gray-700 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                  }`}
                >
                  {section}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Chat list */}
            <ChatList />

            {/* Chat area */}
            <Inbox />

            {/* Right sidebar - Profile and connections */}
            <Profile />
          </div>
        </main>
      </div>
    </div>
  );
}
