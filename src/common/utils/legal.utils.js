import ROLES from "@/common/constants/role.constant";

export const LEGAL_AUDIENCE = {
  CREATOR: "creator",
  CLIENT: "client",
};

const AGREEMENT_SLUG = {
  [LEGAL_AUDIENCE.CREATOR]: "creator-agreement",
  [LEGAL_AUDIENCE.CLIENT]: "terms-of-service",
};

const BRAND_MARKETING_PATHS = [
  "/",
  "/agency",
  "/features",
  "/pricing",
  "/faq",
  "/blog",
  "/about-us",
  "/solution",
];

export function resolveLegalAudienceFromPathname(pathname) {
  if (typeof pathname !== "string" || !pathname) return null;

  if (
    pathname === "/creators" ||
    pathname.startsWith("/creators/") ||
    pathname.startsWith("/legal/creator")
  ) {
    return LEGAL_AUDIENCE.CREATOR;
  }

  if (
    pathname.startsWith("/legal/client") ||
    pathname.startsWith("/vs/") ||
    pathname.startsWith("/alternatives/") ||
    BRAND_MARKETING_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`))
  ) {
    return LEGAL_AUDIENCE.CLIENT;
  }

  return null;
}

export function resolveLegalAudience({ landingCreatorMode, user, pathname }) {
  const pathAudience = resolveLegalAudienceFromPathname(pathname);
  if (pathAudience) return pathAudience;

  if (user?.role) {
    return user.role === ROLES.CREATOR ? LEGAL_AUDIENCE.CREATOR : LEGAL_AUDIENCE.CLIENT;
  }
  if (landingCreatorMode === true) return LEGAL_AUDIENCE.CREATOR;
  if (landingCreatorMode === false) return LEGAL_AUDIENCE.CLIENT;
  return LEGAL_AUDIENCE.CLIENT;
}

export function getLegalDocPath(audience, docKey) {
  if (!audience) return "/";

  const slugByDocKey = {
    terms: AGREEMENT_SLUG[audience],
    privacy: "privacy-policy",
    cookie: "cookie-policy",
  };

  const slug = slugByDocKey[docKey];
  if (!slug) return `/legal/${audience}`;

  return `/legal/${audience}/${slug}`;
}

export function getLegalLinksForAudience(audience) {
  return {
    terms: getLegalDocPath(audience, "terms"),
    privacy: getLegalDocPath(audience, "privacy"),
    cookie: getLegalDocPath(audience, "cookie"),
  };
}

export function getLegalAudienceDescription(audience) {
  return audience === LEGAL_AUDIENCE.CLIENT
    ? "Legal agreements and policies for brands and agencies using CleerCut."
    : "Legal agreements and policies for creators using CleerCut.";
}

export function getLegalAudienceLabel(audience) {
  return audience === LEGAL_AUDIENCE.CLIENT ? "Client" : "Creator";
}
