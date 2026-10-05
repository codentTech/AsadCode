"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  DollarSign,
  FolderOpen,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Settings,
  Shield,
  User,
} from "lucide-react";
import { useDispatch } from "react-redux";

import ROLES from "@/common/constants/role.constant";
import { getUser, isCreatorMode, logout } from "@/common/utils/users.util";
import { resetOnboardingSession } from "@/provider/features/onboarding/onboarding.slice";

const RAIL_BG = "#4552DF";
const PAYOUTS_HREF = "/settings/payments/payment-history";
const SETTINGS_HREF = "/settings/account-settings/personal-information";
const CONTENT_LIBRARY_HREF = "/content-library";
const REPORTS_HREF = "/reports";

const FALLBACK_USER = {
  first_name: "CleerCut",
  last_name: "Member",
  email: "member@cleercut.com",
  role: ROLES.BRAND,
  avatar: null,
};

function isPayoutsPath(pathname) {
  return pathname?.startsWith(PAYOUTS_HREF);
}

function isSettingsPath(pathname) {
  return pathname?.includes("/settings") && !isPayoutsPath(pathname);
}

function isCampaignsPath(pathname) {
  return pathname === "/campaign" || pathname?.startsWith("/campaign/");
}

function isPortfolioPath(pathname, isCreator) {
  if (isCreator) {
    return (
      pathname?.includes("/creator-portfolio") || pathname?.includes("/creator-profile")
    );
  }
  return pathname?.includes("/brand-portfolio");
}

function isNotificationsPath(pathname) {
  return pathname === "/notifications" || pathname?.startsWith("/notifications/");
}

function isContentLibraryPath(pathname) {
  return pathname === CONTENT_LIBRARY_HREF || pathname?.startsWith(`${CONTENT_LIBRARY_HREF}/`);
}

function isReportsPath(pathname) {
  return pathname === REPORTS_HREF || pathname?.startsWith(`${REPORTS_HREF}/`);
}

const useAppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(FALLBACK_USER);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    const user = getUser();
    setCurrentUser(user || FALLBACK_USER);
    setIsCreator(isCreatorMode());
  }, []);

  const portfolioHref = isCreator ? "/creator-portfolio" : "/brand-portfolio";
  const portfolioLabel = isCreator ? "Portfolio" : "Profile";

  const topLinks = useMemo(() => {
    const links = [
      { href: "/campaign", label: "Campaigns", icon: LayoutGrid, id: "campaigns" },
      { href: PAYOUTS_HREF, label: "Payouts", icon: DollarSign, id: "payouts" },
    ];

    if (!isCreator) {
      links.push(
        {
          href: CONTENT_LIBRARY_HREF,
          label: "Content Library",
          icon: FolderOpen,
          id: "content-library",
        },
        { href: REPORTS_HREF, label: "Reports", icon: BarChart3, id: "reports" }
      );
    }

    return links;
  }, [isCreator]);

  const bottomLinks = useMemo(
    () => [
      { href: "/notifications", label: "Notifications", icon: Bell, id: "notifications" },
      { href: SETTINGS_HREF, label: "Settings", icon: Settings, id: "settings" },
    ],
    []
  );

  const isNavLinkActive = useCallback(
    (id) => {
      switch (id) {
        case "campaigns":
          return isCampaignsPath(pathname);
        case "payouts":
          return isPayoutsPath(pathname);
        case "content-library":
          return isContentLibraryPath(pathname);
        case "reports":
          return isReportsPath(pathname);
        case "notifications":
          return isNotificationsPath(pathname);
        case "settings":
          return isSettingsPath(pathname);
        case "profile":
          return isPortfolioPath(pathname, isCreator);
        default:
          return false;
      }
    },
    [pathname, isCreator]
  );

  const profileMenuItems = useMemo(
    () => [
      {
        icon: <User size={16} />,
        label: isCreator ? "View Portfolio" : "View Profile",
        action: () => {
          router.push(portfolioHref);
        },
      },
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
          dispatch(resetOnboardingSession());
          logout();
        },
        className: "text-red-600 hover:text-red-700 hover:bg-red-50",
      },
    ],
    [dispatch, router, isCreator, portfolioHref]
  );

  const getUserInitials = useCallback((name = "") => {
    return name
      .split(" ")
      .map((n) => n?.[0])
      .filter(Boolean)
      .join("")
      .toUpperCase();
  }, []);

  const avatarUrl =
    currentUser?.brand_profile?.brand_logo_url ||
    currentUser?.creator_profile?.profile_photo_url ||
    currentUser?.avatar ||
    null;

  const handleMouseEnter = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!showProfileDropdown) {
      setIsExpanded(false);
    }
  }, [showProfileDropdown]);

  const toggleProfileDropdown = useCallback(() => {
    setShowProfileDropdown((prev) => !prev);
  }, []);

  const closeProfileDropdown = useCallback(() => {
    setShowProfileDropdown(false);
    setIsExpanded(false);
  }, []);

  return {
    railBg: RAIL_BG,
    isExpanded,
    topLinks,
    bottomLinks,
    portfolioHref,
    portfolioLabel,
    isNavLinkActive,
    currentUser,
    avatarUrl,
    profileMenuItems,
    showProfileDropdown,
    toggleProfileDropdown,
    closeProfileDropdown,
    getUserInitials,
    handleMouseEnter,
    handleMouseLeave,
  };
};

export default useAppSidebar;
