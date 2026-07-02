import CustomInput from "@/common/components/custom-input/custom-input.component";
import { DollarSign, PlusCircle, Trash2 } from "lucide-react";
import usePricingTab from "./use-pricing-tab.hook";

const PricingTab = ({ contentRates, setContentRates, customRates, setCustomRates }) => {
  const { handleRateChange, handleCustomRateChange, addCustomRateRow, removeCustomRate } =
    usePricingTab({ setContentRates, setCustomRates });

  return (
    <div className="max-w-3xl space-y-3 sm:space-y-4">
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Content Rates</h3>
        <div className="space-y-3">
          {contentRates.map((rate, index) => (
            <div
              key={`rate-${index}-${rate.contentType}`}
              className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 text-gray-700">
                <DollarSign className="w-4 h-4 text-indigo-500" />
                <span className="text-sm font-medium">{rate.contentType}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">$</span>
                <CustomInput
                  type="number"
                  name={`rate-${index}`}
                  placeholder="0"
                  className="!w-20 !border !h-7 !border-gray-300"
                  value={
                    rate.price !== undefined && rate.price !== null ? String(rate.price) : ""
                  }
                  onChange={(e) => handleRateChange(index, e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:p-4">
        <h3 className="text-xs font-semibold text-gray-900 mb-3">Custom Rates</h3>
        <div className="space-y-3">
          {customRates.map((rate, idx) => (
            <div
              key={`custom-rate-${idx}`}
              className="flex flex-col gap-2 rounded-lg bg-gray-50 p-3 sm:flex-row sm:items-center"
            >
              <CustomInput
                name={`custom-rate-label-${idx}`}
                placeholder="Custom package"
                className="flex-1 !border !border-gray-300"
                value={rate.contentType}
                onChange={(e) => handleCustomRateChange(idx, "contentType", e.target.value)}
              />
              <div className="flex items-center space-x-2">
                <span className="text-gray-500 text-sm">$</span>
                <CustomInput
                  type="number"
                  name={`custom-rate-price-${idx}`}
                  placeholder="0"
                  className="!w-20 !border !border-gray-300"
                  value={
                    rate.price !== undefined && rate.price !== null ? String(rate.price) : ""
                  }
                  onChange={(e) => handleCustomRateChange(idx, "price", e.target.value)}
                />
              </div>
              <button
                type="button"
                className="bg-red-100 p-1.5 rounded-full hover:bg-red-200 transition-colors"
                onClick={() => removeCustomRate(idx)}
                disabled={customRates.length === 1}
              >
                <Trash2 className="text-red-600 w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            className="w-full p-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors"
            onClick={addCustomRateRow}
          >
            <div className="flex items-center justify-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span className="text-sm">Add Custom Rate</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingTab;
