import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function usePricingHook() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const [animateTable, setAnimateTable] = useState(false);

  // Trigger initial animation
  useEffect(() => {
    const timer = setTimeout(() => setAnimateTable(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    isCreatorMode,
    animateTable,
  };
}

export default usePricingHook;
