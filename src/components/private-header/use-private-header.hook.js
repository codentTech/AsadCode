"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { HelpCircle, LogOut, Settings, Shield, User } from "lucide-react";

import ROLES from "@/common/constants/role.constant";
import { getUser, logout } from "@/common/utils/users.util";

const usePrivateHeader = () => {
  const router = useRouter();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

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
        action: () => {},
      },
      {
        icon: <Settings size={16} />,
        label: "Account Settings",
        action: () => {},
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
    showProfileDropdown,
    setShowProfileDropdown,
    getUserInitials,
  };
};

export default usePrivateHeader;
