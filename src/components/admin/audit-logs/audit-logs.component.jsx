"use client";

import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import useAuditLogs from "./use-audit-logs.hook";

const AuditLogs = () => {
  const {
    columns,
    items,
    isLoading,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
    searchTerm,
    handleSearchChange,
  } = useAuditLogs();

  return (
    <DashboardLayout>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
              Security audit logs
            </h3>
          </div>
          <p className="mb-4 text-[10px] leading-snug text-gray-500 sm:text-xs md:text-sm">
            Impersonation and other privileged actions.
          </p>
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative min-w-[200px] max-w-md flex-1">
              <CustomInput
                type="text"
                name="audit-search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by admin email, subject, action, details"
                startIcon={<SearchIcon />}
                className="!h-[36px]"
              />
            </div>
          </div>
        </div>
        <div className="min-w-0 overflow-x-auto">
          <CustomDataTable
            columns={columns}
            data={items}
            selectable={false}
            searchable={false}
            externalSearch
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            emptyMessage="No audit entries yet"
            loading={isLoading}
            externalPagination
            currentPage={currentPage}
            pageSize={pageSize}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;
