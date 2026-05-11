"use client";

import { DEFAULT_PAGE_LIMIT } from "@/common/constants/genaric.constant";
import {
  ADMIN_USERS_DEFAULT_SORT_BY,
  ADMIN_USERS_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import { formatDate } from "@/common/utils/date.utils";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import {
  getAdminUserOnboardingSummaryText,
  getUser,
  isOnboardingCompleted,
} from "@/common/utils/users.util";
import { impersonateUser } from "@/provider/features/auth/auth.slice";
import {
  adminDeleteUser,
  adminToggleBlockUser,
  getAllUsers,
} from "@/provider/features/users/users.slice";
import { Email } from "@mui/icons-material";
import { LogIn, Shield, ShieldOff, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useUsers() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [onboardingFilter, setOnboardingFilter] = useState(null);
  const [sortBy, setSortBy] = useState(ADMIN_USERS_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(ADMIN_USERS_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openImpersonateModal, setOpenImpersonateModal] = useState(false);
  const [userToImpersonate, setUserToImpersonate] = useState(null);
  const [isImpersonatingUser, setIsImpersonatingUser] = useState(false);

  const users = useSelector((state) => state.users.getAllUsers?.data?.users) ?? [];
  const totalUsers = useSelector((state) => state.users.getAllUsers?.data?.total ?? 0);
  const isLoading = useSelector((state) => state.users.getAllUsers?.isLoading ?? false);
  const totalPages = Math.max(1, Math.ceil((totalUsers || 0) / pageSize));

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
        customRender: (row) => (
          <span className="text-neutral-700">{formatDate(row.created_at)}</span>
        ),
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
        customRender: (row) => {
          const summary = getAdminUserOnboardingSummaryText(row);
          return (
            <span
              title={summary}
              className={`block max-w-[min(100%,14rem)] truncate px-2 py-1 text-xs font-semibold rounded-full ${
                isOnboardingCompleted(row)
                  ? "bg-green-100 text-green-800"
                  : "bg-amber-50 text-amber-900"
              }`}
            >
              {summary}
            </span>
          );
        },
      },
    ],
    []
  );

  const fetchUsers = useCallback(async () => {
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const payload = {
      limit: pageSize,
      page: currentPage,
      sortBy,
      sortOrder,
    };
    if (trimmed) payload.search = trimmed;
    if (roleFilter != null && roleFilter !== "ALL") payload.role = roleFilter;
    if (statusFilter === "BLOCKED") payload.isBlocked = true;
    if (statusFilter === "ACTIVE") payload.isBlocked = false;
    if (onboardingFilter != null && onboardingFilter !== "ALL") {
      payload.onboardingStatus = onboardingFilter;
    }
    await dispatch(getAllUsers(payload));
  }, [
    dispatch,
    searchTerm,
    roleFilter,
    statusFilter,
    onboardingFilter,
    sortBy,
    sortOrder,
    currentPage,
    pageSize,
  ]);

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
        case "impersonate":
          setUserToImpersonate(row);
          setOpenImpersonateModal(true);
          break;
        default:
          break;
      }
    },
    [handleAdminBlock, handleAdminUnblock]
  );

  const handleConfirmImpersonate = useCallback(() => {
    if (!userToImpersonate?.id || isImpersonatingUser) {
      return;
    }
    setIsImpersonatingUser(true);
    dispatch(impersonateUser(userToImpersonate.id)).then((result) => {
      setIsImpersonatingUser(false);
      if (impersonateUser.fulfilled.match(result)) {
        setOpenImpersonateModal(false);
        setUserToImpersonate(null);
        router.push("/campaign");
      }
    });
  }, [dispatch, isImpersonatingUser, router, userToImpersonate]);

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
        if (isOnboardingCompleted(row)) {
          items.push({
            key: "impersonate",
            label: "Impersonate",
            icon: <LogIn size={16} />,
          });
        }
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
    const next = typeof value === "string" ? value : (value?.target?.value ?? "");
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const handleRoleFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setRoleFilter(null);
    } else {
      setRoleFilter(v);
    }
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setStatusFilter(null);
    } else {
      setStatusFilter(v);
    }
    setCurrentPage(1);
  };

  const handleOnboardingFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setOnboardingFilter(null);
    } else {
      setOnboardingFilter(v);
    }
    setCurrentPage(1);
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setRoleFilter(null);
    setStatusFilter(null);
    setOnboardingFilter(null);
    setSortBy(ADMIN_USERS_DEFAULT_SORT_BY);
    setSortOrder(ADMIN_USERS_DEFAULT_SORT_ORDER);
    setCurrentPage(1);
  }, []);

  const handlePrevPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  }, [totalPages]);

  const handlePageChange = useCallback((nextPage) => {
    setCurrentPage(nextPage);
  }, []);

  const handlePageSizeChange = useCallback((nextPageSize) => {
    setPageSize(nextPageSize);
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const hasRole = roleFilter != null;
    const hasStatus = statusFilter != null;
    const hasOnboarding = onboardingFilter != null;
    const sortChanged =
      sortBy !== ADMIN_USERS_DEFAULT_SORT_BY || sortOrder !== ADMIN_USERS_DEFAULT_SORT_ORDER;
    return hasSearch || hasRole || hasStatus || hasOnboarding || sortChanged;
  }, [searchTerm, roleFilter, statusFilter, onboardingFilter, sortBy, sortOrder]);

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
    openImpersonateModal,
    setOpenImpersonateModal,
    userToImpersonate,
    isImpersonatingUser,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
    handleConfirmDelete,
    handleConfirmImpersonate,
    roleFilter,
    statusFilter,
    onboardingFilter,
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    handleRoleFilterChange,
    handleStatusFilterChange,
    handleOnboardingFilterChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
    currentPage,
    pageSize,
    totalPages,
    totalUsers,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    handlePageSizeChange,
  };
}

export default useUsers;
