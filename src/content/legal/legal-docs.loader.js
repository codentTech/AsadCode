const LEGAL_DOC_LOADERS = {
  creator: {
    "creator-agreement": () => import("./creator/creator-agreement"),
    "privacy-policy": () => import("./creator/privacy-policy"),
    "cookie-policy": () => import("./creator/cookie-policy"),
    "community-guidelines": () => import("./creator/community-guidelines"),
    "user-verification-policy": () => import("./creator/user-verification-policy"),
    "escrow-and-payment-terms": () => import("./creator/escrow-and-payment-terms"),
    "refund-policy": () => import("./creator/refund-policy"),
    "copyright-dmca-policy": () => import("./creator/copyright-dmca-policy"),
    "age-eligibility-policy": () => import("./creator/age-eligibility-policy"),
    "accessibility-statement": () => import("./creator/accessibility-statement"),
    "data-retention-policy": () => import("./creator/data-retention-policy"),
    "security-policy": () => import("./creator/security-policy"),
    "non-discrimination-statement": () => import("./creator/non-discrimination-statement"),
    "us-state-privacy-notice": () => import("./creator/us-state-privacy-notice"),
    "global-data-processing-agreement": () =>
      import("./creator/global-data-processing-agreement"),
  },
  client: {
    "client-agreement": () => import("./client/client-agreement"),
    "terms-of-service": () => import("./client/terms-of-service"),
    "privacy-policy": () => import("./client/privacy-policy"),
    "cookie-policy": () => import("./client/cookie-policy"),
    "community-guidelines": () => import("./client/community-guidelines"),
    "user-verification-policy": () => import("./client/user-verification-policy"),
    "platform-fees-and-pricing": () => import("./client/platform-fees-and-pricing"),
    "escrow-and-payment-terms": () => import("./client/escrow-and-payment-terms"),
    "refund-policy": () => import("./client/refund-policy"),
    "terms-of-sale": () => import("./client/terms-of-sale"),
    "fee-and-payment-authorization-agreement": () =>
      import("./client/fee-and-payment-authorization-agreement"),
    "copyright-dmca-policy": () => import("./client/copyright-dmca-policy"),
    "proprietary-rights-infringement-reporting": () =>
      import("./client/proprietary-rights-infringement-reporting"),
    "use-of-cleercut-marks": () => import("./client/use-of-cleercut-marks"),
    "age-eligibility-policy": () => import("./client/age-eligibility-policy"),
    "accessibility-statement": () => import("./client/accessibility-statement"),
    "data-retention-policy": () => import("./client/data-retention-policy"),
    "security-policy": () => import("./client/security-policy"),
    "non-discrimination-statement": () => import("./client/non-discrimination-statement"),
    "us-state-privacy-notice": () => import("./client/us-state-privacy-notice"),
    "global-data-processing-agreement": () =>
      import("./client/global-data-processing-agreement"),
  },
};

export function loadLegalDocument(audience, slug) {
  const loader = LEGAL_DOC_LOADERS[audience]?.[slug];
  if (!loader) {
    return Promise.resolve(null);
  }

  return loader().then((module) => module.default);
}
