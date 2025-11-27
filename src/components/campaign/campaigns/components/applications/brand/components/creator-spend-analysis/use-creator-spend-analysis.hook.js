import { useState } from "react";

function useCreatorSpendAnalysis() {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
  };

  return {
    open,
    handleOpenModal,
    handleCloseModal,
  };
}

export default useCreatorSpendAnalysis;
