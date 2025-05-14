import React, { useState } from "react";

function useHero() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return { isOpen, setIsOpen, closeModal };
}

export default useHero;
