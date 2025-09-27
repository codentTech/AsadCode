import { isCreatorMode } from "@/common/utils/users.util";
import { useEffect, useState } from "react";

function usePricingHook() {
  const creatorMode = isCreatorMode();
  const [animateTable, setAnimateTable] = useState(false);

  // Trigger initial animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimateTable(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    creatorMode,
    animateTable,
  };
}

export default usePricingHook;
