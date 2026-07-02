"use client";

import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import Modal from "@/common/components/modal/modal.component";
import { Skeleton } from "@/common/components/loader/skeleton-loader.component";
import {
  ADMIN_PAYMENTS_FUNDING_FILTER_OPTIONS,
  ADMIN_PAYMENTS_PAYOUT_FILTER_OPTIONS,
} from "@/common/constants/options.constant";
import { Filter } from "lucide-react";
import usePayments from "./use-payments.hook";

const formatCents = (cents) => {
  if (cents == null) return "—";
  return `$${((Number(cents) || 0) / 100).toFixed(2)}`;
};

const DetailRow = ({ label, value, className = "" }) => (
  <div className={`rounded-lg px-3 py-2.5 ${className || "bg-gray-100"}`}>
    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-0.5">{label}</div>
    <div className="text-sm text-gray-900">{value}</div>
  </div>
);

const Payments = () => {
  const {
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
    detailLoading,
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
  } = usePayments();

  return (
    <DashboardLayout>
      <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
          <div className="mb-3 sm:mb-4">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg">Payment Monitoring</h3>
            <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
              View all collaboration payments, funding and payout status
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <CustomInput
                type="text"
                name="search"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search client, creator or email"
                startIcon={<SearchIcon />}
                className="!h-[36px]"
              />
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap"
              >
                Clear filters
              </button>
            )}
            <button
              type="button"
              onClick={toggleFilters}
              className={`flex items-center justify-center w-10 h-10 rounded-lg border transition-colors ml-auto ${
                showFilters
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
              }`}
              title="Toggle filters"
            >
              <Filter size={18} />
            </button>
          </div>

          {showFilters && (
            <div className="pt-4 border-t border-gray-200">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2 w-full max-w-[280px]">
                  <SimpleSelect
                    label="Funding status"
                    value={fundingFilter || "ALL"}
                    onChange={(value) => handleFundingFilterChange(value)}
                    options={ADMIN_PAYMENTS_FUNDING_FILTER_OPTIONS}
                    className="w-full min-w-[220px]"
                  />
                </div>
                <div className="flex items-center gap-2 w-full max-w-[280px]">
                  <SimpleSelect
                    label="Payout status"
                    value={payoutFilter || "ALL"}
                    onChange={(value) => handlePayoutFilterChange(value)}
                    options={ADMIN_PAYMENTS_PAYOUT_FILTER_OPTIONS}
                    className="w-full min-w-[220px]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0 overflow-x-auto">
        <CustomDataTable
          columns={columns}
          data={payments}
          selectable={false}
          searchable={false}
          externalSearch={true}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          paginated={true}
          externalPagination={true}
          currentPage={page}
          pageSize={pageSize}
          totalRecords={total}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          actions={actions}
          onActionClick={handleActionClick}
          emptyMessage="No payments found"
          loading={isLoading}
        />
        </div>
      </div>

      <Modal
        show={!!detailPayment}
        title="Payment details"
        onClose={handleCloseDetail}
        size="md"
      >
        {detailLoading && (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-full rounded-lg" />
            <Skeleton className="h-14 w-2/3 rounded-lg" />
          </div>
        )}
        {!detailLoading && detail && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow
                label="Brand"
                value={
                  detail.brand
                    ? `${detail.brand.first_name || ""} ${detail.brand.last_name || ""}`.trim() ||
                      detail.brand.email
                    : "—"
                }
              />
              <DetailRow
                label="Creator"
                value={
                  detail.creator
                    ? `${detail.creator.first_name || ""} ${detail.creator.last_name || ""}`.trim() ||
                      detail.creator.email
                    : "—"
                }
              />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <DetailRow label="Gross amount" value={formatCents(detail.gross_amount_cents)} />
              <DetailRow label="Stripe fee" value={formatCents(detail.stripe_fee_cents)} />
              <DetailRow label="Net payout" value={formatCents(detail.net_payout_cents)} />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailRow
                label="Funding status"
                value={String(detail.funding_status || "").replace(/_/g, " ")}
              />
              <DetailRow
                label="Payout status"
                value={String(detail.payout_status || "").replace(/_/g, " ")}
              />
            </div>
            {detail.payout_block_reason && (
              <DetailRow
                label="Block reason"
                value={String(detail.payout_block_reason).replace(/_/g, " ")}
              />
            )}
            {detail.funding_failed_reason && (
              <DetailRow
                label="Funding error"
                value={detail.funding_failed_reason}
                className="bg-red-50 border border-red-200"
              />
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};

export default Payments;
