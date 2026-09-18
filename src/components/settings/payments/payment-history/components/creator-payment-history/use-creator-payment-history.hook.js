import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { getCreatorPayments } from "@/provider/features/collaboration-payment/collaboration-payment.slice";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending Release" },
  { value: "failed", label: "Failed" },
];

const COLUMNS = [
  { key: "campaignName", title: "Campaign Name" },
  { key: "collaboratorName", title: "Brand Name" },
  { key: "amount", title: "Amount" },
  { key: "status", title: "Status" },
  { key: "datePaid", title: "Date Paid" },
];

function useCreatorPaymentHistory() {
  const dispatch = useDispatch();
  const {
    data: creatorPaymentsData,
    isLoading,
    isSuccess,
  } = useSelector((state) => state.collaborationPayment?.getCreatorPayments || {});

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    dispatch(getCreatorPayments());
  }, [dispatch]);

  const payments = useMemo(() => {
    if (!isSuccess || !Array.isArray(creatorPaymentsData)) return [];
    return creatorPaymentsData.map((payment) => {
      const campaignName =
        payment.collaboration?.campaign?.campaign_title ||
        payment.campaign?.campaign_title ||
        payment.collaboration?.campaign?.title ||
        "Unknown Campaign";

      const brandName =
        payment.brand?.brand_profile?.brand_name ||
        payment.brand?.brand_name ||
        `${payment.brand?.first_name || ""} ${payment.brand?.last_name || ""}`.trim() ||
        "Unknown Brand";

      const amount = payment.gross_amount_cents
        ? parseFloat((payment.gross_amount_cents / 100).toFixed(2))
        : 0;

      let status = "pending";
      if (payment.payout_status === "PAID" || payment.payout_status === "COMPLETED") {
        status = "paid";
      } else if (payment.funding_status === "FAILED") {
        status = "failed";
      } else if (
        payment.funding_status === "SUCCEEDED" &&
        payment.payout_status !== "PAID" &&
        payment.payout_status !== "COMPLETED"
      ) {
        status = "pending";
      }

      const datePaid =
        (payment.payout_status === "PAID" || payment.payout_status === "COMPLETED") &&
        (payment.payout_released_at || payment.payout_completed_at)
          ? payment.payout_released_at || payment.payout_completed_at
          : null;

      return {
        id: payment.id,
        paymentId: payment.id,
        campaignName,
        collaboratorName: brandName,
        brandName,
        amount,
        status,
        datePaid,
        payment,
        paymentData: payment,
        fundingStatus: payment.funding_status,
        payoutStatus: payment.payout_status,
        currency: payment.currency || "USD",
        grossAmountCents: payment.gross_amount_cents,
        netPayoutCents: payment.net_payout_cents,
        heldAmountCents: payment.held_amount_cents,
        funded_at: payment.funded_at,
        payout_released_at: payment.payout_released_at,
        payout_completed_at: payment.payout_completed_at,
        paymentType: "escrow",
      };
    });
  }, [creatorPaymentsData, isSuccess]);

  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  }, []);

  const getStatusColor = useCallback((status) => {
    switch (status) {
      case "paid":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "failed":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  }, []);

  const getStatusLabel = useCallback((status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending Release";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  }, []);

  const customCellRenderer = useMemo(
    () => ({
      campaignName: (value) => (
        <div className="text-sm text-gray-900 max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
      collaboratorName: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>,
      amount: (value) => (
        <div className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</div>
      ),
      status: (value) => (
        <div className="flex items-center">
          {getStatusIcon(value)}
          <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {getStatusLabel(value)}
          </span>
        </div>
      ),
      datePaid: (value, row) => (
        <div className="text-sm text-gray-900">
          {value ? new Date(value).toLocaleDateString() : row.status === "pending" ? "—" : "—"}
        </div>
      ),
    }),
    [getStatusColor, getStatusIcon, getStatusLabel]
  );

  const filteredPayments = useMemo(
    () =>
      payments.filter((payment) => {
        const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
        const matchesSearch =
          payment.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.collaboratorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
      }),
    [payments, filterStatus, searchTerm]
  );

  const handleActionClick = useCallback((actionKey, row) => {
    if (actionKey === "view") {
      setSelectedPayment(row.payment || row);
      setShowDetailsModal(true);
    }
  }, []);

  const handleSelectionChange = useCallback((selectedIds) => {
    setSelectedPayments(selectedIds);
  }, []);

  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
  }, []);

  const handleFilterStatusChange = useCallback((option) => {
    setFilterStatus(option?.value ?? option);
  }, []);

  const handleCloseDetails = useCallback(() => {
    setShowDetailsModal(false);
    setSelectedPayment(null);
  }, []);

  const actions = useMemo(
    () => [
      {
        key: "view",
        label: "View Details",
        icon: <Eye size={16} />,
      },
    ],
    []
  );

  return {
    isLoading,
    filterStatus,
    searchTerm,
    selectedPayments,
    selectedPayment,
    showDetailsModal,
    statusOptions: STATUS_OPTIONS,
    columns: COLUMNS,
    actions,
    customCellRenderer,
    filteredPayments,
    handleActionClick,
    handleSelectionChange,
    handleSearchChange,
    handleFilterStatusChange,
    handleCloseDetails,
  };
}

export default useCreatorPaymentHistory;
