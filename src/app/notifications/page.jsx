"use client";

import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import { getUser } from "@/common/utils/users.util";
import ROLES from "@/common/constants/role.constant";
import NotificationsBrand from "@/components/notifications/brand/notifications-brand.component";
import Notifications from "@/components/notifications/creator/notifications.component";

export default function Page() {
  const user = getUser();
  console.log(user);
  const isBrand = user?.role === ROLES.BRAND || user?.role === ROLES.ADMIN;
  console.log(isBrand);

  return (
    <Auth component={isBrand ? <NotificationsBrand /> : <Notifications />} type={AUTH.PRIVATE} />
  );
}
