"use client";

import DashboardHeader from "@/components/admin/header/header.component";
import Sidebar from "@/components/admin/sidebar/sidebar.component";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const pathToCurrentBar = (path) => {
  if (!path) return null;
  if (path.startsWith("/admin/payments")) return "Payments";
  if (path.startsWith("/admin/users")) return "Users";
  return null;
};

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname || "/admin/dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentBar = useMemo(() => pathToCurrentBar(pathname), [pathname]);

  // Update active route when pathname changes
  useEffect(() => {
    if (pathname) {
      setActiveRoute(pathname);
    }
  }, [pathname]);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
        setMobileMenuOpen(false);
      } else {
        // Auto-expand sidebar on larger screens
        setSidebarCollapsed(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeRoute]);

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Admin only */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        setCurrentBar={null}
        currentBar={currentBar}
      />

      {/* Main Content Area - With Left Margin for Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "ml-16" : "ml-72"
        }`}
      >
        {/* Admin Header */}
        <DashboardHeader
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        {/* Main Content */}
        <main className={`flex-1 px-4 lg:px-6 pt-24 overflow-x-hidden bg-gray-50`}>{children}</main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-4 lg:px-6 py-4">
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
              <span>Version 1.0.0</span>
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
