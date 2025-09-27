import React from "react";
import Modal from "@/common/components/modal/modal.component";
import { Calendar, DollarSign, MapPin, Users, Package } from "lucide-react";

const CampaignBriefModal = ({ show, onClose, campaign }) => {
  if (!campaign) return null;

  const formatCompensationType = (type) => {
    switch (type) {
      case "FIXED":
        return "Fixed Payment";
      case "GIFTED":
        return "Gifted Product";
      case "COMMISSION":
        return "Commission Based";
      default:
        return type;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatFollowers = (followers) => {
    if (followers >= 1000000) {
      return `${(followers / 1000000).toFixed(1)}M`;
    } else if (followers >= 1000) {
      return `${(followers / 1000).toFixed(1)}K`;
    }
    return followers.toString();
  };

  return (
    <Modal show={show} title="Campaign Brief" onClose={onClose} size="lg">
      <div className="space-y-6">
        {/* Campaign Header */}
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{campaign.campaign_title}</h2>
          <p className="text-gray-600">{campaign.short_description}</p>
        </div>

        {/* Campaign Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Brand Information */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Brand Information</h3>
              <div className="flex items-center space-x-3">
                <img
                  src={
                    campaign.created_by?.profile_photo_url ||
                    "https://images.unsplash.com/photo-1549924231-f129b911e442?w=40&h=40&fit=crop&crop=center"
                  }
                  alt="Brand logo"
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900">
                    {campaign.created_by?.first_name || "Brand Name"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {campaign.created_by?.email || "brand@example.com"}
                  </p>
                </div>
              </div>
            </div>

            {/* Campaign Type & Compensation */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Campaign Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Campaign Type:</span>
                  <span className="font-medium">{campaign.campaign_type?.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Compensation:</span>
                  <span className="font-medium">
                    {formatCompensationType(campaign.compensation_type)}
                  </span>
                </div>
                {campaign.budget && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">${campaign.budget}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Requirements</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Min Followers: {formatFollowers(campaign.min_combined_followers)}
                  </span>
                </div>
                {campaign.creator_country && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Location: {campaign.creator_country}
                    </span>
                  </div>
                )}
                {campaign.remote !== undefined && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Remote: {campaign.remote ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Deliverables */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                Deliverables
              </h3>
              <div className="space-y-2">
                {campaign.deliverables?.map((deliverable, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-sm text-gray-700">{deliverable}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Platforms */}
            {campaign.required_platforms && campaign.required_platforms.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Required Platforms</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.required_platforms.map((platform, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary text-white text-xs rounded-full"
                    >
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Niches */}
            {campaign.niches && campaign.niches.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Target Niches</h3>
                <div className="flex flex-wrap gap-2">
                  {campaign.niches.map((niche, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-200 text-gray-700 text-xs rounded-full"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dates */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Important Dates
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="text-sm">{formatDate(campaign.created_at)}</span>
                </div>
                {campaign.application_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Application Deadline:</span>
                    <span className="text-sm">{formatDate(campaign.application_date)}</span>
                  </div>
                )}
                {campaign.campaign_deadline && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Campaign Deadline:</span>
                    <span className="text-sm">{formatDate(campaign.campaign_deadline)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Long Description */}
        {campaign.long_description && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Detailed Description</h3>
            <p className="text-gray-700 leading-relaxed">{campaign.long_description}</p>
          </div>
        )}

        {/* Style Guide */}
        {campaign.style_guide && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Style Guide</h3>
            <p className="text-gray-700 leading-relaxed">{campaign.style_guide}</p>
          </div>
        )}

        {/* Do's and Don'ts */}
        {campaign.do_donts && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Do's and Don'ts</h3>
            <p className="text-gray-700 leading-relaxed">{campaign.do_donts}</p>
          </div>
        )}

        {/* Hashtags */}
        {campaign.hashtags && (
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Required Hashtags</h3>
            <p className="text-gray-700">{campaign.hashtags}</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default CampaignBriefModal;
