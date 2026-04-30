"use client";

import HeaderLayout from "@/common/layouts/header.layout";
import {
  CampaignTabBarMobileSlotProvider,
  useCampaignTabBarMobileSlot,
} from "./campaign-tab-bar-mobile-slot.context";
import useCampaign from "./use-campaign.hook";

function CampaignShell() {
  const { activeTab, setActiveTab, mainTabs, ActiveComponent } = useCampaign();
  const tabBarSlotCtx = useCampaignTabBarMobileSlot();
  const mobileSlot = tabBarSlotCtx?.mobileSlot ?? null;

  return (
    <div className="flex flex-col flex-1 min-h-0 border-b border-gray-200">
      <div className="fixed top-12 left-0 right-0 z-40 border-b border-gray-200 bg-white shadow-sm">
        <nav className="flex items-stretch gap-1 px-1.5 py-1.5 sm:gap-1.5 sm:px-2 sm:py-2 md:gap-2 md:px-3">
          {mobileSlot ? (
            <div className="flex shrink-0 items-stretch md:hidden">{mobileSlot}</div>
          ) : null}
          <div className="flex min-w-0 flex-1 items-stretch gap-1 md:flex-none">
            {mainTabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex min-h-[30px] flex-1 basis-0 items-center justify-center truncate rounded-md border px-1 py-1 text-tab-sm font-medium leading-tight transition-colors active:opacity-90 sm:min-h-8 sm:px-1.5 sm:text-xs md:min-h-9 md:min-w-[112px] md:flex-none md:rounded-lg md:px-3 md:text-sm ${
                  activeTab === tab.id
                    ? "border-primary bg-primary text-white shadow-sm"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      <div className="flex flex-col flex-1 min-h-0 overflow-hidden pt-[44px] sm:pt-[48px] md:pt-[56px]">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
}

export default function Campaign() {
  return (
    <HeaderLayout>
      <CampaignTabBarMobileSlotProvider>
        <CampaignShell />
      </CampaignTabBarMobileSlotProvider>
    </HeaderLayout>
  );
}
