import { notificationsMockData } from "@/common/constants/notifications.data.constant";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function useHeader() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(notificationsMockData);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
  };
}

export default useHeader;
