import React, { useState } from "react";
import { Eye, X, Calendar, Package, DollarSign, Gift, Percent } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";

const CreatorApplications = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Mock data for applications
  const applications = {
    pending: [
      {
        id: 1,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "TechFlow",
        campaignTitle: "Summer Tech Essentials Launch",
        compensationType: "Paid",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-08",
        status: "Pending",
      },
      {
        id: 2,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "StyleCo",
        campaignTitle: "Fashion Forward Collection",
        compensationType: "Gifted",
        deliverables: ["1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-07",
        status: "Pending",
      },
      {
        id: 3,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "FitLife",
        campaignTitle: "Wellness Journey Challenge",
        compensationType: "Commission",
        deliverables: ["2 TikTok videos", "1 Instagram Story"],
        dateApplied: "2024-06-06",
        status: "Pending",
      },
    ],
    rejected: [
      {
        id: 4,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "HomeDecor Plus",
        campaignTitle: "Spring Home Makeover",
        compensationType: "Paid",
        deliverables: ["2 TikTok videos", "1 Instagram post"],
        dateApplied: "2024-06-05",
        status: "Rejected",
      },
      {
        id: 5,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "GourmetEats",
        campaignTitle: "Local Food Discovery",
        compensationType: "Gifted",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-04",
        status: "Rejected",
      },
    ],
  };

  const handleWithdrawApplication = (applicationId) => {
    // In a real app, this would make an API call
    console.log(`Withdrawing application ${applicationId}`);
  };

  const getCompensationIcon = (type) => {
    switch (type) {
      case "Paid":
        return <DollarSign className="w-3 h-3" />;
      case "Gifted":
        return <Gift className="w-3 h-3" />;
      case "Commission":
        return <Percent className="w-3 h-3" />;
      default:
        return <Package className="w-3 h-3" />;
    }
  };

  const getCompensationColor = (type) => {
    switch (type) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Gifted":
        return "bg-blue-100 text-blue-700";
      case "Commission":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Section - Toggle */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <CustomButton
              text={`Pending ${applications.pending.length}`}
              onClick={() => setActiveTab("pending")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "pending"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            />
            <CustomButton
              text={`Rejected ${applications.rejected.length}`}
              onClick={() => setActiveTab("rejected")}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "rejected"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            />
          </div>
        </div>
      </div>

      {/* Center Column - Applications Feed */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {applications[activeTab].map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Brand Logo */}
                  <div className="flex-shrink-0">
                    <img
                      src={application.brandLogo}
                      alt={`${application.brandName} logo`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>

                  {/* Application Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.brandName}
                      </h3>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>

                    <h4 className="text-base font-medium text-gray-900 mb-3">
                      {application.campaignTitle}
                    </h4>

                    <div className="flex items-center space-x-4 mb-3">
                      {/* Compensation Type Badge */}
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getCompensationColor(application.compensationType)}`}
                      >
                        {getCompensationIcon(application.compensationType)}
                        <span>{application.compensationType}</span>
                      </span>
                    </div>

                    {/* Date Applied */}
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Applied {formatDate(application.dateApplied)}</span>
                    </div>

                    {/* Deliverables Summary */}
                    <div className=" py-3">
                      <h5 className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
                        Deliverables
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {application.deliverables.map((item, index) => (
                          <span
                            key={index}
                            className="border text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1"
                          >
                            <div className="w-1 h-1 bg-primary rounded-full" />
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3 ml-4">
                  <CustomButton text="View Campaign" startIcon={<Eye className="w-4 h-4" />} />

                  {application.status === "Pending" && (
                    <CustomButton
                      text="Withdraw"
                      className="btn-danger"
                      startIcon={<X className="w-4 h-4" />}
                      onClick={() => handleWithdrawApplication(application.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}

          {applications[activeTab].length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {activeTab} applications
              </h3>
              <p className="text-gray-600">
                You don't have any {activeTab} campaign applications at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorApplications;
