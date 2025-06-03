import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar } from "@/common/constants/auth.constant";
import InstagramIcon from "@/common/icons/instagram";
import SearchIcon from "@/common/icons/search-icon";
import TwitterIcon from "@/common/icons/twitter";
import YoutubeIcon from "@/common/icons/youtube";
import { MapPin, Star, Users } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = () => {
  const { creators, formatFollowers, getPlatformColor, messageDialogOpen, setMessageDialogOpen } =
    useCreatorSpendAnalysis();

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
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between space-x-4">
          <div className="w-full max-w-[300px] flex-1 relative">
            <CustomInput
              name="search"
              placeholder="Search"
              startIcon={<SearchIcon />}
              className="!h-[36px]"
            />
          </div>
        </div>
      </div>
      {/* Creator List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto space-y-4 mb-5">
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
                    <span className="px-2 py-1 rounded-full text-blue-600 bg-blue-50 font-medium">
                      Applied {creator.appliedDate}
                    </span>
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

                  <div className="flex justify-end mt-3 gap-3">
                    <CustomButton text="Save for Later" className="btn-primary" />
                    <CustomButton
                      text="Message"
                      className="btn-outline"
                      onClick={() => setMessageDialogOpen(true)}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <hr />

        <div className="pt-10">
          <h3 className="text-primary">Recommended Creators</h3>
          <p className="text-xs text-gray-600 pb-5">
            Similar niches, high engagement, and top ratings
          </p>
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
                      <span className="px-2 py-1 rounded-full text-blue-600 bg-blue-50 font-medium">
                        Applied {creator.appliedDate}
                      </span>
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

                    <div className="flex justify-end mt-3 gap-3">
                      <CustomButton text="Invite to apply" className="btn-primary" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Creator Dialog */}
      <Modal
        title={`Message to Sam Waters`}
        show={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
      >
        <TextArea label="Your Message" />
        <div className="w-full flex justify-end gap-3">
          <CustomButton
            text="Cancel"
            className="btn-cancel"
            onClick={() => setMessageDialogOpen(false)}
          />

          <CustomButton text="Send Message" className="btn-primary" />
        </div>
      </Modal>
    </div>
  );
};

export default CreatorSpendAnalysis;
