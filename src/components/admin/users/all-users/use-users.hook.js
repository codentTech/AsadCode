import { formatDate } from "@/common/utils/date.utils";
import { isOnboardingCompleted } from "@/common/utils/users.util";
import { adminToggleBlockUser, getAllUsers } from "@/provider/features/users/users.slice";
import { Email } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define table columns
const columns = [
  {
    key: "first_name",
    title: "First Name",
    customRender: (row) => <span className="text-neutral-700">{row.first_name || "N/A"}</span>,
  },
  {
    key: "last_name",
    title: "Last Name",
  },
  {
    key: "email",
    title: "Email",
    customRender: (row) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Email className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-600">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "role",
    title: "Role",
    customRender: (value) => {
      const getRoleColor = (role) => {
        switch (role) {
          case "ADMIN":
            return "bg-purple-100 text-purple-800";
          case "BRAND":
            return "bg-blue-100 text-blue-800";
          case "CREATOR":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(value.role)}`}
        >
          {value.role}
        </span>
      );
    },
  },
  {
    key: "created_at",
    title: "Joined Date",
    customRender: (row) => <span className="text-neutral-700">{formatDate(row.created_at)}</span>,
  },
  {
    key: "is_blocked",
    title: "Status",
    customRender: (row) => (
      <span className="text-neutral-700">{row.is_blocked ? "Blocked" : "Active"}</span>
    ),
  },
  {
    key: "onboarding_step",
    title: "Onboarding",
    customRender: (row) => (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          isOnboardingCompleted(row) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}
      >
        {isOnboardingCompleted(row) ? "Completed" : "In Progress"}
      </span>
    ),
  },
];

function useUsers() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const users =
    useSelector((state) => state.users.getAllUsers?.data?.users) ?? [];
  const isLoading = useSelector((state) => state.users.getAllUsers?.isLoading ?? false);

  const filteredUsers = users?.filter(
    (user) =>
      user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user?.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    await dispatch(getAllUsers());
  };

  // Handle action clicks
  const handleActionClick = async (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View user:", row);
        break;
      case "block":
        await handleAdminBlock(row);
        break;
      case "unblock":
        await handleAdminUnblock(row);
        break;
      default:
        break;
    }
  };

  const handleAdminBlock = async (user) => {
    if (user.is_blocked) {
      console.log("User is already blocked");
      return;
    }

    try {
      const response = await dispatch(
        adminToggleBlockUser({
          user_id: user.id,
          reason: "Admin block",
        })
      );

      if (response.payload?.success) {
        // Refresh users list
        await fetchUsers();
      }
    } catch (error) {
      console.error("Failed to block user:", error);
    }
  };

  const handleAdminUnblock = async (user) => {
    if (!user.is_blocked) {
      console.log("User is not blocked");
      return;
    }

    try {
      const response = await dispatch(
        adminToggleBlockUser({
          user_id: user.id,
        })
      );

      if (response.payload?.success) {
        // Refresh users list
        await fetchUsers();
      }
    } catch (error) {
      console.error("Failed to unblock user:", error);
    }
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedUsers(selectedIds);
  };

  const handleExport = () => {
    const csvContent = [
      ["Email", "Role", "Joined Date", "Status", "Blocked Date"],
      ...filteredUsers.map((user) => [
        user.email,
        user.role,
        user.created_at,
        user.is_blocked ? "Blocked" : "Active",
        user.blocked_at || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    filteredUsers,
    columns,
    selectedUsers,
    isLoading,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
  };
}

export default useUsers;
