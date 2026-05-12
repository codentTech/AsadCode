"use client";

import {
  CREATOR_APPLICATION_DEFAULT_SORT_BY,
  CREATOR_APPLICATION_DEFAULT_SORT_ORDER,
} from "@/common/constants/options.constant";
import { formatDate } from "@/common/utils/date.utils";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import {
  getAllCreatorApplications,
  approveApplicationAndInvite,
  denyApplication,
  resetApproveState,
  resetDenyState,
} from "@/provider/features/creator-applications/creator-applications.slice";
import { ExternalLink, Mail, UserCheck, UserX } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const creatorApplicationsColumns = [
  {
    key: "full_name",
    title: "Creator Name",
    customRender: (row) => (
      <span className="text-neutral-700 font-medium">{row.full_name || "N/A"}</span>
    ),
  },
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
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-600">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "primary_social_links",
    title: "Social Media Links",
    customRender: (row) => {
      const links = row.primary_social_links || [];
      if (links.length === 0) return <span className="text-sm text-gray-400">-</span>;

      return (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
            >
              <span>{link.platform}</span>
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      );
    },
  },
  {
    key: "country",
    title: "Country",
    customRender: (row) => <span className="text-sm text-gray-600">{row.country || "N/A"}</span>,
  },
  {
    key: "status",
    title: "Status",
    customRender: (row) => {
      const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
          case "PENDING":
            return "bg-yellow-100 text-yellow-800";
          case "APPROVED":
            return "bg-green-100 text-green-800";
          case "ONBOARDING_STARTED":
            return "bg-blue-100 text-blue-800";
          case "DENIED":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}
        >
          {row.status || "Pending"}
        </span>
      );
    },
  },
  {
    key: "created_at",
    title: "Date Submitted",
    customRender: (row) => (
      <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
    ),
  },
];

function getCreatorApplicationRowActions(row) {
  const actions = [];

  if (row?.status !== "APPROVED" && row?.status !== "ONBOARDING_STARTED") {
    actions.push({
      key: "approve",
      label: "Approve and Invite",
      icon: <UserCheck size={16} />,
    });
  }

  if (row?.status !== "APPROVED" && row?.status !== "ONBOARDING_STARTED") {
    actions.push({
      key: "deny",
      label: "Deny",
      icon: <UserX size={16} />,
    });
  }

  return actions;
}

function useCreatorApplications() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState(CREATOR_APPLICATION_DEFAULT_SORT_BY);
  const [sortOrder, setSortOrder] = useState(CREATOR_APPLICATION_DEFAULT_SORT_ORDER);
  const [showFilters, setShowFilters] = useState(false);

  const rawApplications = useSelector(
    (state) => state.creatorApplications.getAllApplications?.data || []
  );

  const applications = Array.isArray(rawApplications) ? rawApplications : [];
  const { isLoading } = useSelector((state) => state.creatorApplications.getAllApplications);
  const { isLoading: isApproving, isSuccess: approveSuccess } = useSelector(
    (state) => state.creatorApplications.approveApplication
  );
  const { isLoading: isDenying, isSuccess: denySuccess } = useSelector(
    (state) => state.creatorApplications.denyApplication
  );

  const fetchApplications = useCallback(async () => {
    const statusParam = statusFilter != null && statusFilter !== "ALL" ? statusFilter : null;
    const trimmed = typeof searchTerm === "string" ? searchTerm.trim() : "";
    const searchParam = trimmed ? trimmed : null;

    await dispatch(
      getAllCreatorApplications({
        status: statusParam,
        search: searchParam,
        sortBy,
        sortOrder,
      })
    );
  }, [dispatch, statusFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [fetchApplications]);

  useEffect(() => {
    if (approveSuccess) {
      dispatch(resetApproveState());
      fetchApplications();
    }
  }, [approveSuccess, dispatch, fetchApplications]);

  useEffect(() => {
    if (denySuccess) {
      dispatch(resetDenyState());
      fetchApplications();
    }
  }, [denySuccess, dispatch, fetchApplications]);

  const handleActionClick = async (actionKey, row) => {
    switch (actionKey) {
      case "approve":
        await handleApprove(row.id, row.email);
        break;
      case "deny":
        await handleDeny(row.id);
        break;
      default:
        break;
    }
  };

  const handleApprove = async (applicationId, email) => {
    await dispatch(approveApplicationAndInvite({ applicationId, email }));
  };

  const handleDeny = async (applicationId) => {
    await dispatch(denyApplication(applicationId));
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedApplications(selectedIds);
  };

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

  const handleStatusFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setStatusFilter(null);
    } else {
      setStatusFilter(v);
    }
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter(null);
    setSortBy(CREATOR_APPLICATION_DEFAULT_SORT_BY);
    setSortOrder(CREATOR_APPLICATION_DEFAULT_SORT_ORDER);
  }, []);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const hasStatus = statusFilter != null;
    const sortChanged =
      sortBy !== CREATOR_APPLICATION_DEFAULT_SORT_BY ||
      sortOrder !== CREATOR_APPLICATION_DEFAULT_SORT_ORDER;
    return hasSearch || hasStatus || sortChanged;
  }, [searchTerm, statusFilter, sortBy, sortOrder]);

  return {
    searchTerm,
    filteredApplications: applications || [],
    columns: creatorApplicationsColumns,
    selectedApplications,
    statusFilter,
    sortBy,
    sortOrder,
    showFilters,
    handleSearchChange,
    handleSortChange,
    handleStatusFilterChange,
    handleSelectionChange,
    handleActionClick,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
    getCreatorApplicationRowActions,
    isLoading: isLoading || isApproving || isDenying,
  };
}

export default useCreatorApplications;
