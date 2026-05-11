"use client";

import { DEFAULT_PAGE_LIMIT } from "@/common/constants/genaric.constant";
import {
  formatAuditLogAction,
  getAuditLogDetailLines,
} from "@/common/utils/audit-log-metadata.util";
import {
  fetchAdminAuditLogs,
  selectFetchAdminAuditLogs,
} from "@/provider/features/admin-audit/admin-audit.slice";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useAuditLogs() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useSelector(selectFetchAdminAuditLogs);

  const items = data?.items ?? [];
  const totalRecords = data?.total ?? 0;

  const fetchLogs = useCallback(async () => {
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const payload = {
      page: currentPage,
      limit: pageSize,
    };
    if (trimmed) {
      payload.search = trimmed;
    }
    await dispatch(fetchAdminAuditLogs(payload));
  }, [dispatch, searchTerm, currentPage, pageSize]);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchLogs();
    }, 300);
    return () => clearTimeout(t);
  }, [fetchLogs]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((size) => {
    setPageSize(size);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : (value?.target?.value ?? "");
    setCurrentPage(1);
    setSearchTerm(next);
  }, []);

  const columns = useMemo(
    () => [
      {
        key: "created_at",
        title: "Time (UTC)",
        customRender: (row) => (
          <span className="text-[10px] text-gray-700 sm:text-xs whitespace-nowrap">
            {new Date(row.created_at).toLocaleString(undefined, {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        ),
      },
      {
        key: "action",
        title: "Action",
        customRender: (row) => (
          <span className="text-[10px] font-semibold capitalize text-gray-900 sm:text-xs">
            {formatAuditLogAction(row.action)}
          </span>
        ),
      },
      {
        key: "actor_email",
        title: "Admin",
        customRender: (row) => (
          <span className="text-[10px] text-gray-700 sm:text-xs break-all">{row.actor_email}</span>
        ),
      },
      {
        key: "subject_email",
        title: "Subject",
        customRender: (row) => (
          <span className="text-[10px] text-gray-700 sm:text-xs break-all">
            {row.subject_email ?? "—"}
          </span>
        ),
      },
      {
        key: "metadata",
        title: "Details",
        customRender: (row) => {
          const lines = getAuditLogDetailLines(row.metadata);
          if (lines.length === 0) {
            return <span className="text-[10px] text-gray-400 sm:text-xs">—</span>;
          }
          return (
            <div className="flex max-w-[14rem] flex-col gap-1 text-left sm:max-w-xs">
              {lines.map((line) => (
                <div key={line.key} className="text-[10px] leading-snug text-gray-800 sm:text-xs">
                  <span className="font-semibold text-gray-600">{line.label}: </span>
                  <span className="break-all text-gray-800">{line.value}</span>
                </div>
              ))}
            </div>
          );
        },
      },
    ],
    []
  );

  return {
    columns,
    items,
    isLoading,
    currentPage,
    pageSize,
    totalRecords,
    handlePageChange,
    handlePageSizeChange,
    searchTerm,
    handleSearchChange,
  };
}

export default useAuditLogs;
