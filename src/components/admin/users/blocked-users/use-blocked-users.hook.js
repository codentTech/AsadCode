import { getAllUsers, adminToggleBlockUser } from "@/provider/features/users/users.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { User } from "lucide-react";
import { Email } from "@mui/icons-material";

// Define table columns
const columns = [
  {
    key: "email",
    title: "Email",
  },
  {
    key: "role",
    title: "Role",
  },
  {
    key: "created_at",
    title: "Joined Date",
  },
  {
    key: "blocked_at",
    title: "Blocked Date",
  },
];

function useBlockedUsers() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Filter only blocked users
  const blockedUsers = users.filter((user) => user.is_blocked);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await dispatch(getAllUsers());
      if (response.payload?.data) {
        setUsers(response.payload.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle action clicks
  const handleActionClick = async (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View user:", row);
        break;
      case "admin-unblock":
        await handleAdminUnblock(row);
        break;
      default:
        break;
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
      ["Email", "Role", "Joined Date", "Blocked Date"],
      ...filteredUsers.map((user) => [
        user.email,
        user.role,
        user.created_at,
        user.blocked_at || "-",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blocked-users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    blockedUsers,
    columns,
    selectedUsers,
    loading,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
  };
}

export default useBlockedUsers;
