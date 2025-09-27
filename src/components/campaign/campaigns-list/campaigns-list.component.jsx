"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCampaigns } from "@/provider/features/campaigns/campaigns.slice";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import DashboardLayout from "@/common/layouts/dashboard-layout";
import { Plus, Download, Filter } from "lucide-react";
import Link from "next/link";

const CampaignsList = () => {
  const dispatch = useDispatch();
  const { campaigns, total, isLoading } = useSelector(
    (state) => state.campaigns.getAllCampaigns?.data || {}
  );
  const { isLoading: isCreating } = useSelector((state) => state.campaigns.createCampaign);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    await dispatch(getAllCampaigns());
  };

  // Define table columns
  const columns = [
    {
      key: "campaign_title",
      title: "Campaign Title",
      customRender: (row) => (
        <span className="text-neutral-700 font-medium">{row.campaign_title || "N/A"}</span>
      ),
    },
    {
      key: "campaign_type",
      title: "Type",
      customRender: (value) => {
        const getTypeColor = (type) => {
          switch (type) {
            case "Sponsored Post":
              return "bg-blue-100 text-blue-800";
            case "UGC":
              return "bg-green-100 text-green-800";
            case "Gifted":
              return "bg-purple-100 text-purple-800";
            case "Affiliate":
              return "bg-orange-100 text-orange-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(value)}`}
          >
            {value}
          </span>
        );
      },
    },
    {
      key: "status",
      title: "Status",
      customRender: (value) => {
        const getStatusColor = (status) => {
          switch (status) {
            case "draft":
              return "bg-gray-100 text-gray-800";
            case "published":
              return "bg-green-100 text-green-800";
            case "active":
              return "bg-blue-100 text-blue-800";
            case "completed":
              return "bg-purple-100 text-purple-800";
            case "cancelled":
              return "bg-red-100 text-red-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(value)}`}
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1) || "N/A"}
          </span>
        );
      },
    },
    {
      key: "compensation_type",
      title: "Compensation",
      customRender: (value) => {
        const getCompensationColor = (type) => {
          switch (type) {
            case "fixed":
              return "bg-green-100 text-green-800";
            case "commission":
              return "bg-blue-100 text-blue-800";
            case "gifted":
              return "bg-purple-100 text-purple-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCompensationColor(value)}`}
          >
            {value?.charAt(0).toUpperCase() + value?.slice(1) || "N/A"}
          </span>
        );
      },
    },
    {
      key: "created_at",
      title: "Created",
      customRender: (row) => (
        <span className="text-neutral-700">
          {row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
  ];

  // Define actions
  const actions = [
    {
      key: "view",
      label: "View Details",
      icon: <span className="text-blue-600">👁️</span>,
    },
    {
      key: "edit",
      label: "Edit",
      icon: <span className="text-green-600">✏️</span>,
    },
    {
      key: "delete",
      label: "Delete",
      icon: <span className="text-red-600">🗑️</span>,
    },
  ];

  // Handle action clicks
  const handleActionClick = (actionKey, row) => {
    switch (actionKey) {
      case "view":
        console.log("View campaign:", row);
        break;
      case "edit":
        console.log("Edit campaign:", row);
        break;
      case "delete":
        console.log("Delete campaign:", row);
        break;
      default:
        break;
    }
  };

  // Handle export
  const handleExport = () => {
    const csvContent = [
      ["Title", "Type", "Status", "Compensation", "Created"],
      ...(campaigns || []).map((campaign) => [
        campaign.campaign_title || "N/A",
        campaign.campaign_type || "N/A",
        campaign.status || "N/A",
        campaign.compensation_type || "N/A",
        campaign.created_at ? new Date(campaign.created_at).toLocaleDateString() : "N/A",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "campaigns.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Campaigns</h3>
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
              <Link
                href="/campaigns/create"
                className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg transition-colors"
              >
                <Plus size={16} />
                <span>Create Campaign</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Custom Data Table */}
        <CustomDataTable
          columns={columns}
          data={campaigns || []}
          selectable={true}
          searchable={true}
          paginated={true}
          isLoading={isLoading}
          emptyMessage="No campaigns found"
          actions={actions}
          onActionClick={handleActionClick}
        />
      </div>
    </DashboardLayout>
  );
};

export default CampaignsList;
