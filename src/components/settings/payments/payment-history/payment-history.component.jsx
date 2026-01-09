import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CheckCircle, Clock, Download, Eye, Filter, User } from "lucide-react";
import { useState } from "react";

const PaymentHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [selectedPayments, setSelectedPayments] = useState([]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending Release" },
  ];

  const timeFilterOptions = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
  ];

  // Sample payment data - Brand payments to creators
  const payments = [
    {
      id: "TXN-001",
      creatorName: "Sarah Johnson",
      campaignName: "Summer Fashion Campaign - ZARA",
      transactionId: "TXN-2024-001-ABC123",
      paymentAmount: 850,
      cleercutCommission: 85,
      releaseDate: "2024-06-15",
      status: "paid",
    },
    {
      id: "TXN-002",
      creatorName: "Michael Chen",
      campaignName: "Skincare Review Series - Glossier",
      transactionId: "TXN-2024-002-XYZ789",
      paymentAmount: 650,
      cleercutCommission: 65,
      releaseDate: null,
      status: "pending",
    },
    {
      id: "TXN-003",
      creatorName: "Emma Williams",
      campaignName: "Tech Product Unboxing - Apple",
      transactionId: "TXN-2024-003-DEF456",
      paymentAmount: 1200,
      cleercutCommission: 120,
      releaseDate: "2024-06-08",
      status: "paid",
    },
    {
      id: "TXN-004",
      creatorName: "James Rodriguez",
      campaignName: "Fitness Equipment Review",
      transactionId: "TXN-2024-004-GHI789",
      paymentAmount: 420,
      cleercutCommission: 42,
      releaseDate: null,
      status: "pending",
    },
    {
      id: "TXN-005",
      creatorName: "Olivia Brown",
      campaignName: "Home Decor Collaboration",
      transactionId: "TXN-2024-005-JKL012",
      paymentAmount: 300,
      cleercutCommission: 30,
      releaseDate: "2024-06-01",
      status: "paid",
    },
  ];

  // Define table columns
  const columns = [
    {
      key: "creatorName",
      title: "Creator Name",
    },
    {
      key: "campaignName",
      title: "Campaign/Collaboration",
    },
    {
      key: "transactionId",
      title: "Transaction ID",
    },
    {
      key: "paymentAmount",
      title: "Payment Amount",
    },
    {
      key: "cleercutCommission",
      title: "CleerCut Commission",
    },
    {
      key: "releaseDate",
      title: "Release Date",
    },
    {
      key: "status",
      title: "Status",
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
    creatorName: (value, row) => (
      <div className="flex items-center">
        <div className="p-1.5 bg-indigo-100 rounded-full mr-2">
          <User className="h-4 w-4 text-indigo-600" />
        </div>
        <div className="text-sm font-medium text-gray-900">{value}</div>
      </div>
    ),
    campaignName: (value) => (
      <div className="text-sm text-gray-900 max-w-xs truncate" title={value}>
        {value}
      </div>
    ),
    transactionId: (value) => <div className="text-sm text-gray-600 font-mono">{value}</div>,
    paymentAmount: (value) => (
      <div className="text-sm font-semibold text-gray-900">${value.toLocaleString()}</div>
    ),
    cleercutCommission: (value) => (
      <div className="text-sm text-gray-700">${value.toLocaleString()}</div>
    ),
    releaseDate: (value, row) => (
      <div className="text-sm text-gray-900">
        {value ? new Date(value).toLocaleDateString() : row.status === "pending" ? "—" : "—"}
      </div>
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
  };

  // Calculate totals
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.paymentAmount, 0);
  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + p.paymentAmount, 0);
  const totalCommission = payments.reduce((sum, p) => sum + p.cleercutCommission, 0);
  const totalExpenses = payments.reduce(
    (sum, p) => sum + p.paymentAmount + p.cleercutCommission,
    0
  );

  // Filter payments
  const filteredPayments = payments.filter((payment) => {
    const matchesStatus = filterStatus === "all" || payment.status === filterStatus;
    const matchesSearch =
      payment.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        // View payment details
        break;
      case "download":
        // Download receipt
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
      [
        "Creator Name",
        "Campaign/Collaboration",
        "Transaction ID",
        "Payment Amount",
        "CleerCut Commission",
        "Release Date",
        "Status",
      ],
      ...filteredPayments.map((payment) => [
        payment.creatorName,
        payment.campaignName,
        payment.transactionId,
        payment.paymentAmount,
        payment.cleercutCommission,
        payment.releaseDate || "—",
        getStatusLabel(payment.status),
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
    <>
      {/* Header */}
      <div className="bg-primary p-4 rounded-lg text-white mb-4">
        <h1 className="text-xl font-bold text-white">Payment History</h1>
        <p className="text-sm mt-1">Track all payments made to creators through escrow</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg mr-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Paid</p>
              <p className="text-xl font-semibold text-gray-900">${totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg mr-3">
              <Clock className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pending Release</p>
              <p className="text-xl font-semibold text-gray-900">
                ${totalPending.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg mr-3">
              <Filter className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Commission</p>
              <p className="text-xl font-semibold text-gray-900">
                ${totalCommission.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg mr-3">
              <Download className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-xl font-semibold text-gray-900">
                ${totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <SimpleSelect
            placeHolder="Select status"
            options={statusOptions}
            value={filterStatus}
            onChange={(value) => setFilterStatus(value)}
          />

          <SimpleSelect
            placeHolder="Select time"
            options={timeFilterOptions}
            value={dateRange}
            onChange={(value) => setDateRange(value)}
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
    </>
  );
};

export default PaymentHistoryPage;
