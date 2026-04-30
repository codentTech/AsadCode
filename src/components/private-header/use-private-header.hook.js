"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, HelpCircle, LayoutGrid, LogOut, Settings, Shield, User, UserRound } from "lucide-react";

import ROLES from "@/common/constants/role.constant";
import { getUser, isCreatorMode, logout } from "@/common/utils/users.util";

function navHrefMatchesPath(pathname, href) {
  return (
    pathname === href ||
    (href.includes("creator-portfolio") && pathname.includes("/creator-profile")) ||
    (href.includes("brand-portfolio") && pathname.includes("/brand-portfolio")) ||
    (href.includes("settings") && pathname.includes("/settings"))
  );
}

const usePrivateHeader = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const isCreator = isCreatorMode();

  const isNavLinkActive = useCallback(
    (href) => navHrefMatchesPath(pathname, href),
    [pathname]
  );

  const currentUser = getUser() || {
    first_name: "CleerCut",
    last_name: "Member",
    email: "member@cleercut.com",
    role: ROLES.BRAND,
    avatar: null,
  };

  const profileMenuItems = useMemo(
    () => [
      {
        icon: <User size={16} />,
        label: "My Profile",
        action: () => {
          router.push("/settings/account-settings/personal-information");
        },
      },
      {
        icon: <Settings size={16} />,
        label: "Account Settings",
        action: () => {
          router.push("/settings/account-settings/security-settings");
        },
      },
      {
        icon: <Shield size={16} />,
        label: "Privacy & Security",
        action: () => {},
      },
      {
        icon: <HelpCircle size={16} />,
        label: "Help & Support",
        action: () => {},
      },
      {
        icon: <LogOut size={16} />,
        label: "Sign Out",
        action: () => {
          logout();
          router.push("/login");
        },
        className: "text-red-600 hover:text-red-700 hover:bg-red-50",
      },
    ],
    [router]
  );

  const navLinks = useMemo(() => {
    const portfolio = isCreator
      ? { href: "/creator-portfolio", label: "Portfolio", icon: UserRound }
      : { href: "/brand-portfolio", label: "Profile", icon: UserRound };

    return [
      { href: "/campaign", label: "Campaigns", icon: LayoutGrid },
      portfolio,
      { href: "/notifications", label: "Notifications", icon: Bell },
      {
        href: "/settings/account-settings/personal-information",
        label: "Settings",
        icon: Settings,
      },
    ];
  }, [isCreator]);

  const getUserInitials = (name = "") =>
    name
      .split(" ")
      .map((n) => n?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();

  return {
    currentUser,
    profileMenuItems,
    navLinks,
    isNavLinkActive,
    showProfileDropdown,
    setShowProfileDropdown,
    getUserInitials,
  };
};

export default usePrivateHeader;
