"use client";

import DashboardHeader from "@/components/admin/header/header.component";
import Sidebar from "@/components/admin/sidebar/sidebar.component";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import useAdminLayout from "./use-admin-layout.hook";

const pathToCurrentBar = (path) => {
  if (!path) return null;
  if (path.startsWith("/admin/payments")) return "Payments";
  if (path.startsWith("/admin/users")) return "Users";
  return null;
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const currentBar = useMemo(() => pathToCurrentBar(pathname), [pathname]);

  const {
    mobileMenuOpen,
    sidebarCollapsed,
    isDesktop,
    openMobileMenu,
    closeMobileMenu,
    toggleSidebarCollapse,
  } = useAdminLayout();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        isCollapsed={sidebarCollapsed}
        isDesktop={isDesktop}
        onToggleCollapse={toggleSidebarCollapse}
        setCurrentBar={null}
        currentBar={currentBar}
      />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ease-in-out ${
          isDesktop ? (sidebarCollapsed ? "lg:ml-20" : "lg:ml-72") : "ml-0"
        }`}
      >
        <DashboardHeader onMenuClick={openMobileMenu} />

        <main className="flex-1 overflow-x-hidden bg-gray-50 px-2.5 py-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] sm:px-4 sm:pb-[calc(6rem+env(safe-area-inset-bottom,0px))] lg:px-6 md:pb-20">
          {children}
        </main>

        <footer className="border-t border-gray-200 bg-white px-4 py-4 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px)+0.75rem)] lg:px-6 md:pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>© 2024 Cleercut. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <button className="hidden transition-colors hover:text-indigo-600 md:inline">
                Privacy Policy
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden transition-colors hover:text-indigo-600 md:inline">
                Terms of Service
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 md:mt-0">
              <span className="hidden md:inline">•</span>
              <button className="hidden transition-colors hover:text-indigo-600 md:inline">
                Documentation
              </button>
              <span className="hidden md:inline">•</span>
              <button className="hidden transition-colors hover:text-indigo-600 md:inline">
                Support
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
