import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BILLING_CHARGE_TYPE,
  BILLING_DATE_RANGE,
  BILLING_DATE_FILTER_OPTIONS,
  BILLING_HISTORY_PAGE_SIZE,
  BILLING_PAYMENT_STATUS,
  BILLING_TYPE_FILTER_OPTIONS,
} from "@/common/constants/billing-history.constant";
import {
  filterBillingRows,
  formatBillingAmount,
  formatBillingDateParts,
  getBillingStatusClassName,
  getBillingTypeClassName,
  isValidReceiptUrl,
} from "@/common/utils/billing-history.util";
import {
  getBrandBillingHistory,
  selectBrandBillingHistory,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";

function useBrandBillingHistory() {
  const dispatch = useDispatch();
  const { data, isLoading } = useSelector(selectBrandBillingHistory);
  const [typeFilter, setTypeFilter] = useState(BILLING_CHARGE_TYPE.ALL);
  const [dateRange, setDateRange] = useState(BILLING_DATE_RANGE.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getBrandBillingHistory());
  }, [dispatch]);

  const rows = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filteredRows = useMemo(
    () => filterBillingRows(rows, { type: typeFilter, dateRange, searchTerm }),
    [rows, typeFilter, dateRange, searchTerm]
  );

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / BILLING_HISTORY_PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedRows = useMemo(() => {
    const start = (safePage - 1) * BILLING_HISTORY_PAGE_SIZE;
    return filteredRows.slice(start, start + BILLING_HISTORY_PAGE_SIZE).map((row) => ({
      ...row,
      dateParts: formatBillingDateParts(row.date),
      amountLabel: formatBillingAmount(row.amountCents, row.currency),
      typeClassName: getBillingTypeClassName(row.type),
      statusClassName: getBillingStatusClassName(row.status),
      showStatus: Boolean(
        row.status && row.status !== BILLING_PAYMENT_STATUS.NONE && row.statusLabel
      ),
      receiptReady: isValidReceiptUrl(row.receiptUrl),
    }));
  }, [filteredRows, safePage]);

  const handleTypeChange = useCallback((option) => {
    setTypeFilter(option?.value ?? option);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((option) => {
    setDateRange(option?.value ?? option);
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event?.target?.value ?? "");
    setCurrentPage(1);
  }, []);

  const handlePreviousPage = useCallback(() => {
    setCurrentPage((page) => Math.max(1, page - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setCurrentPage((page) => page + 1);
  }, []);

  const handleOpenReceipt = useCallback((url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  }, []);

  return {
    isLoading,
    hasAnyPayments: rows.length > 0,
    filteredCount: filteredRows.length,
    paginatedRows,
    typeFilter,
    dateRange,
    searchTerm,
    currentPage: safePage,
    totalPages,
    typeOptions: BILLING_TYPE_FILTER_OPTIONS,
    dateOptions: BILLING_DATE_FILTER_OPTIONS,
    handleTypeChange,
    handleDateRangeChange,
    handleSearchChange,
    handlePreviousPage,
    handleNextPage,
    handleOpenReceipt,
  };
}

export default useBrandBillingHistory;
