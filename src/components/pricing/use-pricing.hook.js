import React, { useEffect, useState } from "react";

function usePricingHook() {
  const [activeTab, setActiveTab] = useState("creator");
  const [animateTable, setAnimateTable] = useState(false);

  // Toggle between creator and brand modes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Reset and trigger animation for table transitions
    setAnimateTable(false);
    setTimeout(() => setAnimateTable(true), 50);
  };

  // Trigger initial animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimateTable(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    activeTab,
    setActiveTab,
    handleTabChange,
    animateTable,
    setAnimateTable,
  };
}

export default usePricingHook;
