import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loadar/loading.component";
import { CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import usePaymentHistory from "./use-payment-history.hook";
import Modal from "@/common/components/modal/modal.component";

const PaymentHistoryPage = () => {
  const { payments, isLoading, isCreator } = usePaymentHistory();
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending Release" },
    { value: "failed", label: "Failed" },
  ];

  // Define table columns based on role
  const columns = [
    {
      key: "campaignName",
      title: "Campaign Name",
    },
    {
      key: "collaboratorName",
      title: isCreator ? "Brand Name" : "Creator Name",
    },
    {
      key: "amount",
      title: "Amount",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "datePaid",
      title: "Date Paid",
    },
  ];

  // Define actions
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye size={16} />,
    },
  ];

  const getStatusIcon = (status) => {
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
  };

  const getStatusColor = (status) => {
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
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return isCreator ? "Pending Release" : "Held in Escrow";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  // Custom cell renderers
  const customCellRenderer = {
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
        <span
          className={`
          ml-2 px-2 py-1 text-xs font-medium rounded-full
          ${getStatusColor(value)}
        `}
        >
          {getStatusLabel(value)}
        </span>
      </div>
    ),
    datePaid: (value, row) => (
      <div className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString() : row.status === "pending" ? "—" : "—"}
      </div>
    ),
  };

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesSearch =
      payment.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.collaboratorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        setSelectedPayment(row.payment);
        setShowDetailsModal(true);
        break;
      default:
        break;
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedPayments(selectedIds);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Payment History</h1>
        <p className="text-sm mt-1">
          {isCreator
            ? "View all payments you've received from brands"
            : "View all payments you've made to creators"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      ) : (
        <>
          {/* Payment History Table using CustomDataTable */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Payments ({filteredPayments.length})
            </h3>
            {/* Filters */}
            <div className="w-full max-w-[300px]">
              <SimpleSelect
                placeHolder="Select status"
                options={statusOptions}
                value={filterStatus}
                onChange={(value) => setFilterStatus(value)}
              />
            </div>
          </div>
        </div>

        {/* Custom Data Table */}
        <CustomDataTable
          columns={columns}
          data={filteredPayments}
          selectable={true}
          selectedIds={selectedPayments}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          customCellRenderer={customCellRenderer}
          emptyMessage="No payments found"
        />
        </div>
        </>
      )}

      {/* Payment Details Modal */}
      <Modal
        show={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedPayment(null);
        }}
        title="Payment Details"
        size="md"
      >
        {selectedPayment && (
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Campaign</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayment.campaign?.campaign_title || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Amount</p>
                <p className="text-sm font-medium text-gray-900">
                  ${((selectedPayment.gross_amount_cents || 0) / 100).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Funding Status</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {selectedPayment.funding_status?.toLowerCase().replace("_", " ") || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payout Status</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {selectedPayment.payout_status?.toLowerCase().replace("_", " ") || "N/A"}
                </p>
              </div>
              {selectedPayment.funded_at && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Funded At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedPayment.funded_at).toLocaleString()}
                  </p>
                </div>
              )}
              {selectedPayment.payout_released_at && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Released At</p>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(selectedPayment.payout_released_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
            {selectedPayment.stripe_payment_intent_id && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Stripe Payment Intent ID</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {selectedPayment.stripe_payment_intent_id}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default PaymentHistoryPage;
