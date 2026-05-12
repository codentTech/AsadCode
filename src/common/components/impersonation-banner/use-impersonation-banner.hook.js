"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useDispatch } from "react-redux";
import { exitImpersonation } from "@/provider/features/auth/auth.slice";
import { getUser } from "@/common/utils/users.util";

const applyDragBox = (el, x, y) => {
  if (!el) {
    return;
  }
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.transform = "none";
};

const clearDragBox = (el) => {
  if (!el) {
    return;
  }
  el.style.left = "";
  el.style.top = "";
  el.style.transform = "";
};

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
  const isDraggingRef = useRef(false);
  isDraggingRef.current = isDragging;
  const cardRef = useRef(null);
  const dragMetaRef = useRef({ offsetX: 0, offsetY: 0, width: 0, height: 0 });
  const dragLiveRef = useRef({ x: 0, y: 0 });
  const dragPositionRafRef = useRef(0);
  const removeDocumentDragListenersRef = useRef(null);

  const clampPosition = useCallback((nextPosition, size) => {
    if (!nextPosition || typeof window !== "object") {
      return nextPosition;
    }
    let width = size?.width;
    let height = size?.height;
    if (
      (typeof width !== "number" || typeof height !== "number" || width < 1 || height < 1) &&
      cardRef.current
    ) {
      const rect = cardRef.current.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
    }
    if (typeof width !== "number" || typeof height !== "number" || width < 1 || height < 1) {
      return nextPosition;
    }
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

  useEffect(() => {
    return () => {
      removeDocumentDragListenersRef.current?.();
      removeDocumentDragListenersRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }
    const onResize = () => {
      if (isDragging) {
        return;
      }
      setPosition((prev) => {
        if (!prev) {
          return prev;
        }
        const clamped = clampPosition(prev);
        if (!clamped || (clamped.x === prev.x && clamped.y === prev.y)) {
          return prev;
        }
        return clamped;
      });
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [clampPosition, isDragging]);

  useEffect(() => {
    if (isDraggingRef.current) {
      return;
    }
    setPosition((prev) => {
      if (!prev) {
        return prev;
      }
      const clamped = clampPosition(prev);
      if (!clamped || (clamped.x === prev.x && clamped.y === prev.y)) {
        return prev;
      }
      return clamped;
    });
  }, [clampPosition, isCollapsed]);

  useLayoutEffect(() => {
    if (!isDragging || !cardRef.current) {
      return;
    }
    const { x, y } = dragLiveRef.current;
    applyDragBox(cardRef.current, x, y);
  }, [isDragging, position, isCollapsed]);

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

  const handleDragStart = useCallback(
    (event) => {
      if (!cardRef.current) {
        return;
      }
      if (event.pointerType === "mouse" && event.button !== 0) {
        return;
      }
      if (event.target?.closest?.("[data-no-drag='true']")) {
        return;
      }

      removeDocumentDragListenersRef.current?.();
      removeDocumentDragListenersRef.current = null;

      const el = cardRef.current;
      const rect = el.getBoundingClientRect();
      dragMetaRef.current = {
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
        width: rect.width,
        height: rect.height,
      };
      const startX = rect.left;
      const startY = rect.top;
      dragLiveRef.current = { x: startX, y: startY };

      if (typeof window === "object") {
        flushSync(() => {
          setPosition({ x: startX, y: startY });
          setIsDragging(true);
        });
      } else {
        setPosition({ x: startX, y: startY });
        setIsDragging(true);
      }

      applyDragBox(el, startX, startY);

      const pointerId = event.pointerId;
      const listenerOpts = { capture: true, passive: false };

      let finished = false;

      const onMove = (e) => {
        if (e.pointerId !== pointerId) {
          return;
        }
        e.preventDefault();
        const moveRect = el.getBoundingClientRect();
        const w = moveRect.width;
        const h = moveRect.height;
        const { offsetX, offsetY } = dragMetaRef.current;
        if (w < 1 || h < 1) {
          return;
        }
        const maxX = Math.max(8, window.innerWidth - w - 8);
        const maxY = Math.max(8, window.innerHeight - h - 8);
        const nextX = Math.min(Math.max(8, e.clientX - offsetX), maxX);
        const nextY = Math.min(Math.max(8, e.clientY - offsetY), maxY);
        dragLiveRef.current = { x: nextX, y: nextY };
        applyDragBox(el, nextX, nextY);
        if (!dragPositionRafRef.current) {
          dragPositionRafRef.current = requestAnimationFrame(() => {
            dragPositionRafRef.current = 0;
            const p = dragLiveRef.current;
            setPosition((prev) => {
              if (prev && prev.x === p.x && prev.y === p.y) {
                return prev;
              }
              return { x: p.x, y: p.y };
            });
          });
        }
      };

      const finish = (e) => {
        if (finished) {
          return;
        }
        if (e.pointerId !== pointerId) {
          return;
        }
        finished = true;
        if (dragPositionRafRef.current) {
          cancelAnimationFrame(dragPositionRafRef.current);
          dragPositionRafRef.current = 0;
        }
        document.removeEventListener("pointermove", onMove, listenerOpts);
        document.removeEventListener("pointerup", finish, listenerOpts);
        document.removeEventListener("pointercancel", finish, listenerOpts);
        removeDocumentDragListenersRef.current = null;
        try {
          if (el.hasPointerCapture?.(pointerId)) {
            el.releasePointerCapture(pointerId);
          }
        } catch {
          /* ignore */
        }
        const live = dragLiveRef.current;
        const x = Number.isFinite(live.x) ? live.x : 8;
        const y = Number.isFinite(live.y) ? live.y : 8;
        clearDragBox(el);
        if (typeof window === "object") {
          flushSync(() => {
            setPosition({ x, y });
            setIsDragging(false);
          });
        } else {
          setPosition({ x, y });
          setIsDragging(false);
        }
        const nodeAfterFlush = cardRef.current;
        if (nodeAfterFlush) {
          applyDragBox(nodeAfterFlush, x, y);
        }
      };

      document.addEventListener("pointermove", onMove, listenerOpts);
      document.addEventListener("pointerup", finish, listenerOpts);
      document.addEventListener("pointercancel", finish, listenerOpts);

      removeDocumentDragListenersRef.current = () => {
        document.removeEventListener("pointermove", onMove, listenerOpts);
        document.removeEventListener("pointerup", finish, listenerOpts);
        document.removeEventListener("pointercancel", finish, listenerOpts);
        if (dragPositionRafRef.current) {
          cancelAnimationFrame(dragPositionRafRef.current);
          dragPositionRafRef.current = 0;
        }
        try {
          if (el.hasPointerCapture?.(pointerId)) {
            el.releasePointerCapture(pointerId);
          }
        } catch {
          /* ignore */
        }
        clearDragBox(el);
      };

      try {
        el.setPointerCapture(pointerId);
      } catch {
        /* ignore */
      }

      event.preventDefault();
    },
    [clampPosition]
  );

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
