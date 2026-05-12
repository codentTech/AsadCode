"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { exitImpersonation } from "@/provider/features/auth/auth.slice";
import { getUser } from "@/common/utils/users.util";

const syncImpersonationState = ({ setCurrentUser, setAdminUser, setIsImpersonating }) => {
  if (typeof window !== "object" || !window?.localStorage) {
    return;
  }
  const activeUser = getUser();
  const storedAdminUser = localStorage.getItem("admin_user");
  const storedAdminToken = localStorage.getItem("admin_token");

  let parsedAdminUser = null;
  if (storedAdminUser) {
    try {
      parsedAdminUser = JSON.parse(storedAdminUser);
    } catch {
      parsedAdminUser = null;
    }
  }

  setCurrentUser(activeUser ?? null);
  setAdminUser(parsedAdminUser);
  setIsImpersonating(Boolean(storedAdminToken));
};

function useImpersonationBanner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(null);
  const cardRef = useRef(null);
  const dragMetaRef = useRef({ offsetX: 0, offsetY: 0, width: 0, height: 0 });

  const clampPosition = useCallback((nextPosition) => {
    if (!nextPosition || !cardRef.current || typeof window !== "object") {
      return nextPosition;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const maxX = Math.max(8, window.innerWidth - width - 8);
    const maxY = Math.max(8, window.innerHeight - height - 8);
    return {
      x: Math.min(Math.max(8, nextPosition.x), maxX),
      y: Math.min(Math.max(8, nextPosition.y), maxY),
    };
  }, []);

  useEffect(() => {
    syncImpersonationState({ setCurrentUser, setAdminUser, setIsImpersonating });
    const onStorage = () =>
      syncImpersonationState({ setCurrentUser, setAdminUser, setIsImpersonating });
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [pathname]);

  const handleExitImpersonation = useCallback(() => {
    if (isExiting) {
      return;
    }
    setIsExiting(true);
    dispatch(exitImpersonation()).then((result) => {
      setIsExiting(false);
      if (exitImpersonation.fulfilled.match(result)) {
        setIsImpersonating(false);
        setAdminUser(null);
        setCurrentUser(result?.payload?.data?.user ?? getUser() ?? null);
        router.push("/admin/users");
        router.refresh();
      }
    });
  }, [dispatch, isExiting, router]);

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const handleDragStart = useCallback((event) => {
    if (!cardRef.current) {
      return;
    }
    if (event.target?.closest?.("[data-no-drag='true']")) {
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    dragMetaRef.current = {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    setPosition({ x: rect.left, y: rect.top });
    setIsDragging(true);
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (!isDragging) {
      return;
    }

    const handlePointerMove = (event) => {
      const { offsetX, offsetY, width, height } = dragMetaRef.current;
      const maxX = Math.max(8, window.innerWidth - width - 8);
      const maxY = Math.max(8, window.innerHeight - height - 8);
      const nextX = Math.min(Math.max(8, event.clientX - offsetX), maxX);
      const nextY = Math.min(Math.max(8, event.clientY - offsetY), maxY);
      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!position) {
      return;
    }
    const applyClamp = () => {
      setPosition((prev) => {
        if (!prev) return prev;
        const clamped = clampPosition(prev);
        if (!clamped) {
          return prev;
        }
        if (clamped.x === prev.x && clamped.y === prev.y) {
          return prev;
        }
        return clamped;
      });
    };
    applyClamp();
    window.addEventListener("resize", applyClamp);
    return () => window.removeEventListener("resize", applyClamp);
  }, [clampPosition, isCollapsed, position]);

  const isCustomPosition = position !== null;

  return {
    cardRef,
    currentUser,
    adminUser,
    isImpersonating,
    isExiting,
    isCollapsed,
    isDragging,
    isCustomPosition,
    position,
    handleExitImpersonation,
    toggleCollapsed,
    handleDragStart,
  };
}

export default useImpersonationBanner;
