import CustomButton from "@/common/components/custom-button/custom-button.component";
import { Calendar, DollarSign, Eye, Gift, Package, Percent, X, ExternalLink, Clock, CheckCircle, XCircle } from "lucide-react";
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
        compensationAmount: "$1,200",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-08",
        status: "Pending",
        priority: "high",
      },
      {
        id: 2,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "StyleCo",
        campaignTitle: "Fashion Forward Collection",
        compensationType: "Gifted",
        compensationAmount: "$800 value",
        deliverables: ["1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-07",
        status: "Pending",
        priority: "medium",
      },
      {
        id: 3,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "FitLife",
        campaignTitle: "Wellness Journey Challenge",
        compensationType: "Commission",
        compensationAmount: "15% commission",
        deliverables: ["2 TikTok videos", "1 Instagram Story"],
        dateApplied: "2024-06-06",
        status: "Pending",
        priority: "medium",
      },
      {
        id: 6,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "BeautyBloom",
        campaignTitle: "Natural Skincare Revolution",
        compensationType: "Paid",
        compensationAmount: "$2,500",
        deliverables: ["3 TikTok videos", "2 Instagram posts", "1 Instagram Reel"],
        dateApplied: "2024-06-05",
        status: "Pending",
        priority: "high",
      },
      {
        id: 7,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "EcoWear",
        campaignTitle: "Sustainable Fashion Week",
        compensationType: "Gifted",
        compensationAmount: "$600 value",
        deliverables: ["1 TikTok video", "2 Instagram posts", "3 Instagram Stories"],
        dateApplied: "2024-06-04",
        status: "Pending",
        priority: "low",
      },
      {
        id: 8,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-a9a3c9f07308?w=40&h=40&fit=crop&crop=center",
        brandName: "TravelGuru",
        campaignTitle: "Hidden Gems Europe Tour",
        compensationType: "Commission",
        compensationAmount: "20% commission",
        deliverables: ["4 TikTok videos", "2 Instagram posts", "Daily Stories"],
        dateApplied: "2024-06-03",
        status: "Pending",
        priority: "high",
      },
      {
        id: 9,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "FoodieFinds",
        campaignTitle: "Local Restaurant Discovery",
        compensationType: "Paid",
        compensationAmount: "$900",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-02",
        status: "Pending",
        priority: "medium",
      },
      {
        id: 10,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "PetPals",
        campaignTitle: "Pet Care Essentials Campaign",
        compensationType: "Gifted",
        compensationAmount: "$400 value",
        deliverables: ["1 TikTok video", "2 Instagram posts"],
        dateApplied: "2024-06-01",
        status: "Pending",
        priority: "low",
      },
      {
        id: 11,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "BookNook",
        campaignTitle: "Summer Reading Challenge",
        compensationType: "Commission",
        compensationAmount: "12% commission",
        deliverables: ["3 TikTok videos", "1 Instagram post", "Weekly Stories"],
        dateApplied: "2024-05-31",
        status: "Pending",
        priority: "medium",
      },
      {
        id: 12,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "GymGear",
        campaignTitle: "Home Workout Equipment Review",
        compensationType: "Paid",
        compensationAmount: "$1,800",
        deliverables: ["2 TikTok videos", "1 Instagram Reel", "2 Instagram Stories"],
        dateApplied: "2024-05-30",
        status: "Pending",
        priority: "high",
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
        compensationAmount: "$1,000",
        deliverables: ["2 TikTok videos", "1 Instagram post"],
        dateApplied: "2024-06-05",
        status: "Rejected",
        rejectionReason: "Profile doesn't match target audience",
      },
      {
        id: 5,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "GourmetEats",
        campaignTitle: "Local Food Discovery",
        compensationType: "Gifted",
        compensationAmount: "$500 value",
        deliverables: ["2 TikTok videos", "1 Instagram post", "1 Instagram Story"],
        dateApplied: "2024-06-04",
        status: "Rejected",
        rejectionReason: "Campaign budget exceeded",
      },
      {
        id: 13,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "TechHub",
        campaignTitle: "Latest Gadgets Review",
        compensationType: "Commission",
        compensationAmount: "10% commission",
        deliverables: ["3 TikTok videos", "2 Instagram posts"],
        dateApplied: "2024-05-29",
        status: "Rejected",
        rejectionReason: "Looking for different content style",
      },
      {
        id: 14,
        brandLogo:
          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center",
        brandName: "LuxuryLifestyle",
        campaignTitle: "Premium Brand Showcase",
        compensationType: "Paid",
        compensationAmount: "$3,000",
        deliverables: ["1 TikTok video", "3 Instagram posts", "Daily Stories"],
        dateApplied: "2024-05-28",
        status: "Rejected",
        rejectionReason: "Insufficient follower count",
      },
      {
        id: 15,
        brandLogo:
          "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=40&h=40&fit=crop&crop=center",
        brandName: "ArtisticVibes",
        campaignTitle: "Creative Arts Promotion",
        compensationType: "Gifted",
        compensationAmount: "$300 value",
        deliverables: ["2 TikTok videos", "1 Instagram Reel"],
        dateApplied: "2024-05-27",
        status: "Rejected",
        rejectionReason: "Content doesn't align with brand values",
      },
      {
        id: 16,
        brandLogo:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=40&h=40&fit=crop&crop=center",
        brandName: "UrbanStyle",
        campaignTitle: "Street Fashion Trends",
        compensationType: "Commission",
        compensationAmount: "18% commission",
        deliverables: ["4 TikTok videos", "2 Instagram posts"],
        dateApplied: "2024-05-26",
        status: "Rejected",
        rejectionReason: "Geographic location mismatch",
      },
      {
        id: 17,
        brandLogo:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=40&h=40&fit=crop&crop=center",
        brandName: "HealthFirst",
        campaignTitle: "Wellness Product Line",
        compensationType: "Paid",
        compensationAmount: "$2,200",
        deliverables: ["2 TikTok videos", "3 Instagram posts", "Weekly Stories"],
        dateApplied: "2024-05-25",
        status: "Rejected",
        rejectionReason: "Looking for micro-influencers only",
      },
      {
        id: 18,
        brandLogo:
          "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center",
        brandName: "GameZone",
        campaignTitle: "Gaming Accessories Review",
        compensationType: "Gifted",
        compensationAmount: "$700 value",
        deliverables: ["3 TikTok videos", "1 Instagram post"],
        dateApplied: "2024-05-24",
        status: "Rejected",
        rejectionReason: "Campaign timeline conflict",
      },
    ],
  };

  const handleWithdrawApplication = (applicationId) => {
    console.log(`Withdrawing application ${applicationId}`);
  };

  const getCompensationIcon = (type) => {
    switch (type) {
      case "Paid":
        return <DollarSign className="w-4 h-4" />;
      case "Gifted":
        return <Gift className="w-4 h-4" />;
      case "Commission":
        return <Percent className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getCompensationColor = (type) => {
    switch (type) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Gifted":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Commission":
        return "bg-violet-50 text-violet-700 border-violet-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 text-red-700 border-red-200";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "low":
        return "bg-green-50 text-green-700 border-green-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Rejected":
        return <XCircle className="w-4 h-4" />;
      case "Approved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Campaign Applications</h1>
              <p className="text-slate-600">Track and manage your brand partnership applications</p>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 bg-slate-100 p-1.5 rounded-xl shadow-inner">
              <CustomButton
                text={
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Pending</span>
                    <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                      {applications.pending.length}
                    </span>
                  </div>
                }
                onClick={() => setActiveTab("pending")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "pending"
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              />
              <CustomButton
                text={
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4" />
                    <span>Rejected</span>
                    <span className="bg-slate-700 text-white text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] flex items-center justify-center">
                      {applications.rejected.length}
                    </span>
                  </div>
                }
                onClick={() => setActiveTab("rejected")}
                className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === "rejected"
                    ? "bg-white text-slate-900 shadow-md ring-1 ring-slate-200"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {applications[activeTab].length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              {activeTab === "pending" ? (
                <Clock className="w-10 h-10 text-slate-400" />
              ) : (
                <XCircle className="w-10 h-10 text-slate-400" />
              )}
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              No {activeTab} applications
            </h3>
            <p className="text-slate-600 max-w-md mx-auto">
              {activeTab === "pending" 
                ? "You don't have any pending applications. Start exploring campaigns to apply!"
                : "No rejected applications to show. Keep applying to increase your chances!"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {applications[activeTab].map((application) => (
              <div
                key={application.id}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Priority Indicator */}
                {application.priority && activeTab === "pending" && (
                  <div className="px-4 pt-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(application.priority)}`}>
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        application.priority === "high" ? "bg-red-400" :
                        application.priority === "medium" ? "bg-amber-400" : "bg-green-400"
                      }`} />
                      {application.priority.charAt(0).toUpperCase() + application.priority.slice(1)} Priority
                    </span>
                  </div>
                )}

                {/* Card Header */}
                <div className="p-4 pb-3">
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <img
                        src={application.brandLogo}
                        alt={`${application.brandName} logo`}
                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm">
                        {getStatusIcon(application.status)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-bold text-slate-900 mb-1">
                        {application.brandName}
                      </h3>
                      <h4 className="text-sm text-slate-600 leading-relaxed line-clamp-2 mb-3">
                        {application.campaignTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Compensation & Status */}
                  <div className="flex items-center justify-between mt-4 gap-2">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-sm font-medium ${getCompensationColor(application.compensationType)}`}>
                      {getCompensationIcon(application.compensationType)}
                      <span>{application.compensationType}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">
                        {application.compensationAmount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="px-4 pb-4 flex-1 flex flex-col">
                  {/* Date Applied */}
                  <div className="flex items-center space-x-2 text-sm text-slate-500 mb-4">
                    <Calendar className="w-4 h-4" />
                    <span>Applied {formatDate(application.dateApplied)}</span>
                  </div>

                  {/* Rejection Reason (for rejected applications) */}
                  {application.rejectionReason && activeTab === "rejected" && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <p className="text-sm text-red-700 font-medium mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-600">{application.rejectionReason}</p>
                    </div>
                  )}

                  {/* Deliverables */}
                  <div className="flex-1">
                    <h5 className="text-sm font-semibold text-slate-700 mb-3">Deliverables</h5>
                    <div className="space-y-2">
                      {application.deliverables.slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 text-sm text-slate-600"
                        >
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {application.deliverables.length > 3 && (
                        <div className="text-sm text-slate-500 font-medium pl-3.5">
                          +{application.deliverables.length - 3} more deliverables
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                  <div className="flex flex-col space-y-2">
                    <CustomButton
                      text={
                        <div className="flex items-center justify-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>View Campaign</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      }
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                    />

                    {application.status === "Pending" && (
                      <CustomButton
                        text={
                          <div className="flex items-center justify-center space-x-2">
                            <X className="w-4 h-4" />
                            <span>Withdraw Application</span>
                          </div>
                        }
                        onClick={() => handleWithdrawApplication(application.id)}
                        className="w-full bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 px-4 py-2.5 rounded-lg font-medium transition-colors text-sm"
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorApplications;