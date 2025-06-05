import { useState } from "react";

const useDeliverablesProgress = () => {
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);

  return {
    messageDialogOpen,
    setMessageDialogOpen,
  };
};

export default useDeliverablesProgress;
