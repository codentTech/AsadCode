import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { MapPin, Star } from "lucide-react";
import CampaignHistory from "../campaign-history/campaign-history.component";
import { getAge } from "@/common/utils/date.utils";

const DeliverablesProgress = ({
  isCompleted = false,
  selectedCampaign,
  selectedCreator,
  onHireClick,
  onRejectClick,
  onMessageClick,
}) => {
  // Extract creator data from the selectedCreator object
  const getCreatorData = () => {
    if (!selectedCreator) return null;

    // If it's the original API data structure
    if (selectedCreator.creator) {
      const creator = selectedCreator?.creator;
      const profile = creator?.creator_profile;

      return {
        id: selectedCreator.id,
        name: `${creator.first_name} ${creator.last_name}`,
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: Number(profile?.rating), // Mock rating
        appliedDate: new Date(selectedCreator.applied_at).toLocaleDateString(),
        pitch: selectedCreator.pitch,
        status: selectedCreator.status,
        profile: profile,
        bio: profile?.bio,
        age: getAge(creator.date_of_birth),
        reviewCount: profile?.review_count,
      };
    }

    // If it's already transformed data
    return selectedCreator;
  };

  const creatorData = getCreatorData();
  // If no campaign selected, render nothing (campaign auto-selects in sidebar)
  if (!selectedCampaign) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
        <Loader loading={true} />
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
        <Loader loading={true} />
      </div>
    );
  }
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Sticky Profile Section */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-1 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={creatorData?.image || avatar}
            alt={creatorData?.image || avatar}
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            {creatorData.name?.charAt(0) || "C"}
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
        </div>
        <h3>
          {creatorData.name}
          <span className="text-lg text-gray-500 ml-1">({creatorData.rating})</span>
        </h3>
        <p className="flex items-center text-sm text-gray-500 -mt-1">
          {creatorData.age} • <span className="ml-1">{creatorData.location}</span>
        </p>

        <p className="text-sm text-gray-500 -mt-1">{creatorData?.bio}</p>

        {isCompleted && (
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Campaign Completed
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col overflow-y-auto p-4 gap-4">
        {/* Actions under profile */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <CustomButton text="Message" className="btn-primary !py-1" onClick={onMessageClick} />
          <CustomButton text="Hire" className="btn-outline !py-1" onClick={onHireClick} />
          <CustomButton text="Reject" className="btn-danger !py-1" onClick={onRejectClick} />
        </div>
        {/* Compact Performance Metrics */}
        <div className="bg-white rounded-lg border p-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Performance Metrics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="border rounded p-2">
              <p className="text-[11px] text-gray-500">Engagement Rate</p>
              <p className="text-sm font-semibold text-gray-900">
                {creatorData?.profile?.engagement_rate ?? "N/A"}
              </p>
            </div>
            <div className="border rounded p-2">
              <p className="text-[11px] text-gray-500">Average Reach</p>
              <p className="text-sm font-semibold text-gray-900">
                {creatorData?.profile?.average_reach ?? "N/A"}
              </p>
            </div>
            <div className="border rounded p-2">
              <p className="text-[11px] text-gray-500">Average Views</p>
              <p className="text-sm font-semibold text-gray-900">
                {creatorData?.profile?.average_views ?? "N/A"}
              </p>
            </div>
            <div className="border rounded p-2">
              <p className="text-[11px] text-gray-500">Posting Frequency</p>
              <p className="text-sm font-semibold text-gray-900">
                {creatorData?.profile?.posting_frequency ?? "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h3 className="text-sm font-bold text-gray-800 mb-2">Audience Demographics</h3>
          <AudienceDemographics className="flex flex-col" />
        </div>

        <div className="bg-white border rounded-lg p-3">
          <h4 className="text-sm font-bold text-gray-800 mb-2">Application Message</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <ReadMore text={creatorData.pitch || "No application message."} maxLength={100} />
          </div>
        </div>

        <CampaignHistory campaignId={selectedCampaign?.id} />
      </div>
    </div>
  );
};

export default DeliverablesProgress;
