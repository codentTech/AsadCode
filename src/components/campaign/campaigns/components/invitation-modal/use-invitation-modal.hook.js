import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendInvitation } from "@/provider/features/invitation/invitation.slice";
import { COLLABORATION_TYPE } from "@/common/constants/campaign.constant";

const useInvitationModal = () => {
  const dispatch = useDispatch();
  const {
    isLoading: isSending,
    isSuccess,
    isError,
  } = useSelector((state) => state.invitation?.sendInvitation || {});

  const [customMessage, setCustomMessage] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const formatCompensation = (campaign) => {
    const type = campaign.compensation_type;

    if (type === "PAID") {
      if (campaign.creator_fixed_price) return `$${campaign.creator_fixed_price}`;
      if (campaign.budget) return `$${campaign.budget}`;
      if (campaign.suggested_min && campaign.suggested_max) {
        return `$${campaign.suggested_min} - $${campaign.suggested_max}`;
      }
      if (campaign.suggested_min) return `From $${campaign.suggested_min}`;
      if (campaign.suggested_max) return `Up to $${campaign.suggested_max}`;
    } else if (type === "GIFTED_PRODUCT") {
      if (campaign.product_value) return `Product ($${campaign.product_value} value)`;
      return "Gifted Product";
    } else if (type === "COMMISSION") {
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

    // Validate based on collaboration type
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
        handleClose(onClose);
      },
      collaborationType
    );
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
