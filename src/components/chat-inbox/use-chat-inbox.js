import { useState } from "react";
import { isCreatorMode } from "@/common/utils/users.util";

export default function useChatInbox() {
  const creatorMode = isCreatorMode();

  const [activeTab, setActiveTab] = useState(4);
  const [activeSection, setActiveSection] = useState(1);
  const [openQuickHire, setOpenQuickHire] = useState(false);

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
    { id: 1, label: "Creators" },
    { id: 2, label: "Brands" },
    { id: 3, label: "Groups" },
    { id: 4, label: "Events" },
    { id: 5, label: "Other" },
  ];

  return {
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
  };
}
