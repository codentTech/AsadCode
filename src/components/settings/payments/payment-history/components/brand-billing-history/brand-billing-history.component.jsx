import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Loader from "@/common/components/loader/loader.component";
import NotFound from "@/common/components/not-found/not-found.component";
import SearchIcon from "@/common/icons/search-icon";
import { ArrowUpRight, Receipt } from "lucide-react";
import Link from "next/link";
import useBrandBillingHistory from "./use-brand-billing-history.hook";

const BrandBillingHistory = () => {
  const {
    isLoading,
    hasAnyPayments,
    filteredCount,
    paginatedRows,
    typeFilter,
    dateRange,
    searchTerm,
    currentPage,
    totalPages,
    typeOptions,
    dateOptions,
    handleTypeChange,
    handleDateRangeChange,
    handleSearchChange,
    handlePreviousPage,
    handleNextPage,
    handleOpenReceipt,
  } = useBrandBillingHistory();

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">
          Billing & Payment History
        </h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          View all payments, receipts, and invoices for your CleerCut activity.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader loading={true} />
        </div>
      ) : !hasAnyPayments ? (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <NotFound
            title="No payments found"
            description="When you fund your first collaboration, your receipt and payment details will appear here."
            icon={Receipt}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-3 py-3 sm:px-6 sm:py-4">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full sm:max-w-md">
                <CustomInput
                  type="text"
                  name="billing-history-search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search payments"
                  startIcon={<SearchIcon />}
                />
              </div>
              <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
                <div className="w-full sm:min-w-[180px]">
                  <SimpleSelect
                    placeHolder="All types"
                    options={typeOptions}
                    value={typeFilter}
                    onChange={handleTypeChange}
                  />
                </div>
                <div className="w-full sm:min-w-[160px]">
                  <SimpleSelect
                    placeHolder="All time"
                    options={dateOptions}
                    value={dateRange}
                    onChange={handleDateRangeChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[760px] w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-6 sm:text-xs">
                    Date
                  </th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs">
                    Campaign / Collaboration
                  </th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs">
                    Type
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs">
                    Amount paid
                  </th>
                  <th className="px-3 py-2.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-4 sm:text-xs">
                    Payment method
                  </th>
                  <th className="px-3 py-2.5 text-right text-[10px] font-semibold uppercase tracking-wide text-gray-400 sm:px-6 sm:text-xs">
                    Receipt
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-3 py-10 text-center text-xs text-gray-500 sm:px-6">
                      No payments match your filters
                    </td>
                  </tr>
                ) : (
                  paginatedRows.map((row) => (
                    <tr key={row.id} className="border-b border-gray-100 last:border-b-0">
                      <td className="whitespace-nowrap px-3 py-3 align-top sm:px-6 sm:py-4">
                        <p className="text-xs font-medium text-gray-900 sm:text-sm">
                          {row.dateParts.monthDay}
                        </p>
                        <p className="text-[10px] text-gray-400 sm:text-xs">{row.dateParts.year}</p>
                      </td>
                      <td className="min-w-[220px] px-3 py-3 align-top sm:px-4 sm:py-4">
                        {row.campaignId ? (
                          <Link
                            href={`/campaign?campaignId=${row.campaignId}`}
                            className="text-sm font-semibold text-blue-600 hover:underline sm:text-base"
                          >
                            {row.title}
                          </Link>
                        ) : (
                          <p className="text-sm font-semibold text-gray-900 sm:text-base">
                            {row.title}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          {row.secondaryLine ? (
                            <span className="text-[10px] text-gray-500 sm:text-xs">
                              {row.secondaryLine}
                            </span>
                          ) : null}
                          {row.showStatus && row.secondaryLine ? (
                            <span className="text-[10px] text-gray-300 sm:text-xs">·</span>
                          ) : null}
                          {row.showStatus ? (
                            <span
                              className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium sm:px-2 sm:text-xs ${row.statusClassName}`}
                            >
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current" />
                              {row.statusLabel}
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-3 align-top sm:px-4 sm:py-4">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium sm:px-2.5 sm:text-xs ${row.typeClassName}`}
                        >
                          {row.typeLabel || "Charge"}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right align-top text-sm font-semibold tabular-nums text-gray-900 sm:px-4 sm:py-4 sm:text-base">
                        {row.amountLabel}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 align-top text-[10px] text-gray-600 sm:px-4 sm:py-4 sm:text-sm">
                        {row.paymentMethod || "—"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-right align-top sm:px-6 sm:py-4">
                        {row.receiptReady ? (
                          <CustomButton
                            text="View receipt"
                            className="!h-auto !min-h-0 bg-transparent p-0 text-xs font-medium text-blue-600 shadow-none hover:bg-transparent hover:underline sm:text-sm"
                            endIcon={<ArrowUpRight size={14} />}
                            onClick={() => handleOpenReceipt(row.receiptUrl)}
                          />
                        ) : (
                          <span className="text-[10px] text-gray-400 sm:text-xs">
                            Receipt unavailable — contact support
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {filteredCount > 0 ? (
            <div className="flex flex-col gap-2 border-t border-gray-200 bg-gray-50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-[10px] text-gray-600 sm:text-xs">
                Showing {paginatedRows.length} of {filteredCount} payments
              </p>
              <div className="flex items-center gap-2">
                <CustomButton
                  text="Previous"
                  className="btn-outline"
                  disabled={currentPage <= 1}
                  onClick={handlePreviousPage}
                />
                <span className="text-[10px] text-gray-700 sm:text-xs">
                  Page {currentPage} of {totalPages}
                </span>
                <CustomButton
                  text="Next"
                  className="btn-outline"
                  disabled={currentPage >= totalPages}
                  onClick={handleNextPage}
                />
              </div>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};

export default BrandBillingHistory;
