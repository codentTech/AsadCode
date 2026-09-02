import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import { setIsCreatorModeMode } from "@/provider/features/auth/auth.slice";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function useLandingPage(audience) {
  const dispatch = useDispatch();
  const router = useRouter();
  const landingCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);
  const routeMode = audience === "creator" ? true : audience === "brand" ? false : null;
  const [resolvedMode, setResolvedMode] = useState(routeMode);

  useLayoutEffect(() => {
    if (routeMode === true || routeMode === false) {
      dispatch(setIsCreatorModeMode(routeMode));
      setResolvedMode(routeMode);
      return;
    }

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
  }, [dispatch, landingCreatorMode, routeMode]);

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
      router.push(mode ? "/creators" : "/");
    },
    [dispatch, router]
  );

  const creatorMode = routeMode !== null ? routeMode : resolvedMode;
  const hasSelectedMode = creatorMode === true || creatorMode === false;

  return {
    creatorMode,
    hasSelectedMode,
    handleSelectMode,
  };
}

export default useLandingPage;
