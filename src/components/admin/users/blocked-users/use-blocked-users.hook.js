"use client";

import {
  ADMIN_USERS_DEFAULT_SORT_BY,
  ADMIN_USERS_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import ONBOARDING_STEPS from "@/common/constants/onboarding-steps.constant";
import { formatDate } from "@/common/utils/date.utils";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import { adminToggleBlockUser, getAllUsers } from "@/provider/features/users/users.slice";
import { Email } from "@mui/icons-material";
import { ShieldOff, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const ADMIN_LIST_LIMIT = 100;

const columns = [
  {
    key: "first_name",
    title: "First Name",
    customRender: (row) => <span className="text-neutral-700">{row.first_name || "N/A"}</span>,
  },
  {
    key: "last_name",
    title: "Last Name",
  },
  {
    key: "email",
    title: "Email",
    customRender: (row) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Email className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-600">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    title: "Role",
    customRender: (row) => {
      const getRoleColor = (role) => {
        switch (role) {
          case "ADMIN":
            return "bg-purple-100 text-purple-800";
          case "BRAND":
            return "bg-blue-100 text-blue-800";
          case "CREATOR":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(row.role)}`}
        >
          {row.role}
        </span>
      );
    },
  },
  {
    key: "created_at",
    title: "Joined Date",
    customRender: (row) => <span className="text-neutral-700">{formatDate(row.created_at)}</span>,
  },
  {
    key: "blocked_at",
    title: "Blocked Date",
    customRender: (row) => {
      const value = row.blocked_at;
      if (!value) return <span className="text-sm text-gray-400">-</span>;
      return <span className="text-sm text-red-600 font-medium">{formatDate(value)}</span>;
    },
  },
  {
    key: "onboarding_step",
    title: "Onboarding",
    customRender: (row) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          row.onboarding_step === ONBOARDING_STEPS.COMPLETED
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.onboarding_step === ONBOARDING_STEPS.COMPLETED ? "Completed" : "In Progress"}
      </span>
    ),
  },
];

function useBlockedUsers() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [sortBy, setSortBy] = useState(ADMIN_USERS_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(ADMIN_USERS_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users =
    useSelector((state) => state.users?.getAllUsers?.data?.users) ?? [];
  const isLoading = useSelector(
    (state) => state.users?.getAllUsers?.isLoading ?? false
  );

  const fetchUsers = useCallback(async () => {
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const payload = {
      isBlocked: true,
      limit: ADMIN_LIST_LIMIT,
      sortBy,
      sortOrder,
    };
    if (trimmed) payload.search = trimmed;
    if (roleFilter != null && roleFilter !== "ALL") payload.role = roleFilter;
    await dispatch(getAllUsers(payload));
  }, [dispatch, searchTerm, roleFilter, sortBy, sortOrder]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  const blockedUsers = useMemo(() => users.filter((u) => u.is_blocked), [users]);

  const handleAdminUnblock = useCallback(
    (user) => {
      if (!user.is_blocked) {
        return;
      }
      dispatch(
        adminToggleBlockUser({
          user_id: user.id,
        })
      ).then((result) => {
        if (adminToggleBlockUser.fulfilled.match(result)) {
          fetchUsers();
        }
      });
    },
    [dispatch, fetchUsers]
  );

  const handleActionClick = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          break;
        case "admin-unblock":
          handleAdminUnblock(row);
          break;
        default:
          break;
      }
    },
    [handleAdminUnblock]
  );

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedUsers(selectedIds);
  }, []);

  const handleExport = useCallback(() => {
    const csvContent = [
      ["Email", "Role", "Joined Date", "Blocked Date"],
      ...blockedUsers.map((user) => [
        user.email,
        user.role,
        user.created_at,
        user.blocked_at || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blocked-users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [blockedUsers]);

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

  const handleRoleFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setRoleFilter(null);
    } else {
      setRoleFilter(v);
    }
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter(null);
    setSortBy(ADMIN_USERS_DEFAULT_SORT_BY);
    setSortOrder(ADMIN_USERS_DEFAULT_SORT_ORDER);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const hasRole = roleFilter != null;
    const sortChanged =
      sortBy !== ADMIN_USERS_DEFAULT_SORT_BY || sortOrder !== ADMIN_USERS_DEFAULT_SORT_ORDER;
    return hasSearch || hasRole || sortChanged;
  }, [searchTerm, roleFilter, sortBy, sortOrder]);

  const actions = useMemo(
    () => [
      {
        key: "view",
        label: "View Details",
        icon: <User size={16} />,
      },
      {
        key: "admin-unblock",
        label: "Unblock User",
        icon: <ShieldOff size={16} />,
      },
    ],
    []
  );

  return {
    searchTerm,
    blockedUsers,
    columns,
    selectedUsers,
    isLoading,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
    actions,
    roleFilter,
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    handleRoleFilterChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
  };
}

export default useBlockedUsers;
