import { useCallback } from "react";

const usePricingTab = ({ setContentRates, setCustomRates }) => {
  const handleRateChange = useCallback(
    (index, value) => {
      setContentRates((prev) => {
        const newRates = [...prev];
        newRates[index] = { ...newRates[index], price: parseFloat(value) || 0 };
        return newRates;
      });
    },
    [setContentRates]
  );

  const handleCustomRateChange = useCallback(
    (idx, field, value) => {
      setCustomRates((prev) => {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          [field]: field === "price" ? parseFloat(value) || 0 : value,
        };
        return updated;
      });
    },
    [setCustomRates]
  );

  const addCustomRateRow = useCallback(() => {
    setCustomRates((prev) => [...prev, { contentType: "", price: 0 }]);
  }, [setCustomRates]);

  const removeCustomRate = useCallback(
    (idx) => {
      setCustomRates((prev) => {
        const updated = prev.filter((_, i) => i !== idx);
        return updated.length ? updated : [{ contentType: "", price: 0 }];
      });
    },
    [setCustomRates]
  );

  return { handleRateChange, handleCustomRateChange, addCustomRateRow, removeCustomRate };
};

export default usePricingTab;
