import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";
import useBrandApplicationsDeliverablesProgress from "@/components/campaign-refactored/brand-campaign/applications/components/deliverables-progress/use-deliverables-progress.hook";

function useDeliverablesProgress({
  onReinstateCreator,
  selectedCampaign,
  selectedCreator,
  isIndividualCreator,
  reinstateConfirmLoading,
}) {
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);
  const awaitingReinstateConfirmRef = useRef(false);

  const { isSuccess: reinstateCreatorSuccess, isError: reinstateCreatorError } = useSelector(
    (state) => state.campaigns.reinstateCreator || {}
  );
  const { isSuccess: reinstateInvitationSuccess, isError: reinstateInvitationError } = useSelector(
    (state) => state.invitation.reinstateInvitation || {}
  );

  const metrics = useBrandApplicationsDeliverablesProgress(
    selectedCreator,
    isIndividualCreator
  );

  useEffect(() => {
    if (!awaitingReinstateConfirmRef.current) return;
    if (reinstateCreatorSuccess || reinstateInvitationSuccess) {
      awaitingReinstateConfirmRef.current = false;
      setShowReinstateConfirmation(false);
    }
    if (reinstateCreatorError || reinstateInvitationError) {
      awaitingReinstateConfirmRef.current = false;
    }
  }, [
    reinstateCreatorSuccess,
    reinstateInvitationSuccess,
    reinstateCreatorError,
    reinstateInvitationError,
  ]);

  const handleReinstateClick = () => {
    setShowReinstateConfirmation(true);
  };

  const handleConfirmReinstate = () => {
    if (!onReinstateCreator || !selectedCreator) {
      setShowReinstateConfirmation(false);
      return;
    }

    const isMultiCreatorMode =
      selectedCampaign &&
      selectedCampaign.collaboration_type !== COLLABORATION_TYPE.INDIVIDUAL_CREATOR;

    if (isMultiCreatorMode && selectedCampaign.id) {
      const creatorUserId =
        selectedCreator.creator?.id ||
        selectedCreator.creator_id ||
        selectedCreator.originalData?.creator?.id;
      if (creatorUserId) {
        awaitingReinstateConfirmRef.current = true;
        onReinstateCreator(selectedCampaign.id, creatorUserId);
        return;
      }
    }

    const invitationId =
      selectedCreator.originalData?.id ||
      selectedCreator.id ||
      selectedCreator.invitation_id;
    if (invitationId) {
      awaitingReinstateConfirmRef.current = true;
      onReinstateCreator(null, null, invitationId);
      return;
    }

    setShowReinstateConfirmation(false);
  };

  const handleCancelReinstate = () => {
    awaitingReinstateConfirmRef.current = false;
    setShowReinstateConfirmation(false);
  };

  return {
    ...metrics,
    showReinstateConfirmation,
    reinstateConfirmLoading,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
  };
}

export default useDeliverablesProgress;
