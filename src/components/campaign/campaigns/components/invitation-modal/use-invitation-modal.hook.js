import invitationService from "@/provider/features/invitation/invitation.service";
import { useState } from "react";

const useInvitationModal = () => {
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const handleSendInvitation = async (creator, onSuccess) => {
    if (!creator || !selectedCampaign) return;

    setIsSending(true);

    const invitationData = {
      creator_id: creator.id,
      campaign_id: selectedCampaign.id,
      custom_message: customMessage.trim() || null,
    };

    await invitationService.sendInvitation(invitationData);

    if (onSuccess) {
      onSuccess(creator, selectedCampaign);
    }

    resetForm();
    setIsSending(false);
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

  const handleSubmit = async (selectedCreator, onInviteSent, onClose) => {
    await handleSendInvitation(selectedCreator, (creator, campaign) => {
      if (onInviteSent) {
        onInviteSent(creator, campaign);
      }
      handleClose(onClose);
    });
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
