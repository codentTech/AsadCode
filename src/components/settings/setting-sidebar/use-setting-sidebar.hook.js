import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import { expandedSidebarSections, setSidebarActiveItem } from "@/provider/features/auth/auth.slice";
import {
  BarChart3,
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
  Plug,
  Receipt,
  Settings,
  Shield,
  Store,
  Tag,
  Target,
  User,
  UserCheck,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
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
    label: "Profile & Campaign Settings",
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
        label: "Payment Methods",
        href: "/settings/payments/payment-methods",
        icon: CreditCard,
      },
      {
        label: "Transaction History",
        href: "/settings/payments/payment-history",
        icon: History,
      },
    ],
  },
  {
    label: "Integrations",
    icon: Plug,
    children: [
      {
        label: "Shopify",
        href: "/settings/integrations/shopify",
        icon: Store,
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
    ],
  },
  {
    label: "Profile & Campaign Settings",
    icon: Target,
    children: [
      {
        label: "Preferred Collaboration Type",
        href: "/settings/campaign-defaults/preferred-collaboration-type",
        icon: Heart,
      },
      {
        label: "Connected Accounts & Preferences",
        href: "/settings/campaign-defaults/saved-default-filter",
        icon: Settings,
      },
      // {
      //   label: "Audience insights",
      //   href: "/settings/audience-insights",
      //   icon: BarChart3,
      // },
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
        label: "Email Notifications",
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
  const [hasMounted, setHasMounted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const { sidebarActiveItem, sidebarSections } = useSelector(({ auth }) => auth);

  // Use Redux state directly, fallback to empty object
  const expandedSections = sidebarSections || {};
  const activeItem = sidebarActiveItem || "Account Settings";

  useEffect(() => {
    setCurrentUser(getUser());
    setHasMounted(true);
  }, []);

  // Defer role-based nav until after mount so SSR HTML matches the first client render
  const navItems = useMemo(() => {
    if (!hasMounted) {
      return [];
    }
    if (currentUser?.role === ROLES.CREATOR) {
      return creatorNavItems;
    }
    return brandNavItems;
  }, [currentUser, hasMounted]);

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

  const getSectionPathsForPath = useCallback(
    (items, currentPath) => {
      const sectionPaths = [];
      if (!items?.length) return sectionPaths;

      for (const item of items) {
        if (!item.children?.length) continue;
        const sectionPath = item.label;
        const activeChild = findActiveItemFromPath(item.children, currentPath);
        if (activeChild) sectionPaths.push(sectionPath);
      }
      return sectionPaths;
    },
    [findActiveItemFromPath]
  );

  useEffect(() => {
    const foundActiveItem = findActiveItemFromPath(navItems, pathname);
    if (foundActiveItem && foundActiveItem !== activeItem) {
      dispatch(setSidebarActiveItem(foundActiveItem));
    }

    const sectionPaths = getSectionPathsForPath(navItems, pathname);
    if (!sectionPaths.length) return;

    const nextExpanded = { ...expandedSections };
    let changed = false;
    for (const sectionPath of sectionPaths) {
      if (!nextExpanded[sectionPath]) {
        nextExpanded[sectionPath] = true;
        changed = true;
      }
    }
    if (changed) {
      dispatch(expandedSidebarSections(nextExpanded));
    }
  }, [pathname, navItems, findActiveItemFromPath, getSectionPathsForPath, dispatch, activeItem]);

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
