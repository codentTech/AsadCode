"use client";

import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { ADMIN_WAITLIST_SORT_OPTIONS } from "@/common/constants/options.constant";
import { ArrowUpDown, Download, Filter } from "lucide-react";
import useWaitingList from "./use-waiting-list.hook";

const WaitingList = () => {
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
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
  } = useWaitingList();

  return (
    <DashboardLayout>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Waitlist Management</h3>
            {/* <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <Download size={16} />
                <span>Export</span>
              </button>
            </div> */}
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by email..."
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
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 w-full max-w-[300px]">
                  <SimpleSelect
                    label="Sort by"
                    value={sortBy}
                    onChange={(value) => handleSortChange(value)}
                    options={ADMIN_WAITLIST_SORT_OPTIONS}
                    className="w-44"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSortChange(sortBy)}
                  className="mt-6 flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200"
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
          emptyMessage="No waitlist entries found"
          loading={isLoading}
        />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WaitingList;
