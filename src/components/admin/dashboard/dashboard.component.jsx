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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold text-gray-900 sm:text-2xl sm:font-bold">
            Dashboard
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            Overview of platform activity and items needing attention.
          </p>
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
