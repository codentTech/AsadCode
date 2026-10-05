"use client";

import SettingSidebar from "./setting-sidebar/setting-sidebar.component";
import AppSidebar from "@/components/app-sidebar/app-sidebar.component";
import { Menu } from "lucide-react";
import Link from "next/link";
import useSettingsLayout from "./use-settings-layout.hook";

export default function SettingsLayout({ children }) {
  const {
    mobileMenuOpen,
    sidebarCollapsed,
    isDesktop,
    openMobileMenu,
    closeMobileMenu,
    toggleSidebarCollapse,
    termsHref,
    privacyHref,
  } = useSettingsLayout();

  const contentOffset = isDesktop
    ? sidebarCollapsed
      ? "ml-16 lg:ml-36"
      : "ml-16 lg:ml-[22rem]"
    : "ml-16";

  return (
    <div className="min-h-screen flex">
      <AppSidebar />
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
        className={`flex min-w-0 flex-1 flex-col transition-[margin] duration-300 ease-in-out ${contentOffset}`}
      >
        {!isDesktop ? (
          <div className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-gray-200 bg-white px-3">
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700"
              onClick={openMobileMenu}
              aria-label="Open settings menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-gray-800">Settings</span>
          </div>
        ) : null}

        <main className="flex-1 overflow-x-hidden bg-gray-50 px-2.5 py-6 pb-8 sm:px-4 sm:py-8 lg:px-6">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 px-4 py-4 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2024 Cleercut. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <Link
                href={privacyHref}
                className="hidden md:inline hover:text-indigo-600 transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="hidden md:inline">•</span>
              <Link
                href={termsHref}
                className="hidden md:inline hover:text-indigo-600 transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
