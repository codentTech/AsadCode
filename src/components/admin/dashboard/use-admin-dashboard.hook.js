import { fetchAdminDashboardSummary, selectAdminDashboardSummary } from "@/provider/features/dashboard/dashboard.slice";
import {
  AlertTriangle,
  Briefcase,
  ClipboardList,
  Link2,
  Mail,
  ShieldAlert,
  UserCircle2,
  UserLock,
  Users,
  Wallet,
} from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const { data, isLoading, isError, message } = useSelector(selectAdminDashboardSummary);

  useEffect(() => {
    dispatch(fetchAdminDashboardSummary());
  }, [dispatch]);

  const reload = useCallback(() => {
    dispatch(fetchAdminDashboardSummary());
  }, [dispatch]);

  const kpiItems = useMemo(() => {
    const c = data?.counts;
    if (!c) {
      return [];
    }
    return [
      { title: "Total users", value: c.totalUsers, icon: Users, color: "indigo" },
      { title: "Creators", value: c.creators, icon: UserCircle2, color: "violet" },
      { title: "Brands", value: c.brands, icon: Briefcase, color: "sky" },
      {
        title: "Waitlist",
        value: c.waitlistEntries,
        icon: Mail,
        color: "emerald",
        href: "/admin/users/waitlist",
      },
      {
        title: "Pending applications",
        value: c.pendingApplications,
        icon: ClipboardList,
        color: "amber",
        href: "/admin/creator-applications",
      },
      {
        title: "Blocked users",
        value: c.blockedUsers,
        icon: UserLock,
        color: "rose",
        href: "/admin/users/blocked",
      },
      {
        title: "Connected accounts",
        value: c.activeConnectedAccounts,
        icon: Link2,
        color: "cyan",
        href: "/admin/connected-accounts",
      },
      {
        title: "Funding issues",
        value: c.paymentsFundingFailed,
        icon: AlertTriangle,
        color: "orange",
        href: "/admin/payments?funding_status=failed_action_required",
      },
      {
        title: "Payout failed",
        value: c.paymentsPayoutFailed,
        icon: Wallet,
        color: "red",
        href: "/admin/payments?payout_status=failed",
      },
      {
        title: "Payout blocked",
        value: c.paymentsPayoutBlocked,
        icon: ShieldAlert,
        color: "fuchsia",
        href: "/admin/payments?payout_status=blocked",
      },
    ];
  }, [data]);

  const signupsByDay = data?.signupsByDay ?? [];
  const applicationsByDay = data?.applicationsByDay ?? [];

  return {
    kpiItems,
    signupsByDay,
    applicationsByDay,
    isLoading,
    isError,
    message,
    reload,
  };
};

export default useAdminDashboard;
