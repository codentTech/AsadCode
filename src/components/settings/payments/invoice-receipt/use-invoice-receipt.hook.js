import { isCreatorMode } from "@/common/utils/users.util";
import {
  getBrandPayments,
  getCreatorPayments,
} from "@/provider/features/collaboration-payment/collaboration-payment.slice";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  Receipt,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const FUNDING_SUCCEEDED = "succeeded";
const FUNDING_NOT_REQUIRED = "not_required";
const PAYOUT_TRANSFERRED = "transferred";
const PAYOUT_NOT_REQUIRED = "not_required";
const FUNDING_FAILED = "failed_action_required";

const timeFilterOptions = [
  { value: "all", label: "All Time" },
  { value: "week", label: "Last Week" },
  { value: "month", label: "Last Month" },
  { value: "quarter", label: "Last Quarter" },
];

function formatName(first, last, fallback) {
  const n = `${first || ""} ${last || ""}`.trim();
  return n || fallback || "—";
}

function paymentInPeriod(createdAt, period) {
  if (period === "all" || !createdAt) return true;
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return true;
  const now = new Date();
  const days = period === "week" ? 7 : period === "month" ? 30 : 90;
  const cutoff = new Date(now);
  cutoff.setDate(cutoff.getDate() - days);
  return d >= cutoff;
}

function isBrandReceipt(p) {
  return p.funding_status === FUNDING_SUCCEEDED || p.funding_status === FUNDING_NOT_REQUIRED;
}

function isCreatorReceipt(p) {
  return (
    p.payout_status === PAYOUT_TRANSFERRED ||
    (p.payout_status === PAYOUT_NOT_REQUIRED && p.funding_status === FUNDING_SUCCEEDED)
  );
}

function rowDocumentType(isBrand, p) {
  if (isBrand) return isBrandReceipt(p) ? "receipt" : "invoice";
  return isCreatorReceipt(p) ? "receipt" : "invoice";
}

function rowDisplayStatus(isBrand, p) {
  if (isBrand) {
    if (p.funding_status === FUNDING_SUCCEEDED || p.funding_status === FUNDING_NOT_REQUIRED) {
      return "paid";
    }
    if (p.funding_status === FUNDING_FAILED) return "overdue";
    return "pending";
  }
  if (p.payout_status === PAYOUT_TRANSFERRED || p.payout_status === PAYOUT_NOT_REQUIRED) {
    return "paid";
  }
  if (p.payout_status === "failed") return "overdue";
  return "pending";
}

function mapApiPaymentToRow(payment, isBrand) {
  const campaign =
    payment.collaboration?.campaign?.campaign_title ||
    payment.collaboration?.campaign_title ||
    "Collaboration";

  const brandDisplay =
    payment.brand?.brand_profile?.brand_name ||
    formatName(payment.brand?.first_name, payment.brand?.last_name, payment.brand?.email);

  const creatorDisplay = formatName(
    payment.creator?.first_name,
    payment.creator?.last_name,
    payment.creator?.email
  );

  const counterparty = isBrand ? creatorDisplay : brandDisplay;
  const cents = Number(payment.gross_amount_cents ?? 0);
  const amount = Number.isFinite(cents) ? Math.round(cents) / 100 : 0;

  const docType = rowDocumentType(isBrand, payment);
  const status = rowDisplayStatus(isBrand, payment);

  const issueDate = payment.created_at;
  const dueDate = payment.collaboration?.completion_deadline || null;
  const paidDate = isBrand ? payment.funded_at : payment.paid_out_at;

  return {
    id: payment.id,
    documentLabel: docType === "invoice" ? `INV-${String(payment.id).slice(0, 8)}` : `REC-${String(payment.id).slice(0, 8)}`,
    type: docType,
    campaign,
    brand: brandDisplay,
    counterparty,
    amount,
    status,
    issueDate,
    dueDate,
    paidDate,
    collaborationId: payment.collaboration_id,
    raw: payment,
  };
}

