import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Calendar, Clock, DollarSign, Eye, Gift, Package, Percent, X, XCircle } from "lucide-react";
import { useState } from "react";

const CreatorApplications = () => {
  const [activeTab, setActiveTab] = useState("pending");

  // Extended mock data for applications
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
      {
        id: 6,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "BeautyBloom",
        campaignTitle: "Natural Skincare Revolution",
        compensationType: "Paid",
        deliverables: ["3 TikTok videos", "2 Instagram posts", "1 Instagram Reel"],
        dateApplied: "2024-06-05",
        status: "Pending",
      },
      {
        id: 7,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "EcoWear",
        campaignTitle: "Sustainable Fashion Week",
        compensationType: "Gifted",
        deliverables: ["1 TikTok video", "2 Instagram posts", "3 Instagram Stories"],
        dateApplied: "2024-06-04",
        status: "Pending",
      },
      {
        id: 8,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-a9a3c9f07308?w=40&h=40&fit=crop&crop=center",
        brandName: "TravelGuru",
        campaignTitle: "Hidden Gems Europe Tour",
        compensationType: "Commission",
        deliverables: ["4 TikTok videos", "2 Instagram posts", "Daily Stories"],
        dateApplied: "2024-06-03",
        status: "Pending",
      },
      {
        id: 9,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "FoodieFinds",
        campaignTitle: "Local Restaurant Discovery",
        compensationType: "Paid",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-02",
        status: "Pending",
      },
      {
        id: 10,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "PetPals",
        campaignTitle: "Pet Care Essentials Campaign",
        compensationType: "Gifted",
        deliverables: ["1 TikTok video", "2 Instagram posts"],
        dateApplied: "2024-06-01",
        status: "Pending",
      },
      {
        id: 11,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "BookNook",
        campaignTitle: "Summer Reading Challenge",
        compensationType: "Commission",
        deliverables: ["3 TikTok videos", "1 Instagram post", "Weekly Stories"],
        dateApplied: "2024-05-31",
        status: "Pending",
      },
      {
        id: 12,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "GymGear",
        campaignTitle: "Home Workout Equipment Review",
        compensationType: "Paid",
        deliverables: ["2 TikTok videos", "1 Instagram Reel", "2 Instagram Stories"],
        dateApplied: "2024-05-30",
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
      {
        id: 13,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "TechHub",
        campaignTitle: "Latest Gadgets Review",
        compensationType: "Commission",
        deliverables: ["3 TikTok videos", "2 Instagram posts"],
        dateApplied: "2024-05-29",
        status: "Rejected",
      },
      {
        id: 14,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "LuxuryLifestyle",
        campaignTitle: "Premium Brand Showcase",
        compensationType: "Paid",
        deliverables: ["1 TikTok video", "3 Instagram posts", "Daily Stories"],
        dateApplied: "2024-05-28",
        status: "Rejected",
      },
      {
        id: 15,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "ArtisticVibes",
        campaignTitle: "Creative Arts Promotion",
        compensationType: "Gifted",
        deliverables: ["2 TikTok videos", "1 Instagram Reel"],
        dateApplied: "2024-05-27",
        status: "Rejected",
      },
      {
        id: 16,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "UrbanStyle",
        campaignTitle: "Street Fashion Trends",
        compensationType: "Commission",
        deliverables: ["4 TikTok videos", "2 Instagram posts"],
        dateApplied: "2024-05-26",
        status: "Rejected",
      },
      {
        id: 17,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "HealthFirst",
        campaignTitle: "Wellness Product Line",
        compensationType: "Paid",
        deliverables: ["2 TikTok videos", "3 Instagram posts", "Weekly Stories"],
        dateApplied: "2024-05-25",
        status: "Rejected",
      },
      {
        id: 18,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "GameZone",
        campaignTitle: "Gaming Accessories Review",
        compensationType: "Gifted",
        deliverables: ["3 TikTok videos", "1 Instagram post"],
        dateApplied: "2024-05-24",
        status: "Rejected",
      },
    ],
  };

  const handleWithdrawApplication = (applicationId) => {
    console.log(`Withdrawing application ${applicationId}`);
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
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Section - Toggle */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto p-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Campaign Applications</h1>
              <p className="text-gray-600">Track and manage your brand applications</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 bg-gray-100 p-1.5 rounded-xl shadow-inner">
              <CustomButton
                text={
                  <div className="flex items-center space-x-2 text-xs">
                    <span>Pending</span>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                      {applications.pending.length}
                    </span>
                  </div>
                }
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "pending"
                    ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              />
              <CustomButton
                text={
                  <div className="flex items-center space-x-2 text-xs">
                    <span>Rejected</span>
                    <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                      {applications.rejected.length}
                    </span>
                  </div>
                }
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "rejected"
                    ? "bg-white text-gray-900 shadow-md ring-1 ring-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Grid View - Applications */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {applications[activeTab].length === 0 ? (
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {applications[activeTab].map((application) => (
                <div
                  key={application.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center space-x-3 mb-1">
                      <img
                        src={application.brandLogo}
                        alt={`${application.brandName} logo`}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {application.brandName}
                        </h3>
                        <h4 className="text-xs font-medium text-gray-600 leading-tight mb-3 line-clamp-2">
                          {application.campaignTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${getCompensationColor(application.compensationType)}`}
                      >
                        <span>{application.compensationType}</span>
                      </span>
                      <span
                        className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
                          application.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {application.status}
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Date Applied */}
                    <div className="flex items-center space-x-1 text-xs text-gray-600 mb-3">
                      <Calendar className="w-3 h-3" />
                      <span className="text-xs text-gray-600 font-semibold">
                        Applied on {formatDate(application.dateApplied)}
                      </span>
                    </div>

                    {/* Deliverables */}
                    <div className="flex-1">
                      <h5 className="text-xs font-semibold text-gray-600 mb-2">Deliverables</h5>
                      <div className="flex flex-wrap gap-1">
                        {application.deliverables.slice(0, 3).map((item, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md flex items-center gap-1"
                          >
                            <div className="w-1 h-1 bg-indigo-600 rounded-full" />
                            {item}
                          </span>
                        ))}
                        {application.deliverables.length > 3 && (
                          <span className="text-xs text-gray-500 px-2 py-1">
                            +{application.deliverables.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-4 border-t border-gray-100">
                    <div className="flex flex-col space-y-2">
                      {application.status === "Pending" && (
                        <CustomButton
                          text="Withdraw"
                          className="btn-secondary"
                          onClick={() => handleWithdrawApplication(application.id)}
                        />
                      )}
                      <CustomButton text="View Campaign" className="btn-outline" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatorApplications;
