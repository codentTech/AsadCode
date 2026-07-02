"use client";

import ThreedotIcon from "@/common/icons/threedot.icon";
import PropTypes from "prop-types";
import React from "react";
import { createPortal } from "react-dom";
import { useCustomDataTable } from "./use-custom-data-table.hook";
import SearchIcon from "@/common/icons/search-icon";
import CustomInput from "../custom-input/custom-input.component";

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
    dropdownPosition,
    activeActionRowId,
    setActiveActionRowId,
    handleActionRowToggle,
    handleActionClick,
    actionButtonRefs,
  } = useCustomDataTable({
    actions,
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

  // Helper function to get nested value from object
  const getNestedValue = (obj, path) => {
    return path.split(".").reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  // Render cell content
  const renderCell = (column, row) => {
    // If there's a custom renderer, use it
    if (column.customRender) {
      return column.customRender(row);
    }

    // If there's a global custom renderer for this column, use it
    if (customCellRenderer[column.key]) {
      return customCellRenderer[column.key](row[column.key], row);
    }

    // Get the value using the column key (supports nested keys like 'category.name')
    const value = getNestedValue(row, column.key);

    // Handle null/undefined values
    if (value === null || value === undefined) {
      return <span className="text-gray-400">---</span>;
    }

    // Handle different data types
    if (typeof value === "boolean") {
      return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
      // If it's an object, try to render it as JSON or return a placeholder
      try {
        return <span className="text-gray-400 text-xs">Object</span>;
      } catch (e) {
        return <span className="text-gray-400">---</span>;
      }
    }

    // For strings, numbers, and other primitive types
    return String(value);
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
      {searchable && !externalSearch && (
        <div className="rounded-t-lg border-b border-gray-200 bg-gray-50 p-3 sm:p-4">
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
      <div className="w-full overflow-x-auto relative rounded-lg" style={{ height }}>
        <table className={`w-full ${tableClassName}`}>
          {/* Header */}
          {showHeader && (
            <thead className={`z-10 rounded-full border-b bg-gray-50 ${headerClassName}`}>
              <tr>
                {/* Selection checkbox */}
                {selectable && (
                  <th className="w-10 px-2 py-2.5 sm:w-12 sm:px-4 sm:py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(el) => {
                        if (el) el.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="border border-gray-300 text-blue-600 rounded-full focus:ring-blue-500"
                    />
                  </th>
                )}

                {/* Column headers */}
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className="px-2 py-2.5 text-left text-xs font-medium text-gray-900 sm:px-4 sm:py-3 sm:text-sm"
                  >
                    <div
                      className={`flex items-center whitespace-nowrap ${
                        column.sortable ? "cursor-pointer hover:text-gray-700" : ""
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      {column.title}
                      {renderSortIcon(column)}
                    </div>
                  </th>
                ))}

                {/* Status column */}
                {statusField && (
                  <th className="px-2 py-2.5 text-left text-xs font-medium text-gray-900 sm:px-4 sm:py-3 sm:text-sm">
                    Status
                  </th>
                )}

                {/* Actions column */}
                {actions.length > 0 && (
                  <th className="px-2 py-2.5 text-left text-xs font-medium text-gray-900 sm:px-4 sm:py-3 sm:text-sm">
                    Actions
                  </th>
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
                      <td className="px-2 py-2.5 sm:px-4 sm:py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </td>
                    )}

                    {/* Data cells */}
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className="whitespace-nowrap px-2 py-2.5 text-xs text-gray-900 sm:px-4 sm:py-3 sm:text-sm"
                      >
                        {renderCell(column, row)}
                      </td>
                    ))}

                    {/* Status cell */}
                    {statusField && (
                      <td className="px-2 py-2.5 sm:px-4 sm:py-3">
                        <select
                          value={row[statusField]}
                          onChange={(e) => onStatusChange?.(row.id, e.target.value)}
                          className="rounded border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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
                    {(() => {
                      const rowActions = typeof actions === "function" ? actions(row) : actions;
                      return Array.isArray(rowActions) && rowActions.length > 0 ? (
                        <td className="relative px-2 py-2.5 sm:px-4 sm:py-3">
                          <button
                            onClick={(e) => handleActionRowToggle(row.id, e)}
                            ref={(el) => {
                              if (el) actionButtonRefs.current[row.id] = el;
                            }}
                            className="p-2 rounded hover:bg-gray-100 transition-colors duration-150"
                          >
                            <ThreedotIcon />
                          </button>
                        </td>
                      ) : null;
                    })()}
                  </tr>
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {activeActionRowId &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="action-dropdown-container fixed z-[1400]"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {(() => {
                const row = paginatedData.find((r) => r.id === activeActionRowId);
                const rowActions = typeof actions === "function" ? actions(row) : actions;
                const filteredActions = rowActions.filter((action) => action.hidden !== true);
                return filteredActions.map((action, index) => (
                  <button
                    key={action.key}
                    onClick={() => {
                      handleActionClick(action.key, row, onActionClick);
                      setActiveActionRowId(null);
                    }}
                    className={`flex w-full items-center px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100 ${
                      index === 0 ? "rounded-t-md" : ""
                    } ${index === filteredActions.length - 1 ? "rounded-b-md" : ""}`}
                  >
                    {action.icon && <span className="mr-2 flex-shrink-0">{action.icon}</span>}
                    <span className="truncate">{action.label}</span>
                  </button>
                ));
              })()}
            </div>
          </div>,
          document.body
        )}

      {/* Pagination */}
      {paginated && totalRecordsCount > 0 && (
        <div className="z-10 flex flex-col gap-2 rounded-b-lg border-t border-gray-200 bg-gray-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center text-xs text-gray-700 sm:text-sm">
            <span>Show</span>
            <select
              value={internalPageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="mx-2 rounded border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span>of {totalRecordsCount} entries</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:space-x-2">
            <button
              onClick={() => handlePageChange(internalCurrentPage - 1)}
              disabled={internalCurrentPage <= 1}
              className="rounded border border-gray-300 px-2.5 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
            >
              Previous
            </button>

            <span className="text-xs text-gray-700 sm:text-sm">
              Page {internalCurrentPage} of {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(internalCurrentPage + 1)}
              disabled={internalCurrentPage >= totalPages}
              className="rounded border border-gray-300 px-2.5 py-1 text-xs hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm"
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
      customRender: PropTypes.func,
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
