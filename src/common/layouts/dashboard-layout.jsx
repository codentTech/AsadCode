"use client";

import Sidebar from "@/components/admin/sidebar/sidebar.component";
import PrivateHeader from "@/components/private-header/private-header.component";
import { getUser } from "@/common/utils/users.util";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import ROLES from "../constants/role.constant";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [activeRoute, setActiveRoute] = useState(pathname || "/admin/dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAdmin = useMemo(() => getUser()?.role === ROLES.ADMIN, []);
  console.log(isAdmin);

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

  // Get page title from pathname
  const getPageTitle = () => {
    if (!activeRoute) return "Dashboard";

    const pathSegments = activeRoute.split("/").filter(Boolean);
    if (pathSegments.length <= 1) return "Dashboard";

    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Get breadcrumbs from pathname
  const getBreadcrumbs = () => {
    if (!activeRoute) return [{ label: "Dashboard", path: "/admin" }];

    const pathSegments = activeRoute.split("/").filter(Boolean);
    const breadcrumbs = [{ label: "Home", path: "/admin" }];

    let currentPath = "";
    pathSegments.forEach((segment, index) => {
      if (segment === "admin") return;

      currentPath += `/${segment}`;
      const label = segment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");

      breadcrumbs.push({
        label,
        path: `/admin${currentPath}`,
        isLast: index === pathSegments.length - 1,
      });
    });

    return breadcrumbs;
  };

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen flex">
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Always Fixed */}
      <Sidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        collapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        activeRoute={activeRoute}
      />

      {/* Main Content Area - With Left Margin for Sidebar */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? "ml-16" : "ml-72"
        }`}
      >
        {/* Header */}
        {isAdmin ? null : <PrivateHeader />}

        {/* Main Content */}
        <main
          className={`flex-1 px-4 lg:px-6 ${isAdmin ? "py-10" : "py-20"} overflow-x-hidden bg-gray-50`}
        >
          {children}
        </main>

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
