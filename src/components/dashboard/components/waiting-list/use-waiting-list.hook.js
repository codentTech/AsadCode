import { fetchAllUserWaitinglist } from "@/provider/features/dashboard/dashboard.slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// Define table columns
const columns = [
  {
    key: "email",
    title: "Email",
  },
  {
    key: "created_at",
    title: "Joined Date",
  },
  // {
  //   key: "status",
  //   title: "Status",
  // },
];

function useWaitingList() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [waitingList, setWaitingList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);

  const filteredUsers = waitingList.filter((user) =>
    user?.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchUserWaitinglist();
  }, []);

  const fetchUserWaitinglist = async () => {
    setLoading(true);
    const response = await dispatch(fetchAllUserWaitinglist());
    if (response.payload.data) {
      setLoading(false);
      setWaitingList(response.payload.data.userWaitlist);
    }
  };

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View user:", row);
        break;
      case "approve":
        console.log("Approve user:", row);
        break;
      case "delete":
        console.log("Delete user:", row);
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

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  return {
    searchTerm,
    filteredUsers,
    columns,
    selectedUsers,
    handleSearchChange,
    handleExport,
    handleSelectionChange,
    handleActionClick,
  };
}

export default useWaitingList;
