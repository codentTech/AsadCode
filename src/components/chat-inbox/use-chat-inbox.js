import { useState } from "react";
import { isCreatorMode } from "@/common/utils/users.util";

export default function useChatInbox() {
  const creatorMode = isCreatorMode();

  const [activeTab, setActiveTab] = useState(4);
  const [activeSection, setActiveSection] = useState(1);
  const [openQuickHire, setOpenQuickHire] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState(null);

  // Clear selected chat when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSelectedChatId(null); // Clear selected chat when switching tabs
  };

  const handleOpenQuickHire = () => {
    setOpenQuickHire(true);
  };

  const handleCloseQuickHire = () => {
    setOpenQuickHire(false);
  };

  const mainTabs = [
    // { id: 1, label: 'Active Campaigns' },
    // { id: 2, label: 'Completed Campaigns' },
    // { id: 3, label: 'Applications' },
    { id: 4, label: "My Network" },
    { id: 5, label: "Message Requests" },
  ];

  const sections = [
    { id: 1, label: "Saved" },
    { id: 2, label: "Rejected" },
  ];

  return {
    creatorMode,
    activeTab,
    setActiveTab: handleTabChange,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
    handleOpenQuickHire,
    openQuickHire,
    handleCloseQuickHire,
    selectedChatId,
    setSelectedChatId,
  };
}
