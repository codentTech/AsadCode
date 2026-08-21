import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useLandingPage() {
  const dispatch = useDispatch();
  const landingCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const [resolvedMode, setResolvedMode] = useState(null);

  useLayoutEffect(() => {
    const user = getUser();
    if (user?.role === ROLES.CREATOR) {
      dispatch(setIsCreatorModeMode(true));
      setResolvedMode(true);
      return;
    }
    if (user?.role === ROLES.BRAND) {
      dispatch(setIsCreatorModeMode(false));
      setResolvedMode(false);
      return;
    }
    if (landingCreatorMode === true || landingCreatorMode === false) {
      setResolvedMode(landingCreatorMode);
    }
  }, [dispatch, landingCreatorMode]);

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
      setResolvedMode(mode);
      dispatch(setIsCreatorModeMode(mode));
    },
    [dispatch]
  );

  const hasSelectedMode = resolvedMode === true || resolvedMode === false;

  return {
    creatorMode: resolvedMode,
    hasSelectedMode,
    handleSelectMode,
  };
}

export default useLandingPage;
