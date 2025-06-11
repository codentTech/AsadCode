import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import InstagramIcon from "@/common/icons/instagram";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import CampaignCreationWizard from "@/components/campaign/create-campaign/create-campaign";
import { MapPin, Star, Users } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({ isCompleted = false }) => {
  const {
    open,
    creators,
    formatFollowers,
    getPlatformColor,
    getSuccessRateColor,
    handleOpenModal,
    handleCloseModal,
  } = useCreatorSpendAnalysis();

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "instagram":
        return <InstagramIcon />;
      case "youtube":
        return <YoutubeIcon />;
      case "twitter":
        return <TwitterIcon />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-screen bg-white pb-20">
      {/* Header */}

      {/* Compact Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">Discover top creators for your campaigns</p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex-1 max-w-sm">
              <SimpleSelect
                placeHolder="Select an option"
                options={sortOptions}
                className="w-full max-w-[400px]"
              />
            </div>
            {!isCompleted && (
              <div className="w-full max-w-[200px]">
                <CustomButton text="Start a new campaign" onClick={handleOpenModal} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Creator List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="p-4 rounded-lg bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.1 transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img
                    src={avatar}
                    alt={creator.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                  />
                </div>

                {/* Creator Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold text-gray-900">{creator.name}</h3>
                        <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                          Creator Fee:
                          <span className="font-bold text-primary"> ${creator.totalSpent}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>{creator.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(creator.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{creator.rating}</span>
                    <span className="text-sm text-gray-500">({creator.reviewCount} reviews)</span>
                  </div>

                  {/* Performance Metrics */}
                  <div className="flex items-center space-x-4 text-xs">
                    <div
                      className={`px-2 py-1 rounded-full ${getSuccessRateColor(
                        creator.successRate
                      )}`}
                    >
                      <span className="font-medium">{creator.successRate}% Success Rate</span>
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Avg Delivery:</span> {creator.avgDeliveryTime}
                    </div>
                    <div className="text-gray-600">
                      <span className="font-medium">Total Reach:</span>{" "}
                      {formatFollowers(
                        Object.values(creator.platforms).reduce((sum, p) => sum + p.followers, 0)
                      )}
                    </div>
                  </div>

                  {/* Platform Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
                    {Object.entries(creator.platforms).map(([platform, data]) => (
                      <div
                        key={platform}
                        className="flex items-center justify-between bg-gray-100 rounded-lg px-1 pr-3
                                    hover:bg-gray-100/80 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <span className={`${getPlatformColor(platform)} p-1 rounded-md`}>
                            {getPlatformIcon(platform)}
                          </span>
                          <span className="text-sm capitalize font-semibold text-gray-700">
                            {platform}
                          </span>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {formatFollowers(data.followers)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <CampaignCreationWizard open={open} close={handleCloseModal} />
    </div>
  );
};

export default CreatorSpendAnalysis;
