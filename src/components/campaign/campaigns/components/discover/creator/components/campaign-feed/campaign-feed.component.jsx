import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { product } from "@/common/constants/auth.constant";
import Niche from "@/components/niche/niche";
import { useCampaignFeed } from "./use-campaign-feed.hook";
import { Globe } from "lucide-react";

function CampaignFeed() {
  const {
    campaigns,
    showFullBrief,
    briefCampaign,
    showApplication,
    applicationCampaign,
    applicationPitch,
    setApplicationPitch,
    handleOpenBrief,
    handleOpenApplication,
    closeBrief,
    closeApplication,
  } = useCampaignFeed();

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-70px)] bg-white">
      {/* Sticky Niche */}
      <div className="sticky top-0 z-10 bg-white p-4 border-b border-gray-200">
        <Niche />
      </div>

      {/* Scrollable Campaign List */}
      <div className="space-y-4 p-4 overflow-y-auto flex-1">
        {campaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            <div className="flex flex-col p-4 gap-3">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-6xl border border-gray-200">
                    {campaign.brandLogo}
                  </div>
                </div>

                <div className="w-full flex justify-between">
                  <div className="flex flex-col gap-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {campaign.brandName}
                    </h3>
                    <h4 className="text-xs text-gray-600 line-clamp-2">
                      <span className="font-bold">Campaign</span> - {campaign.title}
                    </h4>
                    <p className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <span className="text-gray-600">
                        <Globe className="h-3 w-3" />
                      </span>
                      <span>2h ago</span>
                    </p>
                  </div>
                </div>
                <img
                  src={product}
                  alt="Campaign Product"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-200 shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 text-xs">
                {[
                  {
                    label: "Campaign Type",
                    value: campaign.type,
                    bg: "bg-blue-100",
                  },
                  {
                    label: "Compensation Type",
                    value: campaign.compensation,
                    bg: "bg-gray-100",
                  },
                  {
                    label: "Compensation Amount",
                    value: campaign.compensationAmount,
                    bg: "bg-gray-100",
                  },
                  {
                    label: "Niche Type",
                    value: `#${campaign.niche}`,
                    bg: "bg-blue-100",
                  },
                  {
                    label: "Location",
                    value: campaign.location,
                    bg: "bg-blue-100",
                  },
                  {
                    label: "Language",
                    value: campaign.language,
                    bg: "bg-gray-100",
                  },
                  {
                    label: "Follower Minimum",
                    value: campaign.followerMin,
                    bg: "bg-gray-100",
                  },
                ].map((item, index) => (
                  <span
                    key={index}
                    className={`flex items-center gap-1 ${item.bg} text-gray-600 px-2 py-1 rounded-full font-medium`}
                  >
                    <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                    <span className="font-bold">{item.label}</span> - {item.value}
                  </span>
                ))}
              </div>

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
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-600 border-l-2 border-primary border-solid pl-2">
                <span className="font-bold">Description</span> - {campaign.description}
              </p>
            </div>

            <div className="px-4 py-3 border-t  flex gap-2">
              <CustomButton
                text="View Full Brief"
                className="btn-outline w-full"
                onClick={() => handleOpenBrief(campaign)}
              />
              <CustomButton
                text="Apply"
                className="btn-primary w-full"
                onClick={() => handleOpenApplication(campaign)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Campaign Brief */}
      <Modal show={showFullBrief} title="Campaign Brief" onClose={closeBrief}>
        <div className="space-y-3">
          <div className="flex gap-3">
            <div className="relative shrink-0">
              <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-6xl border border-gray-200">
                {briefCampaign?.brandLogo}
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900">{briefCampaign?.brandName}</h4>
              <p className="text-gray-600 text-sm">
                <span className="font-bold">Campaign - </span>
                {briefCampaign?.title}
              </p>
            </div>
          </div>

          <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
            <h5 className="text-lg font-medium text-gray-900">Campaign Details</h5>
            <p className="text-gray-600 text-sm">{briefCampaign?.brief}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-2 shadow-sm">
            <h5 className="text-lg font-medium text-gray-900 mb-1">Deliverables</h5>
            <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
              {briefCampaign?.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal - Apply to Campaign */}
      <Modal show={showApplication} title="Apply to Campaign" onClose={closeApplication}>
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-gray-900">
            {applicationCampaign?.brandName} - {applicationCampaign?.title}
          </h4>
          <TextArea
            label="Your Pitch (Optional)"
            placeholder="Write your pitch here or use a saved template..."
            value={applicationPitch}
            onChange={(e) => setApplicationPitch(e.target.value)}
          />
          <div className="flex gap-3">
            <CustomButton text="Cancel" className="w-full btn-cancel" onClick={closeApplication} />
            <CustomButton
              text="Submit Application"
              className="w-full btn-primary"
              onClick={closeApplication}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default CampaignFeed;
