import { useEffect, useRef } from "react";
import useMessageThread from "../../../../message-thread-modal/use-message-thread.hook";

function useApplicationMessageThread(brandId, application, onClose) {
  const messageThreadHook = useMessageThread(brandId);
  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (brandId && messageThreadHook.openMessageModal && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      messageThreadHook.openMessageModal();
    }
  }, [brandId]);

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

