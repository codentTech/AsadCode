import { MD_BREAKPOINT } from "@/common/constants/genaric.constant";

export function isMobileViewport() {
  return typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT;
}
