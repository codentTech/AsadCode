import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  Filter,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const PaymentHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState([]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "failed", label: "Failed" },
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
  ];

  // Sample payment data
  const payments = [
    {
      id: "PAY-001",
      campaign: "Summer Fashion Campaign - ZARA",
      brand: "ZARA",
      amount: 850,
      status: "completed",
      date: "2024-06-15",
      method: "PayPal",
      type: "sponsored",
    },
    {
      id: "PAY-002",
      campaign: "Skincare Review Series - Glossier",
      brand: "Glossier",
      amount: 650,
      status: "pending",
      date: "2024-06-12",
      method: "Stripe",
      type: "ugc",
    },
    {
      id: "PAY-003",
      campaign: "Tech Product Unboxing - Apple",
      brand: "Apple",
      amount: 1200,
      status: "completed",
      date: "2024-06-08",
      method: "Bank Transfer",
      type: "sponsored",
    },
    {
      id: "PAY-004",
      campaign: "Fitness Equipment Review",
      brand: "Peloton",
      amount: 420,
      status: "processing",
      date: "2024-06-05",
      method: "PayPal",
      type: "affiliate",
    },
    {
      id: "PAY-005",
      campaign: "Home Decor Collaboration",
      brand: "West Elm",
      amount: 300,
      status: "failed",
      date: "2024-06-01",
      method: "Stripe",
      type: "gifted",
    },
  ];

  // Define table columns
  const columns = [
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
      key: "date",
      title: "Date",
    },
    {
      key: "method",
      title: "Method",
    },
  ];

  // Define actions
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <Eye size={16} />,
    },
    {
      key: "download",
      label: "Download Receipt",
      icon: <Download size={16} />,
    },
    {
      key: "retry",
      label: "Retry Payment",
      icon: <RefreshCw size={16} />,
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-700 bg-green-100";
      case "pending":
        return "text-yellow-700 bg-yellow-100";
      case "processing":
        return "text-blue-700 bg-blue-100";
      case "failed":
        return "text-red-700 bg-red-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "sponsored":
        return "💰";
      case "ugc":
        return "🎬";
      case "affiliate":
        return "📈";
      case "gifted":
        return "🎁";
      default:
        return "💼";
    }
  };

  // Custom cell renderers
  const customCellRenderer = {
    campaign: (value, row) => (
      <div className="flex items-center">
        <div className="text-lg mr-3">{getTypeIcon(row.type)}</div>
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.brand}</div>
        </div>
      </div>
    ),
    amount: (value) => (
      <div className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</div>
    ),
    status: (value) => (
      <div className="flex items-center">
        {getStatusIcon(value)}
        <span
          className={`
          ml-2 px-2 py-1 text-xs font-medium rounded-full capitalize
          ${getStatusColor(value)}
        `}
        >
          {value}
        </span>
      </div>
    ),
    date: (value) => (
      <div className="text-sm text-gray-900">{new Date(value).toLocaleDateString()}</div>
    ),
    method: (value) => <div className="text-sm text-gray-900">{value}</div>,
  };

  // Calculate totals
  const totalEarned = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = payments
    .filter((p) => p.status === "pending" || p.status === "processing")
    .reduce((sum, p) => sum + p.amount, 0);
  const completedPayments = payments.filter((p) => p.status === "completed").length;

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesSearch =
      payment.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.brand.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View payment:", row);
        break;
      case "download":
        console.log("Download receipt:", row);
        break;
      case "retry":
        console.log("Retry payment:", row);
        break;
      default:
        break;
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedPayments(selectedIds);
  };

  const handleExport = () => {
    const csvContent = [
      ["Campaign", "Brand", "Amount", "Status", "Date", "Method", "Type"],
      ...filteredPayments.map((payment) => [
        payment.campaign,
        payment.brand,
        payment.amount,
        payment.status,
        payment.date,
        payment.method,
        payment.type,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payment-history.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-6 rounded-lg text-white mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Payment History</h1>
          <p className="">Track all your processed and pending payouts</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${totalEarned.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-gray-900">
                  ${pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-semibold text-gray-900">{completedPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-semibold text-gray-900">$2,420</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SimpleSelect placeHolder="Select status" options={statusOptions} onChange={() => {}} />

            <SimpleSelect
              placeHolder="Select time"
              options={timeFilterOptions}
              onChange={() => {}}
            />
          </div>
        </div>

        {/* Payment History Table using CustomDataTable */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment History ({filteredPayments.length})
              </h3>
              <div className="flex space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
                  <Filter size={16} />
                  <span>Filter</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <Download size={16} />
                  <span>Export</span>
                </button>
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
      </div>
    </SidebarLayout>
  );
};

export default PaymentHistoryPage;
