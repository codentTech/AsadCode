import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SearchIcon from "@/common/icons/search-icon";
import {
  AlertTriangle,
  Archive,
  Clock,
  Download,
  FileText,
  Mail,
  Receipt,
} from "lucide-react";
import useInvoiceReceipt from "./use-invoice-receipt.hook";

const InvoicesReceiptsPage = () => {
  const {
    activeTab,
    setActiveTab,
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
    searchTerm,
  } = useInvoiceReceipt();

  return (
    <>
      <div className="mb-3 rounded-lg bg-primary p-3 text-white sm:mb-4 sm:p-4">
        <h1 className="text-sm font-semibold text-white sm:text-lg md:text-xl">Invoices & Receipts</h1>
        <p className="mt-1 text-[10px] leading-snug sm:text-xs md:text-sm">
          Download summaries for personal records or taxes
        </p>
      </div>

      {isError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {fetchMessage || "Could not load payment records."}
        </div>
      ) : null}

      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-white p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 sm:text-sm">Total Invoices</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">{totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 sm:text-sm">Total Receipts</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">{totalReceipts}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 sm:text-sm">Pending Amount</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">
                ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-3 sm:p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600 sm:text-sm">Attention needed</p>
              <p className="text-sm font-semibold text-gray-900 sm:text-xl">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors sm:px-6 sm:py-4 sm:text-sm ${
                activeTab === "invoices"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Invoices ({totalInvoices})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("receipts")}
              className={`px-3 py-3 text-xs font-medium border-b-2 transition-colors sm:px-6 sm:py-4 sm:text-sm ${
                activeTab === "receipts"
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Receipt className="h-4 w-4 inline mr-2" />
              Receipts ({totalReceipts})
            </button>
          </div>
        </div>

        <div className="border-b border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="w-full sm:max-w-[230px]">
                <SimpleSelect
                  placeHolder="Select time"
                  options={timeFilterOptions}
                  value={filterPeriod}
                  onChange={handlePeriodChange}
                />
              </div>
              <div className="w-full sm:max-w-md">
                <CustomInput
                  type="text"
                  name="invoice-receipt-search"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="Search by campaign, counterparty, or document…"
                  startIcon={<SearchIcon />}
                  className=""
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 shrink-0">
              {selectedItems.length > 0 && (
                <CustomButton
                  type="button"
                  text={`Download (${selectedItems.length})`}
                  className="btn-secondary"
                  startIcon={<Download size={18} />}
                  onClick={downloadSelected}
                />
              )}
              <CustomButton
                type="button"
                text="Email Summary"
                className="btn-secondary"
                startIcon={<Mail size={18} />}
                onClick={emailSummary}
              />
              <CustomButton
                type="button"
                text="Tax Summary"
                className="btn-primary"
                startIcon={<Archive size={18} />}
                onClick={downloadTaxSummary}
              />
            </div>
          </div>
        </div>

        <CustomDataTable
          columns={columns}
          data={filteredData}
          loading={isLoading}
          selectable={true}
          selectedIds={selectedItems}
          searchable={false}
          externalSearch={true}
          searchValue={searchTerm}
          onSearchChange={handleSearchChange}
          onSelectionChange={handleSelectionChange}
          actions={actions}
          onActionClick={handleActionClick}
          customCellRenderer={customCellRenderer}
          emptyMessage={`No ${activeTab} found. Try adjusting your search or time filter.`}
        />
      </div>

      <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 sm:mt-6 sm:p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Archive className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-xs font-medium text-blue-800 sm:text-sm">Tax documentation</h3>
            <p className="mt-1 text-xs text-blue-700 sm:text-sm">
              Export CSV summaries for your records. Consult a tax professional for filing requirements.
            </p>
            <div className="mt-3">
              <CustomButton
                type="button"
                text={`Download ${taxYear} tax summary (CSV)`}
                className="btn-secondary text-sm"
                startIcon={<Download size={18} />}
                onClick={downloadTaxSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicesReceiptsPage;
