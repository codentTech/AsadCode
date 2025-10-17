import { useState, useEffect } from "react";
import { HelpCircle, LogOut, Settings, Shield, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import { logout } from "@/common/utils/users.util";
import {
  getMyNotifications,
  getUnreadCount,
} from "@/provider/features/notification/notification.slice";
import notificationService from "@/provider/features/notification/notification.service";

const useHeader = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const currentUser = getUser() || {
    first_name: "John Doe",
    email: "john.doe@company.com",
    avatar: null,
    role: "Admin",
  };

  // Get notifications from Redux
  const notificationsState = useSelector((state) => state.notification?.getMyNotifications);
  const unreadCountState = useSelector((state) => state.notification?.getUnreadCount);

  const notifications = notificationsState?.data?.data || [];
  const unreadCount = unreadCountState?.data?.data?.count || 0;

  // Fetch notifications on mount
  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getMyNotifications());
      dispatch(getUnreadCount());
    }
  }, [dispatch, currentUser?.id]);

  // Refresh unread count periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentUser?.id) {
        dispatch(getUnreadCount());
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, currentUser?.id]);

  const getUserInitials = (name) =>
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const handleNotificationClick = async (notification) => {
    // Mark as read
    await notificationService.markAsRead(notification.id);

    // Refresh notifications
    dispatch(getMyNotifications());
    dispatch(getUnreadCount());

    // Close dropdown
    setShowNotificationDropdown(false);

    // Redirect to campaigns page
    router.push("/campaign");
  };

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
        router.push("/login");
        logout();
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
    notifications,
    unreadCount,
    handleNotificationClick,
  };
};

export default useHeader;
