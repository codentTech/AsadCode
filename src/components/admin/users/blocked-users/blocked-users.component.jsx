"use client";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import { formatDate } from "@/common/utils/date.utils";
import { Download, Filter, ShieldOff, User } from "lucide-react";
import useBlockedUsers from "./use-blocked-users.hook";
import DashboardLayout from "@/common/layouts/dashboard-layout";

const BlockedUsers = () => {
  const {
    searchTerm,
    blockedUsers,
    columns,
    selectedUsers,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
  } = useBlockedUsers();

  // Define actions
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <User size={16} />,
    },
    {
      key: "admin-unblock",
      label: "Unblock User",
      icon: <ShieldOff size={16} />,
    },
  ];

  // Custom cell renderers
  const customCellRenderer = {
    role: (value) => {
      const getRoleColor = (role) => {
        switch (role) {
          case "ADMIN":
            return "bg-purple-100 text-purple-800";
          case "BRAND":
            return "bg-blue-100 text-blue-800";
          case "CREATOR":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(value)}`}
        >
          {value}
        </span>
      );
    },
    blocked_at: (value) => {
      if (!value) return <span className="text-sm text-gray-400">-</span>;
      return <span className="text-sm text-red-600 font-medium">{formatDate(value)}</span>;
    },
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Blocked Users</h3>
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                <Filter size={16} />
                <span>Filter</span>
              </button>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        {/* Custom Data Table */}
        <CustomDataTable
          columns={columns}
          data={blockedUsers}
          selectable={true}
          selectedIds={selectedUsers}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          customCellRenderer={customCellRenderer}
          emptyMessage="No blocked users found"
        />
      </div>
    </DashboardLayout>
  );
};

export default BlockedUsers;
