import { useState } from "react";

export default function useChatInbox() {
  const [activeTab, setActiveTab] = useState("My Network");
  const [activeSection, setActiveSection] = useState("Creators");

  const mainTabs = [
    "Active Campaigns",
    "Completed Campaigns",
    "Applications",
    "My Network",
    "Events",
  ];

  const sections = ["Creators", "Brands", "Groups", "Events", "Other"];
  return {
    activeTab,
    setActiveTab,
    activeSection,
    setActiveSection,
    mainTabs,
    sections,
  };
}

