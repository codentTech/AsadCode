import { X, Hash } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useQuantityDeliverableInput from "./use-quantity-deliverable-input.hook";

function QuantityDeliverableInput({ deliverables = [], onDeliverablesChange, error = null }) {
  const {
    quantity,
    deliverableText,
    handleQuantityChange,
    handleTextChange,
    handleAddDeliverable,
    handleRemoveDeliverable,
    handleKeyPress,
  } = useQuantityDeliverableInput({ deliverables, onDeliverablesChange });

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <div className="flex gap-3">
          <div className="w-24">
            <CustomInput
              name="quantity"
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              placeholder="1"
              startIcon={<Hash className="w-4 h-4 text-gray-400" />}
              className="w-full"
              label="Quantity"
            />
          </div>

          <div className="flex-1">
            <CustomInput
              name="deliverableText"
              type="text"
              value={deliverableText}
              onChange={handleTextChange}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Instagram Reel, Story Post, Feed Post"
              className="w-full"
              label="Deliverable"
            />
          </div>
        </div>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>
          • Enter quantity and deliverable type (e.g., "Instagram Reel", "Story Post") and hit enter
          to add
        </p>
        <p>• Add multiple deliverables with different quantities</p>
      </div>

      {deliverables.length > 0 && (
        <div className="space-y-1">
          <h5 className="text-xs font-semibold text-gray-600">Selected:</h5>
          <div className="flex flex-wrap gap-1">
            {deliverables.map((deliverable, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 px-2 bg-gray-100 text-gray-600 text-xs rounded-lg border border-primary"
              >
                {typeof deliverable === "string"
                  ? deliverable
                  : deliverable.deliverable || `${deliverable.quantity} ${deliverable.text}`}
                <CustomButton
                  text=""
                  onClick={() => handleRemoveDeliverable(index)}
                  className="hover:bg-white hover:bg-opacity-20 rounded-lg p-0.5 transition-colors bg-transparent shadow-none min-w-0"
                  startIcon={<X className="text-black w-3 h-3 ml-4" />}
                />
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default QuantityDeliverableInput;
