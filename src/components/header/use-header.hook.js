import { notificationsMockData } from "@/common/constants/notifications.data.constant";
import { getUser } from "@/common/utils/users.util";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";

function useHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(notificationsMockData);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const isAuthenticated = !!user;

  useLayoutEffect(() => {
    setUser(getUser() ?? null);
  }, [pathname]);

  const isCreatorsPage = useMemo(
    () => typeof pathname === "string" && pathname.startsWith("/creators"),
    [pathname]
  );

  const audienceSwitch = useMemo(
    () =>
      isCreatorsPage
        ? { text: "For Brands", href: "/" }
        : { text: "For Creators", href: "/creators" },
    [isCreatorsPage]
  );

  const handleAudienceSwitch = useCallback(() => {
    setMobileMenuOpen(false);
    router.push(audienceSwitch.href);
  }, [audienceSwitch.href, router]);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return {
    router,
    scrolled,
    mobileMenuOpen,
    setMobileMenuOpen,
    showDropdown,
    setShowDropdown,
    notifications,
    isAuthenticated,
    user,
    audienceSwitch,
    handleAudienceSwitch,
  };
}

export default useHeader;
