"use client";

import {
  ADMIN_USERS_DEFAULT_SORT_BY,
  ADMIN_USERS_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import { formatDate } from "@/common/utils/date.utils";
import { getUser, isOnboardingCompleted } from "@/common/utils/users.util";
import {
  adminDeleteUser,
  adminToggleBlockUser,
  getAllUsers,
} from "@/provider/features/users/users.slice";
import { Email } from "@mui/icons-material";
import { Shield, ShieldOff, Trash2, User } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const extractSelectValue = (optionOrPrimitive) => {
  if (optionOrPrimitive == null) return null;
  if (typeof optionOrPrimitive === "object" && optionOrPrimitive.value !== undefined) {
    return optionOrPrimitive.value;
  }
  return optionOrPrimitive;
};

const ADMIN_LIST_LIMIT = 100;

function useUsers() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [sortBy, setSortBy] = useState(ADMIN_USERS_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(ADMIN_USERS_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const users =
    useSelector((state) => state.users.getAllUsers?.data?.users) ?? [];
  const isLoading = useSelector((state) => state.users.getAllUsers?.isLoading ?? false);

  const columns = useMemo(
    () => [
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
        key: "is_blocked",
        title: "Status",
        customRender: (row) => (
          <span className="text-neutral-700">{row.is_blocked ? "Blocked" : "Active"}</span>
        ),
      },
      {
        key: "onboarding_step",
        title: "Onboarding",
        customRender: (row) => (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              isOnboardingCompleted(row) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            {isOnboardingCompleted(row) ? "Completed" : "In Progress"}
          </span>
        ),
      },
    ],
    []
  );

  const fetchUsers = useCallback(async () => {
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const payload = {
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

  const handleAdminBlock = useCallback(
    (user) => {
      if (user.is_blocked) {
        return;
      }
      dispatch(
        adminToggleBlockUser({
          user_id: user.id,
          reason: "Admin block",
        })
      ).then((result) => {
        if (adminToggleBlockUser.fulfilled.match(result)) {
          fetchUsers();
        }
      });
    },
    [dispatch, fetchUsers]
  );

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

  const handleConfirmDelete = useCallback(() => {
    if (!userToDelete?.id) {
      return;
    }
    dispatch(adminDeleteUser(userToDelete.id)).then((result) => {
      if (adminDeleteUser.fulfilled.match(result)) {
        setOpenDeleteModal(false);
        setUserToDelete(null);
        fetchUsers();
      }
    });
  }, [dispatch, userToDelete, fetchUsers]);

  const handleActionClick = useCallback(
    (actionKey, row) => {
      switch (actionKey) {
        case "view":
          break;
        case "block":
          handleAdminBlock(row);
          break;
        case "unblock":
          handleAdminUnblock(row);
          break;
        case "delete":
          setUserToDelete(row);
          setOpenDeleteModal(true);
          break;
        default:
          break;
      }
    },
    [handleAdminBlock, handleAdminUnblock]
  );

  const actions = useMemo(
    () => (row) => {
      const me = getUser();
      const items = [
        {
          key: "view",
          label: "View Details",
          icon: <User size={16} />,
        },
        {
          key: "block",
          label: "Block",
          icon: <Shield size={16} />,
        },
        {
          key: "unblock",
          label: "Unblock",
          icon: <ShieldOff size={16} />,
        },
      ];
      if (row.id !== me?.id && row.role !== "ADMIN") {
        items.push({
          key: "delete",
          label: "Delete account",
          icon: <Trash2 size={16} />,
        });
      }
      return items;
    },
    []
  );

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedUsers(selectedIds);
  }, []);

  const filteredUsers = users;

  const handleExport = useCallback(() => {
    const csvContent = [
      ["Email", "Role", "Joined Date", "Status", "Blocked Date"],
      ...filteredUsers.map((user) => [
        user.email,
        user.role,
        user.created_at,
        user.is_blocked ? "Blocked" : "Active",
        user.blocked_at || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  }, [filteredUsers]);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : value?.target?.value ?? "";
    setSearchTerm(next);
  }, []);

  const handleSortChange = (fieldOrOption) => {
    const field = extractSelectValue(fieldOrOption);
    if (field == null || field === "") return;
    if (sortBy === field) {
      setSortOrder((order) => (order === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(field);
      setSortOrder("DESC");
    }
  };

  const handleRoleFilterChange = (option) => {
    const v = extractSelectValue(option);
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

  return {
    searchTerm,
    filteredUsers,
    columns,
    selectedUsers,
    isLoading,
    actions,
    openDeleteModal,
    setOpenDeleteModal,
    userToDelete,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
    handleConfirmDelete,
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

export default useUsers;
