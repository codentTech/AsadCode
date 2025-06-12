import {
  Bell,
  Briefcase,
  CreditCard,
  Mail,
  Settings,
  Shield,
  Target,
  User,
  Users,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

// Define nav items for Brand users
const brandNavItems = [
  {
    label: "User Waitlist",
    icon: Users,
    isActive: true,
  },
  {
    label: "Notifications",
    icon: Bell,
    isActive: false,
  },
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
    children: [
      {
        label: "Account Settings",
        icon: User,
        children: [
          { label: "Personal Information", href: "/settings/personal" },
          { label: "Security Settings", href: "/settings/security" },
          { label: "Email & Phone", href: "/settings/contact" },
        ],
      },
      {
        label: "Brand Profile",
        icon: Briefcase,
        children: [
          { label: "Profile Information", href: "/brand/profile" },
          { label: "Social Links", href: "/brand/social" },
          { label: "Niche Tags", href: "/brand/niches" },
        ],
      },
      {
        label: "Campaign Defaults",
        icon: Target,
        children: [
          { label: "Default Requirements", href: "/campaigns/defaults" },
          { label: "Payment Type", href: "/campaigns/payment" },
          { label: "Auto-Reply Template", href: "/campaigns/templates" },
          { label: "Brief Template", href: "/campaigns/briefs" },
        ],
      },
      {
        label: "Billing & Payments",
        icon: CreditCard,
        children: [
          { label: "Billing Methods", href: "/billing/methods" },
          { label: "Transaction History", href: "/billing/history" },
          { label: "Invoices & Receipts", href: "/billing/invoices" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocking & Restrictions", href: "/privacy/blocking" },
          { label: "Data Privacy", href: "/privacy/data" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [
          { label: "Email Preferences", href: "/communications/email" },
          { label: "Push Notifications", href: "/communications/push" },
        ],
      },
    ],
  },
];

// Define nav items for Creator users
const creatorNavItems = [
  {
    label: "User Waitlist",
    icon: Users,
    isActive: true,
  },
  {
    label: "Notifications",
    icon: Bell,
    isActive: false,
  },
  {
    label: "Settings",
    icon: Settings,
    isActive: false,
    children: [
      {
        label: "Account Settings",
        icon: User,
        children: [
          { label: "Personal Information", href: "/settings/personal" },
          { label: "Security Settings", href: "/settings/security" },
          { label: "Email & Phone", href: "/settings/contact" },
        ],
      },
      {
        label: "Campaign Defaults",
        icon: Target,
        children: [
          { label: "Collaboration Type", href: "/campaigns/collaboration" },
          { label: "Filter Settings", href: "/campaigns/filters" },
        ],
      },
      {
        label: "Payments",
        icon: CreditCard,
        children: [
          { label: "Payout Methods", href: "/payments/methods" },
          { label: "Payment History", href: "/payments/history" },
          { label: "Invoices & Receipts", href: "/payments/invoices" },
        ],
      },
      {
        label: "Privacy & Safety",
        icon: Shield,
        children: [
          { label: "Blocked Brands", href: "/privacy/blocked" },
          { label: "Data Privacy", href: "/privacy/data" },
        ],
      },
      {
        label: "Communications",
        icon: Mail,
        children: [{ label: "Email Preferences", href: "/communications/email" }],
      },
    ],
  },
];

function useSidebar() {
  const isCreatorMode = useSelector(({ auth }) => auth.isCreatorMode);

  const [expandedSections, setExpandedSections] = useState({});
  const [activeItem, setActiveItem] = useState("");

  const navItems = isCreatorMode ? creatorNavItems : brandNavItems;

  const toggleSection = (sectionPath) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionPath]: !prev[sectionPath],
    }));
  };

  const handleItemClick = (href, label) => {
    setActiveItem(href);
    // Handle navigation here
    // console.log(`Navigating to: ${href}`);
  };

  return {
    expandedSections,
    activeItem,
    navItems,
    toggleSection,
    handleItemClick,
  };
}

export default useSidebar;
