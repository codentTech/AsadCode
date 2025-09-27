import Auth from "@/auth/auth.component";
import AUTH from "@/common/constants/auth.constant";
import PersonalInformation from "@/components/settings/account-settings/personal-information/personal-information.component";

export default function Page() {
  return <Auth component={<PersonalInformation />} type={AUTH.PRIVATE} />;
}
