import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CheckCircle, Clock, Eye, X } from "lucide-react";
import { useState } from "react";
import usePaymentHistory from "./use-payment-history.hook";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";

const PaymentHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { payments, isLoading } = usePaymentHistory();

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending Release" },
  ];

  // Define table columns
  const columns = [
    {
      key: "campaignName",
      title: "Campaign Name",
    },
    {
      key: "brandName",
      title: "Brand Name",
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
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "paid":
        return "Paid";
      case "pending":
        return "Pending Release";
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
    brandName: (value) => <div className="text-sm font-medium text-gray-900">{value}</div>,
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
      payment.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        setSelectedPayment(row);
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
        <p className="text-sm mt-1">View all payments you've received</p>
      </div>

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
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader loading={true} />
          </div>
        ) : (
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
        )}
      </div>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedPayment && (
        <Modal
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPayment(null);
          }}
          title="Payment Details"
        >
          <div className="space-y-4">
            {/* Campaign & Brand Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Campaign</label>
                <p className="text-sm text-gray-900 mt-1">{selectedPayment.campaignName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <p className="text-sm text-gray-900 mt-1">{selectedPayment.brandName}</p>
              </div>
            </div>

            {/* Amount Info */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Gross Amount</label>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    {selectedPayment.currency} ${selectedPayment.amount.toLocaleString()}
                  </p>
                </div>
                {selectedPayment.netPayoutCents && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Net Payout</label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">
                      {selectedPayment.currency} $
                      {(selectedPayment.netPayoutCents / 100).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Status Info */}
            <div className="border-t pt-4 space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Funding Status</label>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedPayment.fundingStatus === "COMPLETED"
                        ? "text-green-700 bg-green-100"
                        : selectedPayment.fundingStatus === "FAILED"
                        ? "text-red-700 bg-red-100"
                        : "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {selectedPayment.fundingStatus || "PENDING"}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Payout Status</label>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      selectedPayment.payoutStatus === "COMPLETED"
                        ? "text-green-700 bg-green-100"
                        : selectedPayment.payoutStatus === "FAILED"
                        ? "text-red-700 bg-red-100"
                        : "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {selectedPayment.payoutStatus || "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            {selectedPayment.paymentData && (
              <div className="border-t pt-4 space-y-2">
                {selectedPayment.paymentData.funded_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Funded At</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPayment.paymentData.funded_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedPayment.paymentData.paid_out_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Paid Out At</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPayment.paymentData.paid_out_at).toLocaleString()}
                    </p>
                  </div>
                )}
                {selectedPayment.paymentData.created_at && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Created At</label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(selectedPayment.paymentData.created_at).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default PaymentHistoryPage;
