"use client";

import {
  getAdminPayments,
  getAdminPaymentById,
  resetGetAdminPaymentById,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import { extractSimpleSelectValue } from "@/common/utils/generic.util";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";

const formatCents = (cents) => {
  if (cents == null) return "—";
  return `$${((Number(cents) || 0) / 100).toFixed(2)}`;
};

const formatStatus = (value) => {
  if (!value) return "—";
  return String(value).replace(/_/g, " ");
};

const columns = [
  {
    key: "brand",
    title: "Brand",
    customRender: (row) => (
      <span className="text-neutral-700">
        {row.brand
          ? `${row.brand.first_name || ""} ${row.brand.last_name || ""}`.trim() ||
            row.brand.email
          : "—"}
      </span>
    ),
  },
  {
    key: "creator",
    title: "Creator",
    customRender: (row) => (
      <span className="text-neutral-700">
        {row.creator
          ? `${row.creator.first_name || ""} ${row.creator.last_name || ""}`.trim() ||
            row.creator.email
          : "—"}
      </span>
    ),
  },
  {
    key: "gross_amount_cents",
    title: "Gross",
    customRender: (row) => (
      <span className="text-neutral-700">{formatCents(row.gross_amount_cents)}</span>
    ),
  },
  {
    key: "stripe_fee_cents",
    title: "Fee",
    customRender: (row) => (
      <span className="text-neutral-600">{formatCents(row.stripe_fee_cents)}</span>
    ),
  },
  {
    key: "net_payout_cents",
    title: "Net Payout",
    customRender: (row) => (
      <span className="text-neutral-700">{formatCents(row.net_payout_cents)}</span>
    ),
  },
  {
    key: "funding_status",
    title: "Funding",
    customRender: (row) => {
      const s = row.funding_status;
      const cls =
        s === "succeeded"
          ? "bg-green-100 text-green-800"
          : s === "failed_action_required"
            ? "bg-red-100 text-red-800"
            : s === "pending"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-100 text-gray-800";
      return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${cls}`}>
          {formatStatus(s)}
        </span>
      );
    },
  },
  {
    key: "payout_status",
    title: "Payout",
    customRender: (row) => {
      const s = row.payout_status;
      const cls =
        s === "transferred"
          ? "bg-green-100 text-green-800"
          : s === "failed"
            ? "bg-red-100 text-red-800"
            : s === "blocked"
              ? "bg-amber-100 text-amber-800"
              : "bg-gray-100 text-gray-800";
      return (
        <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded ${cls}`}>
          {formatStatus(s)}
        </span>
      );
    },
  },
  {
    key: "payout_block_reason",
    title: "Block Reason",
    customRender: (row) => (
      <span className="text-neutral-600 text-xs">
        {row.payout_block_reason ? formatStatus(row.payout_block_reason) : "—"}
      </span>
    ),
  },
];

function usePayments() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [fundingFilter, setFundingFilter] = useState(null);
  const [payoutFilter, setPayoutFilter] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [detailPayment, setDetailPayment] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedSearch(typeof searchTerm === "string" ? searchTerm.trim() : "");
    }, 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setFundingFilter(searchParams.get("funding_status") || null);
    setPayoutFilter(searchParams.get("payout_status") || null);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, fundingFilter, payoutFilter]);

  const getAdminPaymentsState = useSelector(
    (state) => state.collaborationPayment.getAdminPayments
  );
  const getAdminPaymentByIdState = useSelector(
    (state) => state.collaborationPayment.getAdminPaymentById
  );

  const payments = getAdminPaymentsState?.data?.payments ?? [];
  const total = getAdminPaymentsState?.data?.total ?? 0;
  const isLoading = getAdminPaymentsState?.isLoading;
  const detail = getAdminPaymentByIdState?.data;

  const fetchPayments = useCallback(() => {
    const payload = {
      page,
      limit: pageSize,
    };
    if (debouncedSearch) payload.search = debouncedSearch;
    if (fundingFilter != null && fundingFilter !== "ALL") payload.funding_status = fundingFilter;
    if (payoutFilter != null && payoutFilter !== "ALL") payload.payout_status = payoutFilter;
    dispatch(getAdminPayments(payload));
  }, [dispatch, debouncedSearch, fundingFilter, payoutFilter, page, pageSize]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize) => {
    setPageSize(newSize);
    setPage(1);
  }, []);

  const handleSearchChange = useCallback((value) => {
    const next = typeof value === "string" ? value : value?.target?.value ?? "";
    setSearchTerm(next);
  }, []);

  const handleFundingFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setFundingFilter(null);
    } else {
      setFundingFilter(v);
    }
  };

  const handlePayoutFilterChange = (option) => {
    const v = extractSimpleSelectValue(option);
    if (v === "ALL" || v == null) {
      setPayoutFilter(null);
    } else {
      setPayoutFilter(v);
    }
  };

  const toggleFilters = useCallback(() => {
    setShowFilters((prev) => !prev);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm("");
    setDebouncedSearch("");
    setFundingFilter(null);
    setPayoutFilter(null);
    setPage(1);
    router.replace("/admin/payments");
  }, [router]);

  const hasActiveFilters = useMemo(() => {
    const hasSearch = typeof searchTerm === "string" && searchTerm.trim() !== "";
    const hasFunding = fundingFilter != null;
    const hasPayout = payoutFilter != null;
    return hasSearch || hasFunding || hasPayout;
  }, [searchTerm, fundingFilter, payoutFilter]);

  const handleViewDetail = useCallback(
    (row) => {
      setDetailPayment(row);
      dispatch(resetGetAdminPaymentById());
      dispatch(getAdminPaymentById(row.id));
    },
    [dispatch]
  );

  const handleCloseDetail = useCallback(() => {
    setDetailPayment(null);
  }, []);

  const actions = useMemo(
    () => [
      {
        key: "view",
        label: "View details",
      },
    ],
    []
  );

  const handleActionClick = useCallback(
    (actionKey, row) => {
      if (actionKey === "view") handleViewDetail(row);
    },
    [handleViewDetail]
  );

  return {
    columns,
    payments,
    total,
    isLoading,
    page,
    pageSize,
    handlePageChange,
    handlePageSizeChange,
    handleActionClick,
    actions,
    detailPayment,
    detail,
    detailLoading: getAdminPaymentByIdState?.isLoading,
    handleCloseDetail,
    searchTerm,
    handleSearchChange,
    fundingFilter,
    payoutFilter,
    handleFundingFilterChange,
    handlePayoutFilterChange,
    showFilters,
    toggleFilters,
    handleClearFilters,
    hasActiveFilters,
  };
}

export default usePayments;
