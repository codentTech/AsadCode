"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const CampaignTabBarMobileSlotContext = createContext(null);

export function CampaignTabBarMobileSlotProvider({ children }) {
  const [mobileSlot, setMobileSlot] = useState(null);

  const registerMobileSlot = useCallback((node) => {
    setMobileSlot(node);
  }, []);

  const clearMobileSlot = useCallback(() => {
    setMobileSlot(null);
  }, []);

  const value = useMemo(
    () => ({ mobileSlot, registerMobileSlot, clearMobileSlot }),
    [mobileSlot, registerMobileSlot, clearMobileSlot]
  );

  return (
    <CampaignTabBarMobileSlotContext.Provider value={value}>
      {children}
    </CampaignTabBarMobileSlotContext.Provider>
  );
}

export function useCampaignTabBarMobileSlot() {
  return useContext(CampaignTabBarMobileSlotContext);
}
