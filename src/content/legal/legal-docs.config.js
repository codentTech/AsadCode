export const LEGAL_DOC_INDEX = {
  creator: [
    { slug: "creator-agreement", label: "Creator Agreement" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "cookie-policy", label: "Cookie Policy" },
    { slug: "community-guidelines", label: "Community Guidelines" },
    { slug: "user-verification-policy", label: "User Verification Policy" },
    { slug: "escrow-and-payment-terms", label: "Escrow and Payment Terms" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "copyright-dmca-policy", label: "Copyright (DMCA) Policy" },
    { slug: "age-eligibility-policy", label: "Age Eligibility Policy" },
    { slug: "accessibility-statement", label: "Accessibility Statement" },
    { slug: "data-retention-policy", label: "Data Retention Policy" },
    { slug: "security-policy", label: "Security Policy" },
    { slug: "non-discrimination-statement", label: "Non-Discrimination Statement" },
    { slug: "us-state-privacy-notice", label: "U.S. State Privacy Notice" },
    { slug: "global-data-processing-agreement", label: "Global Data Processing Agreement" },
  ],
  client: [
    { slug: "client-agreement", label: "Client Agreement" },
    { slug: "terms-of-service", label: "Terms of Service" },
    { slug: "privacy-policy", label: "Privacy Policy" },
    { slug: "cookie-policy", label: "Cookie Policy" },
    { slug: "community-guidelines", label: "Community Guidelines" },
    { slug: "user-verification-policy", label: "User Verification Policy" },
    { slug: "platform-fees-and-pricing", label: "Platform Fees and Pricing" },
    { slug: "escrow-and-payment-terms", label: "Escrow and Payment Terms" },
    { slug: "refund-policy", label: "Refund Policy" },
    { slug: "terms-of-sale", label: "Terms of Sale" },
    {
      slug: "fee-and-payment-authorization-agreement",
      label: "Fee and Payment Authorization Agreement",
    },
    { slug: "copyright-dmca-policy", label: "Copyright (DMCA) Policy" },
    {
      slug: "proprietary-rights-infringement-reporting",
      label: "Proprietary Rights Infringement Reporting",
    },
    { slug: "use-of-cleercut-marks", label: "Use of CleerCut Marks" },
    { slug: "age-eligibility-policy", label: "Age Eligibility Policy" },
    { slug: "accessibility-statement", label: "Accessibility Statement" },
    { slug: "data-retention-policy", label: "Data Retention Policy" },
    {
      slug: "security-policy",
      label: "Security and Incident Response Policy",
    },
    { slug: "non-discrimination-statement", label: "Non-Discrimination Statement" },
    { slug: "us-state-privacy-notice", label: "U.S. State Privacy Notice" },
    { slug: "global-data-processing-agreement", label: "Global Data Processing Agreement" },
  ],
};

export const LEGAL_DOC_GROUPS = {
  creator: [
    {
      title: "Core agreement",
      description: "Terms governing your use of CleerCut as a creator.",
      slugs: ["creator-agreement"],
    },
    {
      title: "Privacy & data",
      description: "How we collect, use, and protect your information.",
      slugs: [
        "privacy-policy",
        "cookie-policy",
        "data-retention-policy",
        "us-state-privacy-notice",
        "global-data-processing-agreement",
      ],
    },
    {
      title: "Payments & escrow",
      description: "Funding, release, disputes, and refunds.",
      slugs: ["escrow-and-payment-terms", "refund-policy"],
    },
    {
      title: "Platform policies",
      description: "Community standards, verification, eligibility, and security.",
      slugs: [
        "community-guidelines",
        "user-verification-policy",
        "age-eligibility-policy",
        "security-policy",
        "non-discrimination-statement",
        "accessibility-statement",
      ],
    },
    {
      title: "Intellectual property",
      description: "Copyright and content-related policies.",
      slugs: ["copyright-dmca-policy"],
    },
  ],
  client: [
    {
      title: "Agreements & terms",
      description: "Contracts and platform terms for brands and agencies.",
      slugs: [
        "client-agreement",
        "terms-of-service",
        "terms-of-sale",
        "fee-and-payment-authorization-agreement",
      ],
    },
    {
      title: "Privacy & data",
      description: "Privacy, cookies, retention, and data processing.",
      slugs: [
        "privacy-policy",
        "cookie-policy",
        "data-retention-policy",
        "us-state-privacy-notice",
        "global-data-processing-agreement",
      ],
    },
    {
      title: "Payments & pricing",
      description: "Fees, escrow, billing, and refund rules.",
      slugs: ["platform-fees-and-pricing", "escrow-and-payment-terms", "refund-policy"],
    },
    {
      title: "Platform policies",
      description: "Community, verification, eligibility, and conduct.",
      slugs: [
        "community-guidelines",
        "user-verification-policy",
        "age-eligibility-policy",
        "non-discrimination-statement",
        "accessibility-statement",
        "security-policy",
      ],
    },
    {
      title: "Intellectual property",
      description: "Copyright, trademarks, and brand usage.",
      slugs: [
        "copyright-dmca-policy",
        "proprietary-rights-infringement-reporting",
        "use-of-cleercut-marks",
      ],
    },
  ],
};

export function getLegalDocGroups(audience) {
  const indexBySlug = Object.fromEntries(
    (LEGAL_DOC_INDEX[audience] ?? []).map((item) => [item.slug, item])
  );

  return (LEGAL_DOC_GROUPS[audience] ?? [])
    .map((group) => ({
      title: group.title,
      description: group.description,
      documents: group.slugs
        .map((slug) => indexBySlug[slug])
        .filter(Boolean),
    }))
    .filter((group) => group.documents.length > 0);
}

export function isValidLegalDocSlug(audience, slug) {
  return (LEGAL_DOC_INDEX[audience] ?? []).some((item) => item.slug === slug);
}
