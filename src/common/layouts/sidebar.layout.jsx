"use client";

import DashboardHeader from "@/components/dashboard/components/header/header.component";
import { useState } from "react";
import { useSelector } from "react-redux";
import Sidebar from "../components/dashboard/sidebar/sidebar.component";
import { notificationsMockData } from "../constants/notifications.data.constant";

export default function SidebarLayout({
  children,
  showHeader = false,
  showFooter = false,
  showDashboardHeader = false,
}) {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unreadCount = notificationsMockData["brand"].filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* {showHeader && (
        <Header
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          userType={isCreatorMode ? "creator" : "brand"}
          showMenuButton={true}
        />
      )} */}

      <div className="flex-1">
        <Sidebar
          active={active}
          setActive={setActive}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          hasHeader={showHeader}
        />
        <main className="ml-0 lg:ml-72 min-h-screen">
          {showDashboardHeader && (
            <DashboardHeader notifications={notificationsMockData} unreadCount={unreadCount} />
          )}
          <div className="flex-1 py-6 px-2 sm:px-4 lg:px-6 bg-white">{children}</div>
          {/* {showFooter && <Footer />} */}
        </main>
      </div>
    </div>
  );
}
