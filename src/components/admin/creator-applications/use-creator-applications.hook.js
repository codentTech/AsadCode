import { formatDate } from "@/common/utils/date.utils";
import {
  getAllCreatorApplications,
  approveApplicationAndInvite,
  denyApplication,
  resetApproveState,
  resetDenyState,
} from "@/provider/features/creator-applications/creator-applications.slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ExternalLink, Mail } from "lucide-react";

// Define table columns
const columns = [
  {
    key: "full_name",
    title: "Creator Name",
    customRender: (row) => (
      <span className="text-neutral-700 font-medium">{row.full_name || "N/A"}</span>
    ),
  },
  {
    key: "email",
    title: "Email",
    customRender: (row) => (
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10">
          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <Mail className="h-5 w-5 text-indigo-600" />
          </div>
        </div>
        <div className="ml-2">
          <div className="text-sm font-medium text-gray-600">{row.email}</div>
        </div>
      </div>
    ),
  },
  {
    key: "primary_social_links",
    title: "Social Media Links",
    customRender: (row) => {
      const links = row.primary_social_links || [];
      if (links.length === 0) return <span className="text-sm text-gray-400">-</span>;

      return (
        <div className="flex flex-wrap gap-2">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-700 rounded hover:bg-indigo-100 transition-colors"
            >
              <span>{link.platform}</span>
              <ExternalLink size={12} />
            </a>
          ))}
        </div>
      );
    },
  },
  {
    key: "country",
    title: "Country",
    customRender: (row) => <span className="text-sm text-gray-600">{row.country || "N/A"}</span>,
  },
  {
    key: "status",
    title: "Status",
    customRender: (row) => {
      const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
          case "PENDING":
            return "bg-yellow-100 text-yellow-800";
          case "APPROVED":
            return "bg-green-100 text-green-800";
          case "ONBOARDING_STARTED":
            return "bg-blue-100 text-blue-800";
          case "DENIED":
            return "bg-red-100 text-red-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(row.status)}`}
        >
          {row.status || "Pending"}
        </span>
      );
    },
  },
  {
    key: "created_at",
    title: "Date Submitted",
    customRender: (row) => (
      <span className="text-sm text-gray-600">{formatDate(row.created_at)}</span>
    ),
  },
];

function useCreatorApplications() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null);
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("DESC");

  const rawApplications = useSelector(
    (state) => state.creatorApplications.getAllApplications?.data || []
  );

  // Safety filter: Never show APPROVED applications on frontend
  const applications = Array.isArray(rawApplications)
    ? rawApplications
    : [];
  const { isLoading } = useSelector((state) => state.creatorApplications.getAllApplications);
  const { isLoading: isApproving, isSuccess: approveSuccess } = useSelector(
    (state) => state.creatorApplications.approveApplication
  );
  const { isLoading: isDenying, isSuccess: denySuccess } = useSelector(
    (state) => state.creatorApplications.denyApplication
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, searchTerm, sortBy, sortOrder]);

  useEffect(() => {
    if (approveSuccess) {
      dispatch(resetApproveState());
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveSuccess]);

  useEffect(() => {
    if (denySuccess) {
      dispatch(resetDenyState());
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [denySuccess]);

  const fetchApplications = async () => {
    // Never pass APPROVED status filter - backend always excludes it
    const filterStatus = statusFilter;
    await dispatch(
      getAllCreatorApplications({
        status: filterStatus,
        search: searchTerm,
        sortBy,
        sortOrder,
      })
    );
  };

  // Handle action clicks
  const handleActionClick = async (actionKey, row) => {
    switch (actionKey) {
      case "approve":
        await handleApprove(row.id, row.email);
        break;
      case "deny":
        await handleDeny(row.id);
        break;
      default:
        break;
    }
  };

  const handleApprove = async (applicationId, email) => {
    await dispatch(approveApplicationAndInvite({ applicationId, email }));
  };

  const handleDeny = async (applicationId) => {
    await dispatch(denyApplication(applicationId));
  };

  // Handle selection change
  const handleSelectionChange = (selectedIds) => {
    setSelectedApplications(selectedIds);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle sort order if same field
      setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
    } else {
      // Set new field and default to DESC
      setSortBy(field);
      setSortOrder("DESC");
    }
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status === "ALL" ? null : status);
  };

  return {
    searchTerm,
    filteredApplications: applications || [],
    columns,
    selectedApplications,
    statusFilter,
    sortBy,
    sortOrder,
    handleSearchChange,
    handleSortChange,
    handleStatusFilterChange,
    handleSelectionChange,
    handleActionClick,
    isLoading: isLoading || isApproving || isDenying,
  };
}

export default useCreatorApplications;
