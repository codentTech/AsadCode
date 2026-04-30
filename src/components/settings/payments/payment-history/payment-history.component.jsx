import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import { CheckCircle, Clock, Eye, XCircle } from "lucide-react";
import { useState } from "react";
import usePaymentHistory from "./use-payment-history.hook";

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
      payment.campaignName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.collaboratorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.brandName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        setSelectedPayment(row.payment || row);
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
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Payment History</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          {isCreator
            ? "View all payments you've received from brands"
            : "View all payments you've made to creators"}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader loading={true} />
        </div>
      ) : (
        <>
          {/* Payment History Table using CustomDataTable */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-3 py-3 sm:px-6 sm:py-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
                  Payments ({filteredPayments.length})
                </h3>
                <div className="w-full sm:max-w-[300px]">
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
      {showDetailsModal && selectedPayment && (
        <Modal
          show={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedPayment(null);
          }}
          title="Payment Details"
          size="md"
        >
          <div className="space-y-4 p-3 sm:p-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Campaign</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayment.campaignName ||
                    selectedPayment.campaign?.campaign_title ||
                    selectedPayment.paymentData?.collaboration?.campaign?.campaign_title ||
                    "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{isCreator ? "Brand" : "Creator"}</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayment.collaboratorName ||
                    selectedPayment.brandName ||
                    (isCreator
                      ? selectedPayment.payment?.brand?.brand_profile?.brand_name ||
                        selectedPayment.payment?.brand?.first_name ||
                        "Unknown Brand"
                      : selectedPayment.payment?.creator?.user?.first_name ||
                        "Unknown Creator") ||
                    "N/A"}
                </p>
              </div>
            </div>

            {/* Amount Info */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Gross Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedPayment.currency || "USD"} $
                    {selectedPayment.amount
                      ? selectedPayment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : selectedPayment.grossAmountCents
                      ? (selectedPayment.grossAmountCents / 100).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : selectedPayment.payment?.gross_amount_cents
                      ? (selectedPayment.payment.gross_amount_cents / 100).toLocaleString(
                          undefined,
                          {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }
                        )
                      : "0.00"}
                  </p>
                </div>
                {(selectedPayment.netPayoutCents ||
                  selectedPayment.payment?.net_payout_cents) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Net Payout</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPayment.currency || "USD"} $
                      {(
                        (selectedPayment.netPayoutCents ||
                          selectedPayment.payment?.net_payout_cents) /
                        100
                      ).toLocaleString(undefined, {
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
                <p className="text-xs text-gray-500 mb-1">Funding Status</p>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      (selectedPayment.fundingStatus === "SUCCEEDED" ||
                        selectedPayment.payment?.funding_status === "SUCCEEDED") &&
                      "text-green-700 bg-green-100"
                    } ${
                      (selectedPayment.fundingStatus === "FAILED" ||
                        selectedPayment.payment?.funding_status === "FAILED") &&
                      "text-red-700 bg-red-100"
                    } ${
                      !(
                        selectedPayment.fundingStatus === "SUCCEEDED" ||
                        selectedPayment.payment?.funding_status === "SUCCEEDED" ||
                        selectedPayment.fundingStatus === "FAILED" ||
                        selectedPayment.payment?.funding_status === "FAILED"
                      ) && "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {selectedPayment.fundingStatus ||
                      selectedPayment.payment?.funding_status ||
                      "PENDING"}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Payout Status</p>
                <div className="mt-1">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      (selectedPayment.payoutStatus === "COMPLETED" ||
                        selectedPayment.payoutStatus === "PAID" ||
                        selectedPayment.payment?.payout_status === "COMPLETED" ||
                        selectedPayment.payment?.payout_status === "PAID") &&
                      "text-green-700 bg-green-100"
                    } ${
                      (selectedPayment.payoutStatus === "FAILED" ||
                        selectedPayment.payment?.payout_status === "FAILED") &&
                      "text-red-700 bg-red-100"
                    } ${
                      !(
                        selectedPayment.payoutStatus === "COMPLETED" ||
                        selectedPayment.payoutStatus === "PAID" ||
                        selectedPayment.payment?.payout_status === "COMPLETED" ||
                        selectedPayment.payment?.payout_status === "PAID" ||
                        selectedPayment.payoutStatus === "FAILED" ||
                        selectedPayment.payment?.payout_status === "FAILED"
                      ) && "text-yellow-700 bg-yellow-100"
                    }`}
                  >
                    {selectedPayment.payoutStatus ||
                      selectedPayment.payment?.payout_status ||
                      "PENDING"}
                  </span>
                </div>
              </div>
            </div>

            {/* Dates */}
            {(selectedPayment.paymentData ||
              selectedPayment.payment ||
              selectedPayment.funded_at ||
              selectedPayment.payout_released_at) && (
              <div className="border-t pt-4 space-y-2">
                {(selectedPayment.paymentData?.funded_at ||
                  selectedPayment.payment?.funded_at ||
                  selectedPayment.funded_at) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Funded At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedPayment.paymentData?.funded_at ||
                          selectedPayment.payment?.funded_at ||
                          selectedPayment.funded_at
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
                {(selectedPayment.paymentData?.paid_out_at ||
                  selectedPayment.paymentData?.payout_released_at ||
                  selectedPayment.payment?.payout_released_at ||
                  selectedPayment.payout_released_at) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Paid Out At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedPayment.paymentData?.paid_out_at ||
                          selectedPayment.paymentData?.payout_released_at ||
                          selectedPayment.payment?.payout_released_at ||
                          selectedPayment.payout_released_at
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
                {(selectedPayment.paymentData?.created_at ||
                  selectedPayment.payment?.created_at) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created At</p>
                    <p className="text-sm text-gray-900">
                      {new Date(
                        selectedPayment.paymentData?.created_at ||
                          selectedPayment.payment?.created_at
                      ).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Stripe Payment Intent ID */}
            {(selectedPayment.payment?.stripe_payment_intent_id ||
              selectedPayment.paymentData?.stripe_payment_intent_id) && (
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-1">Stripe Payment Intent ID</p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {selectedPayment.payment?.stripe_payment_intent_id ||
                    selectedPayment.paymentData?.stripe_payment_intent_id}
                </p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default PaymentHistoryPage;
