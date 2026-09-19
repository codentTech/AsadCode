import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import {
  getLegalLinksForAudience,
  resolveLegalAudience,
} from "@/common/utils/legal.utils";

export default function useLegalLinks(overrideAudience) {
  const pathname = usePathname();
  const landingCreatorMode = useSelector((state) => state.auth.isCreatorMode);

  return useMemo(() => {
    const user = getUser();
    const audience =
      overrideAudience ?? resolveLegalAudience({ landingCreatorMode, user, pathname });
    const links = getLegalLinksForAudience(audience);

    return {
      audience,
      termsHref: links.terms,
      privacyHref: links.privacy,
      cookieHref: links.cookie,
    };
  }, [landingCreatorMode, overrideAudience, pathname]);
}
