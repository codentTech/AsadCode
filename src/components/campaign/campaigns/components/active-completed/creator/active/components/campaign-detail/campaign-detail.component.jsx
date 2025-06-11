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
    <div className="w-full h-screen bg-white border-x flex-1 flex flex-col overflow-y-auto">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-24 h-24 bg-indigo-100 rounded-lg flex items-center justify-center text-6xl">
              {campaign.logo}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 leading-tight">
                {campaign.brand}
              </h2>
              <p className="text-sm text-gray-600">{campaign.title}</p>
            </div>
          </div>
          {/* Product Image */}
          <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center text-6xl">
            {campaign.productImage}
          </div>
        </div>

        {/* Compact Platform Stats and dates*/}
        <div className="flex justify-between my-4">
          <div className="flex gap-4">
            {campaign.platforms.map((platform) => (
              <div
                key={platform}
                className="flex items-center justify-between px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 pr-1">
                  <div className="rounded-md">{getPlatformIcon(platform)}</div>
                  <span className="text-xs font-medium text-gray-600 capitalize">{platform}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-5 bg-gray-100 rounded-lg p-2 my-1">
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

        {/* Progress Tracker */}
        <div className="bg-white  py-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Campaign Progress</h3>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${campaign.completionRate}%` }}
                />
              </div>
              <span className="text-sm font-medium text-gray-600">{campaign.completionRate}%</span>
            </div>
          </div>

          <div className="space-y-4">
            {campaign.progress.map((item, index) => (
              <div key={index} className="flex items-center p-2 bg-gray-100 rounded-lg">
                <div className="flex-shrink-0 mr-4">
                  {item.completed ? (
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <Circle className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <span
                    className={`text-sm font-medium ${item.completed ? "text-gray-900" : "text-gray-600"}`}
                  >
                    {item.task}
                  </span>
                  {item.completed && <div className="text-xs text-green-600 mt-1">Completed</div>}
                </div>
                <div className="text-sm text-gray-600">Step {index + 1}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-3 my-4">
          <CustomButton text="Upload Content" startIcon={<Upload className="w-4 h-4 mr-2" />} />
          <CustomButton
            text="Update Progress"
            className="btn-outline"
            onClick={() => setShowProgressModal(true)}
          />
          <CustomButton text="Message" />
          <CustomButton
            text="View Breif"
            className="btn-outline"
            onClick={() => setShowContentBrief(true)}
          />
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
