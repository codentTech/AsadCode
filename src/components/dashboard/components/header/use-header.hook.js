import { useState } from "react";
import { HelpCircle, LogOut, Settings, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";

const useHeader = () => {
  const router = useRouter();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentUser = {
    name: "John Doe",
    email: "john.doe@company.com",
    avatar: null,
    role: "Admin",
  };

  const getUserInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const profileMenuItems = [
    {
      icon: <User size={16} />,
      label: "My Profile",
      action: () => {},
    },
    {
      icon: <Settings size={16} />,
      label: "Settings",
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
        console.log("Logging out...");
      },
      className: "text-red-600 hover:text-red-700 hover:bg-red-50",
    },
  ];

  return {
    router,
    currentUser,
    showNotificationDropdown,
    setShowNotificationDropdown,
    showProfileDropdown,
    setShowProfileDropdown,
    getUserInitials,
    profileMenuItems,
  };
};

export default useHeader;
