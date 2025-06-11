import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import Modal from "@/common/components/modal/modal.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import useGetplatform from "@/common/hooks/use-get-social-platform.hook";
import { Star } from "lucide-react";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = () => {
  const { creators, formatFollowers, getPlatformColor, messageDialogOpen, setMessageDialogOpen } =
    useCreatorSpendAnalysis();

  const { getPlatformIcon } = useGetplatform();

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100 pb-20">
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
            <span className="px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 text-sm font-medium">
              {creators.length} Results
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {/* Main Creator Grid - 3 columns on large screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 mb-8">
          {creators.map((creator) => (
            <div
              key={creator.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 overflow-hidden"
            >
              <div className="p-4">
                {/* Compact Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <img
                      src={avatar}
                      alt={creator.name}
                      className="w-20 h-20 rounded-xl object-cover border-2 border-gray-100"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base leading-tight">
                          {creator.name}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <span>{creator.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Compact Rating */}
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(creator.rating)
                                ? "text-yellow-400 fill-current"
                                : "text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{creator.rating}</span>
                      <span className="text-sm text-gray-400">({creator.reviewCount})</span>
                    </div>
                  </div>
                </div>

                {/* Compact Status */}
                <div className="mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-medium">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    Applied {creator.appliedDate}
                  </span>
                </div>

                {/* Compact Platform Stats */}
                <div className="space-y-2 mb-4">
                  {Object.entries(creator.platforms).map(([platform, data]) => (
                    <div
                      key={platform}
                      className="flex items-center justify-between px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`${getPlatformColor(platform)} rounded-md`}>
                          {getPlatformIcon(platform)}
                        </div>
                        <span className="text-xs font-medium text-gray-700 capitalize">
                          {platform}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-900 pr-1">
                        {formatFollowers(data.followers)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Compact Action Buttons */}
                <div className="flex gap-2">
                  <CustomButton text="Save" className="w-full btn-primary !h-7" />
                  <CustomButton
                    text="Message"
                    className="w-full btn-outline !h-7"
                    onClick={() => setMessageDialogOpen(true)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Divider */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-sm rounded-full font-medium text-gray-600 bg-gray-200 p-3">
            Recommended
          </span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Recommended Creators - Horizontal Cards */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Recommended Creators</h3>
            <p className="text-sm text-gray-600">Similar niches and high engagement rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
            {creators.map((creator) => (
              <div
                key={`rec-${creator.id}`}
                className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md hover:bg-gray-50 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Profile */}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative">
                          <img
                            src={avatar}
                            alt={creator.name}
                            className="w-20 h-20 rounded-xl object-cover border-2 border-gray-100"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                          <div className="absolute -top-1 -right-1 bg-primary text-white text-xs px-2 py-1 rounded-md font-medium">
                            Rec
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-gray-900 text-base leading-tight">
                                {creator.name}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                                <span>{creator.location}</span>
                              </div>
                            </div>
                          </div>

                          {/* Compact Rating */}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < Math.floor(creator.rating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {creator.rating}
                            </span>
                            <span className="text-sm text-gray-400">({creator.reviewCount})</span>
                          </div>
                        </div>
                      </div>

                      {/* Platform Stats Grid */}
                      <div className="space-y-2 mb-4">
                        {Object.entries(creator.platforms).map(([platform, data]) => (
                          <div
                            key={platform}
                            className="flex items-center justify-between px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`${getPlatformColor(platform)} rounded-md`}>
                                {getPlatformIcon(platform)}
                              </div>
                              <span className="text-xs font-medium text-gray-700 capitalize">
                                {platform}
                              </span>
                            </div>
                            <span className="text-xs font-bold text-gray-900 pr-1">
                              {formatFollowers(data.followers)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex">
                        <CustomButton text="Invite to apply" className="w-full btn-primary !h-7" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
