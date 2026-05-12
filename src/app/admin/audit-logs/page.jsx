"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import AuditLogs from "@/components/admin/audit-logs/audit-logs.component";

export default function Page() {
  return <Auth component={<AuditLogs />} type={AUTH.SUPER_ADMIN} />;
}
