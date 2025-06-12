"use client";

import { notificationsMockData } from "@/common/constants/notifications.data.constant";
import React, { useState } from "react";
import Header from "./components/header/header.component";
import Notifications from "./components/notifications/notifications.component";
import Sidebar from "./components/sidebar/sidebar.component";
import StatsCards from "./components/stats-cards/stats-cards.component";
import WaitingList from "./components/waiting-list/waiting-list.component";

// Main Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentBar, setCurrentBar] = useState("User Waitlist");

  console.log(currentBar);

  // Mock data for waiting list
  const waitingListUsers = [
    {
      id: 1,
      email: "john.doe@example.com",
      joinedDate: "2024-03-15",
      status: "pending",
      priority: "high",
    },
    {
      id: 2,
      email: "sarah.wilson@gmail.com",
      joinedDate: "2024-03-14",
      status: "pending",
      priority: "medium",
    },
    {
      id: 3,
      email: "mike.johnson@company.com",
      joinedDate: "2024-03-13",
      status: "reviewed",
      priority: "low",
    },
    {
      id: 4,
      email: "emma.davis@startup.io",
      joinedDate: "2024-03-12",
      status: "pending",
      priority: "high",
    },
    {
      id: 5,
      email: "alex.brown@tech.com",
      joinedDate: "2024-03-11",
      status: "approved",
      priority: "medium",
    },
    {
      id: 6,
      email: "lisa.anderson@design.co",
      joinedDate: "2024-03-10",
      status: "pending",
      priority: "high",
    },
    {
      id: 7,
      email: "david.kim@agency.com",
      joinedDate: "2024-03-09",
      status: "approved",
      priority: "low",
    },
    {
      id: 8,
      email: "rachel.green@studio.io",
      joinedDate: "2024-03-08",
      status: "pending",
      priority: "medium",
    },
    {
      id: 9,
      email: "lisa.anderson@design.co",
      joinedDate: "2024-03-10",
      status: "pending",
      priority: "high",
    },
    {
      id: 10,
      email: "david.kim@agency.com",
      joinedDate: "2024-03-09",
      status: "approved",
      priority: "low",
    },
    {
      id: 11,
      email: "rachel.green@studio.io",
      joinedDate: "2024-03-08",
      status: "pending",
      priority: "medium",
    },
  ];

  const [notifications, setNotifications] = useState(notificationsMockData);

  const unreadCount = notifications["brand"].filter((n) => n.unread).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        setCurrentBar={setCurrentBar}
        currentBar={currentBar}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          notifications={notifications}
          unreadCount={unreadCount}
          setCurrentBar={setCurrentBar}
        />

        {/* Dashboard Content */}
        <main className="p-6">
          {currentBar === "Notifications" ? (
            <Notifications notifications={notifications} setNotifications={setNotifications} />
          ) : (
            <React.Fragment>
              {/* Stats Cards */}
              <StatsCards users={waitingListUsers} />

              {/* Waitlist Table */}
              <WaitingList users={waitingListUsers} />
            </React.Fragment>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
