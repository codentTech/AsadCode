import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendInvitation } from "@/provider/features/invitation/invitation.slice";
import { COLLABORATION_TYPE, COMPENSATION_TYPE } from "@/common/constants/campaign.constant";

const useInvitationModal = () => {
  const dispatch = useDispatch();
  const {
    isLoading: isSending,
    isSuccess,
    isError,
  } = useSelector((state) => state.invitation?.sendInvitation || {});

  const [customMessage, setCustomMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const calculateRemainingBudget = (campaign) => {
    if (!campaign || campaign.compensation_type !== COMPENSATION_TYPE.PAID) {
      return null;
    }

    const totalBudget = campaign.budget || 0;
    if (totalBudget === 0) return null;

    const creators = campaign.creators || [];
    const spent = creators.reduce((sum, creatorEntry) => {
      let contract = creatorEntry.contract || null;

      if (!contract && creatorEntry.creator) {
        const creatorContracts = creatorEntry.creator.creatorContracts || [];
        contract = creatorContracts.find(
          (c) =>
            (c.campaign?.id === campaign.id) ||
            (c.campaign_id === campaign.id) ||
            (c.campaign === campaign.id)
        );
      }

      const compensation = contract?.total_compensation || contract?.totalCompensation || 0;
      return sum + (compensation || 0);
    }, 0);

    return Math.max(0, totalBudget - spent);
  };

  const formatCompensation = (campaign) => {
    const type = campaign.compensation_type;

    if (type === COMPENSATION_TYPE.PAID) {
      const remainingBudget = calculateRemainingBudget(campaign);
      if (remainingBudget !== null) {
        return remainingBudget.toFixed(2);
      }

      if (campaign.creator_fixed_price) return campaign.creator_fixed_price.toFixed(2);
      if (campaign.budget) return campaign.budget.toFixed(2);
      if (campaign.suggested_min && campaign.suggested_max) {
        return `${campaign.suggested_min} - ${campaign.suggested_max}`;
      }
      if (campaign.suggested_min) return `From ${campaign.suggested_min}`;
      if (campaign.suggested_max) return `Up to ${campaign.suggested_max}`;
    } else if (type === COMPENSATION_TYPE.GIFTED_PRODUCT) {
      if (campaign.product_value) return `Product ($${campaign.product_value} value)`;
      return "Gifted Product";
    } else if (type === COMPENSATION_TYPE.COMMISSION) {
      if (campaign.commission_percentage) return `${campaign.commission_percentage}% Commission`;
      return "Commission Based";
    }

    return "Compensation TBD";
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
  };

  const handleSendInvitation = async (creator, onSuccess, collaborationType) => {
    if (!creator) return;

    if (collaborationType === COLLABORATION_TYPE.MULTI_CREATOR && !selectedCampaign) {
      return;
    }
    if (collaborationType === COLLABORATION_TYPE.INDIVIDUAL_CREATOR && !customMessage.trim()) {
      return;
    }

    const invitationData = {
      creator_id: creator.id,
      collaboration_type: collaborationType,
      campaign_id:
        collaborationType === COLLABORATION_TYPE.MULTI_CREATOR ? selectedCampaign.id : null,
      custom_message: customMessage.trim() || null,
    };

    const result = await dispatch(sendInvitation(invitationData)).unwrap();

    if (result?.success && onSuccess) {
      onSuccess(creator, selectedCampaign);
      resetForm();
    }
  };

  const resetForm = () => {
    setCustomMessage("");
    setSelectedCampaign(null);
  };

  const handleClose = (onClose) => {
    if (!isSending) {
      resetForm();
      onClose();
    }
  };

  const handleSubmit = async (selectedCreator, onInviteSent, onClose, collaborationType) => {
    await handleSendInvitation(
      selectedCreator,
      (creator, campaign) => {
        if (onInviteSent) {
          onInviteSent(creator, campaign);
        }
      },
      collaborationType
    );

    if (onClose) {
      onClose();
    }
  };

  return {
    customMessage,
    setCustomMessage,
    isSending,
    selectedCampaign,
    setSelectedCampaign,
    handleCampaignSelect,
    handleSendInvitation,
    resetForm,
    handleClose,
    handleSubmit,
    formatCompensation,
  };
};

export default useInvitationModal;
