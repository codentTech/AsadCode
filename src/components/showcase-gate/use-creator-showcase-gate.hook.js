"use client";

import { CLEERCUT_OPEN_SHOWCASE_MODAL } from "@/common/utils/creator-showcase.util";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function useCreatorShowcaseGate() {
  const router = useRouter();

  const goToShowcaseUpload = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(CLEERCUT_OPEN_SHOWCASE_MODAL, "1");
    }
    router.push("/creator-portfolio");
  }, [router]);

  return { goToShowcaseUpload };
}
