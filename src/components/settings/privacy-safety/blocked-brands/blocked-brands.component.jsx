import React, { useState } from "react";
import {
  Shield,
  Search,
  Plus,
  X,
  AlertTriangle,
  Building2,
  Calendar,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  Clock,
  Filter,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import SidebarLayout from "@/common/layouts/sidebar.layout";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { useSelector } from "react-redux";
import Modal from "@/common/components/modal/modal.component";

const BlockedBrandsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandReason, setNewBrandReason] = useState("");
  const [selectedBlocks, setSelectedBlocks] = useState([]);
  const [filterReason, setFilterReason] = useState("all");

  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  // Sample blocked brands data
  const [blockedBrands, setBlockedBrands] = useState([
    {
      id: "1",
      brandName: "FastFashion Co.",
      reason: "inappropriate_content",
      dateBlocked: "2024-05-15",
      blockedBy: "user",
      status: "active",
      lastContactAttempt: "2024-06-10",
      notes: "Requested content that didn't align with my values",
    },
    {
      id: "2",
      brandName: "QuickCash Marketing",
      reason: "payment_issues",
      dateBlocked: "2024-04-22",
      blockedBy: "user",
      status: "active",
      lastContactAttempt: "2024-06-01",
      notes: "Failed to pay for completed campaign",
    },
    {
      id: "3",
      brandName: "SpamBrand Inc.",
      reason: "spam_harassment",
      dateBlocked: "2024-03-10",
      blockedBy: "system",
      status: "active",
      lastContactAttempt: "2024-05-28",
      notes: "Excessive unwanted contact attempts",
    },
    {
      id: "4",
      brandName: "UnethicalBiz Ltd.",
      reason: "other",
      dateBlocked: "2024-02-18",
      blockedBy: "user",
      status: "pending_review",
      lastContactAttempt: null,
      notes: "Unethical business practices",
    },
  ]);

  // Define table columns
  const columns = [
    {
      key: "brandName",
      title: "Brand Name",
    },
    {
      key: "reason",
      title: "Reason",
    },
    {
      key: "dateBlocked",
      title: "Date Blocked",
    },
    {
      key: "status",
      title: "Status",
    },
    {
      key: "lastContactAttempt",
      title: "Last Contact Attempt",
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
      key: "unblock",
      label: "Unblock Brand",
      icon: <CheckCircle size={16} />,
    },
    {
      key: "delete",
      label: "Remove Block",
      icon: <Trash2 size={16} />,
    },
  ];

  const reasonOptions = [
    { value: "inappropriate_content", label: "Inappropriate Content" },
    { value: "payment_issues", label: "Payment Issues" },
    { value: "spam_harassment", label: "Spam/Harassment" },
    { value: "poor_communication", label: "Poor Communication" },
    { value: "unethical_practices", label: "Unethical Practices" },
    { value: "other", label: "Other" },
  ];

  const getReasonColor = (reason) => {
    switch (reason) {
      case "inappropriate_content":
        return "bg-red-100 text-red-800";
      case "payment_issues":
        return "bg-orange-100 text-orange-800";
      case "spam_harassment":
        return "bg-purple-100 text-purple-800";
      case "poor_communication":
        return "bg-yellow-100 text-yellow-800";
      case "unethical_practices":
        return "bg-gray-100 text-gray-800";
      case "other":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800";
      case "pending_review":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Custom cell renderers
  const customCellRenderer = {
    brandName: (value, row) => (
      <div className="flex items-center">
        <div className="p-2 bg-gray-100 rounded-lg mr-3">
          <Building2 className="h-4 w-4 text-gray-600" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">
            Blocked by: {row.blockedBy === "user" ? "You" : "System"}
          </div>
        </div>
      </div>
    ),
    reason: (value) => {
      const reasonLabel = reasonOptions.find((r) => r.value === value)?.label || value;
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getReasonColor(value)}`}
        >
          {reasonLabel}
        </span>
      );
    },
    dateBlocked: (value) => (
      <div className="flex items-center">
        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
        <span className="text-sm text-gray-900">{new Date(value).toLocaleDateString()}</span>
      </div>
    ),
    status: (value) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(value)}`}
      >
        {value.replace("_", " ")}
      </span>
    ),
    lastContactAttempt: (value) => (
      <div className="text-sm text-gray-900">
        {value ? (
          new Date(value).toLocaleDateString()
        ) : (
          <span className="text-gray-400 italic">None</span>
        )}
      </div>
    ),
  };

  // Filter data
  const filteredData = blockedBrands.filter((brand) => {
    const matchesSearch = brand.brandName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesReason = filterReason === "all" || brand.reason === filterReason;
    return matchesSearch && matchesReason;
  });

  // Handle actions
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View brand details:", row);
        break;
      case "unblock":
        console.log("Unblock brand:", row);
        // Implement unblock logic
        break;
      case "delete":
        console.log("Remove block:", row);
        setBlockedBrands((prev) => prev.filter((brand) => brand.id !== row.id));
        break;
      default:
        break;
    }
  };

  const handleSelectionChange = (selectedIds) => {
    setSelectedBlocks(selectedIds);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleAddBrand = () => {
    if (newBrandName.trim()) {
      const newBlock = {
        id: Date.now().toString(),
        brandName: newBrandName.trim(),
        reason: newBrandReason || "other",
        dateBlocked: new Date().toISOString().split("T")[0],
        blockedBy: "user",
        status: "active",
        lastContactAttempt: null,
        notes: "",
      };
      setBlockedBrands((prev) => [newBlock, ...prev]);
      setNewBrandName("");
      setNewBrandReason("");
      setShowAddModal(false);
    }
  };

  const handleBulkUnblock = () => {
    console.log("Bulk unblock:", selectedBlocks);
    // Implement bulk unblock logic
  };

  return (
    <SidebarLayout>
      <div className="max-w-8xl mx-auto min-h-screen">
        {/* Header */}
        <div className="bg-primary p-4 rounded-lg text-white mb-4">
          <h1 className="text-xl font-bold text-white">
            {isCreatorMode ? "Blocked Brands" : "Blocked Creators"}
          </h1>
          <p className="text-sm mt-1">
            {`Manage ${isCreatorMode ? "brands" : "creators"} that are blocked from contacting or hiring you`}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg mr-3">
                <Ban className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Blocked</p>
                <p className="text-xl font-semibold text-gray-900">{blockedBrands.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg mr-3">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Issues</p>
                <p className="text-xl font-semibold text-gray-900">
                  {blockedBrands.filter((b) => b.reason === "payment_issues").length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-4">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg mr-3">
                <Shield className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Spam/Harassment</p>
                <p className="text-xl font-semibold text-gray-900">
                  {blockedBrands.filter((b) => b.reason === "spam_harassment").length}
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
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-xl font-semibold text-gray-900">
                  {blockedBrands.filter((b) => b.status === "pending_review").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg border">
          {/* Header Actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Blocked {isCreatorMode ? "Brands" : "Creators"} List
              </h3>
              <div className="flex space-x-3">
                <div className="w-full min-w-[230px]">
                  <SimpleSelect
                    placeHolder="Select a reason"
                    options={reasonOptions}
                    onChange={(value) => setFilterReason(value)}
                  />
                </div>

                {selectedBlocks.length > 0 && (
                  <CustomButton
                    text={`Unblock (${selectedBlocks.length})`}
                    className="btn-secondary"
                    icon={CheckCircle}
                    onClick={handleBulkUnblock}
                  />
                )}

                <CustomButton
                  text="Block New Brand"
                  className="btn-primary w-full"
                  icon={Plus}
                  onClick={() => setShowAddModal(true)}
                />
              </div>
            </div>
          </div>

          {/* CustomDataTable */}
          <CustomDataTable
            columns={columns}
            data={filteredData}
            selectable={true}
            selectedIds={selectedBlocks}
            searchValue={searchTerm}
            onSearchChange={handleSearchChange}
            onSelectionChange={handleSelectionChange}
            actions={actions}
            onActionClick={handleActionClick}
            customCellRenderer={customCellRenderer}
            emptyMessage={`No blocked ${isCreatorMode ? "brands" : "creators"} found. ${isCreatorMode ? "Brands" : "Creators"} you block will appear here.`}
            searchPlaceholder={`Search blocked ${isCreatorMode ? "brands" : "creators"}`}
          />
        </div>

        <Modal
          show={showAddModal}
          title={`Block New ${isCreatorMode ? "Brands" : "Creators"}`}
          onClose={() => setShowAddModal(false)}
        >
          <div className="space-y-4">
            <CustomInput
              label="Brand Name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
              placeholder="Enter brand name to block"
              required
            />

            <SimpleSelect
              label="Reason for Blocking"
              placeHolder="Select an option"
              options={reasonOptions}
              onChange={(value) => setNewBrandReason(value)}
            />

            <div className="flex space-x-3 pt-4">
              <CustomButton
                text="Cancel"
                className="btn-secondary flex-1"
                onClick={() => setShowAddModal(false)}
              />
              <CustomButton
                text="Block Brand"
                className="btn-primary flex-1"
                icon={Ban}
                onClick={handleAddBrand}
                disabled={!newBrandName.trim()}
              />
            </div>
          </div>
        </Modal>

        {/* Info Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">How Blocking Works</h3>
              <div className="text-sm text-blue-700 mt-1 space-y-1">
                <p>
                  • Blocked {isCreatorMode ? "brands" : "creators"} cannot send you campaign
                  invitations or direct messages
                </p>
                <p>• Your profile will not appear in their search results</p>
                <p>
                  • Existing contracts with blocked {isCreatorMode ? "brands" : "creators"} remain
                  valid until completion
                </p>
                <p>• You can unblock {isCreatorMode ? "brands" : "creators"} at any time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default BlockedBrandsPage;
