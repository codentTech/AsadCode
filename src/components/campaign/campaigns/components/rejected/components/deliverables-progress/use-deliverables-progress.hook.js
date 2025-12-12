import { useState, useMemo } from "react";
import { avatar } from "@/common/constants/auth.constant";

function useDeliverablesProgress({ onReinstateCreator, selectedCreator, selectedCampaign, isIndividualCreator }) {
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);

  const creatorData = useMemo(() => {
    if (!selectedCreator) {
      return null;
    }

    const creator = selectedCreator.creator;
    const profile = creator?.creator_profile;

    if (creator && profile) {
      return {
        id: selectedCreator.id,
        name: `${creator.first_name || ""} ${creator.last_name || ""}`.trim() || "Unknown",
        image: profile.profile_photo_url || avatar,
        location:
          `${creator.city || ""} ${creator.country || ""}`.trim() || "Location not specified",
        rating: parseFloat(profile.rating) || 0,
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
        bio: profile.bio,
      };
    }

    return null;
  }, [selectedCreator]);

  const handleReinstateClick = () => {
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    setShowReinstateConfirmation(false);

    if (!onReinstateCreator || !selectedCreator) {
      return;
    }

    const hasCampaignId = !!selectedCreator.campaign_id;
    const hasCreatorIdField = !!selectedCreator.creator_id;
    const isMultiCreatorStructure = hasCampaignId || hasCreatorIdField;
    
    const isMultiCreatorCampaign = selectedCampaign && selectedCampaign.collaboration_type !== "INDIVIDUAL_CREATOR";
    const isIndividualMode = isIndividualCreator || !selectedCampaign || selectedCampaign?.collaboration_type === "INDIVIDUAL_CREATOR";

    if (isMultiCreatorCampaign || isMultiCreatorStructure) {
      const creatorId = selectedCreator.creator?.id || selectedCreator.creator_id || selectedCreator.originalData?.creator?.id;
      if (selectedCampaign && creatorId) {
        onReinstateCreator(selectedCampaign.id, creatorId);
        return;
      }
    }
    
    if (isIndividualMode) {
      const invitationId = selectedCreator.originalData?.id || selectedCreator.id;
      if (invitationId) {
        onReinstateCreator(null, null, invitationId);
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
