import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function useChatInbox() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const [activeTab, setActiveTab] = useState(1);
  const [activeSection, setActiveSection] = useState(1);
  const [openQuickHire, setOpenQuickHire] = useState(false);

  const handleOpenQuickHire = () => {
    setOpenQuickHire(true);
  };

  const handleCloseQuickHire = () => {
    setOpenQuickHire(false);
  };

  const mainTabs = [
    { id: 1, label: 'Active Campaigns' },
    { id: 2, label: 'Completed Campaigns' },
    { id: 3, label: 'Applications' },
    { id: 4, label: 'My Network' },
    { id: 5, label: 'Message Requests' },
  ];

  const sections = [
    { id: 1, label: 'Creators' },
    { id: 2, label: 'Brands' },
    { id: 3, label: 'Groups' },
    { id: 4, label: 'Events' },
    { id: 5, label: 'Other' },
  ];

  return {
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
  };
}
