import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { CheckCircle, Clock, Eye } from "lucide-react";
import { useState } from "react";

const PaymentHistoryPage = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPayments, setSelectedPayments] = useState([]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "paid", label: "Paid" },
    { value: "pending", label: "Pending Release" },
  ];

  // Sample payment data - Payments received by creator
  const payments = [
    {
      id: "TXN-001",
      campaignName: "Summer Fashion Campaign",
      brandName: "ZARA",
      amount: 850,
      status: "paid",
      datePaid: "2024-06-15",
    },
    {
      id: "TXN-002",
      campaignName: "Skincare Review Series",
      brandName: "Glossier",
      amount: 650,
      status: "pending",
      datePaid: null,
    },
    {
      id: "TXN-003",
      campaignName: "Tech Product Unboxing",
      brandName: "Apple",
      amount: 1200,
      status: "paid",
      datePaid: "2024-06-08",
    },
    {
      id: "TXN-004",
      campaignName: "Fitness Equipment Review",
      brandName: "Nike",
      amount: 420,
      status: "pending",
      datePaid: null,
    },
    {
      id: "TXN-005",
      campaignName: "Home Decor Collaboration",
      brandName: "IKEA",
      amount: 300,
      status: "paid",
      datePaid: "2024-06-01",
    },
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
      payment.campaignName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        // View payment details
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
