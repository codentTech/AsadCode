import { useState, useEffect, useRef, useMemo } from "react";

export const useCustomDataTable = ({
  data = [],
  columns = [],
  initialSortConfig = { key: null, direction: "asc" },
  onSortChange,
  externalSort = false,
  searchValue = "",
  externalSearch = false,
  currentPage = 1,
  pageSize = 10,
  totalRecords = 0,
  onPageChange,
  onPageSizeChange,
  externalPagination = false,
  selectedIds = [],
  onSelectionChange,
}) => {
  // Internal state
  const [sortConfig, setSortConfig] = useState(initialSortConfig);
  const [activeActionRow, setActiveActionRow] = useState(null);
  const [internalCurrentPage, setInternalCurrentPage] = useState(currentPage);
  const [internalPageSize, setInternalPageSize] = useState(pageSize);
  const actionRef = useRef(null);

  // Update internal state when external props change
  useEffect(() => {
    setInternalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

  // Close action dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (actionRef.current && !actionRef.current.contains(event.target)) {
        setActiveActionRow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle sorting
  const handleSort = (columnKey) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    let direction = "asc";
    if (sortConfig.key === columnKey && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const newSortConfig = { key: columnKey, direction };
    setSortConfig(newSortConfig);

    // If external sorting is enabled, call the external handler
    if (externalSort && onSortChange) {
      onSortChange(newSortConfig);
    }
  };

  // Process data based on search, sort, and pagination
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter (if not external)
    if (!externalSearch && searchValue) {
      result = result.filter((row) =>
        columns.some((column) => {
          const value = row[column.key];
          if (value == null) return false;
          return String(value).toLowerCase().includes(searchValue.toLowerCase());
        })
      );
    }

    // Apply sorting (if not external)
    if (!externalSort && sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        // Handle null/undefined values
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return sortConfig.direction === "asc" ? 1 : -1;
        if (bValue == null) return sortConfig.direction === "asc" ? -1 : 1;

        // Handle different data types
        if (typeof aValue === "string" && typeof bValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortConfig.direction === "asc" ? comparison : -comparison;
        }

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [data, searchValue, sortConfig, columns, externalSearch, externalSort]);

  // Calculate pagination
  const totalRecordsCount = externalPagination ? totalRecords : processedData.length;
  const totalPages = Math.ceil(totalRecordsCount / internalPageSize);

  // Apply pagination (if not external)
  const paginatedData = useMemo(() => {
    if (externalPagination) {
      return processedData;
    }

    const startIndex = (internalCurrentPage - 1) * internalPageSize;
    return processedData.slice(startIndex, startIndex + internalPageSize);
  }, [processedData, internalCurrentPage, internalPageSize, externalPagination]);

  // Handle page change
  const handlePageChange = (newPage) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setInternalCurrentPage(validPage);

    if (externalPagination && onPageChange) {
      onPageChange(validPage);
    }
  };

  // Handle page size change
  const handlePageSizeChange = (newPageSize) => {
    setInternalPageSize(newPageSize);
    setInternalCurrentPage(1); // Reset to first page when changing page size

    if (externalPagination && onPageSizeChange) {
      onPageSizeChange(newPageSize);
    }
    if (externalPagination && onPageChange) {
      onPageChange(1);
    }
  };

  // Handle selection
  const handleSelectAll = (checked) => {
    if (checked) {
      const allIds = paginatedData.map((row) => row.id);
      const newSelectedIds = [...new Set([...selectedIds, ...allIds])];
      onSelectionChange?.(newSelectedIds);
    } else {
      const currentPageIds = paginatedData.map((row) => row.id);
      const newSelectedIds = selectedIds.filter((id) => !currentPageIds.includes(id));
      onSelectionChange?.(newSelectedIds);
    }
  };

  const handleRowSelect = (id, checked) => {
    if (checked) {
      onSelectionChange?.([...selectedIds, id]);
    } else {
      onSelectionChange?.(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  // Selection state calculations
  const currentPageIds = paginatedData.map((row) => row.id);
  const selectedCurrentPageIds = selectedIds.filter((id) => currentPageIds.includes(id));
  const isAllSelected =
    currentPageIds.length > 0 && selectedCurrentPageIds.length === currentPageIds.length;
  const isIndeterminate =
    selectedCurrentPageIds.length > 0 && selectedCurrentPageIds.length < currentPageIds.length;

  // Action handlers
  const handleActionRowToggle = (rowId) => {
    setActiveActionRow(activeActionRow === rowId ? null : rowId);
  };

  const handleActionClick = (actionKey, row, onActionClick) => {
    onActionClick?.(actionKey, row);
    setActiveActionRow(null);
  };

  return {
    // Data
    paginatedData,
    processedData,
    totalRecordsCount,

    // Sorting
    sortConfig,
    handleSort,

    // Pagination
    currentPage: internalCurrentPage,
    pageSize: internalPageSize,
    totalPages,
    handlePageChange,
    handlePageSizeChange,

    // Selection
    selectedIds,
    isAllSelected,
    isIndeterminate,
    handleSelectAll,
    handleRowSelect,

    // Actions
    activeActionRow,
    actionRef,
    handleActionRowToggle,
    handleActionClick,

    // Search
    searchValue,
  };
};
