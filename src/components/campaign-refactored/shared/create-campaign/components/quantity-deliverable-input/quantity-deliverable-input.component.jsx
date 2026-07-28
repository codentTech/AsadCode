import { Hash, Plus } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import SelectedTagList from "../selected-tag-list/selected-tag-list.component";
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

  const selectedItems = deliverables.map((deliverable, index) => ({
    id: `${index}-${typeof deliverable === "string" ? deliverable : deliverable.deliverable || deliverable.text}`,
    label:
      typeof deliverable === "string"
        ? deliverable
        : deliverable.deliverable || `${deliverable.quantity} ${deliverable.text}`,
    index,
  }));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="w-full sm:w-20 sm:shrink-0">
          <CustomInput
            name="quantity"
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="1"
            startIcon={<Hash className="h-4 w-4 text-gray-400" />}
            className="w-full"
            label="Qty"
          />
        </div>

        <div className="min-w-0 flex-1">
          <CustomInput
            name="deliverableText"
            type="text"
            value={deliverableText}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder="e.g., Instagram Reel, Story Post"
            className="w-full"
            label="Deliverable"
          />
        </div>

        <CustomButton
          text="Add"
          onClick={handleAddDeliverable}
          className="btn-outline !min-w-0 shrink-0 sm:mb-0.5"
          startIcon={<Plus className="h-3.5 w-3.5" />}
        />
      </div>

      <p className="text-[10px] leading-snug text-gray-500 sm:text-xs">
        Press Enter or Add to include multiple deliverables with quantities.
      </p>

      {error ? <p className="text-[10px] text-gray-700 sm:text-xs">{error}</p> : null}

      <SelectedTagList
        items={selectedItems}
        onRemove={(item) => handleRemoveDeliverable(item.index)}
      />
    </div>
  );
}

export default QuantityDeliverableInput;
