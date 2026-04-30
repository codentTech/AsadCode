import { useState, useEffect, useRef, useMemo, useCallback } from "react";

export const useCustomDataTable = ({
  actions = [],
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
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [activeActionRowId, setActiveActionRowId] = useState(null);
  const actionButtonRefs = useRef({});

  // Update internal state when external props change
  useEffect(() => {
    setInternalCurrentPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    setInternalPageSize(pageSize);
  }, [pageSize]);

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

  const computeFixedDropdownPosition = useCallback(
    (button, rowId) => {
      const rect = button.getBoundingClientRect();
      const row = paginatedData.find((r) => r.id === rowId);
      const rowActions =
        typeof actions === "function" && row ? actions(row) : actions;
      const filtered = Array.isArray(rowActions)
        ? rowActions.filter((a) => a.hidden !== true)
        : [];
      const actionCount = Math.max(filtered.length, 1);
      const dropdownWidth = 200;
      const rowHeight = 40;
      const dropdownHeight = Math.min(actionCount * rowHeight + 8, 320);
      const margin = 8;
      let left = rect.right - dropdownWidth;
      if (left < margin) left = margin;
      if (left + dropdownWidth > window.innerWidth - margin) {
        left = window.innerWidth - dropdownWidth - margin;
      }
      let top = rect.bottom + 4;
      const viewportBottom = window.innerHeight - margin;
      if (top + dropdownHeight > viewportBottom) {
        top = Math.max(margin, rect.top - dropdownHeight - 4);
      }
      return { top, left };
    },
    [actions, paginatedData]
  );

  const handleActionRowToggle = (rowId, event) => {
    if (activeActionRowId === rowId) {
      setActiveActionRowId(null);
      return;
    }
    const button = event.currentTarget;
    setDropdownPosition(computeFixedDropdownPosition(button, rowId));
    setActiveActionRowId(rowId);
  };

  useEffect(() => {
    if (!activeActionRowId) return;
    const update = () => {
      const btn = actionButtonRefs.current[activeActionRowId];
      if (!btn) return;
      setDropdownPosition(computeFixedDropdownPosition(btn, activeActionRowId));
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update);
    }
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
    };
  }, [activeActionRowId, computeFixedDropdownPosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeActionRowId && !event.target.closest(".action-dropdown-container")) {
        setActiveActionRowId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeActionRowId]);

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

  const handleActionClick = (actionKey, row, onActionClick) => {
    onActionClick?.(actionKey, row);
    setActiveActionRow(null);
  };

  // Selection state calculations
  const currentPageIds = paginatedData.map((row) => row.id);
  const selectedCurrentPageIds = selectedIds.filter((id) => currentPageIds.includes(id));
  const isAllSelected =
    currentPageIds.length > 0 && selectedCurrentPageIds.length === currentPageIds.length;
  const isIndeterminate =
    selectedCurrentPageIds.length > 0 && selectedCurrentPageIds.length < currentPageIds.length;

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
    actionButtonRefs,
    dropdownPosition,
    setDropdownPosition,
    activeActionRowId,
    setActiveActionRowId,
    activeActionRow,
    handleActionRowToggle,
    handleActionClick,

    // Search
    searchValue,
  };
};
