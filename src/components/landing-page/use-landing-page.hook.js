import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useLandingPageHook() {
  const dispatch = useDispatch();
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  useEffect(() => {
    if (typeof window !== undefined) {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash.slice(1));
          el?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, []);

  const handleSelectMode = (isCreator) => {
    dispatch(setIsCreatorModeMode(isCreator));
  };

  return { isCreatorMode, handleSelectMode };
}

export default useLandingPageHook;
