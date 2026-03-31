"use client";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Download, Filter } from "lucide-react";
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
    actions,
    openDeleteModal,
    setOpenDeleteModal,
    userToDelete,
    handleConfirmDelete,
  } = useUsers();

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
          loading={isLoading}
        />
      </div>

      <DeleteConfirmationModal
        id={0}
        openConfirmationPopup={openDeleteModal}
        setOpenConfirmationPopup={setOpenDeleteModal}
        mainText="Permanently delete this user account?"
        subText={`This will remove ${userToDelete?.email || "this user"} and all related data. This cannot be undone.`}
        confirmText="Delete account"
        closeText="Cancel"
        action={handleConfirmDelete}
        type="admin-delete-user"
      />
    </DashboardLayout>
  );
};

export default Users;
