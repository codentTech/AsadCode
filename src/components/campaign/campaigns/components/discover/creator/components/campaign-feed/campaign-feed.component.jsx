import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import Niche from "@/components/niche/niche";
import { DollarSign, Gift, Percent } from "lucide-react";
import { useCampaignFeed } from "./use-campaign-feed.hook";

function CampaignFeed({ filteredCampaigns }) {
  const {
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
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-200"
          >
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-4xl border border-gray-200">
                    {campaign.brandLogo}
                  </div>
                </div>

                <div className="w-full flex justify-between">
                  <div className="flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm truncate">
                      {campaign.brandName}
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                      <span>{campaign.location}</span>
                      <span className="text-gray-300">•</span>
                      <span>2h ago</span>
                    </p>
                    <h4 className="text-xs text-gray-600 line-clamp-2">{campaign.title}</h4>
                  </div>

                  <div className="flex flex-col gap-2 px-4 text-xs">
                    <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      <span className="font-bold">Campaign Type</span> - {campaign.type}
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
                      {" "}
                      <div
                        className={`w-1.5 h-1.5 ${
                          campaign.compensation === "Paid"
                            ? " bg-green-700"
                            : campaign.compensation === "Gifted"
                              ? " bg-purple-700"
                              : " bg-orange-700"
                        } rounded-full`}
                      />
                      <span className="font-bold">Componsation Type</span> -
                      {campaign.compensation === "Paid" && <DollarSign className="w-3 h-3" />}
                      {campaign.compensation === "Gifted" && <Gift className="w-3 h-3" />}
                      {campaign.compensation === "Commission" && <Percent className="w-3 h-3" />}
                      {campaign.compensation}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full font-medium">
                      <div className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                      <span className="font-bold">Niche Type</span> - #{campaign.niche}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 pb-3">
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
            </div>

            <div className="px-4 py-3 border-t  flex gap-2">
              <CustomButton
                text="View Brief"
                className="btn-outline w-full"
                onClick={() => handleOpenBrief(campaign)}
              />
              <CustomButton
                text="Apply"
                className="btn-secondary w-full"
                onClick={() => handleOpenApplication(campaign)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Campaign Brief */}
      <Modal show={showFullBrief} title="Campaign Brief" onClose={closeBrief}>
        <div className="p-1 space-y-3">
          <div className="space-y-1">
            <h4 className="text-xl font-semibold text-gray-900">{briefCampaign?.brandName}</h4>
            <p className="text-gray-600 text-sm">{briefCampaign?.title}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h5 className="text-lg font-medium text-gray-800 mb-1">Campaign Details</h5>
            <p className="text-gray-700 text-sm">{briefCampaign?.brief}</p>
          </div>

          <div className="bg-gray-100 rounded-lg p-4 shadow-sm">
            <h5 className="text-lg font-medium text-gray-800 mb-1">Deliverables</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
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
