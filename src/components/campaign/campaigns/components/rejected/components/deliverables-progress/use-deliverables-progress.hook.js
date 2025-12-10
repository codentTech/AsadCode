import { useState, useCallback } from "react";

function useDeliverablesProgress({ onReinstateClick }) {
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);

  const handleReinstateClick = useCallback(() => {
    setShowReinstateConfirmation(true);
  }, []);

  const handleConfirmReinstate = useCallback(() => {
    if (onReinstateClick) {
      onReinstateClick();
    }
    setShowReinstateConfirmation(false);
  }, [onReinstateClick]);

  const handleCancelReinstate = useCallback(() => {
    setShowReinstateConfirmation(false);
  }, []);

  return {
    showReinstateConfirmation,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
  };
}

export default useDeliverablesProgress;
