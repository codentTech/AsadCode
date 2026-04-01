"use client";

import DashboardLayout from "@/common/layouts/dashboard-layout";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import DashboardTrends from "./components/dashboard-trends/dashboard-trends.component";
import StatsCards from "./components/stats-cards/stats-cards.component";
import useAdminDashboard from "./use-admin-dashboard.hook";

const AdminDashboard = () => {
  const { kpiItems, signupsByDay, applicationsByDay, isLoading, isError, message, reload } =
    useAdminDashboard();

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Overview of platform activity and items needing attention.</p>
        </div>
        <CustomButton
          type="button"
          text="Refresh"
          variant="outlined"
          onClick={reload}
          disabled={isLoading}
          loading={isLoading}
          className="min-w-[120px] py-2 px-4 rounded-md text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 normal-case"
        />
      </div>

      {isError ? (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {message || "Could not load dashboard data."}
        </div>
      ) : null}

      <StatsCards items={kpiItems} isLoading={isLoading} />
      <DashboardTrends
        signupsByDay={signupsByDay}
        applicationsByDay={applicationsByDay}
        isLoading={isLoading}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
