import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PersonalInformation from "@/components/settings/account-settings/components/personal-information/personal-information.component";

export default function Page() {
  return <Auth component={<PersonalInformation />} type={AUTH.AUTH_MAIN_ROUTES} />;
}
