"use client";

import { Bell, Menu } from "lucide-react";
import { useState } from "react";
import Sidebar from "./components/sidebar/sidebar.component";
import StatsCards from "./components/stats-cards/stats-cards.component";
import WaitingList from "./components/waiting-list/waiting-list.component";

// Header Component
const Header = ({ onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

// Main Dashboard Component
const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* Dashboard Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <StatsCards users={waitingListUsers} />

          {/* Waitlist Table */}
          <WaitingList users={waitingListUsers} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
