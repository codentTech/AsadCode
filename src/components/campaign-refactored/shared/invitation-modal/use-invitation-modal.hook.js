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

  const formatCompensation = (campaign) => {
    const type = campaign.compensation_type;

    if (type === COMPENSATION_TYPE.PAID) {
      if (campaign.creator_fixed_price)
        return `$${Number(campaign.creator_fixed_price).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      if (campaign.budget != null) {
        const remaining = Number(campaign.remaining_budget);
        const total = Number(campaign.budget);
        const value = Number.isFinite(remaining) && remaining >= 0 ? remaining : total;
        return `$${Number(value).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      }
      if (campaign.suggested_min != null && campaign.suggested_max != null) {
        return `$${Number(campaign.suggested_min).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })} - $${Number(campaign.suggested_max).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      }
      if (campaign.suggested_min != null)
        return `From $${Number(campaign.suggested_min).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
      if (campaign.suggested_max != null)
        return `Up to $${Number(campaign.suggested_max).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
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
      },
      collaborationType
    );
    // Close modal after successful invitation
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
