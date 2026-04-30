"use client";

import SettingSidebar from "./setting-sidebar/setting-sidebar.component";
import PrivateHeader from "@/components/private-header/private-header.component";
import { Menu } from "lucide-react";
import useSettingsLayout from "./use-settings-layout.hook";

export default function SettingsLayout({ children }) {
  const {
    mobileMenuOpen,
    sidebarCollapsed,
    isDesktop,
    openMobileMenu,
    closeMobileMenu,
    toggleSidebarCollapse,
  } = useSettingsLayout();

  return (
    <div className="min-h-screen flex">
      <SettingSidebar
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        isCollapsed={sidebarCollapsed}
        isDesktop={isDesktop}
        onToggleCollapse={toggleSidebarCollapse}
        setCurrentBar={null}
        currentBar={null}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${
          isDesktop ? (sidebarCollapsed ? "lg:ml-20" : "lg:ml-72") : "ml-0"
        }`}
      >
        <PrivateHeader
          mobileRightSlot={
            !isDesktop ? (
              <button
                type="button"
                className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-white/30 bg-white/10 text-white"
                onClick={openMobileMenu}
                aria-label="Open settings menu"
              >
                <Menu className="h-4 w-4" />
              </button>
            ) : null
          }
        />

        <main className="flex-1 overflow-x-hidden bg-gray-50 px-2.5 py-16 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:px-4 sm:py-20 sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:px-6 md:pb-20">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 px-4 py-4 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px)+0.75rem)] lg:px-6 md:pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2024 Cleercut. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-indigo-600 transition-colors">
                Privacy Policy
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-indigo-600 transition-colors">
                Terms of Service
              </button>
            </div>

            <div className="flex items-center space-x-4 mt-2 md:mt-0 text-sm text-gray-600">
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-indigo-600 transition-colors">
                Documentation
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden md:inline hover:text-indigo-600 transition-colors">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
