import { avatar } from "@/common/constants/auth.constant";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

/**
 * Transform individual collaborations to creator format
 */
export function transformIndividualCollaborations(individualCollaborations) {
  return individualCollaborations.map((invitation) => ({
    ...invitation,
    creator: invitation.creator,
    campaign_id: invitation.campaign_id || invitation.campaign?.id || null,
    campaign: invitation.campaign,
    applied_at: invitation.created_at,
    status: invitation.status || "PENDING",
  }));
}

/**
 * Get creators to display based on campaign type
 */
export function getDisplayCreators(
  selectedCampaign,
  creators,
  individualCreators
) {
  return selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR
    ? individualCreators
    : creators;
}

/**
 * Get creator info for message thread
 */
export function getCreatorInfo(selectedCreator) {
  return {
    id: selectedCreator?.creator?.id || selectedCreator?.id,
    name: selectedCreator?.creator
      ? `${selectedCreator.creator.first_name || ""} ${selectedCreator.creator.last_name || ""}`.trim()
      : selectedCreator?.name || "",
    avatar:
      selectedCreator?.creator?.creator_profile?.profile_photo_url ||
      selectedCreator?.profileImage ||
      avatar,
    isOnline: true,
  };
}

/**
 * Get campaign ID from various sources
 */
export function getCampaignId(selectedCampaign, selectedCreator) {
  if (selectedCampaign?.id) {
    return selectedCampaign.id;
  }
  if (selectedCreator?.campaign_id) {
    return selectedCreator.campaign_id;
  }
  if (selectedCreator?.campaign?.id) {
    return selectedCreator.campaign.id;
  }
  return null;
}

/**
 * Get creator ID from selected creator
 */
export function getCreatorId(selectedCreator) {
  return selectedCreator?.creator?.id || selectedCreator?.id || null;
}

/**
 * Compute right pane state for the applications view
 */
export function computeRightPaneState(
  selectedCampaign,
  selectedCreator,
  appliedCreatorsLoading,
  individualCollaborationsLoading
) {
  const isIndividualCreator =
    selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
    (!selectedCampaign && selectedCreator?.campaign_id);

  if (!selectedCampaign && !selectedCreator?.campaign_id) {
    return {
      type: "empty",
      title: "Select a Campaign",
      description: "Choose a campaign to view applications.",
    };
  }

  if (appliedCreatorsLoading || individualCollaborationsLoading) {
    return {
      type: "loading",
    };
  }

  if (!selectedCreator) {
    return {
      type: "notFound",
      title: "No Creator Selected",
      description: "Select a creator to view details.",
    };
  }

  return { type: "content", isIndividualCreator };
}

/**
 * Check if should auto-select first creator
 */
export function shouldAutoSelectCreator(
  selectedCampaign,
  selectedCreator,
  autoSelectedForCampaignRef,
  creators
) {
  return (
    selectedCampaign?.id &&
    !selectedCreator &&
    autoSelectedForCampaignRef.current !== selectedCampaign.id &&
    creators.length > 0
  );
}
