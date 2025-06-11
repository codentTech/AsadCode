import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function useDiscoverDreatorsHook({ mockNicheCategories }) {
  const scrollRefs = useRef({});
  const [overflowStates, setOverflowStates] = useState({});

  useEffect(() => {
    const checkAllOverflows = () => {
      const newStates = {};
      mockNicheCategories.forEach((category) => {
        const el = scrollRefs.current[category.id];
        if (el) {
          newStates[category.id] = el.scrollWidth > el.clientWidth;
        }
      });
      setOverflowStates(newStates);
    };

    checkAllOverflows();
    window.addEventListener("resize", checkAllOverflows);

    return () => window.removeEventListener("resize", checkAllOverflows);
  }, [mockNicheCategories.creators]);

  return { scrollRefs, overflowStates };
}

export default useDiscoverDreatorsHook;
