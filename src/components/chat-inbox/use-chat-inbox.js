import { useEffect, useState } from "react";

export default function useChatInbox() {
  const [activeTab, setActiveTab] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [isCreaterInbox, setIsCreaterInbox] = useState(false);
  const [openQuickHire, setOpenQuickHire] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    checked ? setIsCreaterInbox(true) : setIsCreaterInbox(false);
  }, [checked]);

  const handleSwitchChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleOpenQuickHire = () => {
    setOpenQuickHire(true);
  };

  const handleCloseQuickHire = () => {
    setOpenQuickHire(false);
  };

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
    checked,
    handleSwitchChange,
  };
}
