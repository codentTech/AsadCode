"use client";

import {
  adminGetConnectedAccounts,
  adminRemoveConnectedAccount,
} from "@/provider/features/users/users.slice";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useConnectedAccounts() {
  const dispatch = useDispatch();
  const { getPlatformIcon } = useGetplatform();
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredAccounts = useMemo(() => {
    if (!searchTerm) {
      return connectedAccounts;
    }

    const normalizedSearch = searchTerm.toLowerCase();
    return connectedAccounts.filter((account) => {
      return (
        account?.full_name?.toLowerCase().includes(normalizedSearch) ||
        account?.email?.toLowerCase().includes(normalizedSearch) ||
        account?.platform?.toLowerCase().includes(normalizedSearch) ||
        account?.username?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [connectedAccounts, searchTerm]);

  const fetchConnectedAccounts = useCallback(() => {
    dispatch(adminGetConnectedAccounts());
  }, [dispatch]);

  useEffect(() => {
    fetchConnectedAccounts();
  }, [fetchConnectedAccounts]);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

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

    dispatch(adminRemoveConnectedAccount(selectedAccount.id)).then(() => {
      setOpenDeleteModal(false);
      setSelectedAccount(null);
      fetchConnectedAccounts();
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
    filteredAccounts,
    selectedIds,
    isLoading,
    isRemoving,
    openDeleteModal,
    selectedAccount,
    setOpenDeleteModal,
    handleSearchChange,
    handleSelectionChange,
    handleActionClick,
    handleConfirmRemove,
  };
}

export default useConnectedAccounts;
