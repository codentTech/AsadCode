import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { product } from "@/common/constants/auth.constant";
import Niche from "@/components/niche/niche";
import { Globe, DollarSign, Gift, Users, Zap } from "lucide-react";
import { useCampaignFeed } from "./use-campaign-feed.hook";

function CampaignFeed() {
  const {
    campaigns,
    sortBy,
    setSortBy,
    sortedCampaigns,
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

  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "highest-value", label: "Highest Value" },
  ];

  // Campaign type color mapping
  const getCampaignTypeStyle = (type) => {
    const styles = {
      "Sponsored Post": {
        bg: "bg-green-100",
        text: "text-green-800",
        border: "border-green-200",
        icon: <DollarSign size={12} />,
      },
      UGC: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        border: "border-blue-200",
        icon: <Users size={12} />,
      },
      Gifted: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        border: "border-yellow-200",
        icon: <Gift size={12} />,
      },
      Affiliate: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        border: "border-purple-200",
        icon: <Zap size={12} />,
      },
    };
    return styles[type] || styles["Sponsored Post"];
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-70px)] bg-gray-100">
      {/* Sticky Header with Niche and Sort */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="p-4">
          <Niche />
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Available Campaigns</h2>
            <div className="flex items-center gap-2">
              <div className="w-40">
                <SimpleSelect
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeHolder="Sort by"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Campaign List */}
      <div className="space-y-3 p-4 overflow-y-auto flex-1">
        {sortedCampaigns.map((campaign) => {
          const typeStyle = getCampaignTypeStyle(campaign.type);

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="p-4">
                {/* Header Row with Brand Info and Campaign Type */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl border border-gray-200 flex-shrink-0">
                      {campaign.brandLogo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {campaign.brandName}
                      </h3>
                      <h4 className="text-sm text-gray-700 line-clamp-1 font-medium">
                        {campaign.title}
                      </h4>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Globe className="h-3 w-3" />
                        <span>2h ago</span>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Type and Payment Info */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                    >
                      {typeStyle.icon}
                      {campaign.type}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{campaign.compensation}</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {campaign.compensationAmount}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Row */}
                <div className="flex gap-4">
                  {/* Requirements Section */}
                  <div className="flex-1">
                    <h5 className="text-xs font-semibold text-gray-600 mb-2">Requirements</h5>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <span className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Niche:</span> #{campaign.niche}
                      </span>
                      {(campaign.locationMandatory || campaign.locationPreferred) && (
                        <span className="flex items-center gap-2 text-gray-600">
                          <span className="font-medium">Location:</span> {campaign.location}
                        </span>
                      )}
                      <span className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Language:</span> {campaign.language}
                      </span>
                      <span className="flex items-center gap-2 text-gray-600">
                        <span className="font-medium">Min Followers:</span> {campaign.followerMin}
                      </span>
                    </div>

                    {/* Deliverables */}
                    <div className="mt-3">
                      <h5 className="text-xs font-semibold text-gray-600 mb-2">Deliverables</h5>
                      <div className="flex flex-wrap gap-1">
                        {campaign.deliverables.map((item) => (
                          <span
                            key={item}
                            className="px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mt-3">
                      <p className="text-xs text-gray-600 line-clamp-2">
                        <span className="font-medium">Description:</span> {campaign.description}
                      </p>
                    </div>
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={product}
                      alt="Campaign Product"
                      className="w-24 h-24 rounded-lg object-cover border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
                <CustomButton
                  text="View Brief"
                  className="btn-outline flex-1 !h-8 !text-xs"
                  onClick={() => handleOpenBrief(campaign)}
                />
                <CustomButton
                  text="Apply"
                  className="btn-primary flex-1 !h-8 !text-xs"
                  onClick={() => handleOpenApplication(campaign)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal - Campaign Brief */}
      <Modal show={showFullBrief} title="Campaign Brief" onClose={closeBrief} size="lg">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-4xl border border-gray-200 flex-shrink-0">
              {briefCampaign?.brandLogo}
            </div>
            <div className="flex-1">
              <h4 className="text-xl font-semibold text-gray-900">{briefCampaign?.brandName}</h4>
              <p className="text-gray-700 font-medium">{briefCampaign?.title}</p>
              <div className="mt-2">
                {briefCampaign && (
                  <div
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getCampaignTypeStyle(briefCampaign.type).bg} ${getCampaignTypeStyle(briefCampaign.type).text} ${getCampaignTypeStyle(briefCampaign.type).border}`}
                  >
                    {getCampaignTypeStyle(briefCampaign.type).icon}
                    {briefCampaign.type} • {briefCampaign.compensationAmount}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-lg font-medium text-gray-900 mb-2">Campaign Details</h5>
            <p className="text-gray-700 text-sm leading-relaxed">{briefCampaign?.brief}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h5 className="text-lg font-medium text-gray-900 mb-3">Deliverables</h5>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
              {briefCampaign?.deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        </div>
      </Modal>

      {/* Modal - Apply to Campaign */}
      <Modal show={showApplication} title="Apply to Campaign" onClose={closeApplication} size="lg">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-lg font-semibold text-gray-900">
              {applicationCampaign?.brandName}
            </h4>
            <p className="text-gray-700">{applicationCampaign?.title}</p>
          </div>

          <TextArea
            label="Your Pitch (Optional)"
            placeholder="Write your pitch here or use a saved template..."
            value={applicationPitch}
            onChange={(e) => setApplicationPitch(e.target.value)}
            rows={4}
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
