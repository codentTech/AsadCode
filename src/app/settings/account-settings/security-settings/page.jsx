import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import SecuritySettings from "@/components/settings/account-settings/security-settings/security-settings.componnet";

export default function Page() {
  return <Auth component={<SecuritySettings />} type={AUTH.PRIVATE} />;
}
