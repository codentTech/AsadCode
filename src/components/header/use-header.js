import { notificationsMockData } from "@/common/constants/notifications.data.constant";
import { getUser } from "@/common/utils/users.util";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function useHeader() {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState(notificationsMockData);

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication state
  const user = getUser();
  const isAuthenticated = !!user;

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
  };
}

export default useHeader;
