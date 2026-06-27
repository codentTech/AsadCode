import { useMemo } from "react";
import { useSelector } from "react-redux";
import { getUser } from "@/common/utils/users.util";
import {
  getLegalLinksForAudience,
  resolveLegalAudience,
} from "@/common/utils/legal.utils";

export default function useLegalLinks(overrideAudience) {
  const landingCreatorMode = useSelector((state) => state.auth.isCreatorMode);

  return useMemo(() => {
    const user = getUser();
    const audience =
      overrideAudience ?? resolveLegalAudience({ landingCreatorMode, user });
    const links = getLegalLinksForAudience(audience);

    return {
      audience,
      termsHref: links.terms,
      privacyHref: links.privacy,
      cookieHref: links.cookie,
    };
  }, [landingCreatorMode, overrideAudience]);
}
