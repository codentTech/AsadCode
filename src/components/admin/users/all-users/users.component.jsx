"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import {
  ADMIN_USERS_ONBOARDING_FILTER_OPTIONS,
  ADMIN_USERS_ROLE_FILTER_OPTIONS,
  ADMIN_USERS_STATUS_FILTER_OPTIONS,
  ADMIN_USERS_SORT_OPTIONS,
} from "@/common/constants/options.constant";
import { ArrowUpDown, Filter } from "lucide-react";
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
    openImpersonateModal,
    setOpenImpersonateModal,
    userToImpersonate,
    isImpersonatingUser,
    handleConfirmImpersonate,
    roleFilter,
    statusFilter,
    onboardingFilter,
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleOnboardingFilterChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
    currentPage,
    pageSize,
    totalUsers,
    handlePageChange,
    handlePageSizeChange,
  } = useUsers();

  return (
    <DashboardLayout>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">User Management</h3>
            {/* <button
              type="button"
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button> */}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name, email"
                startIcon={<SearchIcon />}
                className="!h-[36px]"
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
            <button
              type="button"
              onClick={toggleFilters}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ml-auto ${
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              title="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5 xl:items-end">
                <div className="w-full">
                  <SimpleSelect
                    label="Role"
                    value={roleFilter || "ALL"}
                    onChange={(value) => handleRoleFilterChange(value)}
                    options={ADMIN_USERS_ROLE_FILTER_OPTIONS}
                    className="w-full"
                  />
                </div>

                <div className="w-full">
                  <SimpleSelect
                    label="Status"
                    value={statusFilter || "ALL"}
                    onChange={(value) => handleStatusFilterChange(value)}
                    options={ADMIN_USERS_STATUS_FILTER_OPTIONS}
                    className="w-full"
                  />
                </div>

                <div className="w-full">
                  <SimpleSelect
                    label="Onboarding"
                    value={onboardingFilter || "ALL"}
                    onChange={(value) => handleOnboardingFilterChange(value)}
                    options={ADMIN_USERS_ONBOARDING_FILTER_OPTIONS}
                    className="w-full"
                  />
                </div>

                <div className="w-full">
                  <SimpleSelect
                    label="Sort by"
                    value={sortBy}
                    onChange={(value) => handleSortChange(value)}
                    options={ADMIN_USERS_SORT_OPTIONS}
                    className="w-full"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSortChange(sortBy)}
                  className="flex h-10 items-center justify-center space-x-1 rounded-lg px-3 text-sm text-white transition-colors bg-primary hover:bg-primary/90 sm:mt-6 xl:mt-0"
                  title={`Sort ${sortOrder === "ASC" ? "Descending" : "Ascending"}`}
                >
                  <ArrowUpDown size={16} />
                  <span>{sortOrder === "ASC" ? "Asc" : "Desc"}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 overflow-x-auto">
          <CustomDataTable
            columns={columns}
            data={filteredUsers}
            selectable={true}
            selectedIds={selectedUsers}
            searchable={false}
            externalSearch={true}
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onSelectionChange={handleSelectionChange}
            actions={actions}
            onActionClick={handleActionClick}
            emptyMessage="No users found"
            loading={isLoading}
            externalPagination={true}
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalUsers}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
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
      <ConfirmationModal
        show={openImpersonateModal}
        close={() => setOpenImpersonateModal(false)}
        onConfirm={handleConfirmImpersonate}
        onCancel={() => setOpenImpersonateModal(false)}
        message="Impersonate this account?"
        messageStyling="text-center text-base font-semibold text-gray-900 sm:text-lg"
        content={`You will operate the platform as ${userToImpersonate?.email || "this user"}. You can exit impersonation at any time.`}
        contentStyling="mt-2 max-w-sm text-center text-xs text-gray-600 sm:text-sm"
        cancelText="Cancel"
        confirmText="Impersonate"
        confirmLoading={isImpersonatingUser}
        confirmLoadingText="Impersonating"
      />
    </DashboardLayout>
  );
};

export default Users;
