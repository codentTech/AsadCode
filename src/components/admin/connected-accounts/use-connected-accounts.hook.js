"use client";

import {
  CONNECTED_ACCOUNTS_DEFAULT_SORT_BY,
  CONNECTED_ACCOUNTS_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import {
  adminGetConnectedAccounts,
  adminRemoveConnectedAccount,
} from "@/provider/features/users/users.slice";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useConnectedAccounts() {
  const dispatch = useDispatch();
  const { getPlatformIcon } = useGetplatform();
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState(null);
  const [sortBy, setSortBy] = useState(CONNECTED_ACCOUNTS_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(CONNECTED_ACCOUNTS_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  const connectedAccountsResponse = useSelector(
    (state) => state?.users?.adminGetConnectedAccounts?.data
  );
  const isLoading = useSelector(
    (state) => state?.users?.adminGetConnectedAccounts?.isLoading || false
  );
  const isRemoving = useSelector(
    (state) => state?.users?.adminRemoveConnectedAccount?.isLoading || false
  );

  const connectedAccounts = connectedAccountsResponse?.data || [];

  const columns = useMemo(
    () => [
      {
        key: "full_name",
        title: "Creator",
      },
      {
        key: "email",
        title: "Email",
      },
      {
        key: "platform",
        title: "Platform",
        customRender: (row) => (
          <span className="inline-flex items-center gap-2">
            {getPlatformIcon(row.platform)}
            <span className="uppercase">{row.platform || "-"}</span>
          </span>
        ),
      },
      {
        key: "username",
        title: "Username",
      },
      {
        key: "follower_count",
        title: "Followers",
        customRender: (row) => (
          <span>{Number(row.follower_count || 0).toLocaleString("en-US")}</span>
        ),
      },
    ],
    [getPlatformIcon]
  );

  const fetchConnectedAccounts = useCallback(async () => {
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const platformParam =
      platformFilter != null && platformFilter !== "ALL" ? platformFilter : undefined;
    await dispatch(
      adminGetConnectedAccounts({
        search: trimmed || undefined,
        platform: platformParam,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, searchTerm, platformFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchConnectedAccounts();
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchConnectedAccounts]);

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

  const handlePlatformFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setPlatformFilter(null);
    } else {
      setPlatformFilter(v);
    }
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setPlatformFilter(null);
    setSortBy(CONNECTED_ACCOUNTS_DEFAULT_SORT_BY);
    setSortOrder(CONNECTED_ACCOUNTS_DEFAULT_SORT_ORDER);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const hasPlatform = platformFilter != null;
    const sortChanged =
      sortBy !== CONNECTED_ACCOUNTS_DEFAULT_SORT_BY ||
      sortOrder !== CONNECTED_ACCOUNTS_DEFAULT_SORT_ORDER;
    return hasSearch || hasPlatform || sortChanged;
  }, [searchTerm, platformFilter, sortBy, sortOrder]);

  const handleSelectionChange = useCallback((ids) => {
    setSelectedIds(ids);
  }, []);

  const handleActionClick = useCallback((actionKey, row) => {
    if (actionKey === "remove") {
      setSelectedAccount(row);
      setOpenDeleteModal(true);
    }
  }, []);

  const handleConfirmRemove = useCallback(() => {
    if (!selectedAccount?.id) {
      return;
    }

    dispatch(adminRemoveConnectedAccount(selectedAccount.id)).then((action) => {
      if (adminRemoveConnectedAccount.fulfilled.match(action)) {
        setOpenDeleteModal(false);
        setSelectedAccount(null);
        fetchConnectedAccounts();
      }
    });
  }, [dispatch, selectedAccount, fetchConnectedAccounts]);

  const actions = useMemo(
    () => [
      {
        key: "remove",
        label: "Remove Account",
        icon: <Trash2 size={16} />,
      },
    ],
    []
  );

  return {
    columns,
    actions,
    searchTerm,
    filteredAccounts: connectedAccounts,
    selectedIds,
    isLoading: isLoading || isRemoving,
    openDeleteModal,
    selectedAccount,
    setOpenDeleteModal,
    handleSearchChange,
    handleSelectionChange,
    handleActionClick,
    handleConfirmRemove,
    platformFilter,
    sortBy,
    sortOrder,
    showFilters,
    handleSortChange,
    handlePlatformFilterChange,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
  };
}

export default useConnectedAccounts;
