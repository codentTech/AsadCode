import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import {
  AlertTriangle,
  Archive,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Mail,
  Receipt,
} from "lucide-react";
import { useState } from "react";

const InvoicesReceiptsPage = () => {
  const [activeTab, setActiveTab] = useState("invoices");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);

  // Sample invoice/receipt data
  const invoices = [
    {
      id: "INV-2024-001",
      campaignId: "CAMP-001",
      campaign: "Summer Fashion Campaign",
      brand: "ZARA",
      amount: 850,
      status: "paid",
      issueDate: "2024-06-15",
      dueDate: "2024-06-30",
      type: "invoice",
    },
    {
      id: "INV-2024-002",
      campaignId: "CAMP-002",
      campaign: "Skincare Review Series",
      brand: "Glossier",
      amount: 650,
      status: "pending",
      issueDate: "2024-06-12",
      dueDate: "2024-06-27",
      type: "invoice",
    },
    {
      id: "REC-2024-001",
      campaignId: "CAMP-003",
      campaign: "Tech Product Unboxing",
      brand: "Apple",
      amount: 1200,
      status: "paid",
      issueDate: "2024-06-08",
      paidDate: "2024-06-08",
      type: "receipt",
    },
    {
      id: "INV-2024-003",
      campaignId: "CAMP-004",
      campaign: "Fitness Equipment Review",
      brand: "Peloton",
      amount: 420,
      status: "overdue",
      issueDate: "2024-05-20",
      dueDate: "2024-06-05",
      type: "invoice",
    },
    {
      id: "REC-2024-002",
      campaignId: "CAMP-005",
      campaign: "Home Decor Collaboration",
      brand: "West Elm",
      amount: 300,
      status: "paid",
      issueDate: "2024-06-01",
      paidDate: "2024-06-01",
      type: "receipt",
    },
  ];

  // Define columns for the data table
  const columns = [
    {
      key: "id",
      title: "Document",
    },
    {
      key: "campaign",
      title: "Campaign",
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
      key: "issueDate",
      title: "Date",
    },
  ];

  // Define actions for the table
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye size={16} />,
    },
    {
      key: "download",
      label: "Download",
      icon: <Download size={16} />,
    },
    {
      key: "email",
      label: "Email",
      icon: <Mail size={16} />,
    },
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
  ];

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

  // Custom cell renderers
  const customCellRenderer = {
    id: (value, row) => (
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
        <div className="text-sm text-gray-500">{row.brand}</div>
      </div>
    ),
    amount: (value) => (
      <div className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</div>
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
        <div className="text-sm text-gray-900">{new Date(value).toLocaleDateString()}</div>
        {row.type === "invoice" && row.status !== "paid" && row.dueDate && (
          <div className="text-xs text-gray-500">
            Due: {new Date(row.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    ),
  };

  // Filter data based on active tab
  const filteredData = invoices.filter((item) => {
    if (activeTab === "invoices" && item.type !== "invoice") return false;
    if (activeTab === "receipts" && item.type !== "receipt") return false;

    const matchesSearch =
      item.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate summary stats
  const totalInvoices = invoices.filter((i) => i.type === "invoice").length;
  const totalReceipts = invoices.filter((i) => i.type === "receipt").length;
  const pendingAmount = invoices
    .filter((i) => i.status === "pending")
    .reduce((sum, i) => sum + i.amount, 0);
  const overdueCount = invoices.filter((i) => i.status === "overdue").length;

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View document:", row);
        break;
      case "download":
        console.log("Download document:", row);
        break;
      case "email":
        console.log("Email document:", row);
        break;
      default:
        break;
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedItems(selectedIds);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const downloadSelected = () => {
    console.log("Downloading selected items:", selectedItems);
    // Implement download logic
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-6 rounded-lg text-white mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Invoices & Receipts</h1>
          <p className="">Download summaries for personal records or taxes</p>
        </div>

        {/* Summary Cards */}
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
                  ${pendingAmount.toLocaleString()}
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
                <p className="text-sm text-gray-600">Overdue</p>
                <p className="text-xl font-semibold text-gray-900">{overdueCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with CustomDataTable */}
        <div className="bg-white rounded-lg border">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("invoices")}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === "invoices"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                Invoices ({totalInvoices})
              </button>
              <button
                onClick={() => setActiveTab("receipts")}
                className={`
                  px-6 py-4 text-sm font-medium border-b-2 transition-colors
                  ${
                    activeTab === "receipts"
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }
                `}
              >
                <Receipt className="h-4 w-4 inline mr-2" />
                Receipts ({totalReceipts})
              </button>
            </div>
          </div>

          {/* Additional Filters and Actions Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
              <div className="w-full max-w-[230px]">
                <SimpleSelect
                  placeHolder="Select time"
                  options={timeFilterOptions}
                  onChange={() => {}}
                />
              </div>

              <div className="flex space-x-2">
                {selectedItems.length > 0 && (
                  <CustomButton
                    text={`Download (${selectedItems.length})`}
                    className="btn-secondary"
                    icon={Download}
                    onClick={downloadSelected}
                  />
                )}
                <CustomButton text="Email Summary" className="btn-secondary" icon={Mail} />
                <CustomButton text="Tax Summary" className="btn-primary" icon={Archive} />
              </div>
            </div>
          </div>

          {/* CustomDataTable */}
          <CustomDataTable
            columns={columns}
            data={filteredData}
            selectable={true}
            selectedIds={selectedItems}
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onSelectionChange={handleSelectionChange}
            actions={actions}
            onActionClick={handleActionClick}
            customCellRenderer={customCellRenderer}
            emptyMessage={`No ${activeTab} found. Try adjusting your search criteria or check back later.`}
            searchPlaceholder="Search by campaign, brand, or ID..."
          />
        </div>

        {/* Tax Information Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Archive className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Tax Documentation</h3>
              <p className="text-sm text-blue-700 mt-1">
                All invoices and receipts are automatically organized for tax purposes. Download
                your annual summary before tax season.
              </p>
              <div className="mt-3">
                <CustomButton
                  text="Download 2024 Tax Summary"
                  className="btn-secondary text-sm"
                  icon={Download}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default InvoicesReceiptsPage;