function rowsToCsv(rows) {
  const header = ["Document", "Type", "Campaign", "Counterparty", "Amount (USD)", "Status", "Issue date"];
  const lines = [header.join(",")];
  for (const r of rows) {
    const cells = [
      r.documentLabel,
      r.type,
      `"${String(r.campaign).replace(/"/g, '""')}"`,
      `"${String(r.counterparty).replace(/"/g, '""')}"`,
      r.amount,
      r.status,
      r.issueDate ? new Date(r.issueDate).toISOString().slice(0, 10) : "",
    ];
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}

function triggerDownload(filename, text) {
  const blob = new Blob([text], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function useInvoiceReceipt() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isBrand = !isCreatorMode();

  const creatorState = useSelector((s) => s.collaborationPayment?.getCreatorPayments || {});
  const brandState = useSelector((s) => s.collaborationPayment?.getBrandPayments || {});

  const { data: rawPayments, isLoading, isError, message: fetchMessage } = isBrand
    ? brandState
    : creatorState;

  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (isBrand) {
      dispatch(getBrandPayments());
    } else {
      dispatch(getCreatorPayments());
    }
  }, [dispatch, isBrand]);

  useEffect(() => {
    setSelectedItems([]);
  }, [activeTab, filterPeriod]);

  const rows = useMemo(() => {
    if (!Array.isArray(rawPayments)) return [];
    return rawPayments.map((p) => mapApiPaymentToRow(p, isBrand));
  }, [rawPayments, isBrand]);

  const filteredByPeriod = useMemo(() => {
    return rows.filter((r) => {
      const p = r.raw;
      return paymentInPeriod(p.created_at, filterPeriod);
    });
  }, [rows, filterPeriod]);

  const filteredData = useMemo(() => {
    return filteredByPeriod.filter((item) => {
      if (activeTab === "invoices" && item.type !== "invoice") return false;
      if (activeTab === "receipts" && item.type !== "receipt") return false;
      const q = searchTerm.trim().toLowerCase();
      if (!q) return true;
      return (
        item.campaign.toLowerCase().includes(q) ||
        item.counterparty.toLowerCase().includes(q) ||
        item.documentLabel.toLowerCase().includes(q) ||
        String(item.id).toLowerCase().includes(q)
      );
    });
  }, [filteredByPeriod, activeTab, searchTerm]);

  const totalInvoices = useMemo(
    () => filteredByPeriod.filter((r) => r.type === "invoice").length,
    [filteredByPeriod]
  );
  const totalReceipts = useMemo(
    () => filteredByPeriod.filter((r) => r.type === "receipt").length,
    [filteredByPeriod]
  );
  const pendingAmount = useMemo(
    () =>
      filteredByPeriod
        .filter((r) => r.type === "invoice" && r.status === "pending")
        .reduce((sum, r) => sum + r.amount, 0),
    [filteredByPeriod]
  );
  const overdueCount = useMemo(
    () => filteredByPeriod.filter((r) => r.status === "overdue").length,
    [filteredByPeriod]
  );

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleSelectionChange = useCallback((ids) => {
    setSelectedItems(ids);
  }, []);

  const handlePeriodChange = useCallback((value) => {
    setFilterPeriod(value ?? "all");
  }, []);

  const handleActionClick = useCallback(
    (actionKey, row) => {
      if (actionKey === "view") {
        router.push("/settings/payments/payment-history");
        return;
      }
      if (actionKey === "download") {
        triggerDownload(
          `${row.documentLabel}.csv`,
          rowsToCsv([
            {
              ...row,
              documentLabel: row.documentLabel,
              type: row.type,
              campaign: row.campaign,
              counterparty: row.counterparty,
              amount: row.amount,
              status: row.status,
              issueDate: row.issueDate,
            },
          ])
        );
      }
      if (actionKey === "email") {
        const subject = encodeURIComponent(`CleerCut: ${row.documentLabel}`);
        const body = encodeURIComponent(
          `Campaign: ${row.campaign}\nAmount: $${row.amount}\nStatus: ${row.status}`
        );
        window.open(`mailto:?subject=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
      }
    },
    [router]
  );

  const downloadSelected = useCallback(() => {
    const selected = filteredData.filter((r) =>
      selectedItems.some((sid) => String(sid) === String(r.id))
    );
    if (!selected.length) return;
    triggerDownload("cleercut-payment-records.csv", rowsToCsv(selected));
  }, [filteredData, selectedItems]);

  const downloadTaxSummary = useCallback(() => {
    const year = new Date().getFullYear();
    const inYear = rows.filter((r) => {
      const d = r.issueDate ? new Date(r.issueDate) : null;
      return d && !Number.isNaN(d.getTime()) && d.getFullYear() === year;
    });
    triggerDownload(`cleercut-tax-summary-${year}.csv`, rowsToCsv(inYear));
  }, [rows]);

  const emailSummary = useCallback(() => {
    const subject = encodeURIComponent("CleerCut payment summary");
    const body = encodeURIComponent(
      `Exported ${filteredData.length} visible rows (${activeTab}). Open the app for full detail.`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`, "_blank", "noopener,noreferrer");
  }, [filteredData.length, activeTab]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "overdue":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "overdue":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const customCellRenderer = useMemo(
    () => ({
      documentLabel: (value, row) => (
        <div className="flex items-center">
          <div className="p-2 bg-gray-100 rounded-lg mr-3">
            {row.type === "invoice" ? (
              <FileText className="h-4 w-4 text-blue-600" />
            ) : (
              <Receipt className="h-4 w-4 text-green-600" />
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500 capitalize">{row.type}</div>
          </div>
        </div>
      ),
      campaign: (value, row) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.counterparty}</div>
        </div>
      ),
      amount: (value) => (
        <div className="text-sm font-semibold text-gray-900">
          ${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
      ),
      status: (value) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <span
            className={`ml-2 px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(value)}`}
          >
            {value}
          </span>
        </div>
      ),
      issueDate: (value, row) => (
        <div>
          <div className="text-sm text-gray-900">
            {value ? new Date(value).toLocaleDateString() : "—"}
          </div>
          {row.type === "invoice" && row.status !== "paid" && row.dueDate && (
            <div className="text-xs text-gray-500">
              Due: {new Date(row.dueDate).toLocaleDateString()}
            </div>
          )}
          {row.type === "receipt" && row.paidDate && (
            <div className="text-xs text-gray-500">
              Paid: {new Date(row.paidDate).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
    }),
    []
  );

  const columns = useMemo(
    () => [
      { key: "documentLabel", title: "Document" },
      { key: "campaign", title: "Campaign" },
      { key: "amount", title: "Amount" },
      { key: "status", title: "Status" },
      { key: "issueDate", title: "Date" },
    ],
    []
  );

  const actions = useMemo(
    () => [
      { key: "view", label: "View Details", icon: <Eye size={16} /> },
      { key: "download", label: "Download", icon: <Download size={16} /> },
      { key: "email", label: "Email", icon: <Mail size={16} /> },
    ],
    []
  );

  const taxYear = new Date().getFullYear();

  return {
    activeTab,
    setActiveTab,
    searchTerm,
    filterPeriod,
    handlePeriodChange,
    selectedItems,
    totalInvoices,
    totalReceipts,
    pendingAmount,
    overdueCount,
    filteredData,
    isLoading,
    isError,
    fetchMessage,
    handleSearchChange,
    handleSelectionChange,
    handleActionClick,
    downloadSelected,
    downloadTaxSummary,
    emailSummary,
    customCellRenderer,
    columns,
    actions,
    timeFilterOptions,
    taxYear,
  };
}

export default useInvoiceReceipt;
