import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import useCreatorPaymentHistory from "./use-creator-payment-history.hook";

const CreatorPaymentHistory = () => {
  const {
    isLoading,
    filterStatus,
    searchTerm,
    selectedPayments,
    selectedPayment,
    showDetailsModal,
    statusOptions,
    columns,
    actions,
    customCellRenderer,
    filteredPayments,
    handleActionClick,
    handleSelectionChange,
    handleSearchChange,
    handleFilterStatusChange,
    handleCloseDetails,
  } = useCreatorPaymentHistory();

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Billing & Payment History
        </h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          View all payments you've received from brands
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader loading={true} />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-sm font-semibold text-gray-900 sm:text-lg">
                Billing & Payment History ({filteredPayments.length})
              </h3>
              <div className="w-full sm:max-w-[300px]">
                <SimpleSelect
                  placeHolder="Select status"
                  options={statusOptions}
                  value={filterStatus}
                  onChange={handleFilterStatusChange}
                />
              </div>
            </div>
          </div>

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
      )}

      {showDetailsModal && selectedPayment && (
        <Modal show={showDetailsModal} onClose={handleCloseDetails} title="Payment Details" size="md">
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
                <p className="text-xs text-gray-500 mb-1">Brand</p>
                <p className="text-sm font-medium text-gray-900">
                  {selectedPayment.collaboratorName ||
                    selectedPayment.brandName ||
                    selectedPayment.payment?.brand?.brand_profile?.brand_name ||
                    selectedPayment.payment?.brand?.first_name ||
                    "Unknown Brand"}
                </p>
              </div>
            </div>

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
                {(selectedPayment.netPayoutCents || selectedPayment.payment?.net_payout_cents) && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Net Payout</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPayment.currency || "USD"} $
                      {(
                        (selectedPayment.netPayoutCents ||
                          selectedPayment.payment?.net_payout_cents) / 100
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

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

export default CreatorPaymentHistory;
