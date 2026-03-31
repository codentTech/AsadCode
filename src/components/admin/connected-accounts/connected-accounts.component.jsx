"use client";

import DeleteConfirmationModal from "@/common/components/delete-confirmation-modal/delete-confirmation-modal.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import useConnectedAccounts from "./use-connected-accounts.hook";

const ConnectedAccounts = () => {
  const {
    columns,
    actions,
    searchTerm,
    filteredAccounts,
    selectedIds,
    isLoading,
    openDeleteModal,
    selectedAccount,
    setOpenDeleteModal,
    handleSearchChange,
    handleSelectionChange,
    handleActionClick,
    handleConfirmRemove,
  } = useConnectedAccounts();

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Connected Accounts</h3>
        </div>

        <CustomDataTable
          columns={columns}
          data={filteredAccounts}
          selectable={true}
          selectedIds={selectedIds}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          emptyMessage="No connected accounts found"
          loading={isLoading}
        />
      </div>

      <DeleteConfirmationModal
        id={0}
        openConfirmationPopup={openDeleteModal}
        setOpenConfirmationPopup={setOpenDeleteModal}
        mainText="Remove this connected account?"
        subText={`This will unlink ${selectedAccount?.platform || "social"} account from ${selectedAccount?.full_name || "creator"}.`}
        confirmText="Remove"
        closeText="Cancel"
        action={handleConfirmRemove}
        type="connected-account"
      />
    </DashboardLayout>
  );
};

export default ConnectedAccounts;
