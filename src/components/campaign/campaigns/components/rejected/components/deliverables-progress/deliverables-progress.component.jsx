import CustomButton from "@/common/components/custom-button/custom-button.component";
import Loader from "@/common/components/loader/loader.component";
import ReadMore from "@/common/components/readmore/readmore.component";
import { avatar } from "@/common/constants/auth.constant";
import AudienceDemographics from "@/components/audience-demographics/audience-demographics";
import { Avatar } from "@mui/material";
import { MapPin, Star } from "lucide-react";
import ConfirmationDialog from "@/common/components/custom-dialog-confirmation/ConfirmationDialog";
import useDeliverablesProgress from "./use-deliverables-progress.hook";

const DeliverablesProgress = ({
  selectedCampaign,
  selectedCreator,
  onReinstateClick,
  onSaveToShortlistClick,
}) => {
  const {
    showReinstateConfirmation,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
  } = useDeliverablesProgress({ onReinstateClick });

  const getCreatorData = () => {
    if (!selectedCreator) return null;

    if (selectedCreator.creator) {
      const creator = selectedCreator.creator;
      const profile = creator.creator_profile;

      return {
        id: selectedCreator.id,
        name: `${creator.first_name} ${creator.last_name}`,
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: selectedCreator.applied_at
          ? new Date(selectedCreator.applied_at).toLocaleDateString()
          : selectedCreator.created_at
            ? new Date(selectedCreator.created_at).toLocaleDateString()
            : "N/A",
        rejectedDate: selectedCreator.rejected_at
          ? new Date(selectedCreator.rejected_at).toLocaleDateString()
          : selectedCreator.updated_at
            ? new Date(selectedCreator.updated_at).toLocaleDateString()
            : "N/A",
        pitch: selectedCreator.custom_message || selectedCreator.pitch || "No message",
        status: selectedCreator.status,
        profile: profile,
        bio: profile?.bio,
      };
    }

    if (selectedCreator.creator_id) {
      const creator = selectedCreator.creator;
      const profile = creator?.creator_profile;

      return {
        id: selectedCreator.id,
        name: `${creator?.first_name || ""} ${creator?.last_name || ""}`.trim() || "Unknown",
        image: profile?.profile_photo_url || avatar,
        location:
          `${creator?.city || ""} ${creator?.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile?.rating) || 0,
        appliedDate: selectedCreator.applied_at
          ? new Date(selectedCreator.applied_at).toLocaleDateString()
          : "N/A",
        rejectedDate: selectedCreator.rejected_at
          ? new Date(selectedCreator.rejected_at).toLocaleDateString()
          : "N/A",
        pitch: selectedCreator.pitch || "No message",
        status: selectedCreator.status,
        profile: profile,
        bio: profile?.bio,
      };
    }

    return selectedCreator;
  };

  const creatorData = getCreatorData();
  const isIndividual = !selectedCampaign;

  if (!creatorData) {
    return (
      <div className="w-[27%] bg-white flex flex-col border-l h-screen items-center justify-center">
        <Loader loading={true} />
      </div>
    );
  }

  return (
    <div className="w-[27%] bg-white flex flex-col border-l h-screen">
      <div className="flex flex-col items-center pt-3 pb-4 px-4 border-b sticky gap-2 top-0 bg-white z-10">
        <div className="relative">
          <Avatar
            src={creatorData?.image || avatar}
            alt={creatorData?.name || "Creator"}
            className="h-20 w-20 border-4 border-white shadow-md ring-2 ring-primary"
          >
            {creatorData.name?.charAt(0) || "C"}
          </Avatar>
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
        <p className="primary-text text-center">{creatorData.bio}</p>

        <div className="mt-2 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
          Application Rejected
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto p-4 gap-4">
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

        <div className="grid grid-cols-1 gap-2 w-full">
          <CustomButton
            text="Reinstate to Applications"
            className="btn-primary !py-1"
            onClick={handleReinstateClick}
          />
          <CustomButton
            text="Save to shortlists"
            className="btn-outline !py-1"
            onClick={onSaveToShortlistClick}
          />
        </div>
      </div>

      <ConfirmationDialog
        show={showReinstateConfirmation}
        onClose={handleCancelReinstate}
        onConfirm={handleConfirmReinstate}
        message="Reinstate Creator to Applications?"
        content={`Are you sure you want to reinstate ${creatorData.name} to the applications pool? This will move them from rejected status back to pending applications.`}
      />
    </div>
  );
};

export default DeliverablesProgress;
