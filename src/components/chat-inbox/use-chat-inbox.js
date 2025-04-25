import { useState } from "react";

export default function useChatInbox() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [isCreaterInbox, setIsCreaterInbox] = useState(true);

  const mainTabs = [
    { id: 1, label: "Active Campaigns" },
    { id: 2, label: "Completed Campaigns" },
    { id: 3, label: "Applications" },
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
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
    isCreaterInbox,
  };
}
