import { useState, useMemo } from "react";
import { avatar } from "@/common/constants/auth.constant";
import { getAge } from "@/common/utils/date.utils";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

function useDeliverablesProgress({ onReinstateCreator, selectedCreator, isIndividualCreator }) {
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);

  const creatorData = useMemo(() => {
    if (!selectedCreator) {
      return null;
    }

    const originalData = selectedCreator.originalData || selectedCreator;
    const creator = originalData.creator || selectedCreator.creator || originalData;
    const profile = creator?.creator_profile || selectedCreator.creator_profile;

    if (!creator || (!creator.first_name && !creator.last_name && !creator.name)) {
      return null;
    }

    const appliedDate = originalData.applied_at || originalData.created_at || selectedCreator.applied_at || selectedCreator.created_at;
    const rejectedDate = originalData.rejected_at || originalData.updated_at || selectedCreator.rejected_at || selectedCreator.updated_at;

    return {
      id: originalData.id || selectedCreator.id || creator.id,
      name:
        creator.first_name && creator.last_name
          ? `${creator.first_name} ${creator.last_name}`.trim()
          : creator.name || selectedCreator.name || "Unknown",
      image: profile?.profile_photo_url || selectedCreator.profileImage || avatar,
      location:
        `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
      rating: parseFloat(profile?.rating) || selectedCreator.rating || 0,
      appliedDate: appliedDate ? new Date(appliedDate).toLocaleDateString() : "N/A",
      rejectedDate: rejectedDate ? new Date(rejectedDate).toLocaleDateString() : "N/A",
      pitch: originalData.custom_message || originalData.pitch || selectedCreator.custom_message || selectedCreator.pitch || selectedCreator.tagline || "No message",
      status: originalData.status || selectedCreator.status || "REJECTED",
      profile: profile,
      bio: profile?.bio || selectedCreator.bio || "",
      age: getAge(creator.date_of_birth) || selectedCreator.age || "N/A",
      reviewCount: profile?.review_count || selectedCreator.reviewCount || 0,
    };
  }, [selectedCreator]);

  const handleReinstateClick = () => {
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    setShowReinstateConfirmation(false);

    if (!onReinstateCreator || !selectedCreator) {
      return;
    }

    if (isIndividualCreator) {
      const invitationId =
        selectedCreator.originalData?.id ||
        selectedCreator.id ||
        selectedCreator.invitation_id;
      if (invitationId) {
        onReinstateCreator(null, null, invitationId);
        return;
      }
    } else {
      const campaignId =
        selectedCreator.campaign_id ||
        selectedCreator.campaign?.id ||
        selectedCreator.originalData?.campaign_id;
      const creatorId =
        selectedCreator.creator?.id ||
        selectedCreator.creator_id ||
        selectedCreator.originalData?.creator?.id;
      if (campaignId && creatorId) {
        onReinstateCreator(campaignId, creatorId);
        return;
      }
    }
  };

  const handleCancelReinstate = () => {
    setShowReinstateConfirmation(false);
  };

  return {
    showReinstateConfirmation,
    creatorData,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
  };
}

export default useDeliverablesProgress;
