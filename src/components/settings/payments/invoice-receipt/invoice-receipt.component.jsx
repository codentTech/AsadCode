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
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Invoices & Receipts</h1>
        <p className="text-sm mt-1">Download summaries for personal records or taxes</p>
      </div>

      {isError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {fetchMessage || "Could not load payment records."}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Invoices</p>
              <p className="text-xl font-semibold text-gray-900">{totalInvoices}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <Receipt className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Receipts</p>
              <p className="text-xl font-semibold text-gray-900">{totalReceipts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Amount</p>
              <p className="text-xl font-semibold text-gray-900">
                ${pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Attention needed</p>
              <p className="text-xl font-semibold text-gray-900">{overdueCount}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("invoices")}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
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

        <div className="p-4 border-b border-gray-200">
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
                  className="!h-[40px]"
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

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Archive className="h-5 w-5 text-blue-600 mt-0.5" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Tax documentation</h3>
            <p className="text-sm text-blue-700 mt-1">
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
