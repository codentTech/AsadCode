"use client";

import SearchIcon from "@/common/icons/search-icon";
import PropTypes from "prop-types";
import React from "react";
import ActionDropdownPortal from "../action-portal/action-portal.component";
import CustomInput from "../custom-input/custom-input.component";
import { useCustomDataTable } from "./use-custom-data-table.hook";

const CustomDataTable = ({
  // Core data props
  columns,
  data,
  loading = false,

  // Sorting props
  initialSortConfig = { key: null, direction: "asc" },
  onSortChange,
  externalSort = false,

  // Selection props
  selectable = true,
  selectedIds = [],
  onSelectionChange,

  // Search props
  searchable = true,
  searchValue = "",
  onSearchChange,
  externalSearch = false,

  // Pagination props
  paginated = true,
  currentPage = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  externalPagination = false,

  // Actions props
  actions = [],
  onActionClick,

  // Status props
  statusField,
  statusOptions = [],
  onStatusChange,

  // Customization props
  customCellRenderer = {},
  className = "",
  tableClassName = "",
  headerClassName = "",
  rowClassName = "",

  // Display options
  showHeader = true,
  emptyMessage = "No data found",
  height,
}) => {
  const {
    paginatedData,
    totalRecordsCount,
    sortConfig,
    handleSort,
    currentPage: internalCurrentPage,
    pageSize: internalPageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleRowSelect,
    activeActionRow,
    actionRef,
    handleActionRowToggle,
    handleActionClick,
  } = useCustomDataTable({
    data,
    columns,
    initialSortConfig,
    onSortChange,
    externalSort,
    searchValue,
    externalSearch,
    currentPage,
    pageSize,
    totalRecords,
    onPageChange,
    onPageSizeChange,
    externalPagination,
    selectedIds,
    onSelectionChange,
  });

  // Render cell content
  const renderCell = (column, row) => {
    if (customCellRenderer[column.key]) {
      return customCellRenderer[column.key](row[column.key], row);
    }
    return row[column.key] ?? "---";
  };

  // Render sort icon
  const renderSortIcon = (column) => {
    if (!column.sortable) return null;

    const isActive = sortConfig.key === column.key;
    const isAsc = sortConfig.direction === "asc";

    return (
      <svg width="9" height="15" viewBox="0 0 9 15" className="ml-1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 6.3326L4.03846 0.499268L8.07692 6.3326H0Z"
          fill={isActive && isAsc ? "#000" : "#BDBDBD"}
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M0 8.66724L4.03846 14.5006L8.07692 8.66724H0Z"
          fill={isActive && !isAsc ? "#000" : "#BDBDBD"}
        />
      </svg>
    );
  };

  const calculateColSpan = () => {
    return (
      columns.length + (selectable ? 1 : 0) + (statusField ? 1 : 0) + (actions.length > 0 ? 1 : 0)
    );
  };

  return (
    <div className={`bg-white ${className}`}>
      {/* Search Header */}
      {searchable && !externalSearch && (
        <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="relative max-w-sm">
            <CustomInput
              type="text"
              name="search"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search conversations..."
              startIcon={<SearchIcon />}
              className="!h-[36px]"
            />
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto" style={{ height }}>
        <table className={`w-full ${tableClassName}`}>
          {/* Header */}
          {showHeader && (
            <thead className={`z-10 bg-gray-50 border-b ${headerClassName}`}>
              <tr>
                {/* Selection checkbox */}
                {selectable && (
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                )}

                {/* Column headers */}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                  >
                    <div
                      className={`flex items-center ${
                        column.sortable ? "cursor-pointer hover:text-gray-700" : ""
                      }`}
                      onClick={() => handleSort(column.key)}
                    >
                      {column.title}
                      {renderSortIcon(column)}
                    </div>
                  </th>
                ))}

                {/* Status column */}
                {statusField && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Status</th>
                )}

                {/* Actions column */}
                {actions.length > 0 && (
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">Actions</th>
                )}
              </tr>
            </thead>
          )}

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={calculateColSpan()} className="px-4 py-8 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan={calculateColSpan()} className="px-4 py-8 text-center text-gray-500">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => (
                <React.Fragment key={row.id || index}>
                  <tr className={`hover:bg-gray-50 ${rowClassName}`}>
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                        {renderCell(column, row)}
                      </td>
                    ))}

                    {/* Status cell */}
                    {statusField && (
                      <td className="px-4 py-3">
                        <select
                          value={row[statusField]}
                          onChange={(e) => onStatusChange?.(row.id, e.target.value)}
                          className="rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                          {statusOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}

                    {/* Actions cell */}
                    {actions.length > 0 && (
                      <td className="px-4 py-3 relative">
                        <button
                          onClick={() => handleActionRowToggle(row.id)}
                          ref={actionRef}
                          className="p-2 rounded hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                          </svg>
                        </button>

                        {activeActionRow === row.id && (
                          <ActionDropdownPortal targetRef={actionRef}>
                            {actions.map((action) => (
                              <button
                                key={action.key}
                                onClick={() => handleActionClick(action.key, row, onActionClick)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-md last:rounded-b-md"
                              >
                                {action.icon && <span className="mr-2">{action.icon}</span>}
                                {action.label}
                              </button>
                            ))}
                          </ActionDropdownPortal>
                        )}
                      </td>
                    )}
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginated && totalRecordsCount > 0 && (
        <div className="z-10 px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-lg flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-700">
            <span>Show</span>
            <select
              value={internalPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="mx-2 rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>of {totalRecordsCount} entries</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(internalCurrentPage - 1)}
              disabled={internalCurrentPage <= 1}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Previous
            </button>

            <span className="text-sm text-gray-700">
              Page {internalCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(internalCurrentPage + 1)}
              disabled={internalCurrentPage >= totalPages}
              className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

CustomDataTable.propTypes = {
  // Core data
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
    })
  ).isRequired,
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  loading: PropTypes.bool,

  // Sorting
  initialSortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(["asc", "desc"]),
  }),
  onSortChange: PropTypes.func,
  externalSort: PropTypes.bool,

  // Selection
  selectable: PropTypes.bool,
  selectedIds: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  onSelectionChange: PropTypes.func,

  // Search
  searchable: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  externalSearch: PropTypes.bool,

  // Pagination
  paginated: PropTypes.bool,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalRecords: PropTypes.number,
  onPageChange: PropTypes.func,
  onPageSizeChange: PropTypes.func,
  externalPagination: PropTypes.bool,

  // Actions
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ),
  onActionClick: PropTypes.func,

  // Status
  statusField: PropTypes.string,
  statusOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  onStatusChange: PropTypes.func,

  // Customization
  customCellRenderer: PropTypes.object,
  className: PropTypes.string,
  tableClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  rowClassName: PropTypes.string,

  // Display options
  showHeader: PropTypes.bool,
  emptyMessage: PropTypes.string,
  height: PropTypes.string,
};

export default CustomDataTable;
