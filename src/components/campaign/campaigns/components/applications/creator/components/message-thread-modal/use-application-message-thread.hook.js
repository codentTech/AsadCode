import { useEffect, useRef } from "react";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

function useApplicationMessageThread(brandId, application, onClose) {
  const campaignId = application?.campaign?.id || application?.campaign_id || application?.campaignId;
  if (!campaignId) {
    throw new Error("Campaign ID is required for conversations");
  }

  const isActuallyInvitation = application?.isInvitation && 
    (application?.collaboration_type === "INDIVIDUAL_CREATOR" || 
     application?.campaign?.collaboration_type === "INDIVIDUAL_CREATOR");

  const applicationPitch = isActuallyInvitation
    ? null
    : application?.pitch?.trim() || null;

  const messageThreadHook = useMessageThread(brandId, campaignId, null, applicationPitch);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (brandId && messageThreadHook.openMessageModal && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      messageThreadHook.openMessageModal();
    }
  }, [brandId, messageThreadHook.openMessageModal]);

  const handleClose = () => {
    messageThreadHook.closeMessageModal();
    onClose();
  };

  const brandData = application?.brand || application?.campaign?.created_by;
  const brand = {
    id: brandId,
    name:
      brandData?.first_name && brandData?.last_name
        ? `${brandData.first_name} ${brandData.last_name}`
        : brandData?.first_name || "Brand",
    avatar:
      brandData?.brand_profile?.logo ||
      brandData?.brand_profile?.brand_logo_url ||
      brandData?.profile_photo_url ||
      null,
  };

  return {
    ...messageThreadHook,
    handleClose,
    brand,
  };
}

export default useApplicationMessageThread;

