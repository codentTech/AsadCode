"use client";

import SidebarLayout from "@/common/layouts/sidebar.layout";
import StatsCards from "./components/stats-cards/stats-cards.component";
import WaitingList from "./components/waiting-list/waiting-list.component";

const AdminDashboard = () => {
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
    <SidebarLayout showDashboardHeader={true}>
      {/* Dashboard Content */}

      {/* Stats Cards */}
      <StatsCards users={waitingListUsers} />

      {/* Waitlist Table */}
      <WaitingList users={waitingListUsers} />
    </SidebarLayout>
  );
};

export default AdminDashboard;
