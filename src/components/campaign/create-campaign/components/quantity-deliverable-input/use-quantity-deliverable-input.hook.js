import { useCallback, useState } from "react";

export default function useQuantityDeliverableInput({ deliverables = [], onDeliverablesChange }) {
  const [quantity, setQuantity] = useState(1);
  const [deliverableText, setDeliverableText] = useState("");

  const handleAddDeliverable = useCallback(() => {
    if (!deliverableText.trim()) return;

    const newDeliverable = `${quantity} ${deliverableText.trim()}`;
    const newDeliverables = [...deliverables, newDeliverable];
    onDeliverablesChange(newDeliverables);

    setDeliverableText("");
    setQuantity(1);
  }, [quantity, deliverableText, deliverables, onDeliverablesChange]);

  const handleRemoveDeliverable = useCallback(
    (index) => {
      const newDeliverables = deliverables.filter((_, i) => i !== index);
      onDeliverablesChange(newDeliverables);
    },
    [deliverables, onDeliverablesChange]
  );

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleAddDeliverable();
      }
    },
    [handleAddDeliverable]
  );

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setQuantity(Math.max(1, value));
  }, []);

  const handleTextChange = useCallback((e) => {
    setDeliverableText(e.target.value);
  }, []);

  return {
    quantity,
    deliverableText,
    handleQuantityChange,
    handleTextChange,
    handleAddDeliverable,
    handleRemoveDeliverable,
    handleKeyPress,
  };
}

