import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import ContactMethodsPage from "@/components/settings/account-settings/email-phone/email-phone.component";

export default function Page() {
  return <Auth component={<ContactMethodsPage />} type={AUTH.PRIVATE} />;
}
