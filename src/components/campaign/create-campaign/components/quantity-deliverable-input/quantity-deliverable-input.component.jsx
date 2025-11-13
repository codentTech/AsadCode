import React, { useState } from "react";
import { Plus, X, Hash } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AddCircle } from "@mui/icons-material";

/**
 * Quantity-Based Deliverable Input Component
 *
 * Allows brands to specify deliverables with quantities.
 * Format: "Quantity (3) Deliverable 'Instagram Reel'"
 */
function QuantityDeliverableInput({ deliverables = [], onDeliverablesChange, error = null }) {
  const [quantity, setQuantity] = useState(1);
  const [deliverableText, setDeliverableText] = useState("");

  // Handle adding deliverable
  const handleAddDeliverable = () => {
    if (deliverableText.trim() === "") return;

    const newDeliverable = {
      quantity: quantity,
      text: deliverableText.trim(),
      deliverable: `${quantity} ${deliverableText.trim()}`,
    };

    const newDeliverables = [...deliverables, newDeliverable];
    onDeliverablesChange(newDeliverables);

    // Reset form
    setDeliverableText("");
    setQuantity(1);
  };

  // Handle removing deliverable
  const handleRemoveDeliverable = (index) => {
    const newDeliverables = deliverables.filter((_, i) => i !== index);
    onDeliverablesChange(newDeliverables);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDeliverable();
    }
  };

  return (
    <div className="space-y-3">
      {/* Input Form */}
      <div className="space-y-2">
        <div className="flex gap-3">
          {/* Quantity Input */}
          <div className="w-24">
            <CustomInput
              name="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)) || 0)}
              placeholder="1"
              startIcon={<Hash className="w-4 h-4 text-gray-400" />}
              className="w-full"
              label="Quantity"
            />
          </div>

          {/* Deliverable Text Input */}
          <div className="flex-1">
            <CustomInput
              name="deliverableText"
              type="text"
              value={deliverableText}
              onChange={(e) => setDeliverableText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Instagram Reel, Story Post, Feed Post"
              className="w-full"
              label="Deliverable"
            />
          </div>

          {/* Add Button */}
          {/* <div className="flex items-end">
            <button
              className="bg-gray-200 p-2 rounded-full"
              disabled={deliverableText.trim() === ""}
              onClick={handleAddDeliverable}
            >
              <AddCircle className="text-primary" />
            </button>
          </div> */}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          • Enter quantity and deliverable type (e.g., "Instagram Reel", "Story Post") and hit enter
          to add
        </p>
        <p>• Add multiple deliverables with different quantities</p>
      </div>

      {/* Selected Deliverables */}
      {deliverables.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
          <div className="space-x-1">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-1 px-2 bg-gray-100 text-black text-xs rounded-lg border border-primary"
              >
                <div className="flex items-center gap-2">
                  <span className="px-2 py-[4px] text-center border bg-primary text-white text-xs rounded-lg font-medium">
                    {deliverable.quantity}
                  </span>
                  <span className="text-xs text-gray-600">{deliverable.text}</span>
                </div>
                <CustomButton
                  text=""
                  onClick={() => handleRemoveDeliverable(index)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                  startIcon={<X className="text-black w-3 h-3 ml-4" />}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuantityDeliverableInput;
