import ROLES from "@/common/constants/role.constant";

export const LEGAL_AUDIENCE = {
  CREATOR: "creator",
  CLIENT: "client",
};

const AGREEMENT_SLUG = {
  [LEGAL_AUDIENCE.CREATOR]: "creator-agreement",
  [LEGAL_AUDIENCE.CLIENT]: "terms-of-service",
};

export function resolveLegalAudience({ landingCreatorMode, user }) {
  if (user?.role) {
    return user.role === ROLES.CREATOR ? LEGAL_AUDIENCE.CREATOR : LEGAL_AUDIENCE.CLIENT;
  }
  if (landingCreatorMode === true) return LEGAL_AUDIENCE.CREATOR;
  if (landingCreatorMode === false) return LEGAL_AUDIENCE.CLIENT;
  return null;
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
