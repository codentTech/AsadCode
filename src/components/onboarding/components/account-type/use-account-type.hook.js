"use client";

import useBackgroundEffect from "@/common/hooks/use-background-effect.hook";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";

export default function useAccountType() {
  const router = useRouter();
  const { position } = useBackgroundEffect();

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return;
    if (localStorage.getItem("token") || localStorage.getItem("user")) return;
    localStorage.removeItem("email");
    localStorage.removeItem("name");
  }, []);

  const handleBackToLogin = useCallback(() => {
    router.push("/login");
  }, [router]);

  return {
    position,
    handleBackToLogin,
  };
}
