"use client";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import { Download, Eye, Filter, Mail, Trash2, UserCheck } from "lucide-react";
import { useState } from "react";
import useWaitingList from "./use-waiting-list.hook";

const WaitingList = ({ users }) => {
  const { loading, waitingList, error, refetch } = useWaitingList();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  console.log(waitingList);
  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  // Define table columns
  const columns = [
    {
      key: "email",
      title: "Email",
    },
    {
      key: "joinedDate",
      title: "Joined Date",
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
      key: "approve",
      label: "Approve User",
      icon: <UserCheck size={16} />,
    },
    {
      key: "delete",
      label: "Delete User",
      icon: <Trash2 size={16} />,
    },
  ];

  // Custom cell renderers
  const customCellRenderer = {
    email: (value, row) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Mail className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-4">
          <div className="text-sm font-medium text-gray-900">{value}</div>
        </div>
      </div>
    ),
    joinedDate: (value) => (
      <span className="text-sm text-gray-500">{new Date(value).toLocaleDateString()}</span>
    ),
    status: (value) => {
      const getStatusColor = (status) => {
        switch (status) {
          case "pending":
            return "bg-yellow-100 text-yellow-800";
          case "approved":
            return "bg-green-100 text-green-800";
          case "reviewed":
            return "bg-blue-100 text-blue-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}
        >
          {value}
        </span>
      );
    },
    priority: (value) => {
      const getPriorityColor = (priority) => {
        switch (priority) {
          case "high":
            return "bg-red-100 text-red-800";
          case "medium":
            return "bg-orange-100 text-orange-800";
          case "low":
            return "bg-gray-100 text-gray-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(value)}`}
        >
          {value}
        </span>
      );
    },
  };

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View user:", row);
        // alert(`Viewing details for ${row.email}`);
        break;
      case "approve":
        console.log("Approve user:", row);
        // alert(`Approved user ${row.email}`);
        break;
      case "delete":
        console.log("Delete user:", row);
        if (confirm(`Are you sure you want to delete ${row.email}?`)) {
          // alert(`Deleted user ${row.email}`);
        }
        break;
      default:
        break;
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedUsers(selectedIds);
  };

  const handleExport = () => {
    const csvContent = [
      ["Email", "Joined Date", "Status", "Priority"],
      ...filteredUsers.map((user) => [user.email, user.joinedDate, user.status, user.priority]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "waitlist-users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Waitlist Management</h3>
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
        data={filteredUsers}
        selectable={true}
        selectedIds={selectedUsers}
        searchValue={searchTerm}
        onSearchChange={handleSearchChange}
        onSelectionChange={handleSelectionChange}
        actions={actions}
        onActionClick={handleActionClick}
        customCellRenderer={customCellRenderer}
        emptyMessage="No users found"
      />
    </div>
  );
};

export default WaitingList;
