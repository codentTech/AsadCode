import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Calendar, CheckCircle, Circle, DollarSign, Eye, Upload, X } from "lucide-react";
import { useState } from "react";

const CampaignDetail = ({ campaigns, selectedCampaign }) => {
  const [showContentBrief, setShowContentBrief] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);

  const campaign = campaigns[selectedCampaign];

  const { getPlatformIcon } = useGetplatform();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="w-full bg-white border-x flex-1 flex flex-col overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center text-xl">
              {campaign.logo}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {campaign.brand}
              </h2>
              <p className="text-sm text-gray-600">{campaign.title}</p>
            </div>
          </div>
          <div
            className="p-3 bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => setShowContentBrief(true)}
          >
            <Eye className="h-4 w-4" />
          </div>
        </div>

        {/* Compact Platform Stats */}
        <div className="flex gap-5 my-4">
          {campaign.platforms.map((platform) => (
            <div
              key={platform}
              className="flex items-center justify-between px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2 pr-1">
                <div className="rounded-md">{getPlatformIcon(platform)}</div>
                <span className="text-xs font-medium text-gray-700 capitalize">{platform}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Due Date */}
        <div className="flex justify-between bg-gray-100 rounded-lg p-2 my-4">
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <Calendar className="w-4 h-4" />
              <h3 className="text-sm font-medium text-gray-900">Due Date:</h3>
            </div>
            <p className="text-sm text-gray-600">{formatDate(campaign.deadline)}</p>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center">
              <DollarSign className="w-4 h-4" />
              <h3 className="text-sm font-medium text-gray-900">Payment:</h3>
            </div>
            <p className="text-sm text-gray-600">{campaign.payment}</p>
          </div>
        </div>

        {/* Deliverables Summary */}
        <div className="bg-gray-100 rounded-lg p-3">
          <h5 className="text-xs font-semibold text-gray-600 flex items-center gap-1.5 mb-2">
            Deliverables
          </h5>
          <div className="flex flex-wrap gap-2">
            {campaign.deliverables.map((item, index) => (
              <span
                key={index}
                className="bg-white border text-xs text-gray-700 px-2 py-1 rounded-lg flex items-center gap-1"
              >
                <div className="w-1 h-1 bg-primary rounded-full" />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Product Image */}
        <div className="my-4">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Product</h3>
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-6xl">
            {campaign.productImage}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <CustomButton text="Upload Content" startIcon={<Upload className="w-4 h-4 mr-2" />} />
          <CustomButton
            text="Update Progress"
            className="btn-outline"
            onClick={() => setShowProgressModal(true)}
          />
          <CustomButton text="Message" />
        </div>

        {/* Progress Tracker */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Progress Tracker</h3>
          <div className="space-y-3">
            {campaign.progress.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 mr-3" />
                )}
                <span className={`text-sm ${item.completed ? "text-gray-900" : "text-gray-600"}`}>
                  {item.task}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Brief Modal */}
      {showContentBrief && (
        <Modal
          show={showContentBrief}
          title="Content Briefs"
          onClose={() => setShowContentBrief(false)}
        >
          <div className="prose text-sm text-gray-600">
            <p className="mb-4">
              Create engaging content showcasing our Summer Skincare Collection. Focus on the
              benefits of our new hydrating serum and SPF moisturizer.
            </p>
            <h3 className="font-medium text-gray-900 mb-2">Key Points to Cover:</h3>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>Lightweight, non-greasy formula</li>
              <li>Suitable for all skin types</li>
              <li>SPF 30 protection</li>
              <li>Hydrating benefits</li>
            </ul>
            <h3 className="font-medium text-gray-900 mb-2">Brand Guidelines:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Use natural lighting when possible</li>
              <li>Include product close-ups</li>
              <li>Mention discount code: SUMMER20</li>
            </ul>
          </div>
        </Modal>
      )}

      {/* Progress Update Modal */}
      <Modal
        show={showProgressModal}
        title="Update Progress"
        onClose={() => setShowProgressModal(false)}
      >
        <div>
          <div className="space-y-3 mb-4">
            {campaigns[selectedCampaign].progress.map((item, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  checked={item.completed}
                  className="w-4 h-4 text-indigo-600 rounded mr-3"
                  readOnly
                />
                <span className="text-sm text-gray-700">{item.task}</span>
              </div>
            ))}
          </div>
          <hr />
          <div className="mt-4 flex justify-end space-x-3">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={() => setShowProgressModal(false)}
            />

            <CustomButton
              text="Save Changes"
              className="btn-primary"
              onClick={() => setShowProgressModal(false)}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignDetail;
