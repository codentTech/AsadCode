import CustomButton from "@/common/components/custom-button/custom-button.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { CheckCircle2, MapPin, Star } from "lucide-react";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({ selectedCampaign, selectedCreator }) => {
  const { privateNotes } = useDeliverablesProgress();

  // If no creator is selected, show empty state
  if (!selectedCreator) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            </div>
            <h3 className="text-base font-medium text-gray-800 mb-2">Select a Creator</h3>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">
              Choose a creator from the list to view their details and actions
            </p>
          </div>
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
            src={selectedCreator.creator?.profile_photo_url || avatar}
            alt={selectedCreator.creator?.first_name || "Creator"}
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            {selectedCreator.creator?.first_name?.[0] || "C"}
          </Avatar>
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 bg-red-500 rounded-full ring-2 ring-white"></span>
        </div>
        <h3>
          {selectedCreator.creator?.first_name} {selectedCreator.creator?.last_name}
        </h3>

        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(selectedCreator.creator_profile?.rating || 0)
                  ? "text-yellow-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>
            {selectedCreator.creator?.city || "Unknown"},{" "}
            {selectedCreator.creator?.country || "Unknown"}
          </span>
        </div>
        <p className="primary-text text-center">
          {selectedCreator.creator_profile?.bio || "Creator profile"}
        </p>
        <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Application Rejected
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Header - Quick Actions */}

        <div className="bg-white rounded-lg">
          <h4 className="text-lg font-semibold text-gray-900 pb-2">Application Message</h4>
          <div className="bg-gray-100 p-3 rounded-lg">
            <ReadMore text={selectedCreator.pitch || "No application message provided."} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
          <AudienceDemographics className="flex flex-col" />
        </div>

        {/* Private Notes Section */}
        <div className="bg-white rounded-lg m-4 p-4 shadow mt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Private Notes</h4>
          <ul className="space-y-3 text-sm text-gray-700 mb-4">
            {privateNotes.map((note, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-gray-500 mt-1">📝</span>
                <div className="flex flex-col">
                  <span>{note.text}</span>
                  <span className="text-xs text-gray-400 mt-1">{note.timestamp}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col justify-between mt-3 m-4 gap-3">
          <CustomButton text="Reinstate to Applications" className="btn-primary" />
          <CustomButton text="Move to saved shortlists" className="btn-outline" />
        </div>
      </div>
    </div>
  );
};

export default DeliverablesProgress;
