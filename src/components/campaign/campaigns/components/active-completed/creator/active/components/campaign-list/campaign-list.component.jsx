import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import { avatar } from "@/common/constants/auth.constant";
import { useState } from "react";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getDaysUntilDeadline = (deadline) => {
  const today = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const CampaignList = ({ campaigns, selectedCampaign, setSelectedCampaign }) => {
  const [showTrackCampaign, setShowTrackCampaign] = useState(false);

  // Track External Campaign Form State
  const [externalCampaignForm, setExternalCampaignForm] = useState({
    brandName: "",
    campaignTitle: "",
    typeOfWork: "",
    niche: "",
    platforms: [],
    deliverables: [],
    completionDate: "",
    compensation: "",
  });

  // External Campaign Form Options
  const workTypeOptions = [
    { label: "UGC", value: "ugc" },
    { label: "Sponsored Post", value: "sponsored" },
    { label: "Affiliate", value: "affiliate" },
    { label: "Gifting", value: "gifting" },
    { label: "Other", value: "other" },
  ];

  const platformOptions = [
    { label: "TikTok", value: "tiktok" },
    { label: "Instagram", value: "instagram" },
    { label: "YouTube", value: "youtube" },
    { label: "Other", value: "other" },
  ];

  const deliverableOptions = [
    { label: "1 TikTok Video", value: "1_tiktok" },
    { label: "1 Instagram Post", value: "1_ig_post" },
    { label: "1 Instagram Story", value: "1_ig_story" },
    { label: "1 YouTube Video", value: "1_youtube" },
    { label: "1 YouTube Short", value: "1_youtube_short" },
    { label: "Other", value: "other" },
  ];

  const handlePlatformChange = (platform) => {
    setExternalCampaignForm((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleDeliverableChange = (deliverable) => {
    setExternalCampaignForm((prev) => ({
      ...prev,
      deliverables: prev.deliverables.includes(deliverable)
        ? prev.deliverables.filter((d) => d !== deliverable)
        : [...prev.deliverables, deliverable],
    }));
  };

  const handleSubmitExternalCampaign = () => {
    // Process form submission
    console.log("External campaign data:", externalCampaignForm);

    // Reset form and close modal
    setExternalCampaignForm({
      brandName: "",
      campaignTitle: "",
      typeOfWork: "",
      niche: "",
      platforms: [],
      deliverables: [],
      completionDate: "",
      compensation: "",
    });
    setShowTrackCampaign(false);

    // Show success message or handle as needed
  };

  return (
    <div className="relative bg-white w-[23%]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Campaigns by Deadline</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {campaigns.map((campaign) => {
          const daysLeft = getDaysUntilDeadline(campaign.deadline);
          return (
            <div
              key={campaign.id}
              onClick={() => setSelectedCampaign(index)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                selectedCampaign?.id === campaign.id
                  ? "bg-gray-100 border-l-4 border-l-primary"
                  : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <img
                  src={avatar}
                  alt={campaign.brand.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 text-sm truncate">{campaign.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{formatDate(campaign.deadline)}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        daysLeft <= 3
                          ? "bg-red-100 text-red-800"
                          : daysLeft <= 7
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {daysLeft}d left
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-20 right-5">
        <CustomButton
          text="Track External Campaign +"
          className="btn-primary"
          onClick={() => setShowTrackCampaign(true)}
        />
      </div>

      {/* Track External Campaign Modal */}
      <Modal
        show={showTrackCampaign}
        title="Track External Campaign"
        onClose={() => setShowTrackCampaign(false)}
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Add campaigns from outside CleerCut to use our content planner and calendar tools.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                label="Brand Name"
                value={externalCampaignForm.brandName}
                onChange={(e) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    brandName: e.target.value,
                  }))
                }
                placeholder="e.g., Nike"
                required
              />
            </div>
            <div>
              <CustomInput
                label="Campaign Title"
                value={externalCampaignForm.campaignTitle}
                onChange={(e) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    campaignTitle: e.target.value,
                  }))
                }
                placeholder="e.g., Summer Collection Launch"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <SimpleSelect
                label="Type of Work"
                placeHolder="Select work type"
                options={workTypeOptions}
                onChange={(value) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    typeOfWork: value,
                  }))
                }
                required
              />
            </div>
            <div>
              <CustomInput
                label="Niche"
                value={externalCampaignForm.niche}
                onChange={(e) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    niche: e.target.value,
                  }))
                }
                placeholder="e.g., Fashion, Beauty, Tech"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Platform(s) <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platformOptions.map((platform) => (
                <label key={platform.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={externalCampaignForm.platforms.includes(platform.value)}
                    onChange={() => handlePlatformChange(platform.value)}
                    className="w-4 h-4 text-slate-600 rounded mr-2"
                  />
                  <span className="text-sm text-gray-700">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">Deliverables</label>
            <div className="grid grid-cols-2 gap-2">
              {deliverableOptions.map((deliverable) => (
                <label key={deliverable.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={externalCampaignForm.deliverables.includes(deliverable.value)}
                    onChange={() => handleDeliverableChange(deliverable.value)}
                    className="w-4 h-4 text-slate-600 rounded mr-2"
                  />
                  <span className="text-sm text-gray-700">{deliverable.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <CustomInput
                label="Completion Date"
                type="date"
                value={externalCampaignForm.completionDate}
                onChange={(e) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    completionDate: e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <CustomInput
                label="Compensation (Optional)"
                value={externalCampaignForm.compensation}
                onChange={(e) =>
                  setExternalCampaignForm((prev) => ({
                    ...prev,
                    compensation: e.target.value,
                  }))
                }
                placeholder="e.g., $500, Gifted"
              />
            </div>
          </div>

          <p className="text-xs text-gray-500 italic">
            *For your reference only – not added to CleerCut income totals
          </p>

          <div className="flex justify-end gap-3 border-t pt-4">
            <CustomButton
              text="Cancel"
              className="btn-cancel"
              onClick={() => setShowTrackCampaign(false)}
            />
            <CustomButton
              text="Add Campaign"
              className="btn-primary"
              onClick={handleSubmitExternalCampaign}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CampaignList;
