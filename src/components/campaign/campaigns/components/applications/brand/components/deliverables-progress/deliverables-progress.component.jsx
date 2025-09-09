import ReadMore from "@/common/components/readmore/readmore.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import CampaignHistory from "../campaign-history/campaign-history.component";

const DeliverablesProgress = ({ isCompleted = false, selectedCampaign, selectedCreator }) => {
  // Extract creator data from the selectedCreator object
  const getCreatorData = () => {
    if (!selectedCreator) return null;

    console.log(selectedCreator);

    // If it's the original API data structure
    if (selectedCreator.creator) {
      const creator = selectedCreator.creator;
      const profile = creator.creator_profile;

      return {
        id: selectedCreator.id,
        name: `${creator.first_name} ${creator.last_name}`,
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: 4.5, // Mock rating
        appliedDate: new Date(selectedCreator.applied_at).toLocaleDateString(),
        pitch: selectedCreator.pitch,
        status: selectedCreator.status,
        profile: profile,
      };
    }

    // If it's already transformed data
    return selectedCreator;
  };

  const creatorData = getCreatorData();
  // Show message if no campaign or creator is selected
  if (!selectedCampaign) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
          <h3 className="text-base font-medium text-gray-800 mb-2">Select Campaign</h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Choose a campaign to view creator details and progress
          </p>
        </div>
      </div>
    );
  }

  if (!creatorData) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
          </div>
          <h3 className="text-base font-medium text-gray-800 mb-2">Select Creator</h3>
          <p className="text-sm text-gray-600 max-w-xs mx-auto">
            Click on a creator card to view their profile and take action
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      {/* Sticky Profile Section */}
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-2 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={creatorData.image || avatar}
            alt={creatorData.name}
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            {creatorData.name?.charAt(0) || "C"}
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-green-500 rounded-full ring-2 ring-white"></span>
          {isCompleted && (
            <span className="absolute -top-1 -right-1 h-6 w-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </span>
          )}
        </div>
        <h3>{creatorData.name}</h3>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(creatorData.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{creatorData.location}</span>
        </div>
        <p className="primary-text text-center">Applied on {creatorData.appliedDate}</p>
        {isCompleted && (
          <div className="mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            Campaign Completed
          </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col overflow-y-auto p-4 gap-4">
        <div className="bg-white rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 pb-2">Application Message</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <ReadMore text={creatorData.pitch || "No application message provided."} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
          <AudienceDemographics className="flex flex-col" />
        </div>

        <hr />

        <CampaignHistory />
      </div>
    </div>
  );
};

export default DeliverablesProgress;
