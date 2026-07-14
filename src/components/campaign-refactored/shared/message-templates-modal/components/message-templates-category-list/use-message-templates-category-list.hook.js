import { useCallback, useEffect, useState } from "react";

export default function useMessageTemplatesCategoryList(isOpen) {
  const [expandedCategoryIds, setExpandedCategoryIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setExpandedCategoryIds([]);
    }
  }, [isOpen]);

  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategoryIds((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }, []);

  return {
    expandedCategoryIds,
    toggleCategory,
  };
}
