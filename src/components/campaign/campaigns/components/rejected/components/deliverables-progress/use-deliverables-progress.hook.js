import { useState, useCallback } from "react";

function useDeliverablesProgress({ onReinstateClick }) {
  // State
  const [showReinstateConfirmation, setShowReinstateConfirmation] = useState(false);

  const privateNotes = [
    {
      text: "Creator has good engagement but content quality needs improvement",
      timestamp: "2 hours ago",
    },
    {
      text: "Requested additional portfolio samples for review",
      timestamp: "1 day ago",
    },
    {
      text: "Initial assessment completed - not suitable for current campaign",
      timestamp: "3 days ago",
    },
  ];

  // Handlers
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
    privateNotes,
    showReinstateConfirmation,
    handleReinstateClick,
    handleConfirmReinstate,
    handleCancelReinstate,
  };
}

export default useDeliverablesProgress;
