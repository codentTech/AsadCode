import ROLES from "@/common/constants/role.constant";
import { getUser } from "@/common/utils/users.util";
import { expandedSidebarSections, setSidebarActiveItem } from "@/provider/features/auth/auth.slice";
import {
  Clipboard,
  LayoutDashboard,
  Link2,
  User2,
  UserLock,
  Users,
  Wallet,
} from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

// Define nav items for Admin users
const adminNavItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: true,
    href: "/admin/dashboard",
  },
  {
    label: "Creator Applications",
    icon: Clipboard,
    isActive: false,
    href: "/admin/creator-applications",
  },
  {
    label: "Connected Accounts",
    icon: Link2,
    isActive: false,
    href: "/admin/connected-accounts",
  },
  {
    label: "Users",
    icon: Users,
    isActive: false,
    children: [
      {
        label: "All Users",
        href: "/admin/users",
        icon: Users,
      },
      {
        label: "Blocked Users",
        href: "/admin/users/blocked",
        icon: UserLock,
      },
      {
        label: "Waitlist",
        href: "/admin/users/waitlist",
        icon: User2,
      },
    ],
  },

  {
    label: "Payments",
    icon: Wallet,
    isActive: false,
    children: [
      {
        label: "All Payments",
        href: "/admin/payments",
        icon: Wallet,
      },
      {
        label: "Funding Issues",
        href: "/admin/payments?funding_status=failed_action_required",
        icon: Wallet,
      },
      {
        label: "Payout Issues",
        href: "/admin/payments?payout_status=failed",
        icon: Wallet,
      },
    ],
  },
  // {
  //   label: "Settings",
  //   icon: Settings,
  //   isActive: false,
  //   children: [
  //     {
  //       label: "Account Settings",
  //       icon: User,
  //       children: [
  //         {
  //           label: "Personal Information",
  //           href: "/settings/account-settings/personal-information",
  //           icon: UserCheck,
  //         },
  //         {
  //           label: "Security Settings",
  //           href: "/settings/account-settings/security-settings",
  //           icon: Lock,
  //         },
  //         {
  //           label: "Email & Phone",
  //           href: "/settings/account-settings/email-phone",
  //           icon: Phone,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Brand Profile",
  //       icon: Briefcase,
  //       children: [
  //         {
  //           label: "Profile Information",
  //           href: "/settings/brand-profile/profile-information",
  //           icon: Info,
  //         },
  //         {
  //           label: "Social Links",
  //           href: "/settings/brand-profile/social-links",
  //           icon: Link,
  //         },
  //         {
  //           label: "Niche Tags",
  //           href: "/settings/brand-profile/niche-tags",
  //           icon: Tag,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Campaign Defaults",
  //       icon: Target,
  //       children: [
  //         {
  //           label: "Default Requirements",
  //           href: "/settings/campaign-defaults/default-campaign-requirement",
  //           icon: FileText,
  //         },
  //         {
  //           label: "Payment Type",
  //           href: "/settings/campaign-defaults/preffered-payment-type",
  //           icon: DollarSign,
  //         },
  //         {
  //           label: "Auto-Reply Template",
  //           href: "/settings/campaign-defaults/auto-reply-template",
  //           icon: MessageSquare,
  //         },
  //         {
  //           label: "Brief Template",
  //           href: "/settings/campaign-defaults/breif-template",
  //           icon: Clipboard,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Billing & Payments",
  //       icon: CreditCard,
  //       children: [
  //         {
  //           label: "Billing Methods",
  //           href: "/settings/payments/payout-methods",
  //           icon: CreditCard,
  //         },
  //         {
  //           label: "Transaction History",
  //           href: "/settings/payments/payment-history",
  //           icon: History,
  //         },
  //         {
  //           label: "Invoices & Receipts",
  //           href: "/settings/payments/invoice-receipt",
  //           icon: Receipt,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Privacy & Safety",
  //       icon: Shield,
  //       children: [
  //         {
  //           label: "Blocking & Restrictions",
  //           href: "/settings/privacy-safety/blocked-brands",
  //           icon: UserX,
  //         },
  //         {
  //           label: "Data Privacy",
  //           href: "/settings/privacy-safety/data-privacy",
  //           icon: Database,
  //         },
  //       ],
  //     },
  //     {
  //       label: "Communications",
  //       icon: Mail,
  //       children: [
  //         {
  //           label: "Email Preferences",
  //           href: "/settings/communications/email-preferrence",
  //           icon: MailOpen,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

function useSidebar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUser = getUser();

  const { sidebarActiveItem, sidebarSections } = useSelector(({ auth }) => auth);

  const expandedSections = sidebarSections || {};
  const activeItem = sidebarActiveItem || "Dashboard";
  const hasAutoExpandedPayments = useRef(false);

  const navItems = useMemo(() => {
    if (currentUser && currentUser.role === ROLES.ADMIN) {
      return adminNavItems;
    }
    return [];
  }, [currentUser]);

  const findActiveItemFromPath = useCallback((items, currentPath, currentSearch) => {
    if (items?.length) {
      for (const item of items) {
        if (item.href) {
          const [itemPath] = item.href.split("?");
          if (itemPath !== currentPath) continue;
          if (
            currentSearch.get("funding_status") === "failed_action_required" &&
            item.href.includes("funding_status=")
          )
            return item.label;
          if (
            currentSearch.get("payout_status") === "failed" &&
            item.href.includes("payout_status=failed")
          )
            return item.label;
          if (!currentSearch.get("funding_status") && !currentSearch.get("payout_status"))
            return item.label;
        }
        if (item.children) {
          const found = findActiveItemFromPath(item.children, currentPath, currentSearch);
          if (found) return found;
        }
      }
      for (const item of items) {
        if (item.href) {
          const [itemPath] = item.href.split("?");
          if (itemPath === currentPath) return item.label;
        }
      }
      return null;
    }
  }, []);

  useEffect(() => {
    if (pathname?.startsWith("/admin/payments")) {
      if (!hasAutoExpandedPayments.current) {
        hasAutoExpandedPayments.current = true;
        dispatch(
          expandedSidebarSections({
            ...expandedSections,
            Payments: true,
          })
        );
      }
    } else {
      hasAutoExpandedPayments.current = false;
    }
  }, [pathname, expandedSections, dispatch]);

  useEffect(() => {
    const foundActiveItem = findActiveItemFromPath(navItems, pathname, searchParams);
    if (foundActiveItem && foundActiveItem !== activeItem) {
      dispatch(setSidebarActiveItem(foundActiveItem));
    }
  }, [pathname, searchParams, navItems, findActiveItemFromPath, dispatch, activeItem]);

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

export default useSidebar;
