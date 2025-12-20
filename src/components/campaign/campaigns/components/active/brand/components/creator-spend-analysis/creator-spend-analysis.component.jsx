import CustomButton from "@/common/components/custom-button/custom-button.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select";
import NotFound from "@/common/components/not-found/not-found.component";
import Loading from "@/common/components/loadar/loading.component";
import { avatar, sortOptions } from "@/common/constants/auth.constant";
import { CAMPAIGN_TYPE } from "@/common/constants/campaign.constant";
import useGetplatform from "@/common/hooks/use-social-platform.hook";
import { MapPin, Star } from "lucide-react";
import React from "react";
import CalendarModal from "../../../calendar-modal/calendar-modal.component";
import TaskManagerModal from "./components/task-manager/task-manager.component";
import { useCreatorSpendAnalysis } from "./use-creator-spend-analysis.hook";

const CreatorSpendAnalysis = ({
  selectedCampaign,
  selectedCreator,
  onCreatorSelect,
  onClearCreator,
  onSortChange,
  currentSort = "newest",
  isMultiCreator = true,
  isCompleted = false,
}) => {
  const {
    creators,
    creatorsLoading,
    creatorsSuccess,
    creatorsError,
    getSuccessRateColor,
    showBrandCalendar,
    setShowBrandCalendar,
    showTaskManager,
    setShowTaskManager,
  } = useCreatorSpendAnalysis(selectedCampaign, isCompleted, isMultiCreator, onClearCreator);

  const { getPlatformIcon, formatFollowers, getPlatformColor } = useGetplatform();
  const autoSelectedRef = React.useRef(null);

  const handleSortChange = (option) => {
    if (onSortChange && option?.value) {
      onSortChange(option.value);
    }
  };

  React.useEffect(() => {
    const campaignKey = selectedCampaign?.id || "none";
    if (
      creatorsSuccess &&
      creators.length > 0 &&
      !selectedCreator &&
      selectedCampaign &&
      autoSelectedRef.current !== campaignKey
    ) {
      autoSelectedRef.current = campaignKey;
      if (onCreatorSelect) {
        const firstCreator = creators[0];
        onCreatorSelect(firstCreator);
      }
    }

    if (!selectedCampaign) {
      autoSelectedRef.current = null;
    }
  }, [creatorsSuccess, creators, selectedCreator, selectedCampaign, onCreatorSelect]);

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Creator Analysis</h1>
              <p className="text-xs text-gray-500">
                Track creator progress, deadlines and deliverables.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center gap-4">
            <div className="flex-1 max-w-sm">
              {isMultiCreator && (
                <SimpleSelect
                  placeHolder="Select an option"
                  options={sortOptions}
                  value={
                    currentSort
                      ? {
                          value: currentSort,
                          label: sortOptions.find((opt) => opt.value === currentSort)?.label,
                        }
                      : null
                  }
                  onChange={handleSortChange}
                  className="w-full max-w-[400px]"
                />
              )}
            </div>
            <div className="flex gap-3">
              <CustomButton
                text="Calendar"
                className="btn-primary"
                onClick={() => setShowBrandCalendar(true)}
              />
              <CustomButton
                text="Task Manager"
                className="btn-outline"
                onClick={() => setShowTaskManager(true)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-5xl mx-auto space-y-4">
          {!selectedCampaign && !creatorsLoading && !isMultiCreator && creators.length === 0 && (
            <div className="py-16">
              <NotFound
                title="No Individual Collaborations"
                description="You don't have any active individual collaborations at the moment."
              />
            </div>
          )}
          {!selectedCampaign && !creatorsLoading && isMultiCreator && (
            <div className="py-16">
              <NotFound
                title="No Active Campaign Selected"
                description="Select an active campaign from the left panel to view and manage creators."
              />
            </div>
          )}

          {creatorsLoading && <Loading />}

          {creatorsError && (
            <div className="py-16">
              <NotFound
                title="Error Loading Creators"
                description="There was an error loading the creators for this campaign. Please try again."
              />
            </div>
          )}

          {creatorsSuccess && creators.length === 0 && selectedCampaign && (
            <div className="py-16">
              <NotFound
                title="No Creators Found"
                description="Try adjusting filters or selecting a different campaign."
              />
            </div>
          )}

          {creatorsSuccess &&
          creators.length > 0 &&
          (selectedCampaign || (!isMultiCreator && creators.length > 0))
            ? creators.map((creator) => {
                const isSelected = selectedCreator?.id === creator.id;

                return (
                  <div
                    key={creator.id}
                    onClick={() => onCreatorSelect(creator)}
                    className={`p-4 rounded-lg bg-white shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border cursor-pointer ${
                      isSelected
                        ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                        : "border-gray-100 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img
                          src={creator.image || avatar}
                          alt={creator.name}
                          className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 ring-2 ring-primary"
                          onError={(e) => {
                            e.target.src = avatar;
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="w-full">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center space-x-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  {creator.name}
                                </h3>
                              </div>
                              {creator?.campaign?.campaign_type === CAMPAIGN_TYPE.SPONSORED_POST ||
                              creator?.campaign?.campaign_type === CAMPAIGN_TYPE.UGC ? (
                                <div className="text-sm text-gray-900 bg-gray-100 rounded-lg p-2">
                                  Creator Fee:
                                  <span className="font-bold text-primary">
                                    {" "}
                                    ${creator?.campaign?.creator_fee}
                                  </span>
                                </div>
                              ) : null}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1 text-xs">
                                <MapPin className="w-4 h-4" />
                                <span>{creator.location}</span>
                              </div>
                              <span className="text-xs text-gray-600">(27 Years Old)</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mb-3">
                          <div className="flex text-xs items-center">
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
                          <span className="text-xs text-gray-600">{creator.rating}</span>
                          <span className="text-xs text-gray-600">
                            ({creator.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-xs">
                          <div
                            className={`px-2 py-1 rounded-full ${getSuccessRateColor(
                              creator.successRate
                            )}`}
                          >
                            {`${creator.successRate || 0}% Success Rate`}
                          </div>
                          <div className="bg-gray-100 rounded-lg px-2 py-1 text-gray-600">
                            <span className="font-bold">Total Views:</span>{" "}
                            {formatFollowers(
                              Object.values(creator.platforms).reduce(
                                (sum, p) => sum + p.followers,
                                0
                              )
                            )}
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                          {Object.entries(creator.platforms).map(([platform, data]) => (
                            <div
                              key={platform}
                              className="flex items-center justify-between bg-gray-100 rounded-lg px-1 pr-3 hover:bg-gray-100/80 transition-colors duration-200"
                            >
                              <div className="flex items-center space-x-2">
                                <span className={`${getPlatformColor(platform)} p-1 rounded-md`}>
                                  {getPlatformIcon(platform)}
                                </span>
                                <span className="text-xs capitalize font-semibold text-gray-700">
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
                );
              })
            : null}
        </div>
      </div>

      <CalendarModal
        show={showBrandCalendar}
        onClose={() => setShowBrandCalendar(false)}
        selectedCampaign={selectedCampaign}
      />
      <TaskManagerModal
        show={showTaskManager}
        onClose={() => setShowTaskManager(false)}
        selectedCampaign={selectedCampaign}
        isMultiCreator={isMultiCreator}
      />
    </div>
  );
};

export default CreatorSpendAnalysis;
