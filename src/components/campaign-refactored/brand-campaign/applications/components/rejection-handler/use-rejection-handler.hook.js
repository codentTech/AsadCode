import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  rejectCreator,
  rejectInvitation,
} from "@/provider/features/campaigns/campaigns.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

export default function useRejectionHandler({
  selectedCreator,
  selectedCampaign,
  onRejectSuccess,
}) {
  const dispatch = useDispatch();
  const [isRejecting, setIsRejecting] = useState(false);

  const handleConfirmReject = useCallback(async () => {
    if (!selectedCreator) return;

    setIsRejecting(true);

    try {
      const isIndividual =
        selectedCampaign?.collaboration_type === COLLABORATION_TYPE.INDIVIDUAL_CREATOR ||
        (!selectedCampaign && selectedCreator?.campaign_id);

      if (isIndividual) {
        // Reject invitation for individual collaboration
        await dispatch(
          rejectInvitation({
            invitationId: selectedCreator.id,
          })
        ).unwrap();
      } else {
        // Reject application for campaign collaboration
        await dispatch(
          rejectCreator({
            campaignId: selectedCampaign.id,
            creatorId: selectedCreator.creator?.id || selectedCreator.id,
          })
        ).unwrap();
      }

      // Notify parent of success
      if (onRejectSuccess) {
        onRejectSuccess(isIndividual);
      }
    } catch (error) {
      console.error("Error rejecting:", error);
    } finally {
      setIsRejecting(false);
    }
  }, [selectedCreator, selectedCampaign, dispatch, onRejectSuccess]);

  return {
    handleConfirmReject,
    isRejecting,
  };
}
