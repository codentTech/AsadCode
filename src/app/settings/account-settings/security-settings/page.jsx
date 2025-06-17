import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import SecuritySettings from "@/components/settings/account-settings/components/security-settings/security-settings.componnet";

export default function Page() {
  return <Auth component={<SecuritySettings />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
