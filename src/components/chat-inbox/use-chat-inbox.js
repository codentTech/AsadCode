import { useState } from "react";

export default function useChatInbox() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [isCreaterInbox, setIsCreaterInbox] = useState(false);
  const [openQuickHire, setOpenQuickHire] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOpenQuickHire = () => {
    setOpenQuickHire(true);
  };

  const handleCloseQuickHire = () => {
    setOpenQuickHire(false);
    setSelectedOption(null);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Mock campaigns for the demo
  const publicCampaigns = [
    { id: 1, title: "Summer Collection Launch", status: "Open" },
    { id: 2, title: "New Product Teaser", status: "Open" },
    { id: 3, title: "Holiday Special", status: "Open" },
  ];

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
    handleOpenQuickHire,
    openQuickHire,
    handleCloseQuickHire,
    handleOptionSelect,
    publicCampaigns,
    selectedOption,
  };
}
