"use client";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import { Filter, UserCheck, UserX, ArrowUpDown } from "lucide-react";
import useCreatorApplications from "./use-creator-applications.hook";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SearchIcon from "@/common/icons/search-icon";
import { useState } from "react";

const CreatorApplications = () => {
  const {
    searchTerm,
    filteredApplications,
    columns,
    selectedApplications,
    statusFilter,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleSortChange,
    handleStatusFilterChange,
    handleSelectionChange,
    handleActionClick,
    isLoading,
  } = useCreatorApplications();

  const [showFilters, setShowFilters] = useState(false);

  // Define actions based on row status
  const getActionsForRow = (row) => {
    const actions = [];

    // Only show approve action if status is not APPROVED
    if (row?.status !== "APPROVED" || row?.status !== "ONBOARDING_STARTED") {
      actions.push({
        key: "approve",
        label: "Approve and Invite",
        icon: <UserCheck size={16} />,
      });
    }

    // Only show deny action if status is not APPROVED
    if (row?.status !== "APPROVED" || row?.status !== "ONBOARDING_STARTED") {
      actions.push({
        key: "deny",
        label: "Deny",
        icon: <UserX size={16} />,
      });
    }

    return actions;
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Creator Applications</h3>
          </div>

          {/* Search and Filter Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search applications..."
                startIcon={<SearchIcon />}
                className="!h-[36px]"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ${
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              title="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>

          {/* Filters and Sorting - Collapsible */}
          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center gap-6">
                {/* Status Filter */}
                <div className="flex items-center gap-2 w-full max-w-[300px]">
                  <SimpleSelect
                    label="Status"
                    value={statusFilter || "ALL"}
                    onChange={(value) => handleStatusFilterChange(value)}
                    options={[
                      { value: "ALL", label: "All" },
                      { value: "PENDING", label: "Pending" },
                      { value: "DENIED", label: "Denied" },
                      { value: "ONBOARDING_STARTED", label: "Onboarding Started" },
                      { value: "APPROVED", label: "Approved" },
                    ]}
                    className="w-44"
                  />
                </div>

                {/* Sort By */}
                <div className="flex items-center gap-2 w-full max-w-[300px]">
                  <SimpleSelect
                    label="Sort by"
                    value={sortBy}
                    onChange={(value) => handleSortChange(value)}
                    options={[
                      { value: "created_at", label: "Date" },
                      { value: "country", label: "Country" },
                      { value: "status", label: "Status" },
                    ]}
                    className="w-44"
                  />
                </div>

                {/* Sort Order */}
                <button
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

        {/* Custom Data Table */}
        <CustomDataTable
          columns={columns}
          data={filteredApplications}
          selectable={true}
          selectedIds={selectedApplications}
          searchable={false}
          externalSearch={true}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={getActionsForRow}
          onActionClick={handleActionClick}
          emptyMessage="No creator applications found"
          loading={isLoading}
        />
      </div>
    </DashboardLayout>
  );
};

export default CreatorApplications;
