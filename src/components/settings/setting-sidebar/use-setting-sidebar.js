import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import { expandedSidebarSections, setSidebarActiveItem } from "@/provider/features/auth/auth.slice";
import {
  Briefcase,
  CreditCard,
  Database,
  FileText,
  Heart,
  History,
  Info,
  Link,
  Lock,
  Mail,
  MailOpen,
  Phone,
  Receipt,
  Settings,
  Shield,
  Tag,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define nav items for Brand users
const brandNavItems = [
  {
    label: "Account Settings",
    icon: User,
    isActive: true,
    children: [
      {
        label: "Personal Information",
        href: "/settings/account-settings/personal-information",
        icon: UserCheck,
      },
      {
        label: "Security Settings",
        href: "/settings/account-settings/security-settings",
        icon: Lock,
      },
      {
        label: "Email & Phone",
        href: "/settings/account-settings/email-phone",
        icon: Phone,
      },
    ],
  },
  {
    label: "Brand Profile",
    icon: Briefcase,
    children: [
      {
        label: "Profile Information",
        href: "/settings/brand-profile/profile-information",
        icon: Info,
      },
      {
        label: "Social Links",
        href: "/settings/brand-profile/social-links",
        icon: Link,
      },
      {
        label: "Niche Tags",
        href: "/settings/brand-profile/niche-tags",
        icon: Tag,
      },
    ],
  },
  {
    label: "Campaign Defaults",
    icon: Target,
    children: [
      {
        label: "Default Requirements",
        href: "/settings/campaign-defaults/default-campaign-requirement",
        icon: FileText,
      },
    ],
  },
  {
    label: "Billing & Payments",
    icon: CreditCard,
    children: [
      {
        label: "Transaction History",
        href: "/settings/payments/payment-history",
        icon: History,
      },
    ],
  },
  {
    label: "Communications",
    icon: Mail,
    children: [
      {
        label: "Email Preferences",
        href: "/settings/communications/email-preferrence",
        icon: MailOpen,
      },
    ],
  },
];

// Define nav items for Creator users
const creatorNavItems = [
  {
    label: "Account Settings",
    icon: User,
    isActive: true,
    children: [
      {
        label: "Personal Information",
        href: "/settings/account-settings/personal-information",
        icon: UserCheck,
      },
      {
        label: "Security Settings",
        href: "/settings/account-settings/security-settings",
        icon: Lock,
      },
      {
        label: "Email & Phone",
        href: "/settings/account-settings/email-phone",
        icon: Phone,
      },
    ],
  },
  {
    label: "Campaign Defaults",
    icon: Target,
    children: [
      {
        label: "Preferred Collaboration Type",
        href: "/settings/campaign-defaults/preferred-collaboration-type",
        icon: Heart,
      },
      {
        label: "Saved Filter Settings",
        href: "/settings/campaign-defaults/saved-default-filter",
        icon: Settings,
      },
    ],
  },
  {
    label: "Payments",
    icon: CreditCard,
    children: [
      {
        label: "Payout Methods",
        href: "/settings/payments/payout-methods",
        icon: CreditCard,
      },
      {
        label: "Payment History",
        href: "/settings/payments/payment-history",
        icon: History,
      },
      {
        label: "Invoices & Receipts",
        href: "/settings/payments/invoice-receipt",
        icon: Receipt,
      },
    ],
  },
  {
    label: "Privacy & Safety",
    icon: Shield,
    children: [
      {
        label: "Data Privacy",
        href: "/settings/privacy-safety/data-privacy",
        icon: Database,
      },
    ],
  },
  {
    label: "Communications",
    icon: Mail,
    children: [
      {
        label: "Email Preferences",
        href: "/settings/communications/email-preferrence",
        icon: MailOpen,
      },
    ],
  },
];

function useSettingSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const currentUser = getUser();

  const { sidebarActiveItem, sidebarSections } = useSelector(({ auth }) => auth);

  // Use Redux state directly, fallback to empty object
  const expandedSections = sidebarSections || {};
  const activeItem = sidebarActiveItem || "Account Settings";

  // Memoize navItems to prevent recreation
  const navItems = useMemo(() => {
    if (currentUser) {
      return currentUser.role === ROLES.CREATOR ? creatorNavItems : brandNavItems;
    }
    return [];
  }, [currentUser]);

  // Memoize the active item finder function
  const findActiveItemFromPath = useCallback((items, currentPath) => {
    if (items?.length) {
      for (const item of items) {
        if (item.href === currentPath) {
          return item.label;
        }
        if (item.children) {
          const found = findActiveItemFromPath(item.children, currentPath);
          if (found) return found;
        }
      }
      return null;
    }
  }, []);

  // Only update active item when pathname changes
  useEffect(() => {
    const foundActiveItem = findActiveItemFromPath(navItems, pathname);
    if (foundActiveItem && foundActiveItem !== activeItem) {
      dispatch(setSidebarActiveItem(foundActiveItem));
    }
  }, [pathname, navItems, findActiveItemFromPath, dispatch, activeItem]);

  const toggleSection = useCallback(
    (sectionPath) => {
      const newExpandedSections = {
        ...expandedSections,
        [sectionPath]: !expandedSections[sectionPath],
      };
      dispatch(expandedSidebarSections(newExpandedSections));
    },
    [expandedSections, dispatch]
  );

  const handleItemClick = useCallback(
    ({ hasChildren, currentPath, href, label }) => {
      if (hasChildren) {
        toggleSection(currentPath);
      }

      if (href) {
        router.push(href);
      }

      if (label && label !== activeItem) {
        dispatch(setSidebarActiveItem(label));
      }
    },
    [toggleSection, router, dispatch, activeItem]
  );

  return {
    expandedSections,
    activeItem,
    navItems,
    handleItemClick,
  };
}

export default useSettingSidebar;

