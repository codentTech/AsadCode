import { getUser, isCreatorMode } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function useLandingPage() {
  const dispatch = useDispatch();
  const landingCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const creatorMode =
    getUser() != null ? isCreatorMode() : landingCreatorMode;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const el = document.getElementById(hash.slice(1));
          el?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }
  }, []);

  const handleSelectMode = useCallback(
    (mode) => {
      dispatch(setIsCreatorModeMode(mode));
    },
    [dispatch]
  );

  return {
    creatorMode,
    handleSelectMode,
  };
}

export default useLandingPage;
