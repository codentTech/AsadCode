import { useState } from "react";

function useCallToAction() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, closeModal };
}

export default useCallToAction;
