import React, { useState } from "react";
import Niche from "@/components/niche/niche";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  DollarSign,
  Eye,
  Filter,
  Gift,
  Percent,
  Trash2,
  X,
} from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
function CampaignFeed({ filteredCampaigns }) {
  const [showFullBrief, setShowFullBrief] = useState(null);
  const [showApplication, setShowApplication] = useState(null);
  return (
    <div className="col-span-6">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Niche Chips */}
        <div className="p-4 border-b border-gray-200">
          <Niche />
        </div>

        {/* News Feed Layout */}
        <div className="max-w-xl mx-auto space-y-4 p-4 overflow-y-scroll h-screen pb-10">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow transition-all duration-200"
            >
              {/* Header Section */}
              <div className="p-4">
                <div className="flex items-start sm:items-center gap-4">
                  {/* Logo */}
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl flex items-center justify-center text-lg border border-gray-200">
                      {campaign.brandLogo}
                    </div>
                    <div className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {campaign.brandName}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <span>{campaign.location}</span>
                      <span className="text-gray-300">•</span>
                      <span>2h ago</span>
                    </p>

                    <h4 className="text-sm font-medium text-gray-800 mt-2 line-clamp-2">
                      {campaign.title}
                    </h4>
                  </div>
                </div>
              </div>

              {/* Tags Section */}
              <div className="flex flex-wrap gap-2 px-4 pb-3 text-xs">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  {campaign.type}
                </span>

                <span
                  className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                    campaign.compensation === "Paid"
                      ? "bg-green-50 text-green-700"
                      : campaign.compensation === "Gifted"
                        ? "bg-purple-50 text-purple-700"
                        : "bg-orange-50 text-orange-700"
                  }`}
                >
                  {campaign.compensation === "Paid" && <DollarSign className="w-3 h-3" />}
                  {campaign.compensation === "Gifted" && <Gift className="w-3 h-3" />}
                  {campaign.compensation === "Commission" && <Percent className="w-3 h-3" />}
                  {campaign.compensation}
                </span>

                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                  #{campaign.niche}
                </span>
              </div>

              {/* Deliverables */}
              <div className="px-4 pb-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
                    <Eye className="w-3 h-3 text-gray-600" />
                    Deliverables
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {campaign.deliverables.map((item, index) => (
                      <span
                        key={index}
                        className="bg-white border text-xs text-gray-700 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <div className="w-1 h-1 bg-primary rounded-full" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t bg-gray-50 flex gap-2">
                <CustomButton
                  text="View Brief"
                  className="btn-outline w-full"
                  onClick={() => setShowFullBrief(campaign)}
                />
                <CustomButton
                  text="Apply"
                  className="btn-primary w-full"
                  onClick={() => setShowApplication(campaign)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Modal show={showFullBrief} title="Campaign Brief" onClose={() => setShowFullBrief(null)}>
        <div className="p-1 space-y-3">
          <div className="space-y-1">
            <h4 className="text-xl font-semibold text-gray-900">{showFullBrief?.brandName}</h4>
            <p className="text-gray-600 text-sm">{showFullBrief?.title}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h5 className="text-lg font-medium text-gray-800 mb-1">Campaign Details</h5>
            <p className="text-gray-700 text-sm">{showFullBrief?.brief}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h5 className="text-lg font-medium text-gray-800 mb-1">Deliverables</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {showFullBrief?.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CampaignFeed;
