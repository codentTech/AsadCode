"use client";

import {
  ADMIN_WAITLIST_DEFAULT_SORT_BY,
  ADMIN_WAITLIST_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import { formatDate } from "@/common/utils/date.utils";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import { fetchAllUserWaitinglist } from "@/provider/features/dashboard/dashboard.slice";
import { Eye, Mail, Trash2, UserCheck } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useWaitingList() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState(ADMIN_WAITLIST_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(ADMIN_WAITLIST_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const waitlistPayload = useSelector(
    (state) => state.dashboard.fetchAllUserWaitinglist?.data
  );
  const isLoading = useSelector(
    (state) => state.dashboard.fetchAllUserWaitinglist?.isLoading ?? false
  );

  const waitingListRaw = waitlistPayload?.data?.userWaitlist ?? [];

  useEffect(() => {
    dispatch(fetchAllUserWaitinglist());
  }, [dispatch]);

  const filteredUsers = useMemo(() => {
    let rows = Array.isArray(waitingListRaw) ? [...waitingListRaw] : [];
    const q = typeof searchTerm === "string" ? searchTerm.trim().toLowerCase() : "";
    if (q) {
      rows = rows.filter((entry) => entry?.email?.toLowerCase().includes(q));
    }
    const mult = sortOrder === "ASC" ? 1 : -1;
    rows.sort((a, b) => {
      if (sortBy === "email") {
        const aE = (a.email || "").toLowerCase();
        const bE = (b.email || "").toLowerCase();
        return aE.localeCompare(bE) * mult;
      }
      const aT = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bT = b.created_at ? new Date(b.created_at).getTime() : 0;
      return (aT - bT) * mult;
    });
    return rows;
  }, [waitingListRaw, searchTerm, sortBy, sortOrder]);

  const columns = useMemo(
    () => [
      {
        key: "email",
        title: "Email",
        customRender: (row) => (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10">
              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-indigo-600" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-600">{row.email}</div>
            </div>
          </div>
        ),
      },
      {
        key: "created_at",
        title: "Joined Date",
        customRender: (row) => (
          <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
        ),
      },
    ],
    []
  );

  const actions = useMemo(
    () => [
      {
        key: "view",
        label: "View Details",
        icon: <Eye size={16} />,
      },
      {
        key: "approve",
        label: "Approve User",
        icon: <UserCheck size={16} />,
      },
      {
        key: "delete",
        label: "Delete User",
        icon: <Trash2 size={16} />,
      },
    ],
    []
  );

  const handleActionClick = useCallback((actionKey, row) => {
    switch (actionKey) {
      case "view":
        break;
      case "approve":
        break;
      case "delete":
        break;
      default:
        break;
    }
  }, []);

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedUsers(selectedIds);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["Email", "Joined Date"],
      ...filteredUsers.map((user) => [user.email, user.created_at]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredUsers]);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : value?.target?.value ?? "";
    setSearchTerm(next);
  }, []);

  const handleSortChange = (fieldOrOption) => {
    const field = extractSimpleSelectValue(fieldOrOption);
    if (field == null || field === "") return;
    if (sortBy === field) {
      setSortOrder((order) => (order === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setSortBy(ADMIN_WAITLIST_DEFAULT_SORT_BY);
    setSortOrder(ADMIN_WAITLIST_DEFAULT_SORT_ORDER);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const sortChanged =
      sortBy !== ADMIN_WAITLIST_DEFAULT_SORT_BY ||
      sortOrder !== ADMIN_WAITLIST_DEFAULT_SORT_ORDER;
    return hasSearch || sortChanged;
  }, [searchTerm, sortBy, sortOrder]);

  return {
    searchTerm,
    filteredUsers,
    columns,
    selectedUsers,
    isLoading,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
    actions,
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
  };
}

export default useWaitingList;
