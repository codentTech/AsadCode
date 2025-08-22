"use client";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Download, Filter, Shield, ShieldOff, User } from "lucide-react";
import useUsers from "./use-users.hook";

const Users = () => {
  const {
    searchTerm,
    filteredUsers,
    columns,
    selectedUsers,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
    isLoading,
  } = useUsers();

  // Define actions
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <User size={16} />,
    },
    {
      key: "block",
      label: "Block",
      icon: <Shield size={16} />,
    },
    {
      key: "unblock",
      label: "Unblock",
      icon: <ShieldOff size={16} />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
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
          data={filteredUsers}
          selectable={true}
          selectedIds={selectedUsers}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          emptyMessage="No users found"
          isLoading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
